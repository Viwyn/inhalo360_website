import { useEffect, useRef, useState, useCallback } from 'react';
import {
  HandLandmarker,
  ObjectDetector,
  FilesetResolver,
  type HandLandmarkerResult,
  type ObjectDetectorResult,
} from '@mediapipe/tasks-vision';
import { Camera, AlertCircle, X, ChevronLeft, ChevronRight, CheckCircle2, Cpu } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

// ─── Hand connections for skeleton drawing ────────────────────────────────────
const HAND_CONNECTIONS: [number, number][] = [
  [0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],
  [0,9],[9,10],[10,11],[11,12],[0,13],[13,14],[14,15],[15,16],
  [0,17],[17,18],[18,19],[19,20],[5,9],[9,13],[13,17],
];

// EfficientDet labels that we treat as "inhaler" (cylindrical, small plastic objects)
const INHALER_LABELS = new Set(['bottle', 'cell phone', 'remote', 'mouse', 'cup', 'vase', 'book', 'toothbrush', 'hair drier']);

// ─── Step Data ───────────────────────────────────────────────────────────────
const STEPS = [
  { title: 'Shake the Inhaler', shortDesc: 'Hold inhaler upright and shake 4–5 times vigorously', description: 'Hold the MDI inhaler upright and shake vigorously 4–5 times. This mixes the medication with the propellant for a consistent dose.', tip: '💡 Always shake before every puff, even mid-session.', duration: '~5 sec', icon: '🫙', color: '#06b6d4', cvHint: 'Shake hand rapidly', detectMode: 'shake' as const },
  { title: 'Remove the Cap', shortDesc: 'Remove mouthpiece cap, check for blockages', description: 'Remove the protective mouthpiece cap and inspect the opening for debris that could restrict airflow.', tip: '💡 First use or unused >7 days? Prime with 2 test sprays into the air.', duration: '~5 sec', icon: '🔓', color: '#8b5cf6', cvHint: 'Hold inhaler steady, low', detectMode: 'hold_low' as const },
  { title: 'Exhale Fully', shortDesc: 'Breathe out completely before inhaling', description: 'Breathe out completely through your mouth, emptying your lungs. Turn face away from the inhaler.', tip: '💡 The more you exhale, the more room for the medication.', duration: '~3 sec', icon: '💨', color: '#10b981', cvHint: 'Lower hand away from face', detectMode: 'hand_low' as const },
  { title: 'Position Inhaler', shortDesc: 'Seal lips around mouthpiece, chin slightly up', description: 'Seal lips around the mouthpiece. Hold inhaler upright with canister on top. Tilt chin slightly upward.', tip: '💡 Alternative: hold 2–4 cm from open mouth.', duration: '~5 sec', icon: '👄', color: '#f59e0b', cvHint: 'Raise hand toward face', detectMode: 'hand_high' as const },
  { title: 'Inhale & Press', shortDesc: 'Begin inhaling THEN press canister once', description: 'Begin breathing in slowly and deeply. AT THE SAME TIME, press the canister firmly once. Continue inhaling for 4–5 seconds.', tip: '💡 Coordination is critical — pressing before inhaling wastes the dose.', duration: '~5 sec', icon: '🫁', color: '#ef4444', cvHint: 'Keep inhaler at mouth level', detectMode: 'hand_high' as const },
  { title: 'Hold Your Breath', shortDesc: 'Hold breath 10 seconds — count silently', description: 'Remove the inhaler and hold your breath for 10 seconds. This allows medication to settle deep in the bronchial airways.', tip: '💡 Need a second puff? Wait 30 seconds, then repeat from Step 1.', duration: '~10 sec', icon: '⏱️', color: '#3b82f6', cvHint: 'Keep hand very still near face', detectMode: 'still' as const },
  { title: 'Breathe Out Slowly', shortDesc: 'Exhale gently — do not exhale into inhaler', description: 'Exhale slowly and gently through your nose or mouth. Do not exhale into the inhaler. Replace cap afterwards.', tip: '💡 Steroid inhaler? Rinse mouth with water to prevent throat infections.', duration: '~5 sec', icon: '🌬️', color: '#06b6d4', cvHint: 'Lower hand away from face', detectMode: 'hand_low' as const },
  { title: 'Check Dose Counter', shortDesc: 'Note remaining doses, refill plan at 20', description: "Check the dose counter. Arrange a refill at 20 remaining. Never use an inhaler showing 0 — it may still spray propellant without medication.", tip: '💡 Log usage in a note or health app so you never run out.', duration: '~10 sec', icon: '📊', color: '#8b5cf6', cvHint: 'Hold inhaler steady at chest level', detectMode: 'hold_low' as const },
];

