import React from 'react';
import FlowFieldCanvas from './FlowFieldCanvas';
import NeuralBackground from './NeuralBackground';
import ParticleConstellation from './ParticleConstellation';
import './AIArtLayer.css';

export default function AIArtLayer({
  variant = 'login', // 'login' | 'home'
  className = '',
  particleCount,
  neuralSpeed = 0.04,
  showFlowField = true,
  showNeural = true,
  showParticles = true,
  interactiveParticles = true,
  children,
}) {
  const defaultParticleCount = variant === 'home' ? 80 : 60;
  const count = particleCount ?? defaultParticleCount;

  return (
    <div
      className={`ai-art-layer ai-art-layer-${variant} ${className}`}
      aria-hidden="true"
    >
      {/* Layer 1: Generative Fluid Flow Field (Atmosphere) */}
      {showFlowField && (
        <FlowFieldCanvas
          className="ai-art-flow-field"
          particleCount={variant === 'home' ? 2400 : 1800}
          opacity={0.15}
        />
      )}

      {/* Layer 2: Breathing Neural Network (AI Theme) */}
      {showNeural && (
        <NeuralBackground
          className="ai-art-neural-net"
          nodeDensity={variant === 'home' ? 75 : 65}
          speed={neuralSpeed}
          opacity={0.35}
        />
      )}

      {/* Layer 3: Interactive Particle Constellation */}
      {showParticles && (
        <ParticleConstellation
          id={`ai-particles-${variant}`}
          className="ai-art-constellation"
          particleCount={count}
          speed={0.4}
          opacity={0.4}
          interactive={interactiveParticles}
        />
      )}

      {/* Optional slotted overlays or radar stages */}
      {children}
    </div>
  );
}
