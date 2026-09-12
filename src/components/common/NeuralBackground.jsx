import React, { useEffect, useRef } from 'react';
import 'seinx-nn-canvas-animation';
import { useTheme } from '../../contexts/ThemeContext';

export default function NeuralBackground({
  className = '',
  nodeDensity = 70,
  speed = 0.04,
  opacity = 0.35,
  style = {},
}) {
  const canvasRef = useRef(null);
  const { currentTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Extract dynamic CSS theme colors
    const computed = window.getComputedStyle(document.documentElement);
    const primary = computed.getPropertyValue('--bs-primary').trim() || '#15803D';
    const info = computed.getPropertyValue('--bs-info').trim() || '#0891B2';

    const effectiveSpeed = prefersReducedMotion ? 0 : speed;

    const applyConfiguration = () => {
      if (typeof canvas.applyConfig === 'function') {
        canvas.applyConfig({
          nodeDensity: Math.min(80, Math.max(50, nodeDensity)),
          speed: effectiveSpeed,
          glowSpread: 2.0,
          glowIntensity: 0.25,
          lineOpacity: 0.35,
          nodeOpacity: 0.6,
          net1Color: primary,
          net2Color: info,
          breathSpeed: prefersReducedMotion ? 0 : 0.25,
          breathIntensity: 0.8,
        });
      }
    };

    // Initial config apply (slight delay ensures shadow DOM initialization)
    const timer = setTimeout(applyConfiguration, 50);

    // Visibility change handler to pause when tab is inactive
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (typeof canvas.applyConfig === 'function') {
          canvas.applyConfig({ speed: 0, breathSpeed: 0 });
        }
      } else {
        applyConfiguration();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [currentTheme, nodeDensity, speed]);

  return (
    <div
      className={`neural-bg-wrapper ${className}`}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        opacity,
        pointerEvents: 'none',
        overflow: 'hidden',
        ...style,
      }}
    >
      <neural-canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          position: 'absolute',
          inset: 0,
        }}
      />
    </div>
  );
}
