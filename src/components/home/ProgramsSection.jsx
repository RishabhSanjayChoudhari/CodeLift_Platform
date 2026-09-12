import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBook, FaDownload, FaCheckCircle } from 'react-icons/fa';

function ProgramCardItem({ program, index, onViewSyllabus, onBrochure }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [shimmerParticles, setShimmerParticles] = useState([]);
  const hasBurstRef = useRef(false);

  // Check reduced motion
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleMouseMove = (e) => {
    if (prefersReducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 3D perspective tilt
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotX = -((y - centerY) / centerY) * 4; // max 4 deg
    const rotY = ((x - centerX) / centerX) * 4;

    setTilt({ rotateX: rotX, rotateY: rotY });

    // Spawn 8-12 shimmer particles once on enter
    if (!hasBurstRef.current) {
      hasBurstRef.current = true;
      const count = 10;
      const newParticles = [];
      const colors = ['var(--bs-primary, #15803D)', 'var(--bs-info, #0891B2)', '#F59E0B', '#FFFFFF'];

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.2 + Math.random() * 2.5;
        newParticles.push({
          id: Date.now() + i,
          x,
          y,
          dx: Math.cos(angle) * speed * 22,
          dy: Math.sin(angle) * speed * 22,
          color: colors[i % colors.length],
          size: 2.5 + Math.random() * 3,
        });
      }

      setShimmerParticles(newParticles);
      setTimeout(() => {
        setShimmerParticles([]);
      }, 700);
    }
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
    hasBurstRef.current = false;
  };

  return (
    <motion.div
      ref={cardRef}
      className="cl-program-card position-relative"
      initial={{ opacity: 0, y: 35, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: prefersReducedMotion
          ? 'none'
          : `perspective(800px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
        transition: 'transform 0.15s ease-out, box-shadow 0.25s ease',
        transformStyle: 'preserve-3d',
        overflow: 'hidden',
      }}
    >
      {/* Particle Shimmer Burst Overlay */}
      {shimmerParticles.length > 0 && (
        <div
          className="particle-shimmer-container"
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          {shimmerParticles.map((p) => (
            <span
              key={p.id}
              className="shimmer-particle"
              style={{
                position: 'absolute',
                left: `${p.x}px`,
                top: `${p.y}px`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                borderRadius: '50%',
                backgroundColor: p.color,
                boxShadow: `0 0 6px ${p.color}`,
                transform: `translate(${p.dx}px, ${p.dy}px)`,
                opacity: 0,
                transition: 'transform 0.65s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.65s ease-out',
                animation: 'shimmer-fade 0.65s forwards',
              }}
            />
          ))}
        </div>
      )}

      {/* Colored Banner */}
      <div
        className="cl-program-card-banner"
        style={{ background: program.bannerColor }}
      />

      <div className="cl-program-card-body">
        <div className="cl-program-icon">{program.icon}</div>
        <h3>{program.title}</h3>
        <div className="cl-program-duration">
          <FaBook style={{ fontSize: '0.75rem' }} />
          {program.duration}
        </div>
        <p>{program.description}</p>

        {/* Skill Tags */}
        <div className="cl-skill-tags">
          {program.skills.map((s) => (
            <span key={s} className="cl-skill-tag">{s}</span>
          ))}
        </div>

        {/* Program Highlights */}
        <div className="mb-4">
          {program.highlights.map((h) => (
            <div key={h} className="d-flex align-items-center gap-2 mb-1">
              <FaCheckCircle style={{ color: 'var(--bs-primary, #15803D)', fontSize: '0.75rem', flexShrink: 0 }} />
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary, #52525B)' }}>{h}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="cl-program-actions">
          <button
            className="cl-btn-syllabus"
            onClick={() => onViewSyllabus(program)}
          >
            <FaBook style={{ fontSize: '0.75rem' }} /> View Syllabus
          </button>
          <button
            className="cl-btn-brochure"
            onClick={() => onBrochure(program)}
          >
            <FaDownload style={{ fontSize: '0.75rem' }} /> Brochure
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProgramsSection({ programs, onViewSyllabus, onBrochure }) {
  return (
    <section id="programs" className="cl-section-alt">
      <div className="container">
        {/* Section Header */}
        <motion.div
          className="text-center mb-5"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <div className="cl-section-label">Our Programs</div>
          <h2 className="cl-section-title">Programs Designed for Your Success</h2>
          <p className="cl-section-subtitle">
            Whether you're starting from scratch or leveling up, we have a program tailored to
            take you to where you want to be.
          </p>
        </motion.div>

        {/* Programs Grid */}
        <div className="row g-4">
          {programs.map((prog, i) => (
            <div key={prog.id} className="col-lg-4">
              <ProgramCardItem
                program={prog}
                index={i}
                onViewSyllabus={onViewSyllabus}
                onBrochure={onBrochure}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
