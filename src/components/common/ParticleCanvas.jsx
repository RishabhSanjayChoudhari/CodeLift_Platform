import React from 'react';
import Particles, { ParticlesProvider } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

const initParticles = async (engine) => {
  await loadSlim(engine);
};

export default function ParticleCanvas({ id = 'radar-particles' }) {
  return (
    <ParticlesProvider init={initParticles}>
      <Particles
        id={id}
        className="radar-particle-canvas"
        options={{
          fullScreen: { enable: false },
          fpsLimit: 60,
          detectRetina: true,
          particles: {
            number: { value: 90, density: { enable: true, area: 900 } },
            color: { value: ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#06B6D4'] },
            shape: { type: 'circle' },
            opacity: {
              value: { min: 0.15, max: 0.65 },
              animation: { enable: true, speed: 1, sync: false },
            },
            size: {
              value: { min: 1, max: 3.5 },
              animation: { enable: true, speed: 2, sync: false },
            },
            move: {
              enable: true,
              speed: 0.6,
              direction: 'none',
              random: true,
              straight: false,
              outModes: { default: 'out' },
            },
            links: {
              enable: true,
              color: '#10B981',
              distance: 130,
              opacity: 0.12,
              width: 1,
            },
          },
          interactivity: {
            events: { onHover: { enable: true, mode: 'grab' } },
            modes: { grab: { distance: 160, links: { opacity: 0.35 } } },
          },
        }}
      />
    </ParticlesProvider>
  );
}
