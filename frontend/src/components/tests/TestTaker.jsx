import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { api } from '../../services/api';
import Modal from '../common/Modal';
import { Clock, CheckCircle, AlertTriangle, Award, Check, X, ArrowRight, Loader2 } from 'lucide-react';

export default function TestTaker({ isOpen, onClose, test, onCompleted }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  // Load questions and initialize timer
  useEffect(() => {
    if (isOpen && test) {
      setLoading(true);
      setResult(null);
      setAnswers({});
      setCurrentIndex(0);

      api.tests
        .list(test.id, true)
        .then((res) => {
          setQuestions(res.questions || []);
          setTimeLeft((test.timeLimit || 15) * 60);
        })
        .catch((err) => {
          console.error('Failed to load questions:', err);
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, test]);

  // Countdown timer effect
  useEffect(() => {
    if (!isOpen || timeLeft <= 0 || result || loading) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitAnswers();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, timeLeft, result, loading]);

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  function handleSelectOption(questionId, optionIndex) {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  }

  async function handleSubmitAnswers() {
    if (submitting || result) return;
    setSubmitting(true);
    try {
      const res = await api.tests.attempt(test.id, answers);
      setResult(res);

      if (res.score >= 70) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      if (onCompleted) onCompleted(res);
    } catch (err) {
      console.error('Failed to submit test:', err);
    } finally {
      setSubmitting(false);
    }
  }

  if (!test) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={test.title}
      maxWidth="max-w-3xl"
    >
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-brand-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading questions from Storage...</p>
        </div>
      ) : result ? (
        /* Results View */
        <div className="space-y-6 py-2">
          <div className="text-center py-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
            <Award className="w-12 h-12 text-brand-400 mx-auto" />
            <h4 className="text-2xl font-bold text-white">Assessment Finished!</h4>
            <div className="flex items-center justify-center space-x-2 text-3xl font-extrabold text-brand-400 font-mono">
              <span>{result.score}%</span>
            </div>
            <p className="text-xs text-slate-400">
              You answered {result.correctCount} out of {result.totalQuestions} questions correctly.
            </p>
          </div>

          {/* Breakdown if returned */}
          {result.breakdown && (
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {result.breakdown.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                    item.isCorrect
                      ? 'bg-emerald-950/20 border-emerald-500/30'
                      : 'bg-red-950/20 border-red-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-slate-200">Question {idx + 1}</span>
                    {item.isCorrect ? (
                      <span className="text-emerald-400 flex items-center gap-1 font-mono">
                        <Check className="w-3.5 h-3.5" /> Correct
                      </span>
                    ) : (
                      <span className="text-red-400 flex items-center gap-1 font-mono">
                        <X className="w-3.5 h-3.5" /> Incorrect
                      </span>
                    )}
                  </div>
                  {item.explanation && (
                    <p className="text-slate-400 text-[11px] italic">{item.explanation}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-5 py-2 text-xs font-semibold bg-brand-500 hover:bg-brand-400 text-slate-950 rounded-xl transition-all"
            >
              Done & Return to Dashboard
            </button>
          </div>
        </div>
      ) : (
        /* Test In Progress View */
        <div className="space-y-6">
          {/* Top Bar: Progress & Timer */}
          <div className="flex items-center justify-between bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-2 text-xs text-slate-300">
              <span>
                Question <strong className="text-white">{currentIndex + 1}</strong> of{' '}
                <strong className="text-white">{questions.length}</strong>
              </span>
            </div>

            <div
              className={`flex items-center space-x-1.5 text-xs font-mono font-bold px-3 py-1 rounded-lg border ${
                timeLeft < 180
                  ? 'bg-red-500/15 border-red-500/30 text-red-400 animate-pulse'
                  : 'bg-brand-500/10 border-brand-500/20 text-brand-400'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Current Question */}
          {questions[currentIndex] && (
            <div className="space-y-4">
              <h4 className="text-base font-semibold text-white leading-relaxed">
                {questions[currentIndex].question}
              </h4>

              <div className="space-y-2.5">
                {questions[currentIndex].options?.map((opt, oIdx) => {
                  const isSelected = answers[questions[currentIndex].id] === oIdx;
                  return (
                    <label
                      key={oIdx}
                      onClick={() => handleSelectOption(questions[currentIndex].id, oIdx)}
                      className={`flex items-start space-x-3 p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-brand-500/15 border-brand-500 text-brand-200 shadow-sm'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${questions[currentIndex].id}`}
                        checked={isSelected}
                        onChange={() => {}}
                        className="mt-0.5 text-brand-500 focus:ring-brand-400"
                      />
                      <span className="leading-normal">{opt}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-30"
            >
              Previous
            </button>

            <div className="flex space-x-2">
              {currentIndex < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                  className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-all flex items-center gap-1"
                >
                  <span>Next</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitAnswers}
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-semibold bg-brand-500 hover:bg-brand-400 text-slate-950 rounded-xl transition-all shadow-md shadow-brand-500/20 flex items-center gap-1.5"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Grading...</span>
                    </>
                  ) : (
                    <span>Submit Assessment</span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
