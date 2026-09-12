import React from 'react';
import AIArtLayer from './AIArtLayer';
import RadarRings from './RadarRings';
import './LoginRadar.css';

export default function LoginRadar() {
  return (
    <div className="login-radar" aria-hidden="true">
      {/* 3-Layer AI Art Stack: Flow Field + Breathing Neural Canvas + Particle Constellation */}
      <AIArtLayer variant="login" particleCount={60} />
      
      {/* Layer 4: Radar Rings, Orbiting Planets & Central Nucleus */}
      <div className="login-radar-stage">
        <RadarRings showLabels={true} nucleusSize="sm" variant="login" />
      </div>
    </div>
  );
}
