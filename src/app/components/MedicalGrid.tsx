import { useEffect, useRef } from 'react';

export function MedicalGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    const drawGrid = () => {
      if (!ctx) return;

      const gridSize = 80;
      const dotSize = 1.5;

      // 绘制网格点
      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          // 计算波动效果
          const wave = Math.sin((x + time * 50) * 0.01) * Math.cos((y + time * 30) * 0.01);
          const opacity = 0.15 + wave * 0.08;

          ctx.fillStyle = `rgba(59, 130, 246, ${opacity})`;
          ctx.beginPath();
          ctx.arc(x, y, dotSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 绘制水平线 - 医疗心电图风格
      const numLines = 3;
      for (let i = 0; i < numLines; i++) {
        const y = (canvas.height / (numLines + 1)) * (i + 1);
        
        ctx.strokeStyle = `rgba(59, 130, 246, 0.08)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        
        for (let x = 0; x < canvas.width; x += 2) {
          const wave = Math.sin((x + time * 100 + i * 200) * 0.02) * 10;
          const yPos = y + wave;
          
          if (x === 0) {
            ctx.moveTo(x, yPos);
          } else {
            ctx.lineTo(x, yPos);
          }
        }
        
        ctx.stroke();
      }

      // 数据流动效果 - 垂直线
      const dataLines = 4;
      for (let i = 0; i < dataLines; i++) {
        const x = ((time * 50 + i * 500) % (canvas.width + 200)) - 100;
        
        const gradient = ctx.createLinearGradient(x, 0, x, canvas.height);
        gradient.addColorStop(0, 'rgba(96, 165, 250, 0)');
        gradient.addColorStop(0.3, 'rgba(96, 165, 250, 0.15)');
        gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.2)');
        gradient.addColorStop(0.7, 'rgba(96, 165, 250, 0.15)');
        gradient.addColorStop(1, 'rgba(96, 165, 250, 0)');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      time += 0.01;
      drawGrid();
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.4 }}
    />
  );
}
