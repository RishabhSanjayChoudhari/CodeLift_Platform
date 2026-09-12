import React from 'react';
import { motion } from 'framer-motion';

export default function TestimonialsSection({ testimonials }) {
  return (
    <section id="testimonials" className="cl-section">
      <div className="container">
        {/* Section Header */}
        <motion.div
          className="text-center mb-5"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <div className="cl-section-label">Learner Stories</div>
          <h2 className="cl-section-title">What Our Learners Say</h2>
          <p className="cl-section-subtitle">
            Don't just take our word for it. Hear directly from the people who've been through
            this journey and come out the other side.
          </p>
        </motion.div>

        {/* Testimonials Cards Grid */}
        <div className="row g-4">
          {testimonials.map((t, i) => (
            <div key={t.name} className="col-md-4">
              <motion.div
                className="cl-testimonial-card h-100"
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.55,
                  delay: i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <span className="cl-stars">★★★★★</span>
                <span className="cl-quote-mark">"</span>
                <blockquote>{t.quote}</blockquote>

                <div className="cl-testimonial-author">
                  <div
                    className="cl-author-avatar"
                    style={{ backgroundColor: t.avatarBg }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div className="cl-author-name">{t.name}</div>
                    <div className="cl-author-role">{t.role}</div>
                    <div style={{ marginTop: '3px' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: 'var(--bs-primary, #15803D)',
                          background: 'rgba(var(--bs-primary-rgb, 21, 128, 61), 0.15)',
                          padding: '2px 8px',
                          borderRadius: '50px',
                        }}
                      >
                        ✓ {t.outcome}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