// ─── Draw inhaler overlay at position ────────────────────────────────────────
function drawInhalerAR(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale: number, color: string, t: number) {
  const w = 38 * scale, h = 115 * scale;
  const a = 0.72 + Math.sin(t / 600) * 0.14;

  const rr = (rx: number, ry: number, rw: number, rh: number, r: number) => {
    ctx.beginPath();
    ctx.moveTo(rx + r, ry);
    ctx.lineTo(rx + rw - r, ry); ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + r);
    ctx.lineTo(rx + rw, ry + rh - r); ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - r, ry + rh);
    ctx.lineTo(rx + r, ry + rh); ctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - r);
    ctx.lineTo(rx, ry + r); ctx.quadraticCurveTo(rx, ry, rx + r, ry);
    ctx.closePath();
  };

  ctx.save();
  ctx.translate(cx, cy);
  ctx.shadowColor = color; ctx.shadowBlur = 20 + Math.sin(t / 400) * 6;

  // Body
  rr(-w/2, -h/2, w, h, w * 0.32);
  ctx.fillStyle = color + Math.round(a * 0.18 * 255).toString(16).padStart(2,'0');
  ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.fill(); ctx.stroke();

  // Canister window
  const wW = w * 0.55, wH = h * 0.38;
  rr(-wW/2, -h/2 + h*0.08, wW, wH, 5);
  ctx.fillStyle = color + '28'; ctx.strokeStyle = color+'99'; ctx.lineWidth = 1.5; ctx.fill(); ctx.stroke();

  // Cap
  const cW = w*0.65, cH = h*0.1;
  rr(-cW/2, -h/2 - cH - 3*scale, cW, cH, 4);
  ctx.fillStyle = color+'55'; ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.fill(); ctx.stroke();

  // Nozzle
  const nW = cW*0.4, nH = cH*0.55;
  rr(-nW/2, -h/2 - cH - nH - 3*scale, nW, nH, 3);
  ctx.fillStyle = color+'66'; ctx.fill(); ctx.stroke();

  // Side button
  rr(w/2+1, -h*0.06, w*0.22, h*0.12, 3);
  ctx.fillStyle = color+'55'; ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.fill(); ctx.stroke();

  ctx.shadowBlur = 0; ctx.restore();
}

