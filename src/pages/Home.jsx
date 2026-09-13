import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaStar, FaUserGraduate, FaGraduationCap, FaBookOpen, FaWhatsapp } from 'react-icons/fa';
import InstituteNavbar from '../components/common/InstituteNavbar';
import HomeRadar from '../components/common/HomeRadar';
import RadarRings from '../components/common/RadarRings';
import ContactHub from '../components/home/ContactHub';
import FloatingWhatsApp from '../components/common/FloatingWhatsApp';
import CourseEnrollModal from '../components/common/CourseEnrollModal';
import { useData } from '../contexts/DataContext';

export default function Home() {
  const { courses } = useData();
  const [selectedCourseForEnroll, setSelectedCourseForEnroll] = useState(null);

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
  const cohortCourses = (courses || []).filter(
    (c) =>
      c.isPublished !== false &&
      c.isApproved !== false &&
      (c.courseType === 'cohort' || c.isCohort === true)
  );

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
                Where Ambition Meets{' '}
                <span className="highlight">
                  Expertise
                </span>{' '}
                — Master Full-Stack &amp; Data Analytics
              </h1>

              <p className="lead-text mb-4" style={{ color: 'var(--text-secondary)' }}>
                Join an elite community of ambitious learners. Hands-on coding, production-grade
                projects, and personalized 1-on-1 mentorship from industry engineers.
              </p>

              <div className="d-flex flex-wrap gap-3 cl-hero-cta-group">
                <button className="btn-explore" onClick={() => scrollTo('courses')}>
                  Explore Cohorts <FaArrowRight style={{ fontSize: '0.8rem' }} />
                </button>
                <button className="btn-visit" onClick={() => scrollTo('contact')}>
                  Talk to a Counselor
                </button>
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
      <section id="courses" className="py-5" style={{ background: 'var(--bg-body)' }}>
        <div className="container py-4">
          <div className="text-center mb-5">
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
            <h2 className="fw-bold display-6 mb-3" style={{ color: 'var(--text-primary)' }}>
              Live Cohort Bootcamps
            </h2>
            <p className="text-secondary mx-auto mb-4" style={{ maxWidth: '640px' }}>
              Master high-impact skills with our intensive, mentor-led cohort bootcamps featuring live problem solving, production deployments, and career placement guidance.
            </p>
          </div>

          {/* Courses Grid */}
          {cohortCourses.length === 0 ? (
            <div
              className="text-center py-5 rounded-4 border"
              style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
            >
              <FaBookOpen className="text-muted fs-1 mb-3 opacity-50" />
              <h5 className="fw-bold" style={{ color: 'var(--text-primary)' }}>
                No active cohorts available
              </h5>
              <p className="text-secondary">Check back soon for upcoming cohort batch registrations.</p>
            </div>
          ) : (
            <div className="row g-4">
              {cohortCourses.map((c) => (
                <div key={c.id} className="col-md-6 col-lg-4">
                  <div
                    className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden"
                    style={{
                      background: 'var(--card-bg)',
                      border: '1px solid var(--border-color)',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    }}
                  >
                    {/* Thumbnail & Badges */}
                    <div className="position-relative">
                      <img
                        src={
                          c.thumbnail ||
                          'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600'
                        }
                        alt={c.title}
                        className="card-img-top"
                        style={{ height: 190, objectFit: 'cover' }}
                      />
                      <div className="position-absolute top-0 start-0 m-3">
                        <span
                          className="badge rounded-pill px-2.5 py-1.5 fw-semibold shadow-sm"
                          style={{
                            background: 'rgba(15, 23, 42, 0.9)',
                            color: '#ffffff',
                            backdropFilter: 'blur(4px)',
                            fontSize: '0.72rem',
                          }}
                        >
                          🏛️ Live Cohort
                        </span>
                      </div>
                      <span
                        className={`position-absolute top-0 end-0 m-3 badge rounded-pill px-3 py-1.5 font-bold shadow-sm ${
                          c.isFree || c.price === 0 ? 'bg-success' : 'bg-primary'
                        }`}
                        style={{ fontSize: '0.75rem' }}
                      >
                        {c.isFree || c.price === 0 ? 'FREE' : `₹${c.price}`}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="card-body p-4 d-flex flex-column justify-content-between">
                      <div>
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <span
                            className="badge rounded-pill px-2.5 py-1 fw-semibold"
                            style={{
                              background: 'var(--card-bg-alt, rgba(34, 197, 94, 0.12))',
                              color: 'var(--bs-primary)',
                              fontSize: '0.72rem',
                            }}
                          >
                            {c.categoryId
                              ? c.categoryId.replace('cat-', '').toUpperCase()
                              : 'COHORT'}
                          </span>
                          <div
                            className="d-flex align-items-center gap-1 text-warning fw-bold small"
                            style={{ fontSize: '0.8rem' }}
                          >
                            <FaStar /> {c.rating || 5.0} ({c.numReviews || 0})
                          </div>
                        </div>

                        <h5
                          className="card-title fw-bold mb-2"
                          style={{ fontSize: '1.1rem' }}
                        >
                          <Link
                            to={`/courses/${c.slug || c.id}`}
                            className="text-decoration-none"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            {c.title}
                          </Link>
                        </h5>
                        <p
                          className="card-text text-secondary small line-clamp-2 mb-3"
                          style={{ minHeight: '38px' }}
                        >
                          {c.description}
                        </p>
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
                              CodeLift
                            </span>
                          </div>
                          <div
                            className="small text-muted d-flex align-items-center gap-1"
                            style={{ fontSize: '0.8rem' }}
                          >
                            <FaUserGraduate /> {c.studentsEnrolled || 0} enrolled
                          </div>
                        </div>

                        <div className="d-flex gap-2">
                          <Link
                            to={`/courses/${c.slug || c.id}`}
                            className="btn btn-outline-success flex-grow-1 rounded-pill fw-bold"
                            style={{ fontSize: '0.82rem' }}
                          >
                            Curriculum
                          </Link>
                          <button
                            type="button"
                            className="btn btn-success rounded-pill fw-bold px-3 d-flex align-items-center gap-1.5 flex-shrink-0"
                            style={{
                              background: '#25D366',
                              borderColor: '#25D366',
                              color: '#ffffff',
                              fontSize: '0.82rem'
                            }}
                            onClick={() => setSelectedCourseForEnroll(c)}
                            title="Enroll via WhatsApp"
                          >
                            <FaWhatsapp size={14} />
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
          <div className="text-center mt-5">
            <div
              className="p-4 rounded-4 border d-inline-flex flex-column flex-md-row align-items-center gap-3 text-start shadow-sm"
              style={{
                background: 'var(--card-bg)',
                borderColor: 'var(--border-color)',
                maxWidth: '780px',
                width: '100%',
              }}
            >
              <div className="flex-grow-1">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="badge rounded-pill bg-success-subtle text-success fw-bold px-2.5 py-1" style={{ fontSize: '0.72rem' }}>
                    ⚡ Self-Paced Modules
                  </span>
                  <h6 className="fw-bold mb-0" style={{ color: 'var(--text-primary)', fontSize: '1rem' }}>
                    Looking for Modular Electives?
                  </h6>
                </div>
                <p className="text-secondary small mb-0">
                  Explore our complete catalog of specialized, bite-sized skill modules in Python, DSA, Web Dev, and SQL.
                </p>
              </div>
              <Link
                to="/courses"
                className="btn btn-outline-success rounded-pill px-4 py-2 fw-bold text-nowrap d-inline-flex align-items-center gap-2"
                style={{ fontSize: '0.85rem' }}
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
