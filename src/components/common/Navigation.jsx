import React from 'react';
import { Navbar, Nav, Container, Button, Badge } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import {
  FaCode,
  FaUserShield,
  FaUserGraduate,
  FaSignOutAlt,
  FaRedo
} from 'react-icons/fa';

export default function Navigation() {
  const { role, isAdmin, isStudent, currentStudent, loginAsAdmin, loginAsStudent, logout } = useAuth();
  const { resetToSeedData } = useData();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSwitchRole = () => {
    if (isAdmin) {
      loginAsStudent();
      navigate('/dashboard');
    } else {
      loginAsAdmin();
      navigate('/admin');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm sticky-top">
      <Container fluid className="px-3 px-md-4">
        {/* Brand Logo */}
        <Navbar.Brand as={Link} to={role === 'admin' ? '/admin' : role === 'student' ? '/dashboard' : '/login'} className="d-flex items-center gap-2 fw-bold text-white">
          <span className="bg-primary text-white p-1 rounded d-inline-flex align-items-center justify-content-center" style={{ width: 28, height: 28 }}>
            <FaCode size={16} />
          </span>
          <span>CodeLift <small className="fw-normal text-muted fs-6">Platform</small></span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />

        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            {role === 'admin' && (
              <Nav.Link as={Link} to="/admin" active={location.pathname === '/admin'}>
                Admin Console
              </Nav.Link>
            )}
            {role === 'student' && (
              <Nav.Link as={Link} to="/dashboard" active={location.pathname === '/dashboard'}>
                Student Portal
              </Nav.Link>
            )}
          </Nav>

          <div className="d-flex flex-wrap align-items-center gap-2 mt-2 mt-lg-0">
            {role ? (
              <>
                {/* Active user badge */}
                <div className="text-light d-flex align-items-center gap-1 bg-secondary bg-opacity-25 px-2 py-1 rounded small">
                  {isAdmin ? (
                    <>
                      <FaUserShield className="text-warning" />
                      <span>Admin Mode</span>
                    </>
                  ) : (
                    <>
                      <FaUserGraduate className="text-info" />
                      <span>{currentStudent?.name || 'Rahul Sharma'}</span>
                    </>
                  )}
                </div>

                {/* Switch Role Button */}
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={handleSwitchRole}
                  title="Switch between Admin and Student view"
                >
                  Switch to {isAdmin ? 'Student View' : 'Admin View'}
                </Button>

                {/* Reset Data to Seed */}
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={resetToSeedData}
                  title="Reset localStorage to original seed data"
                >
                  <FaRedo size={12} className="me-1" /> Reset Data
                </Button>

                {/* Logout Button */}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleLogout}
                  title="Log out"
                >
                  <FaSignOutAlt className="me-1" /> Logout
                </Button>
              </>
            ) : (
              <Nav.Link as={Link} to="/login" className="btn btn-primary text-white btn-sm px-3">
                Login
              </Nav.Link>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