// ─── Component ────────────────────────────────────────────────────────────────
export function ARCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | undefined>(undefined);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const objectDetectorRef = useRef<ObjectDetector | null>(null);
  const lastHandRef = useRef<HandLandmarkerResult | null>(null);
  const lastObjRef = useRef<ObjectDetectorResult | null>(null);
  const objFrameRef = useRef(0); // throttle object detection
  const prevWristRef = useRef<{ x: number; y: number } | null>(null);
  const stepHoldRef = useRef(0);
  const lastFrameTimeRef = useRef<number>(performance.now());

  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cvLoading, setCvLoading] = useState(true);
  const [inhalerDetected, setInhalerDetected] = useState(false);
  const [handVisible, setHandVisible] = useState(false);

  const [currentStep, setCurrentStep] = useState(0);
  const [evaluated, setEvaluated] = useState<Record<number, 'pass' | 'fail'>>({});
  const [showTip, setShowTip] = useState(false);
  const [autoDetected, setAutoDetected] = useState(false);

  const passCount = Object.values(evaluated).filter(v => v === 'pass').length;
  const progress = Math.round((passCount / STEPS.length) * 100);

  const goNext = () => { setCurrentStep(s => Math.min(s + 1, STEPS.length - 1)); setAutoDetected(false); };
  const goPrev = () => { setCurrentStep(s => Math.max(s - 1, 0)); setAutoDetected(false); };

  const markCurrent = useCallback((result: 'pass' | 'fail') => {
    const idx = currentStep;
    setEvaluated(prev => ({ ...prev, [idx]: result }));
    stepHoldRef.current = 0;
    if (result === 'pass' && idx < STEPS.length - 1) {
      setTimeout(() => { 
        setCurrentStep(s => Math.min(s + 1, STEPS.length - 1)); 
        setAutoDetected(false); 
      }, 200);
    }
  }, [currentStep]);

  const resetAll = () => { 
    setEvaluated({}); 
    setCurrentStep(0); 
    setAutoDetected(false); 
    (window as any).__inhalerSeen = {};
    stepHoldRef.current = 0;
    prevWristRef.current = null;
  };

  // ── Load both MediaPipe models ────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );

        // Load HandLandmarker
        const hl = await HandLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task', delegate: 'GPU' },
          runningMode: 'VIDEO',
          numHands: 2,
        });

        // Load ObjectDetector (EfficientDet-Lite) for inhaler detection
        const od = await ObjectDetector.createFromOptions(vision, {
          baseOptions: { modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/float16/1/efficientdet_lite0.tflite', delegate: 'GPU' },
          runningMode: 'VIDEO',
          scoreThreshold: 0.25, // Lower threshold to catch more inhaler-like shapes and colors
          maxResults: 5,
        });

        if (!cancelled) {
          handLandmarkerRef.current = hl;
          objectDetectorRef.current = od;
          setCvLoading(false);
        }
      } catch (e) {
        console.warn('MediaPipe model load error:', e);
        if (!cancelled) setCvLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ── Camera start/stop ─────────────────────────────────────────────────────
  const startCamera = async () => {
    try {
      const ms = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setStream(ms); setCameraActive(true); setCameraError(null); setCurrentStep(0);
    } catch {
      setCameraError('Cannot access camera. Please allow camera permission and try again.');
    }
  };

  const stopCamera = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    stream?.getTracks().forEach(t => t.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    setStream(null); setCameraActive(false);
    setInhalerDetected(false); setHandVisible(false);
    prevWristRef.current = null; stepHoldRef.current = 0;
  };

  useEffect(() => {
    if (!cameraActive || !stream || !videoRef.current) return;
    videoRef.current.srcObject = stream;
  }, [cameraActive, stream]);

  useEffect(() => () => {
    if (videoRef.current?.srcObject) (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
    if (animRef.current) cancelAnimationFrame(animRef.current);
  }, []);

  // ── Main CV + Draw loop ───────────────────────────────────────────────────
  const loop = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!canvas || !video || !video.videoWidth) { animRef.current = requestAnimationFrame(loop); return; }

    canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const W = canvas.width, H = canvas.height;
    const now = performance.now();
    const step = STEPS[currentStep];
    const primary = step.color;

    // ── Run HandLandmarker every frame ────────────────────────────────────
    let handLMs: HandLandmarkerResult['landmarks'][0] | null = null;
    if (handLandmarkerRef.current && video.readyState >= 2) {
      try {
        const res = handLandmarkerRef.current.detectForVideo(video, now);
        lastHandRef.current = res;
      } catch { /* ignore */ }
    }
    if (lastHandRef.current?.landmarks.length) {
      handLMs = lastHandRef.current.landmarks[0];
      setHandVisible(true);
    } else {
      setHandVisible(false);
    }

    // ── Run ObjectDetector every 12 frames (throttled) ────────────────────
    objFrameRef.current = (objFrameRef.current + 1) % 12;
    if (objFrameRef.current === 0 && objectDetectorRef.current && video.readyState >= 2) {
      try {
        const res = objectDetectorRef.current.detectForVideo(video, now);
        lastObjRef.current = res;
        const hit = res.detections.find(d =>
          d.categories.some(c => INHALER_LABELS.has(c.categoryName.toLowerCase()))
        );
        if (hit) {
           setInhalerDetected(true);
           if (!(window as any).__inhalerSeen) (window as any).__inhalerSeen = {};
           if (currentStep === 0) (window as any).__inhalerSeen[0] = true;
        } else {
           // If we are in step 0 and have seen it once, do not un-detect it.
           if (!(currentStep === 0 && (window as any).__inhalerSeen?.[0])) {
              setInhalerDetected(false);
           }
        }
      } catch { /* ignore */ }
    }

    // Use latest object detection result to draw bounding box
    const latestObj = lastObjRef.current;
    const inhalerHit = latestObj?.detections.find(d =>
      d.categories.some(c => INHALER_LABELS.has(c.categoryName.toLowerCase()))
    );

    if (inhalerHit?.boundingBox) {
      const bb = inhalerHit.boundingBox;
      const bx = bb.originX, by = bb.originY, bw = bb.width, bh = bb.height;
      const confidence = inhalerHit.categories[0]?.score ?? 0;

      ctx.save();
      ctx.strokeStyle = '#00E5CC'; ctx.lineWidth = 3;
      ctx.shadowColor = '#00E5CC'; ctx.shadowBlur = 12;
      ctx.strokeRect(bx, by, bw, bh);

      // Corner accents
      const cl = 18;
      [[bx, by, 1, 1],[bx+bw, by, -1, 1],[bx, by+bh, 1, -1],[bx+bw, by+bh, -1, -1]].forEach(([x, y, sx, sy]) => {
        ctx.beginPath(); ctx.moveTo(x, y + sy * cl); ctx.lineTo(x, y); ctx.lineTo(x + sx * cl, y); ctx.stroke();
      });
      ctx.shadowBlur = 0;

      // Label badge
      const label = `✓ Detected  ${Math.round(confidence * 100)}%`;
      ctx.font = `bold ${Math.max(13, W * 0.016)}px Inter,sans-serif`;
      const tw = ctx.measureText(label).width;
      const bPad = 8, bH = 28;
      ctx.fillStyle = '#00E5CC';
      ctx.beginPath();
      ctx.roundRect?.(bx - 1, by - bH - 6, tw + bPad * 2, bH, 6) ?? ctx.rect(bx - 1, by - bH - 6, tw + bPad * 2, bH);
      ctx.fill();
      ctx.fillStyle = '#000'; ctx.textAlign = 'left';
      ctx.fillText(label, bx + bPad - 1, by - 14);

      // Draw inhaler AR overlay initially based on bounding box if hand not tracking it perfectly
      const arCx = bx + bw / 2;
      const arCy = by + bh / 2;
      const arScale = Math.max(0.4, Math.min(1.6, bh / 200));
      drawInhalerAR(ctx, arCx, arCy, arScale, '#00E5CC', now);
      ctx.restore();
    }

    // ── Draw hand skeleton ────────────────────────────────────────────────
    if (handLMs) {
      ctx.strokeStyle = primary + 'cc'; ctx.lineWidth = 2.5;
      ctx.shadowColor = primary; ctx.shadowBlur = 5;
      HAND_CONNECTIONS.forEach(([a, b]) => {
        const pa = handLMs![a], pb = handLMs![b];
        ctx.beginPath();
        ctx.moveTo(pa.x * W, pa.y * H);
        ctx.lineTo(pb.x * W, pb.y * H);
        ctx.stroke();
      });
      handLMs.forEach((lm, i) => {
        const key = [0,4,8,12,16,20].includes(i);
        ctx.beginPath();
        ctx.arc(lm.x * W, lm.y * H, key ? 6 : 3.5, 0, Math.PI * 2);
        ctx.fillStyle = key ? primary : '#fff';
        ctx.shadowColor = primary; ctx.shadowBlur = key ? 10 : 4; ctx.fill();
      });
      ctx.shadowBlur = 0;

      // Draw inhaler AT THE HAND position if hand detected (overrides object detector position if both exist)
      const wrist = handLMs[0];
      const middleMcp = handLMs[9];
      const inhalerCx = ((wrist.x + middleMcp.x) / 2) * W;
      const inhalerCy = ((wrist.y + middleMcp.y) / 2) * H;
      const scale = Math.max(0.5, Math.min(1.8, H / 400));
      if (!inhalerHit?.boundingBox) {
         drawInhalerAR(ctx, inhalerCx, inhalerCy, scale, primary, now);
      }
    }

    // ── Gesture detection for auto-advance ─────────────────────────────
    let match = false;
    
    if (handLMs) {
      if (step.detectMode !== 'shake') {
        const wrist = handLMs[0];
        const velocity = prevWristRef.current
          ? Math.hypot(wrist.x - prevWristRef.current.x, wrist.y - prevWristRef.current.y) : 0;
        prevWristRef.current = { x: wrist.x, y: wrist.y };

        switch (step.detectMode) {
          case 'hand_high': match = wrist.y < 0.55; break;
          case 'hand_low':  match = wrist.y > 0.5; break;
          case 'hold_low':  match = wrist.y > 0.4 && velocity < 0.01; break;
          case 'still':     match = velocity < 0.008; break;
        }
      }
    }

    if (step.detectMode === 'shake') {
       // Shake mode starts AUTOMATICALLY once inhaler is detected and STAYS active
       match = !!(window as any).__inhalerSeen?.[0];
    }

    if (currentStep === 1) { // Step 2: Remove the Cap
       // Trigger: Inhaler must be detected AND we see two hands (simulating the opening action)
       const twoHands = lastHandRef.current?.landmarks.length && lastHandRef.current.landmarks.length >= 2;
       match = inhalerDetected && !!twoHands;
    }

    const delta = now - lastFrameTimeRef.current;
    lastFrameTimeRef.current = now;

    const targetMs = step.detectMode === 'shake' ? 5000 : (currentStep === 1 ? 2500 : 1500); 

    if (match) { 
      stepHoldRef.current += delta;
      if (stepHoldRef.current >= targetMs && !evaluated[currentStep]) {
        stepHoldRef.current = 0;
        setAutoDetected(true);
        markCurrent('pass');
      }
      
      // Countdown / Progress Visuals
      const hp = Math.min(stepHoldRef.current / targetMs, 1);
      const ax = W - 58, ay = H - 96;
      
      // Draw background circle
      ctx.beginPath(); ctx.arc(ax, ay, 32, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.fill();
      
      // Draw track
      ctx.beginPath(); ctx.arc(ax, ay, 28, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 6; ctx.stroke();
      
      // Draw progress arc
      ctx.beginPath(); ctx.arc(ax, ay, 28, -Math.PI / 2, -Math.PI / 2 + hp * 2 * Math.PI);
      ctx.strokeStyle = primary; ctx.lineWidth = 6;
      ctx.shadowColor = primary; ctx.shadowBlur = 15; ctx.stroke(); ctx.shadowBlur = 0;
      
      ctx.fillStyle = '#fff'; 
      ctx.textAlign = 'center';
      
      if (step.detectMode === 'shake' || currentStep === 1) {
        // True Countdown display
        const remaining = Math.max(0, (targetMs - stepHoldRef.current) / 1000);
        ctx.font = `bold ${Math.max(14, W * 0.018)}px Inter,sans-serif`;
        ctx.fillText(`${remaining.toFixed(1)}s`, ax, ay + 6);
        
        // Central AR Instruction Overlay
        const displaySec = Math.ceil(remaining);
        ctx.save();
        
        // Background blur/backing for readability
        const text = currentStep === 0 
          ? `Shake your inhaler for ${displaySec} seconds`
          : `Remove the mouthpiece cap: ${displaySec}`;
        
        ctx.font = `bold ${Math.max(20, W * 0.03)}px Inter,sans-serif`;
        const tw = ctx.measureText(text).width;
        const th = Math.max(20, W * 0.03);
        
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.beginPath();
        ctx.roundRect?.(W / 2 - tw / 2 - 20, H / 2 - 80, tw + 40, th + 40, 15) ?? ctx.rect(W / 2 - tw / 2 - 20, H / 2 - 80, tw + 40, th + 40);
        ctx.fill();

        // Main text with glow
        ctx.fillStyle = '#fff';
        ctx.shadowColor = primary; ctx.shadowBlur = 15;
        ctx.textAlign = 'center';
        ctx.globalAlpha = 0.9 + Math.sin(now / 150) * 0.1;
        ctx.fillText(text, W / 2, H / 2 - 40 + th/4);
        
        ctx.restore();
      } else {
        ctx.font = `bold ${Math.max(12, W * 0.016)}px Inter,sans-serif`;
        ctx.fillText(`${Math.round(hp * 100)}%`, ax, ay + 6);
      }
    } else {
      // Decay progress if interrupted (only for non-persistent modes)
      if (step.detectMode !== 'shake') {
        stepHoldRef.current = Math.max(0, stepHoldRef.current - delta * 0.5);
      }
      
      if (stepHoldRef.current > 0) {
        const hp = Math.min(stepHoldRef.current / targetMs, 1);
        const ax = W - 58, ay = H - 96;
        ctx.beginPath(); ctx.arc(ax, ay, 28, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 6; ctx.stroke();
        ctx.beginPath(); ctx.arc(ax, ay, 28, -Math.PI / 2, -Math.PI / 2 + hp * 2 * Math.PI);
        ctx.strokeStyle = primary + '66'; ctx.lineWidth = 6; ctx.stroke(); 
      }
    }

    // ── Progress dots (top-right) ─────────────────────────────────────────
    const ds = Math.min(22, (W * 0.35) / STEPS.length);
    const dx = W - STEPS.length * ds - 16, dy = 22;
    STEPS.forEach((s, i) => {
      const ev = evaluated[i]; const iC = i === currentStep;
      ctx.shadowColor = iC ? s.color : 'transparent'; ctx.shadowBlur = iC ? 8 : 0;
      ctx.beginPath(); ctx.arc(dx + i * ds + ds / 2, dy, iC ? 6 : 4, 0, Math.PI * 2);
      ctx.fillStyle = ev === 'pass' ? '#22c55e' : ev === 'fail' ? '#f97316' : iC ? s.color : 'rgba(255,255,255,0.3)';
      ctx.fill();
    });
    ctx.shadowBlur = 0;

    animRef.current = requestAnimationFrame(loop);
  }, [cameraActive, currentStep, evaluated, markCurrent]);

  useEffect(() => {
    if (!cameraActive) return;
    animRef.current = requestAnimationFrame(loop);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [cameraActive, loop]);

  // ── Render ─────────────────────────────────────────────────────────────────
  const step = STEPS[currentStep];
  const stepEv = evaluated[currentStep];

  return (
    <div className="w-full">
      <Card className="border-gray-200 overflow-hidden shadow-xl">
        <CardContent className="p-0">
          <div className="relative bg-gray-950" style={{ aspectRatio: '16/9' }}>

            {/* ── Inactive ── */}
            {!cameraActive ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900">
                <div className="relative mb-8">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-36 h-36 border-2 border-cyan-400/20 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
                  </div>
                  <div className="w-28 h-28 rounded-full bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center">
                    <Camera className="w-14 h-14 text-cyan-400" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">AR Live Guidance</h3>
                <p className="text-gray-400 mb-2 text-center max-w-md leading-relaxed">
                  Real-time CV detects your hand and inhaler — an AR guide overlays directly onto the detected inhaler in your camera.
                </p>
                <div className="flex items-center gap-2 text-cyan-400/70 text-sm mb-8">
                  <Cpu className="w-4 h-4" />
                  <span>{cvLoading ? 'Loading CV models…' : 'MediaPipe Tasks Vision'} · {STEPS.length} steps</span>
                </div>
                {cameraError && (
                  <div className="mb-5 flex items-center gap-2 bg-red-500/20 border border-red-400/50 rounded-2xl px-5 py-3 text-red-300 text-sm max-w-md">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />{cameraError}
                  </div>
                )}
                <Button onClick={startCamera} size="lg" disabled={cvLoading}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white border-0 px-10 py-6 text-lg rounded-2xl hover:scale-105 transition-all shadow-lg shadow-cyan-500/25">
                  {cvLoading ? 'Models Loading...' : '🎯 Launch AR Training'}
                </Button>
                {cvLoading && <p className="mt-4 text-xs text-yellow-400 animate-pulse">Loading CV engine…</p>}
              </div>
            ) : (
              /* ── Active camera ── */
              <>
                <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10 pointer-events-none" />

                {/* Top bar */}
                <div className="absolute top-0 left-0 right-0 z-20 p-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    {/* LIVE badge */}
                    <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/10">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-white text-xs font-medium">LIVE</span>
                    </div>

                    {/* ── Status badges ── */}
                    <div className="flex gap-2">
                       <div className={`flex items-center gap-1.5 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300 ${
                         handVisible
                           ? 'bg-purple-500/90 text-white shadow-lg shadow-purple-500/40'
                           : 'bg-black/50 text-white/50 border border-white/10'
                       }`}>
                         <span className={`w-2 h-2 rounded-full ${handVisible ? 'bg-white animate-pulse' : 'bg-gray-500'}`} />
                         {handVisible ? 'Hand Tracked' : 'Detecting Hand…'}
                       </div>

                       <div className={`flex items-center gap-1.5 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                         inhalerDetected
                           ? 'bg-cyan-500/90 text-white shadow-lg shadow-cyan-500/40 border border-cyan-400/50'
                           : 'bg-black/80 text-orange-400 border border-orange-500/50'
                       }`}>
                         <span className={`w-2.5 h-2.5 rounded-full ${inhalerDetected ? 'bg-white animate-pulse shadow-[0_0_8px_#fff]' : 'bg-orange-500 animate-pulse'}`} />
                         {inhalerDetected ? 'Inhaler Detected' : 'Waiting...'}
                       </div>
                    </div>

                    {/* Step counter */}
                    <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/10">
                      <span className="text-white/70 text-xs">Step </span>
                      <span className="text-white text-xs font-bold">{currentStep + 1}</span>
                      <span className="text-white/50 text-xs"> / {STEPS.length}</span>
                    </div>

                    <button onClick={stopCamera} className="flex items-center gap-1.5 bg-red-600/80 hover:bg-red-600 backdrop-blur-sm rounded-full px-3 py-1.5 text-white text-xs font-medium transition-colors border border-red-400/30">
                      <X className="w-3.5 h-3.5" /> End
                    </button>
                  </div>
                </div>

                {/* Auto-detected flash */}
                {autoDetected && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
                    <div className="bg-green-500/90 text-white text-lg font-bold px-6 py-3 rounded-2xl shadow-xl animate-bounce">
                      ✓ Step Auto-Detected!
                    </div>
                  </div>
                )}

                {/* Bottom step guidance panel */}
                <div className="absolute bottom-0 left-0 right-0 z-20 p-3">
                  <div className="rounded-2xl overflow-hidden backdrop-blur-md border border-white/10 shadow-2xl" style={{ background: 'rgba(0,0,0,0.76)' }}>
                    <div className="px-4 py-2.5 flex items-center gap-3" style={{ background: step.color + '20', borderBottom: '1px solid ' + step.color + '44' }}>
                      <span className="text-2xl">{step.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: step.color }}>Step {currentStep + 1}</span>
                          <span className="text-white/30 text-xs">·</span>
                          <span className="text-white/50 text-xs">{step.duration}</span>
                        </div>
                        <p className="text-white font-semibold text-base leading-tight">{step.title}</p>
                      </div>
                      <span className="hidden sm:block text-xs px-2 py-1 rounded-lg flex-shrink-0" style={{ background: step.color + '30', color: step.color }}>
                        👁 {step.cvHint}
                      </span>
                      <button onClick={() => setShowTip(s => !s)} className="text-xs px-2.5 py-1 rounded-full border border-white/20 text-white/60 hover:text-white transition-colors flex-shrink-0">
                        {showTip ? 'Hide' : '💡 Tip'}
                      </button>
                    </div>

                    <div className="px-4 py-2">
                      <p className="text-white/85 text-sm leading-relaxed">{step.shortDesc}</p>
                      {showTip && (
                        <div className="mt-2 text-xs px-3 py-2 rounded-xl" style={{ background: step.color + '22', color: step.color }}>
                          {step.tip}
                        </div>
                      )}
                    </div>

                    <div className="px-4 pb-3.5 flex items-center gap-2">
                      <button onClick={goPrev} disabled={currentStep === 0}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium text-white/70 hover:text-white border border-white/15 hover:border-white/30 disabled:opacity-30 transition-all">
                        <ChevronLeft className="w-4 h-4" /> Prev
                      </button>
                      <button onClick={() => markCurrent('pass')}
                        className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${stepEv === 'pass' ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'}`}>
                        <CheckCircle2 className="w-4 h-4" /> Done
                      </button>
                      <button onClick={() => markCurrent('fail')}
                        className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${stepEv === 'fail' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-orange-500/20 text-orange-400 border border-orange-500/30 hover:bg-orange-500/30'}`}>
                        ↻ Retry
                      </button>
                      <button onClick={goNext} disabled={currentStep === STEPS.length - 1}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium text-white/70 hover:text-white border border-white/15 hover:border-white/30 disabled:opacity-30 transition-all">
                        Next <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reference cards */}
      <Card className="mt-6 border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-3">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Step Reference Guide</h3>
              <p className="text-sm text-gray-500 mt-0.5">Click any step card to jump to it in the AR session</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right"><span className="text-xs text-gray-500">Completion</span><p className="text-xl font-bold text-cyan-600">{progress}%</p></div>
              <button onClick={resetAll} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500 transition-colors">Reset</button>
            </div>
          </div>

          <div className="w-full h-2.5 bg-gray-100 rounded-full mb-7 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${progress}%`, background: 'linear-gradient(90deg,#06b6d4,#3b82f6)' }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {STEPS.map((s, idx) => {
              const ev = evaluated[idx]; const isCurrent = currentStep === idx;
              const passed = ev === 'pass'; const failed = ev === 'fail';
              return (
                <div key={idx} onClick={() => { setCurrentStep(idx); setAutoDetected(false); }}
                  className={`rounded-2xl border-2 overflow-hidden transition-all duration-300 cursor-pointer ${
                    passed ? 'border-green-300 bg-green-50/60' : failed ? 'border-orange-300 bg-orange-50/40'
                    : isCurrent ? 'shadow-lg scale-[1.01]' : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
                  }`}
                  style={isCurrent && !passed && !failed ? { borderColor: s.color, background: s.color + '0d' } : {}}>
                  <div className="flex items-center gap-3 px-4 pt-4 pb-2">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-base"
                      style={{ background: passed ? '#dcfce7' : failed ? '#ffedd5' : isCurrent ? s.color+'22' : '#f3f4f6', border: isCurrent ? `2px solid ${s.color}55` : '2px solid transparent' }}>
                      {passed ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <span>{s.icon}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Step {idx+1}</span>
                        <span className="text-xs text-gray-300">·</span>
                        <span className="text-xs text-gray-400">{s.duration}</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900 leading-snug">{s.title}</p>
                    </div>
                    {passed && <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full shrink-0">✓ Done</span>}
                    {failed && <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full shrink-0">↻ Retry</span>}
                    {isCurrent && !passed && !failed && <span className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0" style={{ color: s.color, background: s.color+'22' }}>● Active</span>}
                  </div>
                  <div className="px-4 pb-3"><p className="text-sm text-gray-600 leading-relaxed">{s.description}</p></div>
                  <div className="px-4 pb-3">
                    <div className="rounded-xl px-3 py-2" style={{ background: s.color+'11', border: `1px solid ${s.color}33` }}>
                      <p className="text-xs leading-relaxed" style={{ color: s.color }}>{s.tip}</p>
                    </div>
                  </div>
                  <div className="px-4 pb-4 flex gap-2">
                    <button onClick={e => { e.stopPropagation(); setEvaluated(prev => ({ ...prev, [idx]: 'pass' })); }}
                      className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${passed ? 'bg-green-500 text-white' : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-500 hover:text-white'}`}>✓ Done</button>
                    <button onClick={e => { e.stopPropagation(); setEvaluated(prev => ({ ...prev, [idx]: 'fail' })); }}
                      className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${failed ? 'bg-orange-400 text-white' : 'bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-400 hover:text-white'}`}>↻ Retry</button>
                  </div>
                </div>
              );
            })}
          </div>

          {progress === 100 && (
            <div className="mt-6 bg-gradient-to-r from-green-50 to-cyan-50 border border-green-200 rounded-2xl p-6 text-center">
              <div className="text-5xl mb-3">🎉</div>
              <h4 className="text-xl font-bold text-green-700 mb-2">All 8 steps completed!</h4>
              <p className="text-sm text-green-600 max-w-md mx-auto">Excellent! Your MDI technique is fully practiced. Regular repetition builds muscle memory.</p>
              <button onClick={resetAll} className="mt-4 text-sm px-5 py-2 rounded-xl border border-green-300 text-green-700 hover:bg-green-100 transition-colors">Practice Again</button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}