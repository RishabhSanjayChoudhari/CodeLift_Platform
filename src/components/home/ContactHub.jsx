import React, { useState } from 'react';
import { FiSearch, FiMapPin, FiInstagram, FiMessageCircle, FiArrowRight, FiPhoneCall } from 'react-icons/fi';
import InterestFormModal from './InterestFormModal';
import './ContactHub.css';

export default function ContactHub() {
  const [showContactForm, setShowContactForm] = useState(false);

  return (
    <section id="contact" className="contact-hub-section py-5">
      <div className="container py-3">
        {/* Section Header */}
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
            Connect With Us
          </div>
          <h2 className="fw-bold display-6 mb-2" style={{ color: 'var(--text-primary)' }}>
            Get in Touch
          </h2>
          <p className="text-secondary mx-auto mb-0" style={{ maxWidth: '600px' }}>
            Reach out to us on any platform — we're here to help.
          </p>
        </div>

        {/* 2-Column Responsive Grid */}
        <div className="contact-grid">
          {/* Block 1 — Find Us on Google */}
          <div className="contact-block">
            <div className="contact-icon-wrapper">
              <FiSearch className="contact-icon" />
            </div>
            <h3>Find Us on Google</h3>
            <p>See our reviews and business profile on Google.</p>
            <a
              href="https://share.google/qZlZpyhvHoGCLU4aZ"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-primary mt-auto"
            >
              View on Google
            </a>
          </div>

          {/* Block 2 — Visit Our Location */}
          <div className="contact-block">
            <div className="contact-icon-wrapper">
              <FiMapPin className="contact-icon" />
            </div>
            <h3>Visit Our Office</h3>
            <p>Plot 25, Gayatri Colony, Hazari Pahad, Nagpur</p>
            <a
              href="https://maps.app.goo.gl/GoQbaPXr3Gc5YvaB7"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-primary mt-auto"
            >
              Get Directions
            </a>
          </div>

          {/* Block 3 — Follow Us on Instagram */}
          <div className="contact-block">
            <div className="contact-icon-wrapper">
              <FiInstagram className="contact-icon" />
            </div>
            <h3>Follow Us on Instagram</h3>
            <p>Stay updated with the latest news, events, and student success stories.</p>
            <a
              href="https://www.instagram.com/codelift._/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-primary mt-auto"
            >
              @codelift._
            </a>
          </div>

          {/* Block 4 — WhatsApp Us Directly */}
          <div className="contact-block">
            <div className="contact-icon-wrapper">
              <FiMessageCircle className="contact-icon" />
            </div>
            <h3>WhatsApp Us</h3>
            <p>Chat with us or call directly for quick assistance.</p>
            <div className="d-flex gap-2 flex-wrap mt-auto">
              <a
                href="https://wa.me/919834671940?text=Hi%20CodeLift%2C%20I%27d%20like%20to%20know%20more"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Chat on WhatsApp
              </a>
              <a
                href="tel:+919834671940"
                className="btn btn-outline-primary d-inline-flex align-items-center gap-1.5"
              >
                <FiPhoneCall size={14} /> Call 98346 71940
              </a>
            </div>
          </div>
        </div>

        {/* Block 5 — Share Interest (Contact Form Trigger) */}
        <div className="share-interest-cta mt-4">
          <h3>Interested in Joining CodeLift?</h3>
          <p>Share your details and we'll reach out to you on WhatsApp.</p>
          <button
            type="button"
            className="btn btn-primary btn-lg d-inline-flex align-items-center gap-2"
            onClick={() => setShowContactForm(true)}
          >
            <span>Share Interest</span>
            <FiArrowRight />
          </button>
        </div>
      </div>

      {/* Contact Form Modal */}
      <InterestFormModal
        show={showContactForm}
        onHide={() => setShowContactForm(false)}
      />
    </section>
  );
}
