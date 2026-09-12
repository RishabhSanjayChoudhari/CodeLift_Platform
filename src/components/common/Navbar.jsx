import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaGraduationCap, FaBook, FaCode, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

export default function Navbar() {
  const { auth, currentUser, logout, isAdmin, isStudent } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getDashboardPath = () => {
    if (isAdmin) return '/admin/dashboard';
    if (isStudent) return '/student/dashboard';
    return '/login';
  };

  return (
    <nav
      className="navbar navbar-expand-lg sticky-top shadow-sm py-2 px-3"
      style={{
        backgroundColor: 'var(--card-bg, #ffffff)',
        borderBottom: '1px solid var(--border-color, #e5e7eb)',
        zIndex: 1040
      }}
    >
      <div className="container-fluid max-w-7xl">
        {/* Brand */}
        <Link className="navbar-brand d-flex align-items-center gap-2 font-bold" to="/">
          <div
            className="d-flex align-items-center justify-content-center rounded-3 text-white fw-bold shadow-sm"
            style={{ width: 38, height: 38, background: 'var(--bs-primary, #15803D)', fontSize: '1.2rem' }}
          >
            <FaCode size={20} />
          </div>
          <div>
            <span className="brand-text fw-bold fs-4" style={{ letterSpacing: '-0.5px' }}>
              CodeLift
            </span>
            <span className="badge ms-2 text-uppercase" style={{ fontSize: '0.65rem', background: 'rgba(21, 128, 61, 0.1)', color: 'var(--bs-primary)' }}>
              Marketplace
            </span>
          </div>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          {/* Navigation Links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4 gap-1">
            <li className="nav-item">
              <Link
                to="/courses"
                className={`nav-link fw-semibold px-3 rounded-3 d-flex align-items-center gap-2 ${
                  location.pathname.startsWith('/courses') ? 'active text-success' : ''
                }`}
              >
                <FaBook /> Courses
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/problems"
                className={`nav-link fw-semibold px-3 rounded-3 d-flex align-items-center gap-2 ${
                  location.pathname.startsWith('/problems') ? 'active text-success' : ''
                }`}
              >
                <FaCode /> Problem Solving
              </Link>
            </li>
          </ul>

          {/* Right Actions */}
          <div className="d-flex align-items-center gap-3">
            {/* Auth Actions */}
            {auth ? (
              <div className="dropdown">
                <button
                  className="btn btn-sm btn-primary rounded-pill px-3 py-2 d-flex align-items-center gap-2 fw-bold"
                  type="button"
                  data-bs-toggle="dropdown"
                >
                  <FaUserCircle className="fs-5" />
                  <span>{currentUser?.name || 'My Account'}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0 p-2" style={{ minWidth: 200, background: 'var(--card-bg)' }}>
                  <li className="px-3 py-2 rounded-2 mb-2 border" style={{ background: 'var(--card-bg-alt, rgba(255,255,255,0.05))', borderColor: 'var(--border-color)' }}>
                    <div className="fw-bold" style={{ color: 'var(--text-primary)' }}>{currentUser?.name}</div>
                    <div className="text-muted small">{currentUser?.email || currentUser?.role}</div>
                    <span className="badge bg-success mt-1 text-uppercase">{currentUser?.role}</span>
                  </li>
                  <li>
                    <Link className="dropdown-item rounded-2 py-2 fw-semibold" to={getDashboardPath()}>
                      <FaGraduationCap className="me-2" /> My Dashboard
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item rounded-2 py-2 text-danger fw-semibold"
                      onClick={() => {
                        logout();
                        navigate('/');
                      }}
                    >
                      <FaSignOutAlt className="me-2" /> Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold">
                  Sign In
                </Link>
                <Link to="/courses" className="btn btn-sm btn-primary rounded-pill px-3 fw-bold">
                  Explore Courses
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
