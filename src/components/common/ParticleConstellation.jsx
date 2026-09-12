import React, { useMemo } from 'react';
import Particles, { ParticlesProvider } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { useTheme } from '../../contexts/ThemeContext';

const initParticles = async (engine) => {
  await loadSlim(engine);
};

export default function ParticleConstellation({
  id = 'particle-constellation',
  particleCount = 60,
  speed = 0.4,
  opacity = 0.4,
  interactive = true,
  className = '',
  style = {},
}) {
  const { currentTheme } = useTheme();

  // Dynamically resolve theme colors from CSS variables
  const colors = useMemo(() => {
    if (typeof window === 'undefined') return ['#15803D', '#0891B2', '#D97706'];
    const style = window.getComputedStyle(document.documentElement);
    const primary = style.getPropertyValue('--bs-primary').trim() || '#15803D';
    const info = style.getPropertyValue('--bs-info').trim() || style.getPropertyValue('--info').trim() || '#0891B2';
    const warning = style.getPropertyValue('--bs-warning').trim() || style.getPropertyValue('--warning').trim() || '#D97706';
    return [primary, info, warning];
  }, [currentTheme]);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const effectiveSpeed = prefersReducedMotion ? 0 : speed;

  const particleOptions = useMemo(
    () => ({
      fullScreen: { enable: false },
      fpsLimit: 45,
      detectRetina: true,
      particles: {
        number: {
          value: particleCount,
          density: { enable: true, area: 800 },
        },
        color: {
          value: colors,
        },
        shape: { type: 'circle' },
        opacity: {
          value: { min: 0.2, max: 0.45 },
          animation: {
            enable: !prefersReducedMotion,
            speed: 0.8,
            sync: false,
          },
        },
        size: {
          value: { min: 1.5, max: 3.5 },
          animation: {
            enable: !prefersReducedMotion,
            speed: 1.2,
            sync: false,
          },
        },
        move: {
          enable: !prefersReducedMotion,
          speed: effectiveSpeed,
          direction: 'none',
          random: true,
          straight: false,
          outModes: { default: 'bounce' },
        },
        links: {
          enable: true,
          color: colors[0],
          distance: 120,
          opacity: 0.22,
          width: 1,
        },
      },
      interactivity: {
        events: {
          onHover: {
            enable: interactive && !prefersReducedMotion,
            mode: ['grab', 'repulse'],
          },
        },
        modes: {
          grab: {
            distance: 140,
            links: {
              opacity: 0.35,
              color: colors[0],
            },
          },
          repulse: {
            distance: 80,
            duration: 0.4,
            speed: 0.6,
          },
        },
      },
    }),
    [colors, particleCount, effectiveSpeed, interactive, prefersReducedMotion]
  );

  return (
    <div
      className={`particle-constellation-wrapper ${className}`}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        opacity,
        pointerEvents: interactive ? 'auto' : 'none',
        overflow: 'hidden',
        ...style,
      }}
    >
      <ParticlesProvider init={initParticles}>
        <Particles
          id={id}
          className="particle-constellation-canvas"
          options={particleOptions}
          style={{ width: '100%', height: '100%' }}
        />
      </ParticlesProvider>
    </div>
  );
}
