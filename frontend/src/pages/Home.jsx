import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import {
  Code2,
  Database,
  ShieldCheck,
  Zap,
  BookOpen,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Terminal,
  FileCheck,
  Award,
  Layers,
  ChevronRight
} from 'lucide-react';

export default function Home() {
  const { user, loginAsDemo } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.courses.list().catch(() => ({ courses: [] })),
      api.batches.list().catch(() => ({ batches: [] })),
      api.feedback.list().catch(() => ({ feedback: [] }))
    ]).then(([courseRes, batchRes, fbkRes]) => {
      setCourses(courseRes.courses || []);
      setBatches(batchRes.batches || []);
      setFeedbackList(fbkRes.feedback || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Phase 1 Architecture Live</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
          Learn Full-Stack Systems with a{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-emerald-300 to-teal-400">
            JSON-First Storage
          </span>{' '}
          Architecture
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Supabase Storage as the primary database. Vercel Serverless Functions for atomic CRUD operations. Zero PostgreSQL runtime bloat.
        </p>

        {/* Call to Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          {user ? (
            <Link
              to={user.isAdmin ? '/admin' : '/dashboard'}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2"
            >
              <span>Go to Your {user.isAdmin ? 'Admin Console' : 'Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2"
              >
                <span>Enroll in Spring 2026 Batch</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={async () => {
                  await loginAsDemo('student');
                  navigate('/dashboard');
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold text-sm transition-all flex items-center justify-center gap-2"
              >
                <Terminal className="w-4 h-4 text-brand-400" />
                <span>Instant Student Demo</span>
              </button>
            </>
          )}
        </div>

        {/* Architecture Spec Pill Banner */}
        <div className="mt-14 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center space-x-2.5">
            <Database className="w-4 h-4 text-brand-400 flex-shrink-0" />
            <div className="text-left text-xs">
              <p className="font-semibold text-white">Private Bucket</p>
              <p className="text-slate-400 font-mono text-[11px]">app-data/*.json</p>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center space-x-2.5">
            <Zap className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <div className="text-left text-xs">
              <p className="font-semibold text-white">Serverless CRUD</p>
              <p className="text-slate-400 font-mono text-[11px]">Vercel Edge/Node</p>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center space-x-2.5">
            <ShieldCheck className="w-4 h-4 text-purple-400 flex-shrink-0" />
            <div className="text-left text-xs">
              <p className="font-semibold text-white">Optimistic Locks</p>
              <p className="text-slate-400 font-mono text-[11px]">3-Retry OCC</p>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center space-x-2.5">
            <FileCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <div className="text-left text-xs">
              <p className="font-semibold text-white">Direct Uploads</p>
              <p className="text-slate-400 font-mono text-[11px]">Storage Signed URL</p>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Deep Dive Section */}
      <section id="architecture" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 sm:p-12">
          <div className="max-w-3xl">
            <span className="text-xs font-mono uppercase text-brand-400 font-semibold tracking-wider">
              System Design Blueprint
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-2">
              Why We Replaced Postgres with Supabase Storage
            </h2>
            <p className="text-slate-400 mt-3 text-sm sm:text-base leading-relaxed">
              Relational databases often incur unnecessary compute costs and connection pooling overhead for Phase 1 MVPs. By leveraging Supabase Storage as an atomic JSON document store, every entity is human-readable, exportable, and globally replicated.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-400 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="text-base font-bold text-white">Fetch JSON from Storage</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Vercel Functions stream the relevant normalized JSON file (e.g. <code className="text-brand-300">students.json</code>) directly via Supabase Service Role credentials.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="text-base font-bold text-white">In-Memory Mutation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                The function parses the text into native JavaScript collections, applies validations, deadlines, business rules, and updates array records.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="text-base font-bold text-white">Optimistic Atomic Write</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                The updated collection is serialized and uploaded with upsert flags and retry logic, completing transactions in under 200 milliseconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum / Courses Preview */}
      <section id="courses" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase text-brand-400 font-semibold tracking-wider">
              Engineering Syllabus
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
              Engineered for Senior Practitioners
            </h2>
          </div>
          <Link
            to="/course-view"
            className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Explore full curriculum</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course) =>
            course.modules?.map((mod, idx) => (
              <div
                key={mod.id}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 glass-panel-hover flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Module 0{idx + 1}</span>
                    <span className="text-brand-400 font-semibold">{mod.topics?.length || 0} Topics</span>
                  </div>
                  <h3 className="text-lg font-bold text-white leading-snug">{mod.title}</h3>
                  <ul className="space-y-2 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                    {mod.topics?.map((topic) => (
                      <li key={topic.id} className="flex items-center space-x-2 truncate">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" />
                        <span className="truncate">{topic.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800">
                  <Link
                    to="/course-view"
                    className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
                  >
                    <span>Read module topics</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Batches & Admission Section */}
      <section id="batches" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div>
          <span className="text-xs font-mono uppercase text-brand-400 font-semibold tracking-wider">
            Cohorts & Pricing
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
            Upcoming Active Batches
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {batches.map((batch) => (
            <div
              key={batch.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 font-semibold">
                    {batch.isActive ? 'Enrollment Open' : 'Closed'}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Capacity: {batch.capacity} seats
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white">{batch.name}</h3>

                <div className="py-2">
                  <span className="text-4xl font-extrabold text-white font-mono">
                    ₹{batch.fee.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400 ml-2">/ one-time fee</span>
                </div>

                <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-400" />
                    <span>Live feedback & code reviews in submissions.json</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-400" />
                    <span>Direct storage signed URL uploads for submissions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-400" />
                    <span>Verifiable completion certificate with SHA ID</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800">
                <Link
                  to="/register"
                  className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-brand-500/20 flex items-center justify-center gap-2"
                >
                  <span>Register for this Batch</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Student Reviews & Testimonials */}
      <section id="feedback" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div>
          <span className="text-xs font-mono uppercase text-brand-400 font-semibold tracking-wider">
            Verified Testimonials
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
            What Our Students Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {feedbackList.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4"
            >
              <div className="flex items-center space-x-1 text-amber-400">
                {[...Array(item.rating || 5)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed italic">
                "{item.comment}"
              </p>
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="font-semibold text-white">{item.studentName}</span>
                <span className="text-slate-500">
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
