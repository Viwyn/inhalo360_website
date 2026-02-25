import { motion } from 'motion/react';

export function FloatingBubbles() {
  // 减少数量到12个，增加质量和层次感
  const bubbles = Array.from({ length: 12 }, (_, i) => {
    const sizeType = Math.random();
    let size, opacity;
    
    // 创建三种尺寸层次
    if (sizeType < 0.5) {
      // 小气泡 - 较快，较透明
      size = Math.random() * 60 + 40;
      opacity = { start: 0, peak: 0.4, end: 0 };
    } else if (sizeType < 0.85) {
      // 中气泡
      size = Math.random() * 100 + 80;
      opacity = { start: 0, peak: 0.3, end: 0 };
    } else {
      // 大气泡 - 较慢，更透明
      size = Math.random() * 160 + 120;
      opacity = { start: 0, peak: 0.2, end: 0 };
    }

    return {
      id: i,
      size,
      opacity,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 20 + Math.random() * 15,
      drift: Math.random() * 200 - 100,
    };
  });

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute rounded-full"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: `${bubble.left}%`,
            bottom: '-15%',
            background: `radial-gradient(circle at 35% 35%, 
              rgba(191, 219, 254, ${bubble.opacity.peak * 1.2}), 
              rgba(147, 197, 253, ${bubble.opacity.peak * 0.9}), 
              rgba(96, 165, 250, ${bubble.opacity.peak * 0.5}),
              rgba(59, 130, 246, 0))`,
            backdropFilter: 'blur(2px)',
            border: `1px solid rgba(147, 197, 253, ${bubble.opacity.peak * 0.6})`,
            boxShadow: `
              inset 0 0 ${bubble.size * 0.3}px rgba(255, 255, 255, ${bubble.opacity.peak * 0.4}),
              0 8px 32px rgba(59, 130, 246, ${bubble.opacity.peak * 0.15})
            `,
          }}
          animate={{
            y: [0, -window.innerHeight - 300],
            x: [
              0,
              bubble.drift * 0.5,
              bubble.drift,
              bubble.drift * 0.7,
              bubble.drift * 0.3,
            ],
            scale: [0.8, 1, 1.1, 1.2, 1, 0.7],
            opacity: [
              0,
              bubble.opacity.peak * 0.3,
              bubble.opacity.peak,
              bubble.opacity.peak * 0.8,
              bubble.opacity.peak * 0.4,
              0,
            ],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* 内部高光效果 */}
          <div
            className="absolute rounded-full"
            style={{
              width: '40%',
              height: '40%',
              top: '15%',
              left: '20%',
              background: `radial-gradient(circle, rgba(255, 255, 255, ${bubble.opacity.peak * 0.6}), transparent)`,
              filter: 'blur(8px)',
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}
