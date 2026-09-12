import React from 'react';
import { FiMessageCircle } from 'react-icons/fi';
import './FloatingWhatsApp.css';

export default function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/919834671940?text=Hi%20CodeLift%2C%20I%20have%20a%20question"
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
