import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Code2,
  BookOpen,
  FileCheck2,
  CheckCircle2,
  Award,
  CreditCard,
  LayoutDashboard,
  ShieldCheck,
  LogOut,
  User,
  Menu,
  X,
  Sparkles
} from 'lucide-react';

export default function Navbar() {
  const { user, student, signOut, loginAsDemo, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 p-0.5 shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Code2 className="w-5 h-5 text-brand-400" />
              </div>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                Code<span className="text-brand-400">Lift</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  JSON-1st
                </span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {user ? (
              isAdmin ? (
                <>
                  <Link
                    to="/admin"
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/admin')
                        ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin Control</span>
                  </Link>
                  <Link
                    to="/course-view"
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/course-view')
                        ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Curriculum</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/dashboard')
                        ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/course-view"
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/course-view')
                        ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Course</span>
                  </Link>
                  <Link
                    to="/assignments"
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/assignments')
                        ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>Assignments</span>
                  </Link>
                  <Link
                    to="/tests"
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/tests')
                        ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Tests</span>
                  </Link>
                  <Link
                    to="/certificates"
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/certificates')
                        ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Award className="w-4 h-4" />
                    <span>Certificates</span>
                  </Link>
                  <Link
                    to="/fees"
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/fees')
                        ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Fees</span>
                  </Link>
                </>
              )
            ) : (
              <>
                <a href="/#courses" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  Curriculum
                </a>
                <a href="/#batches" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  Batches
                </a>
                <a href="/#architecture" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  Architecture
                </a>
                <a href="/#feedback" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  Reviews
                </a>
              </>
            )}
          </div>

          {/* User Account / Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full">
                  <div className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-xs">
                    {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-medium text-slate-200 truncate max-w-[120px]">
                    {user.name || user.email}
                  </span>
                  {isAdmin && (
                    <span className="text-[10px] bg-brand-500 text-slate-950 font-bold px-1.5 py-0.5 rounded-full uppercase">
                      Admin
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    signOut();
                    navigate('/');
                  }}
                  title="Sign out"
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-900 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                {/* 1-Click Demo Fill Helpers */}
                <button
                  onClick={async () => {
                    await loginAsDemo('student');
                    navigate('/dashboard');
                  }}
                  className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-all flex items-center gap-1"
                  title="Instant login as demo student"
                >
                  <Sparkles className="w-3 h-3 text-brand-400" />
                  <span>Student Demo</span>
                </button>
                <button
                  onClick={async () => {
                    await loginAsDemo('admin');
                    navigate('/admin');
                  }}
                  className="text-xs px-2.5 py-1.5 rounded-lg border border-brand-500/30 bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 transition-all flex items-center gap-1"
                  title="Instant login as demo admin"
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span>Admin Demo</span>
                </button>
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800/60 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium bg-brand-500 hover:bg-brand-400 text-slate-950 px-3.5 py-1.5 rounded-lg transition-colors font-semibold shadow-md shadow-brand-500/20"
                >
                  Enroll Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 focus:outline-none"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 pt-3 pb-6 space-y-2">
          {user ? (
            <>
              <div className="p-3 mb-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">{user.name || user.email}</p>
                  <p className="text-xs text-slate-400">{isAdmin ? 'Administrator' : 'Student'}</p>
                </div>
                <button
                  onClick={() => {
                    signOut();
                    navigate('/');
                    setMobileOpen(false);
                  }}
                  className="text-xs text-red-400 hover:underline"
                >
                  Sign Out
                </button>
              </div>
              {isAdmin ? (
                <>
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-brand-400 bg-brand-500/10 font-medium"
                  >
                    Admin Control Panel
                  </Link>
                  <Link
                    to="/course-view"
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-slate-300"
                  >
                    Curriculum
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-900"
                  >
                    Student Dashboard
                  </Link>
                  <Link
                    to="/course-view"
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-900"
                  >
                    Courses & Topics
                  </Link>
                  <Link
                    to="/assignments"
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-900"
                  >
                    Assignments
                  </Link>
                  <Link
                    to="/tests"
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-900"
                  >
                    Tests & Quizzes
                  </Link>
                  <Link
                    to="/certificates"
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-900"
                  >
                    Certificates
                  </Link>
                  <Link
                    to="/fees"
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-900"
                  >
                    Fees & Coupons
                  </Link>
                </>
              )}
            </>
          ) : (
            <div className="space-y-3 pt-2">
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    await loginAsDemo('student');
                    navigate('/dashboard');
                    setMobileOpen(false);
                  }}
                  className="w-1/2 py-2 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-200"
                >
                  Student Demo
                </button>
                <button
                  onClick={async () => {
                    await loginAsDemo('admin');
                    navigate('/admin');
                    setMobileOpen(false);
                  }}
                  className="w-1/2 py-2 text-xs rounded-lg border border-brand-500/30 bg-brand-500/10 text-brand-400"
                >
                  Admin Demo
                </button>
              </div>
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block text-center py-2 text-sm text-slate-300 hover:text-white"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="block text-center py-2 text-sm bg-brand-500 text-slate-950 font-bold rounded-lg"
              >
                Enroll Now
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
