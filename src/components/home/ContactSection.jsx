import React, { useState } from 'react';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './ContactSection.css';

const ADMIN_WA = import.meta.env.VITE_ADMIN_WHATSAPP || '919834671940';

export default function ContactSection() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    interest: 'Full Stack Development',
    message: '',
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, phone, interest, message } = form;

    if (!name || !email || !phone) {
      toast.error('Please fill in name, email, and phone');
      return;
    }

    const waMessage = `Hello CodeLift Admissions,

I would like to inquire about academic courses at CodeLift.

Applicant Name: ${name}
Email Address: ${email}
Phone Number: ${phone}
Program of Interest: ${interest}
${message ? `Message: ${message}\n` : ''}
Please share upcoming batch schedules and admission details.

Thank you.`;

    const waUrl = `https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(waMessage)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    toast.success('Opening WhatsApp...');
  };

  return (
    <section id="contact" className="cl-section-alt py-5" style={{ background: 'var(--bg-card, rgba(255,255,255,0.02))' }}>
      <div className="container py-3">
        <div className="text-center mb-5 cl-fade-up">
          <div
            className="cl-section-label"
            style={{
              color: 'var(--bs-primary)',
              fontWeight: 700,
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              marginBottom: '8px',
            }}
          >
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
          {/* Contact Info Card */}
          <div className="col-lg-5 col-xl-4">
            <div
              className="p-4 rounded-4 h-100 border d-flex flex-column justify-content-between shadow-sm"
              style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
            >
              <div>
                <h4 className="fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  We're here for you.
                </h4>
                <p className="text-secondary small mb-4" style={{ lineHeight: 1.6 }}>
                  Whether it's a quick question or an in-depth curriculum discussion, reach out through any of these channels.
                </p>

                <div className="contact-info">
                  <div className="contact-row">
                    <FiMapPin className="contact-icon" aria-hidden="true" />
                    <span>Plot 25, Gayatri Colony, Hazari Pahad, Nagpur</span>
                  </div>
                  <div className="contact-row">
                    <FiPhone className="contact-icon" aria-hidden="true" />
                    <a href="tel:+919834671940">+91 98346 71940</a>
                  </div>
                  <div className="contact-row">
                    <FiMail className="contact-icon" aria-hidden="true" />
                    <a href="mailto:codelift.official@gmail.com">codelift.official@gmail.com</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="col-lg-7 col-xl-8">
            <div
              className="p-4 p-md-5 rounded-4 border shadow-sm"
              style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
            >
              <h5 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                Register Your Interest
              </h5>
              <p className="text-secondary small mb-4">
                Fill in your details and connect with us directly on WhatsApp.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-secondary">
                      Full Name *
                    </label>
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
                    <label className="form-label small fw-semibold text-secondary">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      inputMode="tel"
                      autoComplete="tel"
                      className="form-control"
                      placeholder="e.g. 9834671940"
                      value={form.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-secondary">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      inputMode="email"
                      autoComplete="email"
                      autoCapitalize="none"
                      spellCheck="false"
                      className="form-control"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-secondary">
                      Interested In *
                    </label>
                    <select
                      name="interest"
                      className="form-select"
                      value={form.interest}
                      onChange={handleChange}
                      required
                    >
                      <option value="Full Stack Development">Full Stack Development</option>
                      <option value="Data Analytics">Data Analytics</option>
                      <option value="Both">Both</option>
                      <option value="Not Sure">Not Sure</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-semibold text-secondary">
                      Message (optional)
                    </label>
                    <textarea
                      name="message"
                      rows={3}
                      className="form-control"
                      placeholder="Tell us about your background or questions (max 500 characters)..."
                      value={form.message}
                      onChange={handleChange}
                      maxLength={500}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-success px-4 py-2 mt-4 rounded-pill fw-bold"
                  style={{ minHeight: '44px' }}
                >
                  Share Interest →
                </button>

                <small className="text-secondary d-block mt-2" style={{ fontSize: '0.8rem' }}>
                  Submitting opens WhatsApp with your details pre-filled.
                </small>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
