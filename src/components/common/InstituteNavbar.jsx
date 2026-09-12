import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaGraduationCap, FaLock, FaUserGraduate } from 'react-icons/fa';
import { FiMenu, FiX } from 'react-icons/fi';

export default function InstituteNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToSection = (id) => {
    setExpanded(false);
    const el = document.getElementById(id);
    if (el) {
      const offset = 72;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <nav className={`cl-navbar navbar navbar-expand-lg fixed-top py-2 ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        {/* Brand */}
        <Link to="/" className="navbar-brand" onClick={() => setExpanded(false)}>
          <FaGraduationCap style={{ color: 'var(--bs-primary)', fontSize: '1.3rem' }} />
          <span>Code<span style={{ color: 'var(--bs-primary)' }}>Lift</span></span>
        </Link>

        {/* Hamburger Toggle with FiMenu / FiX - only visible on mobile/tablet < 992px */}
        <button
          className="navbar-toggler border-0 shadow-none d-lg-none d-flex align-items-center justify-content-center p-1"
          type="button"
          aria-expanded={expanded}
          aria-label="Toggle navigation"
          onClick={() => setExpanded(!expanded)}
          style={{ fontSize: '1.25rem', color: 'var(--bs-primary)' }}
        >
          {expanded ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Nav Links */}
        <div className={`collapse navbar-collapse ${expanded ? 'show' : ''}`}>
          <ul className="navbar-nav mx-auto gap-1">
            {[
              { label: 'Home', id: 'hero' },
              { label: 'About Us', id: 'about' },
              { label: 'Programs', id: 'programs' },
              { label: 'Testimonials', id: 'testimonials' },
              { label: 'Contact', id: 'contact' },
            ].map(({ label, id }) => (
              <li className="nav-item" key={id}>
                <button
                  className="nav-link btn btn-link border-0 shadow-none"
                  style={{ textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}
                  onClick={() => scrollToSection(id)}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>

          {/* Right Action Controls: Login CTAs */}
          <div className="d-flex gap-2 align-items-center mt-2 mt-lg-0">

            <Link
              to="/login"
              className="btn-admin"
              onClick={() => setExpanded(false)}
              style={{
                background: 'var(--bs-primary)',
                color: '#ffffff',
                borderColor: 'var(--bs-primary)',
                fontSize: '0.82rem',
                padding: '7px 16px'
              }}
            >
              <FaUserGraduate style={{ fontSize: '0.7rem' }} />
              Student Portal
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
