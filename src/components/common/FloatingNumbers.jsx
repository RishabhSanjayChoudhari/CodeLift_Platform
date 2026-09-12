import React from 'react';
import { motion } from 'framer-motion';

/**
 * FloatingNumbers component
 * Produces floating upward number particles with rotation and opacity fade
 */
export default function FloatingNumbers({
  count = 28,
  colors = ['#15803D', '#D97706', '#6D28D9', '#BE123C', '#2563EB', '#0D9488']
}) {
  const numbers = React.useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      value: Math.floor(Math.random() * 99) + 1,
      x: Math.random() * 92 + 4,
      y: Math.random() * 70 + 25,
      size: Math.random() * 22 + 14,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 1.5,
      duration: Math.random() * 2.5 + 2.5,
    }));
  }, [count]);

  return (
    <div
      className="position-absolute top-0 start-0 w-100 h-100 overflow-hidden"
      style={{ pointerEvents: 'none', zIndex: 1 }}
    >
      {numbers.map((num) => (
        <motion.div
          key={num.id}
          className="position-absolute fw-bolder user-select-none font-monospace"
          style={{
            left: `${num.x}%`,
            top: `${num.y}%`,
            fontSize: `${num.size}px`,
            color: num.color,
            opacity: 0.22,
          }}
          initial={{ y: 0, opacity: 0.22, rotate: 0 }}
          animate={{ y: -240, opacity: 0, rotate: (Math.random() - 0.5) * 160 }}
          transition={{
            duration: num.duration,
            delay: num.delay,
            ease: 'easeOut',
            repeat: Infinity,
            repeatDelay: num.delay + 0.8,
          }}
        >
          {num.value}%
        </motion.div>
      ))}
    </div>
  );
}
