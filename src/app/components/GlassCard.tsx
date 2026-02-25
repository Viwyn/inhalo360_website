import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className = '', hover = true }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={hover ? { scale: 1.02, translateY: -5 } : {}}
      transition={{ duration: 0.3 }}
      className={`
        bg-white/90 backdrop-blur-sm 
        border border-gray-200/50 
        rounded-lg 
        shadow-lg hover:shadow-2xl 
        transition-all duration-300
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
