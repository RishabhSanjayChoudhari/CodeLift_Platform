import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaGraduationCap, FaBook, FaCode, FaUserCircle, FaSignOutAlt, FaRocket } from 'react-icons/fa';

export default function Navbar() {
  const { auth, currentUser, logout, isAdmin, isStudent } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Scroll glass effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getDashboardPath = () => {
    if (isAdmin) return '/admin/dashboard';
    if (isStudent) return '/student/dashboard';
    return '/login';
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav
      className={`navbar navbar-expand-lg sticky-top py-2 px-3 ${scrolled ? 'scrolled' : ''}`}
      style={{
        backgroundColor: 'var(--card-bg, #ffffff)',
        borderBottom: '1px solid var(--border-color, #e5e7eb)',
        zIndex: 1040,
        transition: 'background 0.3s ease, box-shadow 0.3s ease'
      }}
    >
      <div className="container-fluid max-w-7xl">
        {/* Brand */}
        <Link className="navbar-brand d-flex align-items-center gap-2 text-decoration-none" to="/">
          <div
            className="d-flex align-items-center justify-content-center rounded-3 text-white fw-bold"
            style={{
              width: 38,
              height: 38,
              background: 'linear-gradient(135deg, var(--bs-primary, #15803D) 0%, color-mix(in srgb, var(--bs-primary, #15803D) 80%, #000) 100%)',
              fontSize: '1.1rem',
              boxShadow: '0 3px 10px rgba(var(--bs-primary-rgb, 21,128,61), 0.35)',
              flexShrink: 0
            }}
          >
            <FaCode size={18} />
          </div>
          <div>
            <span className="brand-text fw-extrabold" style={{ letterSpacing: '-0.5px', fontSize: '1.2rem' }}>
              CodeLift
            </span>
            <span
              className="ms-2 badge text-uppercase"
              style={{
                fontSize: '0.6rem',
                background: 'rgba(var(--bs-primary-rgb, 21,128,61), 0.10)',
                color: 'var(--bs-primary)',
                border: '1px solid rgba(var(--bs-primary-rgb, 21,128,61), 0.2)',
                borderRadius: 6,
                letterSpacing: '0.06em',
                padding: '2px 7px'
              }}
            >
              Marketplace
            </span>
          </div>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          {/* Navigation Links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4 gap-1">
            <li className="nav-item">
              <Link
                to="/courses"
                className={`nav-link fw-semibold px-3 rounded-3 d-flex align-items-center gap-2 position-relative ${isActive('/courses') ? 'active' : ''}`}
                style={{ color: isActive('/courses') ? 'var(--bs-primary)' : 'var(--text-secondary)' }}
              >
                <FaBook size={13} />
                <span>Courses</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/problems"
                className={`nav-link fw-semibold px-3 rounded-3 d-flex align-items-center gap-2 position-relative ${isActive('/problems') ? 'active' : ''}`}
                style={{ color: isActive('/problems') ? 'var(--bs-primary)' : 'var(--text-secondary)' }}
              >
                <FaCode size={13} />
                <span>Problem Solving</span>
              </Link>
            </li>
          </ul>

          {/* Right Actions */}
          <div className="d-flex align-items-center gap-2">
            {auth ? (
              <div className="dropdown">
                <button
                  className="btn btn-sm btn-primary rounded-pill px-3 py-2 d-flex align-items-center gap-2 fw-bold"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <FaUserCircle className="fs-5" />
                  <span className="d-none d-sm-inline">{currentUser?.name?.split(' ')[0] || 'My Account'}</span>
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end shadow-lg p-2"
                  style={{
                    minWidth: 220,
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 14,
                    zIndex: 1100
                  }}
                >
                  {/* User Identity Header */}
                  <li
                    className="px-3 py-2 rounded-3 mb-1"
                    style={{
                      background: 'linear-gradient(135deg, rgba(var(--bs-primary-rgb),0.08) 0%, transparent 100%)',
                      border: '1px solid rgba(var(--bs-primary-rgb),0.14)'
                    }}
                  >
                    <div className="fw-bold" style={{ color: 'var(--text-primary)', fontSize: '0.88rem' }}>
                      {currentUser?.name}
                    </div>
                    <div className="text-muted" style={{ fontSize: '0.74rem' }}>
                      {currentUser?.email || currentUser?.role}
                    </div>
                    <span
                      className="badge mt-1 text-uppercase"
                      style={{
                        fontSize: '0.62rem',
                        background: 'rgba(var(--bs-primary-rgb),0.12)',
                        color: 'var(--bs-primary)',
                        border: '1px solid rgba(var(--bs-primary-rgb),0.25)',
                        letterSpacing: '0.05em',
                        padding: '2px 7px',
                        borderRadius: 6
                      }}
                    >
                      {currentUser?.role}
                    </span>
                  </li>

                  <li>
                    <Link
                      className="dropdown-item rounded-2 py-2 fw-semibold d-flex align-items-center gap-2"
                      to={getDashboardPath()}
                      style={{ color: 'var(--text-primary)', fontSize: '0.875rem' }}
                    >
                      <FaGraduationCap style={{ color: 'var(--bs-primary)' }} />
                      My Dashboard
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider my-1" style={{ borderColor: 'var(--border-color)' }} /></li>
                  <li>
                    <button
                      className="dropdown-item rounded-2 py-2 d-flex align-items-center gap-2 fw-semibold"
                      style={{ color: '#dc2626', fontSize: '0.875rem' }}
                      onClick={() => { logout(); navigate('/'); }}
                    >
                      <FaSignOutAlt />
                      Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold">
                  Sign In
                </Link>
                <Link
                  to="/courses"
                  className="btn btn-sm btn-primary rounded-pill px-3 fw-bold d-flex align-items-center gap-1"
                >
                  <FaRocket size={11} />
                  <span>Explore</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
