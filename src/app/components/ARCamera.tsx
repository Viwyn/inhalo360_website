import { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, CheckCircle2, AlertCircle } from 'lucide-react';
// 确保这些相对路径与你的项目结构一致
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

import * as tf from '@tensorflow/tfjs';
import * as tmImage from '@teachablemachine/image';

export function ARCamera() {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();

  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [predictionResult, setPredictionResult] = useState<string>('');

  const steps = [
    t('training.ar.step1'),
    t('training.ar.step2'),
    t('training.ar.step3'),
    t('training.ar.step4'),
    t('training.ar.step5'),
    t('training.ar.step6'),
  ];

  const URL = "https://teachablemachine.withgoogle.com/models/YOUR_MODEL_ID_HERE/";

  // 1. 加载 AI 模型
  useEffect(() => {
    const loadModel = async () => {
      try {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";
        const loadedModel = await tmImage.load(modelURL, metadataURL);
        setModel(loadedModel);
        setIsModelLoading(false);
      } catch (err) {
        console.error("Failed to load CV model. Please check the URL.", err);
        setIsModelLoading(false); 
      }
    };
    loadModel();
  }, []);

  // 2. AI 侦测循环
  const detectFrame = useCallback(async () => {
    if (model && videoRef.current && videoRef.current.readyState === 4) {
      const predictions = await model.predict(videoRef.current);
      const topPrediction = predictions.reduce((p, c) => p.probability > c.probability ? p : c);
      
      setPredictionResult(`${topPrediction.className} (${(topPrediction.probability * 100).toFixed(0)}%)`);

      if (topPrediction.className === "Wrong_Angle" && topPrediction.probability > 0.8) {
        setError(t('training.ar.error.coordination') || "姿势错误：请保持吸入器直立");
      } else if (topPrediction.className === "No_Inhaler" && topPrediction.probability > 0.8) {
        setError("未检测到吸入器，请将设备放入框内");
      } else if (topPrediction.className === "Correct_Posture" && topPrediction.probability > 0.85) {
        setError(null);
      } else {
        setError(null);
      }
    }
    
    if (isActive) {
      requestRef.current = requestAnimationFrame(detectFrame);
    }
  }, [model, isActive, t]);

  // 3. 启动摄像头
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });

      setStream(mediaStream);
      setIsActive(true); // 这一步会切换 UI，把视频框渲染出来
      setError(null);
      
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please ensure you have granted camera permissions.');
    }
  };

  // 4. 当视频框渲染出来后，塞入摄像头画面
  useEffect(() => {
    if (isActive && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      
      videoRef.current.onplay = () => {
        if (model) {
          requestRef.current = requestAnimationFrame(detectFrame);
        }
      };
    }
  }, [isActive, stream, model, detectFrame]);

  // 5. 停止摄像头逻辑
  const stopCamera = () => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
    setCurrentStep(0);
    setPredictionResult('');
    setError(null);
  };

  // ✅ 修复点：彻底改写清理组件副作用的逻辑，只在离开网页时强制断开硬件摄像头
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const s = videoRef.current.srcObject as MediaStream;
        s.getTracks().forEach(track => track.stop());
      }
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []); // 保持空数组，只有离开页面才执行

  // 6. 绘制 AR 扫描框 (Canvas)
  useEffect(() => {
    let animationFrameId: number;
    let pulse = 0;

    const drawOverlay = () => {
      if (isActive && videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (!ctx || !video.videoWidth) {
          animationFrameId = requestAnimationFrame(drawOverlay);
          return;
        }

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        pulse += 0.05;
        const alpha = 0.5 + Math.sin(pulse) * 0.3;

        if (error) {
          ctx.strokeStyle = `rgba(239, 68, 68, ${alpha + 0.2})`; 
          ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
        } else {
          ctx.strokeStyle = `rgba(0, 225, 217, ${alpha})`; 
          ctx.fillStyle = 'rgba(0, 225, 217, 0.1)';
        }

        ctx.lineWidth = 4;
        ctx.setLineDash([15, 10]);

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const boxWidth = Math.min(300, canvas.width * 0.7);
        const boxHeight = Math.min(400, canvas.height * 0.7);

        ctx.shadowColor = error ? '#EF4444' : '#00E1D9';
        ctx.shadowBlur = 15;

        ctx.strokeRect(centerX - boxWidth / 2, centerY - boxHeight / 2, boxWidth, boxHeight);
        ctx.fillRect(centerX - boxWidth / 2, centerY - boxHeight / 2, boxWidth, boxHeight);

        ctx.shadowBlur = 0;
        ctx.setLineDash([]);
        ctx.fillStyle = '#ffffff';
        ctx.font = '600 20px "Lora", serif';
        ctx.textAlign = 'center';
        ctx.fillText('Position Inhaler Here', centerX, centerY - boxHeight / 2 - 20);
      }
      animationFrameId = requestAnimationFrame(drawOverlay);
    };

    if (isActive) {
      drawOverlay();
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isActive, error]);

  return (
    <div className="w-full">
      <Card className="border-gray-200 overflow-hidden shadow-lg">
        <CardContent className="p-0">
          <div className="relative bg-gray-900 aspect-video overflow-hidden">
            {!isActive ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8 bg-gradient-to-br from-gray-800 to-gray-900">
                <Camera className="w-24 h-24 mb-6 text-cyan-400 opacity-80" />
                <h3 className="text-2xl mb-4 text-center font-semibold">
                  {isModelLoading ? "Initializing CV Engine..." : t('training.ar.subtitle')}
                </h3>
                <p className="text-gray-300 mb-8 text-center max-w-md leading-relaxed">
                  {t('training.ar.desc')}
                </p>
                <Button
                  onClick={startCamera}
                  disabled={isModelLoading}
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 transition-transform hover:scale-105"
                >
                  {isModelLoading ? "Loading AI Model..." : t('training.ar.button')}
                </Button>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform scale-x-[-1]" 
                />
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full z-10"
                />
                
                <div className="absolute top-4 left-4 right-4 z-20">
                  <div className="bg-black/60 backdrop-blur-md rounded-xl p-4 text-white border border-white/10 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse shadow-[0_0_10px_#4ade80]"></div>
                        <span className="text-sm font-medium">CV Engine Active</span>
                      </div>
                      <span className="text-xs font-mono text-cyan-300 bg-cyan-900/50 px-2 py-1 rounded">
                        {predictionResult || 'Scanning...'}
                      </span>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="absolute bottom-24 left-4 right-4 z-20 animate-in slide-in-from-bottom-2">
                    <div className="bg-red-500/95 backdrop-blur-md rounded-xl p-4 text-white flex items-center shadow-2xl border border-red-400">
                      <AlertCircle className="w-7 h-7 mr-3 flex-shrink-0" />
                      <p className="text-sm font-medium tracking-wide">{error}</p>
                    </div>
                  </div>
                )}

                <div className="absolute bottom-4 left-4 right-4 flex justify-center z-20">
                  <Button
                    onClick={stopCamera}
                    variant="destructive"
                    size="lg"
                    className="rounded-full px-8 shadow-lg hover:shadow-red-500/20"
                  >
                    End AR Session
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6 border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 font-['Lora']">
              {t('training.ar.guide.title') || "Step-by-Step Guide"}
            </h3>
            <span className="text-sm text-gray-500 font-medium">
              Progress: {currentStep + 1}/{steps.length}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  currentStep === index && isActive
                    ? 'border-cyan-500 bg-cyan-50/50 shadow-md transform scale-[1.02]'
                    : 'border-gray-100 bg-white hover:border-gray-200'
                }`}
              >
                <div className="flex items-start">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mr-3 font-semibold transition-colors ${
                    currentStep === index && isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-sm'
                      : currentStep > index
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-400'
                  }`}>
                    {currentStep > index ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <span className="text-sm">{index + 1}</span>
                    )}
                  </div>
                  <p className={`text-sm leading-relaxed mt-1 ${currentStep === index && isActive ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                    {step}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}