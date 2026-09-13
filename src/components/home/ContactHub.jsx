import React, { useState } from 'react';
import {
  FiSearch,
  FiMapPin,
  FiInstagram,
  FiMessageCircle,
  FiArrowUpRight,
  FiPhoneCall,
  FiMail,
  FiSend,
} from 'react-icons/fi';
import InterestFormModal from './InterestFormModal';
import './ContactHub.css';

export default function ContactHub() {
  const [showContactForm, setShowContactForm] = useState(false);

  return (
    <section id="contact" className="contact-hub-section py-3">
      <div className="container">
        {/* Unified Combined Contact & Social Hub */}
        <div className="contact-hub-wrapper">
          <div className="row g-4 align-items-stretch">
            {/* Left Column: Primary Interaction Hero Card */}
            <div className="col-lg-5 col-xl-5 d-flex">
              <div className="contact-hero-card w-100">
                <div className="contact-hero-top">
                  <div className="contact-live-pill">
                    <span className="live-dot" />
                    <span>Admissions &amp; Guidance Active</span>
                  </div>
                  <h3 className="contact-hero-title">
                    Interested in Joining CodeLift?
                  </h3>
                  <p className="contact-hero-desc">
                    Share your details and we'll reach out to you on WhatsApp to discuss your career goals, syllabus, and upcoming batches.
                  </p>
                </div>

                <div className="contact-hero-action">
                  <button
                    type="button"
                    className="btn btn-hero-cta w-100"
                    onClick={() => setShowContactForm(true)}
                  >
                    <span>Share Interest</span>
                    <FiSend size={16} />
                  </button>
                  <small className="contact-hero-hint">
                    ⚡ Instant WhatsApp connect • Zero spam
                  </small>
                </div>

                {/* Integrated Direct Contact Footnote */}
                <div className="contact-direct-strip">
                  <a href="tel:+919834671940" className="contact-direct-item">
                    <div className="direct-icon-circle">
                      <FiPhoneCall size={14} />
                    </div>
                    <div className="direct-text-group">
                      <span className="direct-label">Call Directly</span>
                      <span className="direct-val">+91 98346 71940</span>
                    </div>
                  </a>
                  <a href="mailto:codelift.official@gmail.com" className="contact-direct-item">
                    <div className="direct-icon-circle">
                      <FiMail size={14} />
                    </div>
                    <div className="direct-text-group">
                      <span className="direct-label">Official Email</span>
                      <span className="direct-val">codelift.official@gmail.com</span>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: 2x2 Official Channel Cards Grid */}
            <div className="col-lg-7 col-xl-7 d-flex">
              <div className="contact-channels-grid w-100">
                {/* 1. Google Business */}
                <a
                  href="https://share.google/qZlZpyhvHoGCLU4aZ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="channel-tile"
                >
                  <div className="channel-tile-header">
                    <div className="channel-icon-box icon-google">
                      <FiSearch size={22} />
                    </div>
                    <span className="channel-arrow-badge">
                      <FiArrowUpRight size={16} />
                    </span>
                  </div>
                  <div className="channel-tile-body">
                    <div className="channel-tag">Verified Business</div>
                    <h4 className="channel-title">Find Us on Google</h4>
                    <p className="channel-desc">
                      See our reviews and business profile on Google.
                    </p>
                  </div>
                  <div className="channel-tile-footer">
                    <span className="channel-action-label">View on Google</span>
                  </div>
                </a>

                {/* 2. Visit Location */}
                <a
                  href="https://maps.app.goo.gl/GoQbaPXr3Gc5YvaB7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="channel-tile"
                >
                  <div className="channel-tile-header">
                    <div className="channel-icon-box icon-location">
                      <FiMapPin size={22} />
                    </div>
                    <span className="channel-arrow-badge">
                      <FiArrowUpRight size={16} />
                    </span>
                  </div>
                  <div className="channel-tile-body">
                    <div className="channel-tag">Nagpur Campus</div>
                    <h4 className="channel-title">Visit Our Office</h4>
                    <p className="channel-desc">
                      Plot 25, Gayatri Colony, Hazari Pahad, Nagpur
                    </p>
                  </div>
                  <div className="channel-tile-footer">
                    <span className="channel-action-label">Get Directions</span>
                  </div>
                </a>

                {/* 3. Instagram */}
                <a
                  href="https://www.instagram.com/codelift._/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="channel-tile"
                >
                  <div className="channel-tile-header">
                    <div className="channel-icon-box icon-instagram">
                      <FiInstagram size={22} />
                    </div>
                    <span className="channel-arrow-badge">
                      <FiArrowUpRight size={16} />
                    </span>
                  </div>
                  <div className="channel-tile-body">
                    <div className="channel-tag">Social Community</div>
                    <h4 className="channel-title">Follow Us on Instagram</h4>
                    <p className="channel-desc">
                      Stay updated with the latest news, events, and student success stories.
                    </p>
                  </div>
                  <div className="channel-tile-footer">
                    <span className="channel-action-label">@codelift._</span>
                  </div>
                </a>

                {/* 4. WhatsApp Direct */}
                <div className="channel-tile channel-tile-interactive">
                  <div className="channel-tile-header">
                    <div className="channel-icon-box icon-whatsapp">
                      <FiMessageCircle size={22} />
                    </div>
                    <span className="channel-badge-status">Fast Response</span>
                  </div>
                  <div className="channel-tile-body">
                    <div className="channel-tag">Instant Connect</div>
                    <h4 className="channel-title">WhatsApp Us Directly</h4>
                    <p className="channel-desc">
                      Chat with us or call directly for quick assistance.
                    </p>
                  </div>
                  <div className="channel-tile-footer d-flex gap-2 flex-wrap">
                    <a
                      href="https://wa.me/919834671940?text=Hi%20CodeLift%2C%20I%27d%20like%20to%20know%20more"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-channel-wa flex-grow-1"
                    >
                      Chat on WhatsApp
                    </a>
                    <a
                      href="tel:+919834671940"
                      className="btn btn-channel-tel"
                    >
                      Call 98346 71940
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
