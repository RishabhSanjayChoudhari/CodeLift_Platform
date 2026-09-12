import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import SubmissionModal from '../components/assignments/SubmissionModal';
import {
  FileCheck2,
  Clock,
  CheckCircle2,
  Upload,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  FileText,
  ExternalLink,
  MessageSquare,
  Award
} from 'lucide-react';

export default function AssignmentsPage() {
  const { student, user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeModalAsgn, setActiveModalAsgn] = useState(null);
  const [expandedDesc, setExpandedDesc] = useState({});
  const [descriptions, setDescriptions] = useState({});

  useEffect(() => {
    loadData();
  }, [student]);

  async function loadData() {
    try {
      const [aRes, sRes] = await Promise.all([
        api.assignments.list(student?.batchId).catch(() => ({ assignments: [] })),
        api.submissions.list().catch(() => ({ submissions: [] }))
      ]);
      setAssignments(aRes.assignments || []);
      setSubmissions(sRes.submissions || []);
    } finally {
      setLoading(false);
    }
  }

  async function toggleDescription(asgn) {
    const isCurrentlyExpanded = expandedDesc[asgn.id];
    setExpandedDesc((prev) => ({ ...prev, [asgn.id]: !isCurrentlyExpanded }));

    if (!isCurrentlyExpanded && !descriptions[asgn.id] && asgn.descriptionUrl) {
      try {
        const res = await api.assignments.list(null, asgn.descriptionUrl);
        setDescriptions((prev) => ({ ...prev, [asgn.id]: res.description || '# Description unavailable' }));
      } catch (err) {
        setDescriptions((prev) => ({ ...prev, [asgn.id]: '# Error loading description' }));
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-brand-400 font-semibold tracking-wider">
            Hands-on Engineering
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 flex items-center gap-2.5">
            <FileCheck2 className="w-7 h-7 text-brand-400" />
            <span>Assignments & Code Submissions</span>
          </h1>
        </div>
        <p className="text-xs text-slate-400 max-w-sm">
          Files are uploaded straight to the private <code className="text-brand-300">app-data</code> Supabase bucket via pre-signed URLs.
        </p>
      </div>

      {/* Assignment List */}
      <div className="space-y-4">
        {assignments.map((asgn) => {
          const sub = submissions.find((s) => s.assignmentId === asgn.id);
          const deadline = new Date(asgn.deadline);
          const isPassed = new Date() > deadline;
          const isExpanded = expandedDesc[asgn.id];

          return (
            <div
              key={asgn.id}
              className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
                      {asgn.type}
                    </span>
                    <span className="text-xs font-mono text-brand-400 bg-brand-500/10 px-2.5 py-0.5 rounded-full border border-brand-500/20">
                      Max Marks: {asgn.maxMarks}
                    </span>
                    <span
                      className={`text-xs font-mono flex items-center gap-1 ${
                        isPassed ? 'text-red-400' : 'text-slate-400'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Due: {deadline.toLocaleString()}</span>
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-white">{asgn.title}</h3>
                </div>

                {/* Status / Submit Button */}
                <div className="flex items-center gap-3">
                  {sub ? (
                    <div className="flex flex-col sm:items-end">
                      <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Submitted</span>
                      </span>
                      {sub.grade !== null && (
                        <span className="text-xs font-mono text-brand-300 mt-1 font-bold">
                          Score: {sub.grade} / {asgn.maxMarks}
                        </span>
                      )}
                    </div>
                  ) : isPassed ? (
                    <span className="text-xs font-mono text-red-400 bg-red-500/10 px-3 py-1 rounded-xl border border-red-500/20">
                      Past Deadline
                    </span>
                  ) : (
                    <button
                      onClick={() => setActiveModalAsgn(asgn)}
                      className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-brand-500/20 flex items-center gap-1.5"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Submit Solution</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Feedback and Grade alert if graded */}
              {sub && sub.feedback && (
                <div className="p-4 rounded-2xl bg-brand-950/20 border border-brand-500/30 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-brand-300 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5" /> Instructor Evaluation & Feedback
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">
                      Grade: {sub.grade} / {asgn.maxMarks}
                    </span>
                  </div>
                  <p className="text-slate-300 italic pl-5">"{sub.feedback}"</p>
                </div>
              )}

              {/* Collapsible Assignment Description */}
              {asgn.descriptionUrl && (
                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={() => toggleDescription(asgn)}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-3.5 h-3.5" />
                        <span>Hide assignment details</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3.5 h-3.5" />
                        <span>View assignment description & specifications</span>
                      </>
                    )}
                  </button>

                  {isExpanded && (
                    <div className="mt-3 p-4 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs prose-custom">
                      {descriptions[asgn.id] ? (
                        <div className="whitespace-pre-line">{descriptions[asgn.id]}</div>
                      ) : (
                        <p className="text-slate-500">Loading brief from Storage...</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <SubmissionModal
        isOpen={Boolean(activeModalAsgn)}
        onClose={() => setActiveModalAsgn(null)}
        assignment={activeModalAsgn}
        onSuccess={loadData}
      />
    </div>
  );
}
