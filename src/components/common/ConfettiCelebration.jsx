import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

/**
 * ConfettiCelebration component
 * Fires celebration particle bursts via canvas-confetti and displays
 * animated falling confetti ribbons for a rich party-popper atmosphere.
 */
export default function ConfettiCelebration({ active = true }) {
  useEffect(() => {
    if (!active) return;

    // Fire fireworks / party poppers
    const count = 200;
    const defaults = {
      origin: { y: 0.7 }
    };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });

    // Secondary burst after 400ms
    const timer = setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { x: 0.2, y: 0.6 }
      });
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { x: 0.8, y: 0.6 }
      });
    }, 450);

    return () => clearTimeout(timer);
  }, [active]);

  if (!active) return null;

  const colors = ['#15803D', '#D97706', '#6D28D9', '#BE123C', '#0D9488', '#F59E0B', '#EC4899', '#3B82F6'];
  const confettiRibbons = Array.from({ length: 45 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: -10,
    size: Math.random() * 8 + 6,
    color: colors[Math.floor(Math.random() * colors.length)],
    duration: Math.random() * 2 + 2.5,
    delay: Math.random() * 1.2,
  }));

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100"
      style={{
        pointerEvents: 'none',
        zIndex: 1050,
        maxHeight: '100vh',
        maxWidth: '100vw',
        contain: 'strict',
        overflow: 'hidden'
      }}
      aria-hidden="true"
    >
      {confettiRibbons.map((c) => (
        <motion.div
          key={c.id}
          className="position-absolute"
          style={{
            left: `${c.x}%`,
            top: `${c.y}%`,
            width: `${c.size}px`,
            height: `${c.size * 2.2}px`,
            backgroundColor: c.color,
            borderRadius: '2px',
            opacity: 0.9
          }}
          initial={{ y: -20, rotate: 0, opacity: 1 }}
          animate={{ y: '96vh', rotate: (Math.random() - 0.5) * 1080, opacity: [1, 1, 0.3, 0] }}
          transition={{
            duration: c.duration,
            delay: c.delay,
            ease: 'easeIn',
          }}
        />
      ))}
    </div>
  );
}
