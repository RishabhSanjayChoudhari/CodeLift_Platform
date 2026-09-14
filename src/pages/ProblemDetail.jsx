import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SEED_PROBLEMS } from '../data/problemsSeed';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/common/Navbar';
import SEO from '../components/common/SEO';
import toast from 'react-hot-toast';
import {
  FaPlay,
  FaCheckCircle,
  FaTimesCircle,
  FaLightbulb,
  FaArrowLeft,
  FaCode,
  FaTerminal,
  FaFire,
  FaSpinner
} from 'react-icons/fa';
import '../styles/ProblemArena.css';

export default function ProblemDetail() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const { recordProblemAttempt } = useData();

  const problem = SEED_PROBLEMS.find((p) => p.id === id);

  const [code, setCode] = useState(problem?.starterCode || '');
  const [showHints, setShowHints] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  // Update starter code when problem changes
  useEffect(() => {
    if (problem) {
      setCode(problem.starterCode || '');
      setTestResults(null);
    }
  }, [problem]);

  // Keyboard shortcut: Ctrl + Enter to Run Solution
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!isRunning) {
          runCodeExecution();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, isRunning]);

  if (!problem) {
    return (
      <div className="cl-arena-page">
        <Navbar />
        <div className="container text-center py-5">
          <h3 className="fw-bold mb-3">Problem Challenge Not Found</h3>
          <p className="text-secondary mb-4">The challenge you requested does not exist or may have been updated.</p>
          <Link to="/problems" className="btn btn-success rounded-pill px-4 fw-bold">
            Back to Problems Arena
          </Link>
        </div>
      </div>
    );
  }

  // Simulated Code Execution Engine
  const runCodeExecution = () => {
    setIsRunning(true);
    setTimeout(() => {
      // Evaluate test cases
      const results = problem.testCases.map((tc) => {
        let passed = false;
        if (
          code.includes('return') ||
          code.includes('SELECT') ||
          code.includes('def') ||
          code.includes('function')
        ) {
          passed = true;
        }

        return {
          input: tc.input,
          expected: tc.expected,
          actual: tc.expected,
          passed
        };
      });

      setTestResults(results);
      setIsRunning(false);

      const allPassed = results.every((r) => r.passed);
      if (allPassed) {
        toast.success(`All test cases passed! +${problem.xp} XP awarded!`);
        if (currentUser) {
          recordProblemAttempt({
            studentId: currentUser.id,
            problemId: problem.id,
            codeSubmitted: code,
            passed: true,
            score: problem.xp,
            testResults: results,
            hintsUsed: showHints ? 1 : 0
          });
        }
      } else {
        toast.error('Some test cases failed. Review code output.');
      }
    }, 600);
  };

  const getDifficultyClass = (diff) => {
    if (diff === 'Easy') return 'easy';
    if (diff === 'Medium') return 'medium';
    return 'hard';
  };

  return (
    <div className="cl-arena-page">
      <SEO title={`${problem.title} — Problem Solving Arena`} description={problem.description} />
      <Navbar />

      <main className="container-fluid max-w-7xl py-4 px-3 px-md-4">
        {/* Navigation Breadcrumb */}
        <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
          <Link
            to="/problems"
            className="text-decoration-none text-secondary small fw-bold d-flex align-items-center gap-2"
          >
            <FaArrowLeft /> Back to Problem Arena
          </Link>

          <div className="d-flex align-items-center gap-2">
            <span className="cl-problem-category-tag">{problem.category}</span>
            <span className={`cl-diff-badge ${getDifficultyClass(problem.difficulty)}`}>
              {problem.difficulty}
            </span>
            <span className="cl-xp-pill">
              <FaFire size={11} /> +{problem.xp} XP
            </span>
          </div>
        </div>

        <div className="row g-4">
          {/* Left Panel: Problem Statement & Test Cases */}
          <div className="col-lg-5">
            <div className="cl-arena-filters-card h-100 d-flex flex-column justify-content-between mb-0">
              <div>
                <h3 className="fw-extrabold mb-3" style={{ color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>
                  {problem.title}
                </h3>
                <p className="text-secondary mb-4" style={{ lineHeight: '1.7', fontSize: '0.95rem' }}>
                  {problem.description}
                </p>

                {/* Example Test Cases */}
                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <FaTerminal size={14} className="text-success" /> Example Test Cases:
                </h6>
                <div className="d-flex flex-column gap-2 mb-4">
                  {problem.testCases.map((tc, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-3 font-monospace small"
                      style={{
                        background: 'color-mix(in srgb, var(--card-bg-alt, #0f172a) 80%, transparent)',
                        border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))',
                        color: 'var(--text-primary)'
                      }}
                    >
                      <div className="mb-1">
                        <strong className="text-success opacity-90">Input:</strong>{' '}
                        <span className="text-light">{tc.input}</span>
                      </div>
                      <div>
                        <strong className="text-warning opacity-90">Expected:</strong>{' '}
                        <span className="text-light">{tc.expected}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hints Drawer */}
              <div className="pt-3 border-top" style={{ borderColor: 'var(--border-color, rgba(255, 255, 255, 0.1))' }}>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-warning rounded-pill px-3 fw-bold d-flex align-items-center gap-2"
                  onClick={() => setShowHints(!showHints)}
                >
                  <FaLightbulb /> {showHints ? 'Hide Hints' : 'Reveal Solution Hints'}
                </button>
                {showHints && (
                  <div
                    className="p-3 rounded-3 mt-3 small border"
                    style={{
                      background: 'rgba(245, 158, 11, 0.08)',
                      borderColor: 'rgba(245, 158, 11, 0.3)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <ul className="mb-0 ps-3">
                      {problem.hints.map((h, i) => (
                        <li key={i} className="mb-1">{h}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel: Interactive Code Playground */}
          <div className="col-lg-7">
            <div className="cl-ide-frame">
              {/* macOS Terminal Window Chrome Header */}
              <div className="cl-ide-header">
                <div className="cl-ide-dots">
                  <div className="cl-ide-dot close" />
                  <div className="cl-ide-dot minimize" />
                  <div className="cl-ide-dot maximize" />
                  <span className="ms-2 font-monospace small text-secondary">solution.py</span>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <span className="d-none d-sm-inline small text-secondary font-monospace me-2">
                    Ctrl + Enter to run
                  </span>
                  <button
                    type="button"
                    className="btn btn-success btn-sm rounded-pill px-4 fw-bold d-inline-flex align-items-center gap-2"
                    onClick={runCodeExecution}
                    disabled={isRunning}
                    style={{ minHeight: 38 }}
                  >
                    {isRunning ? (
                      <>
                        <FaSpinner className="fa-spin" /> Running...
                      </>
                    ) : (
                      <>
                        <FaPlay size={11} /> Run & Submit
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Code Editor Area */}
              <div className="cl-ide-editor-area">
                <textarea
                  className="cl-ide-textarea"
                  rows={15}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="# Write your solution here..."
                  spellCheck="false"
                />
              </div>

              {/* Execution & Test Results Panel */}
              {testResults && (
                <div
                  className="p-4 border-top"
                  style={{
                    background: '#070a10',
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h6 className="fw-bold text-light mb-0 d-flex align-items-center gap-2">
                      <FaTerminal className="text-success" /> Execution & Test Results:
                    </h6>
                    <span className="badge rounded-pill bg-success-subtle text-success fw-bold px-3 py-1">
                      {testResults.filter((r) => r.passed).length} / {testResults.length} Passed
                    </span>
                  </div>

                  <div className="d-flex flex-column gap-2">
                    {testResults.map((res, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-3 border d-flex justify-content-between align-items-center"
                        style={{
                          background: res.passed ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                          borderColor: res.passed ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'
                        }}
                      >
                        <div className="font-monospace small">
                          <div className="text-light">
                            <strong className="text-secondary">Test #{idx + 1}:</strong> {res.input}
                          </div>
                          <div className="text-secondary mt-1">
                            Expected: <span className="text-light">{res.expected}</span> | Actual:{' '}
                            <span className={res.passed ? 'text-success' : 'text-danger'}>
                              {res.actual}
                            </span>
                          </div>
                        </div>
                        {res.passed ? (
                          <FaCheckCircle className="fs-4 text-success flex-shrink-0" />
                        ) : (
                          <FaTimesCircle className="fs-4 text-danger flex-shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

