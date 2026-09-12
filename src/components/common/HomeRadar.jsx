import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import RadarRings from './RadarRings';
import FlowFieldCanvas from './FlowFieldCanvas';
import NeuralBackground from './NeuralBackground';
import ParticleConstellation from './ParticleConstellation';
import './HomeRadar.css';

export default function HomeRadar({ hideAngles = [] }) {
  const { scrollY } = useScroll();

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const isMobile =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(max-width: 991px)').matches;

  const shouldDisableParallax = prefersReducedMotion || isMobile;

  // Parallax rates: Neural at 0.3x, Particles at 0.5x, Radar at 1.0x
  const yNeural = useTransform(scrollY, [0, 800], [0, shouldDisableParallax ? 0 : 90]);
  const yParticles = useTransform(scrollY, [0, 800], [0, shouldDisableParallax ? 0 : 150]);
  const yRadar = useTransform(scrollY, [0, 800], [0, shouldDisableParallax ? 0 : 200]);

  return (
    <div className="home-radar" aria-hidden="true">
      {/* Layer 1: Ambient Flow Field Canvas (Atmosphere) */}
      <div className="home-art-flow-container">
        <FlowFieldCanvas
          className="home-flow-canvas"
          particleCount={2400}
          opacity={0.16}
        />
      </div>

      {/* Layer 2: Neural Network with 0.3x Parallax */}
      <motion.div
        className="home-art-neural-container"
        style={{ y: yNeural }}
      >
        <NeuralBackground
          className="home-neural-canvas"
          nodeDensity={75}
          speed={0.04}
          opacity={0.35}
        />
      </motion.div>

      {/* Layer 3: Interactive Particle Constellation with 0.5x Parallax */}
      <motion.div
        className="home-art-particles-container"
        style={{ y: yParticles }}
      >
        <ParticleConstellation
          id="home-particles"
          particleCount={85}
          speed={0.4}
          opacity={0.40}
          interactive={true}
        />
      </motion.div>

      {/* Layer 4: Linear vignette softening AI art on left behind text copy */}
      <div className="home-radar-vignette" />

      {/* Layer 5: Radar Rings Stage with 1.0x Parallax (Preserves CSS vertical centering) */}
      <div className="home-radar-stage">
        <motion.div
          className="home-radar-motion"
          style={{ y: yRadar }}
        >
          <RadarRings showLabels={true} nucleusSize="lg" hideAngles={hideAngles} />
        </motion.div>
      </div>
    </div>
  );
}
