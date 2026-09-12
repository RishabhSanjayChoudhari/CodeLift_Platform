import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiShield, FiLock, FiUser, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setErrorMsg('Please enter both administrator username and password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      await loginAdmin({ username: username.trim(), password });
      toast.success('Welcome back, Administrator!');
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      console.error('[AdminLogin] Authentication failure:', err);
      setErrorMsg(err.message || 'Invalid administrator credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center p-3"
      style={{
        background: 'radial-gradient(ellipse at top, #1e293b 0%, #0f172a 60%, #020617 100%)',
        color: '#f8fafc',
        fontFamily: 'inherit'
      }}
    >
      <div className="w-100" style={{ maxWidth: '440px' }}>
        {/* Brand & Security Header */}
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3 shadow-lg"
            style={{
              width: '68px',
              height: '68px',
              background: 'linear-gradient(135deg, #15803d 0%, #16a34a 100%)',
              color: '#ffffff',
              boxShadow: '0 10px 25px -5px rgba(22, 163, 74, 0.4)'
            }}
          >
            <FiShield size={32} />
          </div>
          <h2 className="fw-bold tracking-tight mb-1" style={{ color: '#ffffff', letterSpacing: '-0.025em' }}>
            CodeLift Admin
          </h2>
          <p className="text-muted small mb-0" style={{ color: '#94a3b8' }}>
            Restricted Institutional Infrastructure Portal
          </p>
        </div>

        {/* Login Card */}
        <div
          className="card border rounded-4 shadow-2xl p-4 p-md-5"
          style={{
            background: 'rgba(30, 41, 59, 0.7)',
            backdropFilter: 'blur(16px)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}
        >
          {errorMsg && (
            <div
              className="alert border-0 py-2.5 px-3 rounded-3 mb-4 small d-flex align-items-center gap-2"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: '#fca5a5',
                border: '1px solid rgba(239, 68, 68, 0.3)'
              }}
              role="alert"
            >
              <span>⚠️</span>
              <div className="fw-medium">{errorMsg}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Username Input */}
            <div className="mb-3">
              <label className="form-label small fw-semibold text-uppercase tracking-wider" style={{ color: '#cbd5e1', fontSize: '0.75rem' }}>
                Administrator Username
              </label>
              <div className="input-group">
                <span
                  className="input-group-text border-0"
                  style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', color: '#94a3b8' }}
                >
                  <FiUser />
                </span>
                <input
                  type="text"
                  autoFocus
                  required
                  autoComplete="username"
                  className="form-control border-0 text-white"
                  style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.6)',
                    boxShadow: 'none',
                    padding: '0.75rem 1rem'
                  }}
                  placeholder="e.g. rishabh"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <label className="form-label small fw-semibold text-uppercase tracking-wider" style={{ color: '#cbd5e1', fontSize: '0.75rem' }}>
                Password
              </label>
              <div className="input-group">
                <span
                  className="input-group-text border-0"
                  style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', color: '#94a3b8' }}
                >
                  <FiLock />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  className="form-control border-0 text-white"
                  style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.6)',
                    boxShadow: 'none',
                    padding: '0.75rem 1rem'
                  }}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="input-group-text border-0 text-muted"
                  style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', cursor: 'pointer' }}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-success w-100 py-2.5 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow"
              style={{
                background: 'linear-gradient(135deg, #15803d 0%, #16a34a 100%)',
                border: 'none',
                boxShadow: '0 10px 15px -3px rgba(22, 163, 74, 0.3)'
              }}
            >
              {isLoading ? (
                <span>Verifying credentials...</span>
              ) : (
                <>
                  <span>Sign In as Admin</span>
                  <FiArrowRight />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-4 pt-3 border-top text-center" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
            <span className="small text-muted" style={{ fontSize: '0.75rem' }}>
              🔒 Protected by 256-bit encrypted security definer RPC
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
