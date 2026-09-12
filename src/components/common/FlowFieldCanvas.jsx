import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

// Fast, self-contained 2D Simplex Noise implementation for smooth flow field calculations
class SimplexNoise {
  constructor(seed = 1337) {
    this.p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) this.p[i] = i;
    let s = seed;
    for (let i = 255; i > 0; i--) {
      s = (s * 16807) % 2147483647;
      const j = s % (i + 1);
      const temp = this.p[i];
      this.p[i] = this.p[j];
      this.p[j] = temp;
    }
    this.perm = new Uint8Array(512);
    this.permMod12 = new Uint8Array(512);
    for (let i = 0; i < 512; i++) {
      this.perm[i] = this.p[i & 255];
      this.permMod12[i] = this.perm[i] % 12;
    }
  }

  noise2D(xin, yin) {
    const F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
    const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
    let n0 = 0, n1 = 0, n2 = 0;

    const s = (xin + yin) * F2;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const t = (i + j) * G2;
    const X0 = i - t;
    const Y0 = j - t;
    const x0 = xin - X0;
    const y0 = yin - Y0;

    let i1, j1;
    if (x0 > y0) { i1 = 1; j1 = 0; }
    else { i1 = 0; j1 = 1; }

    const x1 = x0 - i1 + G2;
    const y1 = y0 - j1 + G2;
    const x2 = x0 - 1.0 + 2.0 * G2;
    const y2 = y0 - 1.0 + 2.0 * G2;

    const ii = i & 255;
    const jj = j & 255;

    const gi0 = this.permMod12[ii + this.perm[jj]];
    const gi1 = this.permMod12[ii + i1 + this.perm[jj + j1]];
    const gi2 = this.permMod12[ii + 1 + this.perm[jj + 1]];

    const GRAD3 = [
      [1, 1], [-1, 1], [1, -1], [-1, -1],
      [1, 0], [-1, 0], [1, 0], [-1, 0],
      [0, 1], [0, -1], [0, 1], [0, -1],
    ];

    let t0 = 0.5 - x0 * x0 - y0 * y0;
    if (t0 >= 0) {
      t0 *= t0;
      const g = GRAD3[gi0];
      n0 = t0 * t0 * (g[0] * x0 + g[1] * y0);
    }

    let t1 = 0.5 - x1 * x1 - y1 * y1;
    if (t1 >= 0) {
      t1 *= t1;
      const g = GRAD3[gi1];
      n1 = t1 * t1 * (g[0] * x1 + g[1] * y1);
    }

    let t2 = 0.5 - x2 * x2 - y2 * y2;
    if (t2 >= 0) {
      t2 *= t2;
      const g = GRAD3[gi2];
      n2 = t2 * t2 * (g[0] * x2 + g[1] * y2);
    }

    return 70.0 * (n0 + n1 + n2);
  }
}

export default function FlowFieldCanvas({
  className = '',
  opacity = 0.15,
  particleCount = 2200,
  style = {},
}) {
  const canvasRef = useRef(null);
  const { currentTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Check reduced motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animId = null;
    let width = 0;
    let height = 0;
    const simplex = new SimplexNoise(42);

    // Dynamic color sampling
    const styleObj = window.getComputedStyle(document.documentElement);
    const primaryColor = styleObj.getPropertyValue('--bs-primary').trim() || '#15803D';

    // Parse RGB components or fallback
    let r = 21, g = 128, b = 61;
    if (primaryColor.startsWith('#')) {
      const hex = primaryColor.replace('#', '');
      if (hex.length === 6) {
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
      } else if (hex.length === 3) {
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
      }
    }

    const colorStr = `rgba(${r}, ${g}, ${b}, 0.28)`;

    // Resize handler
    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      width = canvas.width = rect.width || window.innerWidth;
      height = canvas.height = rect.height || window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Determine particle count based on screen width
    const effectiveCount = width < 768 ? Math.min(600, particleCount) : particleCount;

    // Initialize particles
    const particles = new Float32Array(effectiveCount * 4); // [x, y, prevX, prevY]
    for (let i = 0; i < effectiveCount; i++) {
      const idx = i * 4;
      particles[idx] = Math.random() * width;
      particles[idx + 1] = Math.random() * height;
      particles[idx + 2] = particles[idx];
      particles[idx + 3] = particles[idx + 1];
    }

    let lastTime = performance.now();
    const targetInterval = 1000 / 30; // Throttle to 30 FPS for ambient flow
    let timeOffset = 0;

    const render = (currentTime) => {
      if (document.hidden || prefersReducedMotion) {
        animId = requestAnimationFrame(render);
        return;
      }

      const elapsed = currentTime - lastTime;
      if (elapsed < targetInterval) {
        animId = requestAnimationFrame(render);
        return;
      }
      lastTime = currentTime - (elapsed % targetInterval);

      timeOffset += 0.002;
      const noiseScale = 0.003;
      const stepSpeed = 1.2;

      // Fade previous particle trails towards full transparency without darkening the page background
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.07)';
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'source-over';

      ctx.strokeStyle = colorStr;
      ctx.lineWidth = 1.0;
      ctx.beginPath();

      for (let i = 0; i < effectiveCount; i++) {
        const idx = i * 4;
        const x = particles[idx];
        const y = particles[idx + 1];

        // Sample angle from simplex noise
        const angle = simplex.noise2D(x * noiseScale, y * noiseScale + timeOffset) * Math.PI * 2;
        const nextX = x + Math.cos(angle) * stepSpeed;
        const nextY = y + Math.sin(angle) * stepSpeed;

        ctx.moveTo(x, y);
        ctx.lineTo(nextX, nextY);

        particles[idx + 2] = x;
        particles[idx + 3] = y;

        // Wrap around bounds or reset randomly
        if (nextX < 0 || nextX > width || nextY < 0 || nextY > height || Math.random() < 0.005) {
          particles[idx] = Math.random() * width;
          particles[idx + 1] = Math.random() * height;
        } else {
          particles[idx] = nextX;
          particles[idx + 1] = nextY;
        }
      }

      ctx.stroke();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [currentTheme, particleCount]);

  return (
    <div
      className={`flow-field-wrapper ${className}`}
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
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
}
