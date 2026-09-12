import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import TestTaker from '../components/tests/TestTaker';
import { Award, Clock, CheckCircle2, Play, Calendar, AlertCircle } from 'lucide-react';

export default function TestsPage() {
  const [tests, setTests] = useState([]);
  const [activeTest, setActiveTest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTests();
  }, []);

  async function loadTests() {
    try {
      const res = await api.tests.list();
      setTests(res.tests || []);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-brand-400 font-semibold tracking-wider">
            Knowledge Check
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 flex items-center gap-2.5">
            <Award className="w-7 h-7 text-purple-400" />
            <span>Timed Tests & Assessments</span>
          </h1>
        </div>
        <p className="text-xs text-slate-400 max-w-sm">
          Tests are strictly timed and question papers are loaded on demand. Attempts are scored automatically and saved to <code className="text-brand-300">attempts.json</code>.
        </p>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tests.map((test) => (
          <div
            key={test.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xl"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                  Multiple Choice
                </span>
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{test.timeLimit} Minutes</span>
                </span>
              </div>

              <h3 className="text-xl font-bold text-white">{test.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Evaluates deep conceptual understanding of execution context, queues, and concurrency mechanics.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={() => setActiveTest(test)}
                className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-brand-500/20 flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Timed Assessment</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Test Taker Modal */}
      <TestTaker
        isOpen={Boolean(activeTest)}
        onClose={() => setActiveTest(null)}
        test={activeTest}
        onCompleted={loadTests}
      />
    </div>
  );
}
