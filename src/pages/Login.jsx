import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Modal, Form, Button } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { FaUserGraduate, FaSignInAlt, FaArrowLeft, FaEnvelope, FaLock, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import LoginRadar from '../components/common/LoginRadar';
import { supabase } from '../services/supabaseClient';
import toast from 'react-hot-toast';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const { loginStudent } = useAuth();
  const { students } = useData();

  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Password Reset State via Supabase Auth
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleStudentLogin = async (e) => {
    if (e) e.preventDefault();
    if (!studentEmail.trim() || !studentPassword) {
      setErrorMsg('Please enter both your student email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      // First check if email matches an admin user to show specific message
      const { data: adminCheck } = await supabase
        .from('users')
        .select('role')
        .eq('email', studentEmail.trim().toLowerCase())
        .maybeSingle();

      if (adminCheck && adminCheck.role === 'admin') {
        throw new Error('Admin accounts must log in via the administrator portal.');
      }

      await loginStudent({
        email: studentEmail.trim(),
        password: studentPassword
      });

      toast.success('Welcome back to CodeLift! 🚀');
      navigate('/student/dashboard', { replace: true });
    } catch (err) {
      console.error('[StudentLogin] Error:', err);
      const msg = err.message?.includes('Invalid login credentials')
        ? 'Invalid email or password. Please try again.'
        : err.message || 'Failed to sign in. Please verify your credentials.';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendResetEmail = async (e) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      toast.error('Please enter your registered email address');
      return;
    }

    setResetLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
        redirectTo: `${window.location.origin}/login`
      });
      if (error) throw error;
      toast.success(`Password reset instructions sent to ${resetEmail}! Check your inbox.`);
      setShowResetModal(false);
    } catch (err) {
      toast.error(err.message || 'Failed to send password reset email.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="login-page login-page-wrapper">
      {/* Top-left Back to Home */}
      <Link to="/" className="login-back-link">
        <FaArrowLeft /> Back to Home
      </Link>

      {/* Two-Column Grid: Radar Left, Card Right */}
      <div className="login-grid-container">
        {/* Left Column: Compact Radar Presentation */}
        <div className="login-radar-col">
          <LoginRadar />
        </div>

        {/* Right Column: Frosted Glass Login Card */}
        <div className="login-card-col">
          <div className="login-glass-card">
            {/* Brand Header */}
            <div className="login-brand-header">
              <div className="login-brand-logo">🚀 CodeLift</div>
              <div className="login-brand-sub">Student Learning Portal</div>
            </div>

            {/* Error Notification */}
            {errorMsg && (
              <div
                className="alert border-0 py-2.5 px-3 rounded-3 mb-4 small d-flex align-items-center gap-2"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  color: '#fca5a5',
                  border: '1px solid rgba(239, 68, 68, 0.3)'
                }}
              >
                <FaExclamationTriangle className="flex-shrink-0" />
                <div>{errorMsg}</div>
              </div>
            )}

            {/* Student Login Form */}
            <form onSubmit={handleStudentLogin}>
              <div className="login-input-group">
                <label className="login-input-label">Student Email Address</label>
                <div className="login-input-wrapper">
                  <FaEnvelope className="login-input-icon" />
                  <input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    autoCapitalize="none"
                    spellCheck="false"
                    required
                    className="login-input"
                    placeholder="e.g. student@example.com"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="login-input-group" style={{ marginBottom: 12 }}>
                <label className="login-input-label">Password</label>
                <div className="login-input-wrapper">
                  <FaLock className="login-input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    className="login-input"
                    placeholder="Enter your password"
                    value={studentPassword}
                    onChange={(e) => setStudentPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="login-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div style={{ textAlign: 'right', marginBottom: 20 }}>
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(studentEmail);
                    setShowResetModal(true);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--bs-primary, #15803d)',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="login-submit-btn w-100"
              >
                {isLoading ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <FaSignInAlt /> <span>Sign In to Student Portal</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 pt-3 border-top text-center" style={{ borderColor: 'var(--border-color)' }}>
              <span className="small text-muted d-block" style={{ fontSize: '0.78rem' }}>
                Need an account? Contact your institute faculty or batch coordinator.
              </span>
              <div className="mt-2">
                <Link
                  to="/admin/login"
                  className="small fw-semibold text-decoration-none"
                  style={{ fontSize: '0.8rem', color: 'var(--bs-primary)' }}
                >
                  🔒 Institutional Administrator Portal →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        show={showResetModal}
        onHide={() => setShowResetModal(false)}
        centered
        contentClassName="border-0 shadow-lg rounded-4 overflow-hidden"
      >
        <Modal.Header closeButton style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
          <Modal.Title className="fs-5 fw-bold" style={{ color: 'var(--text-primary)' }}>
            Reset Student Password
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSendResetEmail}>
          <Modal.Body className="p-4" style={{ background: 'var(--card-bg)' }}>
            <p className="text-muted small mb-3">
              Enter your registered student email address. We will send you secure password reset instructions.
            </p>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold">Email Address</Form.Label>
              <Form.Control
                type="email"
                required
                placeholder="name@example.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
            <Button variant="secondary" size="sm" onClick={() => setShowResetModal(false)}>
              Cancel
            </Button>
            <Button
              variant="success"
              size="sm"
              type="submit"
              disabled={resetLoading}
              className="fw-semibold px-3"
            >
              {resetLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
