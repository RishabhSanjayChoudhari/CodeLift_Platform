import React from 'react';
import { FiMessageCircle } from 'react-icons/fi';
import './FloatingWhatsApp.css';

export default function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/919834671940?text=Hello%20CodeLift%2C%20I%20would%20like%20to%20inquire%20about%20your%20courses%20and%20admissions."
      target="_blank"
      rel="noopener noreferrer"
      className="floating-whatsapp"
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
    >
      <FiMessageCircle />
    </a>
  );
}
