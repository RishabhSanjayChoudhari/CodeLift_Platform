import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaArrowRight,
  FaStar,
  FaUserGraduate,
  FaGraduationCap,
  FaBookOpen,
  FaWhatsapp,
  FaLaptopCode,
  FaChalkboardTeacher,
  FaCertificate,
  FaCheckCircle
} from 'react-icons/fa';
import InstituteNavbar from '../components/common/InstituteNavbar';
import HomeRadar from '../components/common/HomeRadar';
import RadarRings from '../components/common/RadarRings';
import ContactHub from '../components/home/ContactHub';
import FloatingWhatsApp from '../components/common/FloatingWhatsApp';
import CourseEnrollModal from '../components/common/CourseEnrollModal';
import { useData } from '../contexts/DataContext';
import '../styles/HomeElevated.css';

export default function Home() {
  const { courses } = useData();
  const [selectedCourseForEnroll, setSelectedCourseForEnroll] = useState(null);
  const [selectedCohortTrack, setSelectedCohortTrack] = useState('all');

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 72;
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'smooth',
      });
    }
  };

  // Highlight strictly published cohort bootcamps on the homepage
  const allCohorts = (courses || []).filter(
    (c) =>
      c.isPublished !== false &&
      c.isApproved !== false &&
      (c.courseType === 'cohort' || c.isCohort === true)
  );

  // Filter cohorts by selected track
  const filteredCohorts = allCohorts.filter((c) => {
    if (selectedCohortTrack === 'all') return true;
    const cat = (c.categoryId || '').toLowerCase();
    const title = (c.title || '').toLowerCase();
    if (selectedCohortTrack === 'web') return cat.includes('web') || title.includes('full') || title.includes('react');
    if (selectedCohortTrack === 'python') return cat.includes('python') || title.includes('python') || title.includes('ai');
    if (selectedCohortTrack === 'data') return cat.includes('data') || title.includes('data') || title.includes('sql');
    return true;
  });

  return (
    <>
      {/* 1. NAVBAR */}
      <InstituteNavbar />

      {/* 2. HERO SECTION */}
      <section id="hero" className="cl-hero hero-section">
        <HomeRadar />
        <div className="container hero-content">
          <div className="row align-items-center g-4 g-lg-5">
            <div className="col-lg-7 col-xl-6">
              <div className="cl-hero-trust-badge mb-3">
                <span className="live-dot" />
                <span>Admissions Open • 2026 Live Cohorts</span>
              </div>
              <h1 className="mb-3 mb-md-4">
                Learn{' '}
                <span className="highlight">
                  -{' '}Build{' '}-
                </span>{' '}  Grow
              </h1>

              <p className="lead-text mb-4" style={{ color: 'var(--text-secondary)' }}>
                Join our community and begin your journey to success. Hands-on coding, production-grade projects, and 1-on-1 mentorship.
              </p>

              <div className="d-flex flex-wrap gap-3 cl-hero-cta-group">
                <button className="btn-explore" onClick={() => scrollTo('courses')}>
                  Explore Cohorts <FaArrowRight style={{ fontSize: '0.8rem' }} />
                </button>
                <button className="btn-visit" onClick={() => scrollTo('contact')}>
                  Talk to a Counselor
                </button>
              </div>

              {/* Hero Key Metrics Ribbon */}
              <div className="cl-hero-metrics-ribbon">
                <div className="cl-hero-metric-item">
                  <div className="cl-hero-metric-icon">
                    <FaLaptopCode />
                  </div>
                  <div className="cl-hero-metric-text">
                    <span className="cl-hero-metric-title">50+ Challenges</span>
                    <span className="cl-hero-metric-sub">Interactive Problem Arena</span>
                  </div>
                </div>

                <div className="cl-hero-metric-item">
                  <div className="cl-hero-metric-icon">
                    <FaChalkboardTeacher />
                  </div>
                  <div className="cl-hero-metric-text">
                    <span className="cl-hero-metric-title">1:1 Mentorship</span>
                    <span className="cl-hero-metric-sub">Live Code Reviews</span>
                  </div>
                </div>

                <div className="cl-hero-metric-item">
                  <div className="cl-hero-metric-icon">
                    <FaCheckCircle />
                  </div>
                  <div className="cl-hero-metric-text">
                    <span className="cl-hero-metric-title">Capstone Projects</span>
                    <span className="cl-hero-metric-sub">Production Deployments</span>
                  </div>
                </div>

                <div className="cl-hero-metric-item">
                  <div className="cl-hero-metric-icon">
                    <FaCertificate />
                  </div>
                  <div className="cl-hero-metric-text">
                    <span className="cl-hero-metric-title">Verified Certs</span>
                    <span className="cl-hero-metric-sub">Industry Recognized</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side empty on desktop — radar stage occupies visually */}
            <div className="col-lg-5 col-xl-6 d-none d-lg-block" />

            {/* Mobile Radar Showcase: Visible ONLY on mobile/tablet (< 992px) */}
            <div className="col-12 d-lg-none mt-3">
              <div className="cl-mobile-radar-card">
                <div className="cl-mobile-radar-header">
                  <span className="cl-mobile-radar-badge">
                    <span className="live-dot" /> Live Tech Stack
                  </span>
                  <span className="cl-mobile-radar-hint">Interactive Skills Radar</span>
                </div>
                <div className="cl-mobile-radar-viewport">
                  <RadarRings showLabels={true} nucleusSize="sm" />
                </div>
                <div className="cl-mobile-radar-caption">
                  Orbiting technologies mastered across CodeLift full-stack &amp; data cohorts
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. COURSES SECTION (COHORTS ONLY) */}
      <section id="courses" className="py-4 py-md-5" style={{ background: 'var(--bg-body)' }}>
        <div className="container py-2 py-md-4">
          <div className="text-center mb-4 mb-md-4">
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
              Flagship Programs
            </div>
            <h2
              className="fw-bold mb-3"
              style={{
                color: 'var(--text-primary)',
                fontSize: 'clamp(1.7rem, 3.5vw, 2.35rem)',
                lineHeight: 1.25,
              }}
            >
              Live Cohort Bootcamps
            </h2>
            <p className="text-secondary mx-auto mb-4" style={{ maxWidth: '640px', fontSize: '0.96rem' }}>
              Master high-impact skills with our intensive, mentor-led cohort bootcamps featuring live problem solving, production deployments, and career placement guidance.
            </p>

            {/* Quick Track Filter Pills */}
            <div className="cl-cohort-filter-pills">
              {[
                { id: 'all', label: `All Cohorts (${allCohorts.length})` },
                { id: 'web', label: 'Full-Stack Web' },
                { id: 'python', label: 'Python & AI' },
                { id: 'data', label: 'Data Analytics' }
              ].map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  className={`cl-cohort-filter-pill ${selectedCohortTrack === pill.id ? 'active' : ''}`}
                  onClick={() => setSelectedCohortTrack(pill.id)}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Courses Grid */}
          {filteredCohorts.length === 0 ? (
            <div
              className="text-center py-5 rounded-4 border"
              style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
            >
              <FaBookOpen className="text-muted fs-1 mb-3 opacity-50" />
              <h5 className="fw-bold" style={{ color: 'var(--text-primary)' }}>
                No active cohorts found for this track
              </h5>
              <p className="text-secondary mb-3">Explore all available cohorts or check back for upcoming batch dates.</p>
              <button
                type="button"
                className="btn btn-outline-success rounded-pill px-4 fw-bold btn-sm"
                onClick={() => setSelectedCohortTrack('all')}
              >
                View All Cohorts
              </button>
            </div>
          ) : (
            <div className="row g-4">
              {filteredCohorts.map((c) => (
                <div key={c.id} className="col-md-6 col-lg-4">
                  <div className="cl-cohort-card-elevated">
                    {/* Thumbnail & Badges */}
                    <div className="cl-cohort-img-wrap">
                      <img
                        src={
                          c.thumbnail ||
                          'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600'
                        }
                        alt={c.title}
                        className="cl-cohort-img"
                      />
                      <div className="cl-cohort-badge-live">
                        <span className="live-dot" /> Live Cohort
                      </div>
                      <span
                        className={`badge rounded-pill cl-cohort-price-tag ${
                          c.isFree || c.price === 0 ? 'bg-success text-white' : 'bg-primary text-white'
                        }`}
                      >
                        {c.isFree || c.price === 0 ? 'Free' : `₹${c.price}`}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="cl-cohort-body">
                      <div>
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <span className="cl-course-category-tag">
                            {c.categoryId
                              ? c.categoryId.replace('cat-', '').replace(/-/g, ' ').toUpperCase()
                              : 'COHORT PROGRAM'}
                          </span>
                          <div
                            className="d-flex align-items-center gap-1 text-warning fw-bold small"
                            style={{ fontSize: '0.8rem' }}
                          >
                            <FaStar size={12} /> {c.rating || 5.0} ({c.numReviews || 0})
                          </div>
                        </div>

                        <h5
                          className="fw-bold mb-2"
                          style={{ fontSize: '1.12rem', minHeight: '2.8rem', lineHeight: 1.35 }}
                        >
                          <Link
                            to={`/courses/${c.slug || c.id}`}
                            className="text-decoration-none line-clamp-2"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            {c.title}
                          </Link>
                        </h5>
                        <p
                          className="text-secondary small line-clamp-2 mb-2"
                          style={{ minHeight: '38px', lineHeight: 1.55 }}
                        >
                          {c.description}
                        </p>

                        {/* Feature Bullets */}
                        <ul className="cl-cohort-feature-bullets">
                          <li className="cl-cohort-feature-bullet">
                            <FaCheckCircle size={12} /> 1-on-1 Mentor Code Reviews
                          </li>
                          <li className="cl-cohort-feature-bullet">
                            <FaCheckCircle size={12} /> Production Capstone Project
                          </li>
                          <li className="cl-cohort-feature-bullet">
                            <FaCheckCircle size={12} /> Verified Certificate of Mastery
                          </li>
                        </ul>
                      </div>

                      <div>
                        <hr
                          className="my-3 opacity-25"
                          style={{ borderColor: 'var(--border-color)' }}
                        />
                        <div className="d-flex align-items-center justify-content-between mb-3">
                          <div className="d-flex align-items-center gap-2">
                            <div
                              className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                              style={{
                                width: 28,
                                height: 28,
                                fontSize: '0.8rem',
                                background: 'rgba(var(--bs-primary-rgb, 21, 128, 61), 0.15)',
                                color: 'var(--bs-primary)',
                              }}
                            >
                              <FaGraduationCap size={13} />
                            </div>
                            <span
                              className="small fw-semibold"
                              style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}
                            >
                              CodeLift Faculty
                            </span>
                          </div>
                          <div
                            className="small text-muted d-flex align-items-center gap-1"
                            style={{ fontSize: '0.8rem' }}
                          >
                            <FaUserGraduate size={12} /> {c.studentsEnrolled || 0} enrolled
                          </div>
                        </div>

                        {/* Touch-Friendly Action Buttons */}
                        <div className="d-flex gap-2">
                          <Link
                            to={`/courses/${c.slug || c.id}`}
                            className="btn btn-outline-success flex-grow-1 rounded-pill fw-bold d-inline-flex align-items-center justify-content-center"
                            style={{ fontSize: '0.85rem', minHeight: '44px' }}
                          >
                            Curriculum
                          </Link>
                          <button
                            type="button"
                            className="btn btn-success rounded-pill fw-bold px-3 d-inline-flex align-items-center justify-content-center gap-1.5 flex-shrink-0"
                            style={{
                              background: '#25D366',
                              borderColor: '#25D366',
                              color: '#ffffff',
                              fontSize: '0.85rem',
                              minHeight: '44px'
                            }}
                            onClick={() => setSelectedCourseForEnroll(c)}
                            title="Enroll via WhatsApp"
                          >
                            <FaWhatsapp size={16} />
                            <span>Enroll</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modular Electives Link Banner */}
          <div className="text-center mt-4 mt-md-5">
            <div
              className="cl-home-electives-banner d-inline-flex flex-column flex-md-row align-items-center gap-3 text-start shadow-sm mx-auto"
              style={{
                maxWidth: '780px',
                width: '100%',
              }}
            >
              <div className="flex-grow-1">
                <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                  <span className="badge rounded-pill bg-success-subtle text-success fw-bold px-2.5 py-1" style={{ fontSize: '0.72rem' }}>
                    Modular Electives
                  </span>
                  <h6 className="fw-bold mb-0" style={{ color: 'var(--text-primary)', fontSize: '1rem' }}>
                    Looking for Modular Electives?
                  </h6>
                </div>
                <p className="text-secondary small mb-0" style={{ lineHeight: 1.55 }}>
                  Explore our complete catalog of specialized, bite-sized skill modules in Python, DSA, Web Dev, and SQL.
                </p>
              </div>
              <Link
                to="/courses"
                className="btn btn-outline-success rounded-pill px-4 py-2 fw-bold text-nowrap d-inline-flex align-items-center justify-content-center gap-2 w-100 w-md-auto"
                style={{ fontSize: '0.85rem', minHeight: '42px' }}
              >
                Browse All Electives <FaArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CONTACT & SOCIAL HUB */}
      <ContactHub />

      {/* MINIMAL FOOTER */}
      <footer
        className="py-4 text-center border-top"
        style={{
          borderColor: 'var(--border-color, rgba(255, 255, 255, 0.1))',
          background: 'var(--card-bg, transparent)',
        }}
      >
        <div className="container">
          <p
            className="mb-0"
            style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}
          >
            © 2026 CodeLift
          </p>
        </div>
      </footer>

      {/* Course Enrollment WhatsApp Modal */}
      {selectedCourseForEnroll && (
        <CourseEnrollModal
          course={selectedCourseForEnroll}
          show={Boolean(selectedCourseForEnroll)}
          onClose={() => setSelectedCourseForEnroll(null)}
        />
      )}

      {/* FLOATING WHATSAPP BUTTON */}
      <FloatingWhatsApp />
    </>
  );
}
