import React, { useState } from 'react';
import { Card, Button, Badge, Modal, Form, Row, Col } from 'react-bootstrap';
import confetti from 'canvas-confetti';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { FaPlay, FaCheck, FaTimes, FaTrophy, FaTasks } from 'react-icons/fa';

export default function TestTaker() {
  const { tests, attempts, recordAttempt } = useData();
  const { currentStudent } = useAuth();

  const [activeTest, setActiveTest] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [testResult, setTestResult] = useState(null);

  const startTest = (test) => {
    setActiveTest(test);
    setSelectedAnswers({});
    setTestResult(null);
  };

  const handleSelectOption = (questionId, optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmitTest = (e) => {
    e.preventDefault();
    if (!activeTest || !currentStudent) return;

    let correctCount = 0;
    const questions = activeTest.questions || [];

    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const scorePercentage = Math.round((correctCount / questions.length) * 100);

    // Save attempt to DataContext
    recordAttempt(currentStudent.id, activeTest.id, scorePercentage);

    setTestResult({
      score: scorePercentage,
      correctCount,
      total: questions.length
    });

    if (scorePercentage >= 70) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h5 className="fw-bold mb-1 d-flex align-items-center gap-2">
          <FaTasks className="text-primary" />
          <span>Assessments & Quizzes</span>
        </h5>
        <p className="text-muted small mb-0">
          Verify your conceptual grasp of asynchronous systems and React Fiber internals.
        </p>
      </div>

      <Row className="g-4">
        {tests.map((test) => {
          const studentAttempts = attempts.filter(
            (att) => att.testId === test.id && att.studentId === currentStudent?.id
          );
          const latestAttempt = studentAttempts[studentAttempts.length - 1];

          return (
            <Col md={6} key={test.id}>
              <Card className="border-0 shadow-sm rounded-3 h-100">
                <Card.Body className="p-4 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <Badge className="border px-2.5 py-1.5" style={{ background: 'var(--card-bg-alt, #162032)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}>
                        {test.questions?.length} Questions
                      </Badge>
                      {latestAttempt && (
                        <Badge bg={latestAttempt.score >= 70 ? 'success' : 'warning'} className="font-monospace">
                          Last Score: {latestAttempt.score}%
                        </Badge>
                      )}
                    </div>
                    <h5 className="fw-bold" style={{ color: 'var(--text-primary)' }}>{test.title}</h5>
                    <p className="text-muted small mb-4">
                      Includes multiple choice questions with automated score computation and instant feedback.
                    </p>
                  </div>

                  <Button
                    variant="primary"
                    onClick={() => startTest(test)}
                    className="d-flex align-items-center justify-content-center gap-2 w-100 shadow-sm"
                  >
                    <FaPlay size={11} />
                    <span>{latestAttempt ? 'Retake Quiz' : 'Start Assessment'}</span>
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Test Modal */}
      <Modal show={Boolean(activeTest)} onHide={() => setActiveTest(null)} centered size="lg">
        <Modal.Header closeButton style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
          <Modal.Title className="fs-5 fw-bold" style={{ color: 'var(--text-primary)' }}>{activeTest?.title}</Modal.Title>
        </Modal.Header>
        {testResult ? (
          /* Result View */
          <Modal.Body className="p-4 text-center" style={{ background: 'var(--card-bg)', color: 'var(--text-primary)' }}>
            <div className="my-3">
              <FaTrophy className="text-warning display-4 mb-2" />
              <h4 className="fw-bold" style={{ color: 'var(--text-primary)' }}>Assessment Completed!</h4>
              <div className="display-5 fw-bold text-success font-monospace my-2">
                {testResult.score}%
              </div>
              <p className="text-muted">
                You answered {testResult.correctCount} out of {testResult.total} questions correctly.
              </p>
            </div>
            <Button variant="primary" onClick={() => setActiveTest(null)}>
              Close & View Dashboard
            </Button>
          </Modal.Body>
        ) : (
          /* Questionnaire View */
          <Form onSubmit={handleSubmitTest}>
            <Modal.Body className="p-4 space-y-4" style={{ background: 'var(--card-bg)', color: 'var(--text-primary)' }}>
              {activeTest?.questions?.map((q, idx) => (
                <div key={q.id} className="p-3 rounded-3 mb-3 border" style={{ background: 'var(--card-bg-alt, #162032)', borderColor: 'var(--border-color)' }}>
                  <div className="d-flex align-items-start gap-3 mb-3">
                    <div className="quiz-q-marker">
                      Q{idx + 1}
                    </div>
                    <div className="quiz-q-text flex-grow-1" style={{ color: 'var(--text-primary)' }}>
                      {q.text}
                    </div>
                  </div>
                  <div className="d-flex flex-column gap-2">
                    {q.options?.map((opt, oIdx) => {
                      const isSelected = selectedAnswers[q.id] === oIdx;
                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => handleSelectOption(q.id, oIdx)}
                          className={`quiz-option-card ${isSelected ? 'selected' : ''}`}
                          style={{ marginBottom: 0 }}
                        >
                          <div className="quiz-opt-letter">
                            {'ABCD'[oIdx]}
                          </div>
                          <div className="quiz-opt-text">
                            {opt}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </Modal.Body>
            <Modal.Footer style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
              <Button variant="secondary" size="sm" onClick={() => setActiveTest(null)}>
                Cancel
              </Button>
              <Button variant="success" size="sm" type="submit">
                Submit Answers
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Modal>
    </div>
  );
}
