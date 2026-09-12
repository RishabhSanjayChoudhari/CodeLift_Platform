import React from 'react';
import { motion } from 'framer-motion';
import { FaBookOpen, FaUsers, FaProjectDiagram, FaCheckCircle } from 'react-icons/fa';

const PILLARS = [
  {
    icon: <FaBookOpen size={24} />,
    title: 'Industry-Ready Curriculum',
    body: "Our syllabus is crafted with senior engineers who currently work at product companies and startups. We teach what teams are actually using—not yesterday's tools. Every module is reviewed quarterly to stay current.",
  },
  {
    icon: <FaUsers size={24} />,
    title: 'Mentorship & Community',
    body: "We keep batch sizes small intentionally. You get dedicated 1:1 mentorship sessions, weekly group doubt-clearing, and access to a thriving alumni network that continues to grow and support each other long after the program ends.",
  },
  {
    icon: <FaProjectDiagram size={24} />,
    title: 'Project-Based Learning',
    body: "Theory without practice is empty. Every module is paired with a hands-on project that goes into your GitHub portfolio. By the time you graduate, you'll have multiple production-ready applications that you can proudly showcase to employers.",
  },
];

export default function PillarsSection() {
  return (
    <section id="about" className="cl-section">
      <div className="container">
        {/* Section Header */}
        <motion.div
          className="text-center mb-5"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <div className="cl-section-label">Why CodeLift</div>
          <h2 className="cl-section-title">We Don't Just Teach Code.<br />We Build Careers.</h2>
          <p className="cl-section-subtitle">
            We believe education should be personal, practical, and powerful. Our programs
            are designed around what the industry actually needs—not just what textbooks say.
          </p>
        </motion.div>

        {/* 3 Pillars Cards with Staggered Entrance */}
        <div className="row g-4">
          {PILLARS.map(({ icon, title, body }, index) => (
            <div key={title} className="col-md-4">
              <motion.div
                className="cl-pillar-card"
                initial={{ opacity: 0, y: 35, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
              >
                <div className="cl-pillar-icon">{icon}</div>
                <h4>{title}</h4>
                <p>{body}</p>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Philosophy & Highlights */}
        <motion.div
          className="row mt-5 align-items-center g-5"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="col-lg-6">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=640&auto=format&fit=crop&q=80"
              alt="Students collaborating on a coding project together"
              style={{
                borderRadius: '20px',
                width: '100%',
                height: '320px',
                objectFit: 'cover',
                boxShadow: '0 16px 48px rgba(0,0,0,0.1)',
              }}
            />
          </div>
          <div className="col-lg-6">
            <div className="cl-section-label">Our Philosophy</div>
            <h3
              style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                color: 'var(--text-primary, #171717)',
                marginBottom: '16px',
                lineHeight: 1.3,
              }}
            >
              Small batches. Big impact.
            </h3>
            <p style={{ color: 'var(--text-secondary, #52525B)', lineHeight: 1.8, marginBottom: '16px' }}>
              We intentionally limit each cohort to a small group so that every learner gets the
              attention they deserve. When you raise your hand with a doubt, a mentor is right there.
              When you struggle with a concept, we slow down and explore it together.
            </p>
            <p style={{ color: 'var(--text-secondary, #52525B)', lineHeight: 1.8, marginBottom: '24px' }}>
              We've seen it time and again: the learners who succeed here aren't always the most
              technical to begin with—they're the most curious, the most persistent. Our job is to
              channel that drive into a structured, supportive journey.
            </p>
            {[
              'Doubt resolution within 24 hours—always',
              'Peer programming sessions every week',
              'Placement support for 6 months post-graduation',
            ].map((item) => (
              <div key={item} className="d-flex align-items-start gap-2 mb-2">
                <FaCheckCircle style={{ color: 'var(--bs-primary, #15803D)', marginTop: '3px', flexShrink: 0 }} />
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary, #52525B)' }}>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
