import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';

export default function ContactSection() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    program: 'Full-Stack Web Development',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="cl-section-alt py-5" style={{ background: 'var(--bg-card, rgba(255,255,255,0.02))' }}>
      <div className="container">
        <div className="text-center mb-5 cl-fade-up">
          <div className="cl-section-label" style={{ color: 'var(--bs-primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>
            Get in Touch
          </div>
          <h2 className="cl-section-title fw-bold" style={{ color: 'var(--text-primary)' }}>
            Talk to an Academic Counselor
          </h2>
          <p className="cl-section-subtitle text-secondary mx-auto" style={{ maxWidth: '600px' }}>
            Have questions about which program is right for you? Our counselors are here to help—no pressure, just an honest conversation.
          </p>
        </div>

        <div className="row g-4 align-items-stretch">
          {/* Contact Info */}
          <div className="col-lg-4">
            <div
              className="p-4 rounded-4 h-100 border d-flex flex-column justify-content-between"
              style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
            >
              <div>
                <h4 className="fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  We're here for you.
                </h4>
                <p className="text-secondary small mb-4">
                  Whether it's a quick question or an in-depth program discussion, reach out through any of these channels.
                </p>

                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-start gap-3">
                    <FaPhone style={{ color: 'var(--bs-primary)', marginTop: '4px' }} />
                    <div>
                      <strong className="d-block small text-secondary">Phone</strong>
                      <span style={{ color: 'var(--text-primary)' }}>+91 98346 71940</span>
                    </div>
                  </div>
                  <div className="d-flex align-items-start gap-3">
                    <FaEnvelope style={{ color: 'var(--bs-primary)', marginTop: '4px' }} />
                    <div>
                      <strong className="d-block small text-secondary">Email</strong>
                      <span style={{ color: 'var(--text-primary)' }}>codelift.official@gmail.com</span>
                    </div>
                  </div>
                  <div className="d-flex align-items-start gap-3">
                    <FaMapMarkerAlt style={{ color: 'var(--bs-primary)', marginTop: '4px' }} />
                    <div>
                      <strong className="d-block small text-secondary">Campus</strong>
                      <span style={{ color: 'var(--text-primary)' }}>Plot 25, Gayatri Colony, Hazari Pahad, Nagpur</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="col-lg-8">
            <div
              className="p-4 rounded-4 border"
              style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
            >
              {submitted ? (
                <div className="text-center py-5">
                  <FaCheckCircle size={44} style={{ color: 'var(--bs-primary)', marginBottom: '16px' }} />
                  <h4 className="fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Thank you!
                  </h4>
                  <p className="text-secondary mb-4">
                    We have received your details and will get back to you shortly.
                  </p>
                  <button
                    className="btn btn-outline-success rounded-pill px-4"
                    onClick={() => setSubmitted(false)}
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h5 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                    Register Your Interest
                  </h5>
                  <p className="text-secondary small mb-4">
                    Fill in your details and we'll connect with you right away.
                  </p>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-secondary">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="e.g. Rahul Sharma"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-secondary">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        className="form-control"
                        placeholder="e.g. 9834671940"
                        value={form.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-secondary">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-secondary">Interested In *</label>
                      <select
                        name="program"
                        className="form-select"
                        value={form.program}
                        onChange={handleChange}
                      >
                        <option value="Full Stack Development">Full Stack Development</option>
                        <option value="Data Analytics">Data Analytics</option>
                        <option value="Both">Both</option>
                        <option value="Not Sure">Not Sure</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold text-secondary">Message (optional)</label>
                      <textarea
                        name="message"
                        rows={3}
                        className="form-control"
                        placeholder="Tell us about your background or questions..."
                        value={form.message}
                        onChange={handleChange}
                        maxLength={500}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-success px-4 py-2 mt-4 rounded-pill fw-bold">
                    Share Interest →
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
