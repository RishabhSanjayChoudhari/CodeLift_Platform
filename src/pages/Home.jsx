import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaStar, FaUserGraduate, FaGraduationCap, FaBookOpen } from 'react-icons/fa';
import InstituteNavbar from '../components/common/InstituteNavbar';
import HomeRadar from '../components/common/HomeRadar';
import ContactHub from '../components/home/ContactHub';
import FloatingWhatsApp from '../components/common/FloatingWhatsApp';
import { useData } from '../contexts/DataContext';

export default function Home() {
  const { courses } = useData();
  const [courseFilter, setCourseFilter] = useState('all'); // all, cohort, elective

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

  // Filter published courses
  const allCourses = (courses || []).filter(
    (c) => c.isPublished !== false && c.isApproved !== false
  );

  const filteredCourses = allCourses.filter((c) => {
    if (courseFilter === 'all') return true;
    const type = c.courseType || (c.isCohort ? 'cohort' : 'elective');
    return type === courseFilter;
  });

  return (
    <>
      {/* 1. NAVBAR */}
      <InstituteNavbar />

      {/* 2. HERO SECTION */}
      <section id="hero" className="cl-hero hero-section">
        <HomeRadar />
        <div className="container hero-content">
          <div className="row align-items-center g-5">
            <div className="col-lg-7 col-xl-6">
              <h1 className="mb-4">
                Where Ambition Meets{' '}
                <span className="highlight">
                  Expertise
                </span>{' '}
                — Master Full-Stack &amp; Data Analytics
              </h1>

              <p className="lead-text mb-4" style={{ color: 'var(--text-secondary)' }}>
                Join a community of passionate learners. Get hands-on training, real-world
                projects, and mentorship from industry experts who've been in the trenches.
              </p>

              <div className="d-flex flex-wrap gap-3">
                <button className="btn-explore" onClick={() => scrollTo('courses')}>
                  Explore Courses <FaArrowRight style={{ fontSize: '0.8rem' }} />
                </button>
                <button className="btn-visit" onClick={() => scrollTo('contact')}>
                  Talk to a Counselor
                </button>
              </div>
            </div>
            {/* Right side empty — radar stage occupies visually */}
            <div className="col-lg-5 col-xl-6 d-none d-lg-block" />
          </div>
        </div>
      </section>

      {/* 3. COURSES SECTION (COHORT + ELECTIVE) */}
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
              Explore Curriculum
            </div>
            <h2 className="fw-bold display-6 mb-3" style={{ color: 'var(--text-primary)' }}>
              Industry-Ready Programs &amp; Electives
            </h2>
            <p className="text-secondary mx-auto mb-4" style={{ maxWidth: '600px' }}>
              Master high-impact skills with our intensive cohort bootcamps and specialized
              elective modules.
            </p>

            {/* Filter Pills */}
            <div className="d-flex justify-content-center gap-2 flex-wrap">
              <button
                className={`btn btn-sm rounded-pill px-3 fw-bold ${
                  courseFilter === 'all' ? 'btn-success' : 'btn-outline-secondary'
                }`}
                onClick={() => setCourseFilter('all')}
              >
                All Courses ({allCourses.length})
              </button>
              <button
                className={`btn btn-sm rounded-pill px-3 fw-bold ${
                  courseFilter === 'cohort' ? 'btn-success' : 'btn-outline-secondary'
                }`}
                onClick={() => setCourseFilter('cohort')}
              >
                🏛️ Cohorts ({allCourses.filter((c) => c.courseType === 'cohort').length})
              </button>
              <button
                className={`btn btn-sm rounded-pill px-3 fw-bold ${
                  courseFilter === 'elective' ? 'btn-success' : 'btn-outline-secondary'
                }`}
                onClick={() => setCourseFilter('elective')}
              >
                ⚡ Electives ({allCourses.filter((c) => c.courseType !== 'cohort').length})
              </button>
            </div>
          </div>

          {/* Courses Grid */}
          {filteredCourses.length === 0 ? (
            <div
              className="text-center py-5 rounded-4 border"
              style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
            >
              <FaBookOpen className="text-muted fs-1 mb-3 opacity-50" />
              <h5 className="fw-bold" style={{ color: 'var(--text-primary)' }}>
                No courses available
              </h5>
              <p className="text-secondary">Check back soon for upcoming cohorts and electives.</p>
            </div>
          ) : (
            <div className="row g-4">
              {filteredCourses.map((c) => (
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
                            background:
                              c.courseType === 'cohort'
                                ? 'rgba(15, 23, 42, 0.9)'
                                : 'rgba(21, 128, 61, 0.9)',
                            color: '#ffffff',
                            backdropFilter: 'blur(4px)',
                            fontSize: '0.72rem',
                          }}
                        >
                          {c.courseType === 'cohort' ? '🏛️ Cohort' : '⚡ Elective'}
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
                              : 'PROGRAM'}
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

                        <Link
                          to={`/courses/${c.slug || c.id}`}
                          className="btn btn-outline-success w-100 rounded-pill fw-bold"
                          style={{ fontSize: '0.85rem' }}
                        >
                          View Curriculum &amp; Modules
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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

      {/* FLOATING WHATSAPP BUTTON */}
      <FloatingWhatsApp />
    </>
  );
}
