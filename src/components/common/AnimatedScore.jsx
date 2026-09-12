import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

/**
 * AnimatedScore component
 * Smoothly animates a numerical score count-up from 0 to value% with spring physics
 */
export default function AnimatedScore({ value = 0, duration = 2, className = '' }) {
  const springValue = useSpring(0, { damping: 20, stiffness: 60 });
  const [displayNumber, setDisplayNumber] = useState(0);

  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      setDisplayNumber(Math.round(latest));
    });
    return () => unsubscribe();
  }, [springValue]);

  return (
    <motion.span
      className={`display-2 fw-bolder ${className}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {displayNumber}%
    </motion.span>
  );
}
