import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/common/Navbar';
import SEO from '../components/common/SEO';
import CheckoutModal from '../components/common/CheckoutModal';
import InvoiceModal from '../components/common/InvoiceModal';
import toast from 'react-hot-toast';
import { FaStar, FaUserGraduate, FaCheckCircle, FaBookOpen, FaLock, FaCertificate, FaAward, FaFileInvoice, FaGraduationCap } from 'react-icons/fa';

export default function CourseDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { auth, currentUser } = useAuth();
  const { courses, enrollments, payments } = useData();

  const [showCheckout, setShowCheckout] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [activeTopic, setActiveTopic] = useState(null);

  // Find course by slug or id
  const course = courses.find((c) => c.slug === slug || c.id === slug);

  if (!course) {
    return (
      <div style={{ backgroundColor: 'var(--bg-body, #f8fafc)', minHeight: '100vh' }}>
        <Navbar />
        <div className="container text-center py-5">
          <h3>Course Not Found</h3>
          <p className="text-muted">The requested course does not exist or has been removed.</p>
          <Link to="/courses" className="btn btn-success rounded-pill px-4 fw-bold">
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  // Enrollment status for current user
  const userEnrollment = currentUser
    ? enrollments.find((e) => e.studentId === currentUser.id && e.courseId === course.id)
    : null;
  const userPayment = userEnrollment ? payments.find((p) => p.enrollmentId === userEnrollment.id) : null;
  const isEnrolled = Boolean(userEnrollment && (userEnrollment.status === 'FREE' || userEnrollment.status === 'PAID'));

  const handleEnrollClick = () => {
    if (!currentUser) {
      toast.error('Please log in or register to enroll.');
      navigate('/login');
      return;
    }
    setShowCheckout(true);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-body, #f8fafc)', minHeight: '100vh' }}>
      <SEO title={course.title} description={course.description} />
      <Navbar />

      {/* Hero Header */}
      <section className="bg-dark text-white py-5">
        <div className="container max-w-7xl">
          <div className="row g-4 align-items-center">
            <div className="col-lg-8">
              <span className="badge bg-success font-bold text-uppercase px-3 py-2 rounded-pill mb-3">
                {course.isFree || course.price === 0 ? 'FREE COURSE' : `PAID COURSE • ₹${course.price}`}
              </span>
              <h1 className="fw-extrabold display-5 mb-3">{course.title}</h1>
              <p className="lead text-light opacity-90 mb-4">{course.description}</p>

              <div className="d-flex flex-wrap align-items-center gap-4 text-light small">
                <div className="d-flex align-items-center gap-1 text-warning fw-bold">
                  <FaStar /> {course.rating || 5.0} rating
                </div>
                <div className="d-flex align-items-center gap-1">
                  <FaUserGraduate /> {course.studentsEnrolled || 0} Students Enrolled
                </div>
                <div className="d-flex align-items-center gap-1">
                  <FaCertificate className="text-success" /> Verified Certificate Included
                </div>
              </div>
            </div>

            {/* Action Card */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                <img
                  src={course.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600'}
                  alt={course.title}
                  style={{ height: 200, objectFit: 'cover' }}
                />
                <div className="card-body p-4 text-center">
                  <div className="mb-3">
                    <span className="fs-2 fw-extrabold text-success">
                      {course.isFree || course.price === 0 ? 'FREE' : `₹${course.price}`}
                    </span>
                  </div>

                  {isEnrolled ? (
                    <div>
                      <div className="alert alert-success py-2 px-3 mb-3 small font-semibold">
                        <FaCheckCircle className="me-1" /> You are enrolled in this course!
                      </div>
                      {userPayment && (
                        <button
                          className="btn btn-outline-secondary w-100 rounded-pill fw-bold mb-2 d-flex align-items-center justify-content-center gap-2"
                          onClick={() => setShowInvoice(true)}
                        >
                          <FaFileInvoice /> View Tax Receipt
                        </button>
                      )}
                    </div>
                  ) : userEnrollment?.status === 'PENDING' ? (
                    <div className="alert alert-warning py-2 px-3 mb-3 small font-semibold">
                      ⏳ Payment Verification Pending Admin Approval.
                    </div>
                  ) : (
                    <button
                      className="btn btn-success btn-lg w-100 rounded-pill fw-bold shadow-sm mb-3"
                      onClick={handleEnrollClick}
                    >
                      {course.isFree || course.price === 0 ? 'Enroll Now for Free' : 'Enroll Now & Unlock'}
                    </button>
                  )}

                  <ul className="list-unstyled text-start small text-muted mb-0">
                    <li className="mb-2">✓ Full Lifetime Access to Curricula</li>
                    <li className="mb-2">✓ Comprehensive Code Examples</li>
                    <li className="mb-2">✓ Practical Assignments & Tests</li>
                    <li>✓ Verified Certificate on Completion</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container max-w-7xl py-5">
        <div className="row g-4">
          <div className="col-lg-8">
            {/* Curriculum Accordion */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
              <h4 className="fw-bold mb-3">Course Curriculum & Modules</h4>
              <p className="text-muted small mb-4">
                {course.modules?.length || 0} Modules •{' '}
                {course.modules?.reduce((acc, m) => acc + (m.topics?.length || 0), 0) || 0} Topics
              </p>

              <div className="accordion rounded-3 overflow-hidden border" id="curriculumAccordion">
                {(course.modules || []).map((mod, idx) => (
                  <div className="accordion-item border-0 border-bottom" key={mod.id || idx}>
                    <h2 className="accordion-header">
                      <button
                        className={`accordion-button fw-bold ${idx !== 0 ? 'collapsed' : ''}`}
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#mod-${mod.id}`}
                      >
                        Module {idx + 1}: {mod.title}
                      </button>
                    </h2>
                    <div id={`mod-${mod.id}`} className={`accordion-collapse collapse ${idx === 0 ? 'show' : ''}`}>
                      <div className="accordion-body p-0">
                        <ul className="list-group list-group-flush">
                          {(mod.topics || []).map((topic) => (
                            <li
                              key={topic.id}
                              className="list-group-item d-flex justify-content-between align-items-center py-3 px-4 hover-bg-light"
                            >
                              <div className="d-flex align-items-center gap-3">
                                {isEnrolled ? (
                                  <FaBookOpen
                                    className="text-success cursor-pointer fs-5"
                                    onClick={() => navigate('/student/courses')}
                                  />
                                ) : (
                                  <FaLock className="text-muted" />
                                )}
                                <div>
                                  <div
                                    className={`fw-semibold ${isEnrolled ? 'cursor-pointer' : 'text-secondary'}`}
                                    style={isEnrolled ? { color: 'var(--text-primary)' } : undefined}
                                    onClick={() => isEnrolled && navigate('/student/courses')}
                                  >
                                    {topic.title}
                                  </div>
                                  {topic.contentMd && (
                                    <div className="small text-muted line-clamp-1">{topic.contentMd.slice(0, 80)}...</div>
                                  )}
                                </div>
                              </div>
                              {isEnrolled && (
                                <button
                                  className="btn btn-sm btn-outline-success rounded-pill px-3"
                                  onClick={() => navigate('/student/courses')}
                                >
                                  Open Lesson
                                </button>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            {/* Institute Mentorship & Certification Card */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <FaAward className="text-success" /> Academy Mentorship
              </h5>
              <div className="d-flex align-items-center gap-3 mb-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
                  style={{ width: 54, height: 54, background: 'var(--bs-primary, #15803D)', fontSize: '1.4rem' }}
                >
                  <FaGraduationCap size={24} />
                </div>
                <div>
                  <h6 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>CodeLift Institute Faculty</h6>
                  <span className="text-muted small">support@codelift.dev</span>
                </div>
              </div>
              <p className="text-secondary small mb-3">
                Industry-proven senior engineering mentorship with rigorous project reviews, hands-on debugging, and career interview prep.
              </p>
              <div className="d-flex gap-2 flex-wrap">
                {['Live Mentorship', 'Code Reviews', 'Verified Certificate', 'Job Assistance'].map((sk, i) => (
                  <span key={i} className="badge border" style={{ background: 'var(--card-bg-alt, rgba(34, 197, 94, 0.12))', color: 'var(--accent-color, #10b981)', borderColor: 'var(--border-color)' }}>
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Checkout Modal */}
      {showCheckout && (
        <CheckoutModal
          course={course}
          onClose={() => setShowCheckout(false)}
          onSuccess={() => setShowCheckout(false)}
        />
      )}

      {/* Tax Invoice Modal */}
      {showInvoice && (
        <InvoiceModal
          payment={userPayment}
          enrollment={userEnrollment}
          course={course}
          onClose={() => setShowInvoice(false)}
        />
      )}
    </div>
  );
}
