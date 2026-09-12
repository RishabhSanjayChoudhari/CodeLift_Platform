import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import SubmissionModal from '../components/assignments/SubmissionModal';
import {
  BookOpen,
  FileCheck2,
  CheckCircle2,
  Award,
  CreditCard,
  ArrowRight,
  Upload,
  Calendar,
  Clock,
  Sparkles,
  MessageSquare
} from 'lucide-react';

export default function StudentDashboard() {
  const { user, student } = useAuth();
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [tests, setTests] = useState([]);
  const [fees, setFees] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeSubmissionAsgn, setActiveSubmissionAsgn] = useState(null);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, [student]);

  async function loadDashboardData() {
    try {
      const [cRes, aRes, sRes, tRes, fRes, bRes] = await Promise.all([
        api.courses.list().catch(() => ({ courses: [] })),
        api.assignments.list(student?.batchId).catch(() => ({ assignments: [] })),
        api.submissions.list().catch(() => ({ submissions: [] })),
        api.tests.list().catch(() => ({ tests: [] })),
        api.fees.list().catch(() => ({ fees: [] })),
        api.batches.list().catch(() => ({ batches: [] }))
      ]);

      setCourses(cRes.courses || []);
      setAssignments(aRes.assignments || []);
      setSubmissions(sRes.submissions || []);
      setTests(tRes.tests || []);
      setFees(fRes.fees || []);
      setBatches(bRes.batches || []);
    } finally {
      setLoading(false);
    }
  }

  // Calculate total topics
  let totalTopics = 0;
  courses.forEach((c) => {
    c.modules?.forEach((m) => {
      totalTopics += m.topics?.length || 0;
    });
  });

  const completedCount = Object.keys(student?.progress || {}).length;
  const progressPercent = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  const currentBatch = batches.find((b) => b.id === student?.batchId) || {
    name: 'Full Stack Mastery - Spring 2026'
  };

  const isFeePaid = fees.some((f) => f.status === 'PAID');

  async function handleSendFeedback(e) {
    e.preventDefault();
    if (!feedbackComment) return;
    try {
      await api.feedback.submit(feedbackRating, feedbackComment, false);
      setFeedbackSent(true);
      setFeedbackComment('');
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-850 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
                {currentBatch.name}
              </span>
              <span className="text-xs font-mono text-slate-400">
                ID: {student?.id || user?.id}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, {student?.name || user?.name || 'Engineer'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Track your weekly topic completion, submit assignments via direct Supabase Storage signed URLs, and take timed assessments.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/course-view"
              className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-brand-500/20 flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Resume Course</span>
            </Link>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" /> Course Mastery Progress
            </span>
            <span className="font-mono text-brand-400 font-bold">
              {completedCount} / {totalTopics} Topics ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-emerald-400 transition-all duration-500 shadow-sm shadow-brand-500/50"
              style={{ width: `${Math.max(5, progressPercent)}%` }}
            />
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-brand-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white font-mono">{completedCount}</p>
          <p className="text-[11px] text-slate-500">Topics finished</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Assignments</span>
            <FileCheck2 className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white font-mono">{submissions.length}</p>
          <p className="text-[11px] text-slate-500">{assignments.length} total assigned</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Assessments</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-white font-mono">{tests.length}</p>
          <p className="text-[11px] text-slate-500">Quizzes available</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Fees</span>
            <CreditCard className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl sm:text-2xl font-bold font-mono">
            {isFeePaid ? (
              <span className="text-emerald-400">PAID</span>
            ) : (
              <span className="text-amber-400">PENDING</span>
            )}
          </p>
          <Link to="/fees" className="text-[11px] text-brand-400 hover:underline block">
            {isFeePaid ? 'View receipt' : 'Pay & redeem coupon'}
          </Link>
        </div>
      </div>

      {/* Main Grid: Active Assignments & Quick Curriculum Link */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Assignments */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-brand-400" />
              <span>Pending & Active Assignments</span>
            </h3>
            <Link
              to="/assignments"
              className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 font-semibold"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {assignments.map((asgn) => {
              const userSub = submissions.find((s) => s.assignmentId === asgn.id);
              const isPast = new Date() > new Date(asgn.deadline);

              return (
                <div
                  key={asgn.id}
                  className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {asgn.type}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        Max Marks: {asgn.maxMarks}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{asgn.title}</h4>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>Due: {new Date(asgn.deadline).toLocaleDateString()}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {userSub ? (
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                          {userSub.grade !== null ? `Grade: ${userSub.grade}/${asgn.maxMarks}` : 'Submitted'}
                        </span>
                      </div>
                    ) : isPast ? (
                      <span className="text-xs font-mono text-red-400 bg-red-500/10 px-2 py-1 rounded">
                        Deadline Passed
                      </span>
                    ) : (
                      <button
                        onClick={() => setActiveSubmissionAsgn(asgn)}
                        className="px-3.5 py-1.5 rounded-xl bg-brand-500/15 hover:bg-brand-500/25 border border-brand-500/30 text-brand-300 text-xs font-semibold transition-all flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Submit</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar: Quizzes & Feedback */}
        <div className="space-y-6">
          {/* Quizzes card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-400" />
              <span>Assessment Quizzes</span>
            </h3>
            <p className="text-xs text-slate-400">
              Test your knowledge on asynchronous architecture and React Fiber runtime.
            </p>
            <Link
              to="/tests"
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center justify-center gap-2 border border-slate-700"
            >
              <span>View & Take Assessments</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Quick Feedback Form */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>Student Feedback</span>
            </h3>
            <p className="text-xs text-slate-400">
              Help us refine the curriculum and JSON-first platform experience.
            </p>

            {feedbackSent ? (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
                Thank you! Your feedback has been recorded in feedback.json.
              </div>
            ) : (
              <form onSubmit={handleSendFeedback} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Rating (1-5)
                  </label>
                  <select
                    value={feedbackRating}
                    onChange={(e) => setFeedbackRating(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                  >
                    <option value={5}>5 - Outstanding</option>
                    <option value={4}>4 - Very Good</option>
                    <option value={3}>3 - Average</option>
                    <option value={2}>2 - Needs Improvement</option>
                    <option value={1}>1 - Poor</option>
                  </select>
                </div>

                <div>
                  <textarea
                    rows={2}
                    required
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    placeholder="Share your thoughts on the modules..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-brand-500 resize-none placeholder:text-slate-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs transition-all shadow-sm"
                >
                  Submit Feedback
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Submission Modal for file upload */}
      <SubmissionModal
        isOpen={Boolean(activeSubmissionAsgn)}
        onClose={() => setActiveSubmissionAsgn(null)}
        assignment={activeSubmissionAsgn}
        onSuccess={loadDashboardData}
      />
    </div>
  );
}
