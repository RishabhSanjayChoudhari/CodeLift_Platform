import React, { useState } from 'react';
import { ListGroup, Button, Badge, Card, Modal, Form } from 'react-bootstrap';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  FaFileUpload,
  FaCheckCircle,
  FaClock,
  FaCommentDots,
  FaClipboardList
} from 'react-icons/fa';

export default function AssignmentList() {
  const { assignments, submissions, submitAssignment } = useData();
  const { currentStudent } = useAuth();

  const [uploadModalAsgn, setUploadModalAsgn] = useState(null);
  const [fileName, setFileName] = useState('');

  // Filter assignments for student's batch
  const studentAssignments = assignments.filter(
    (a) => !a.batchIds || a.batchIds.length === 0 || (currentStudent && a.batchIds.includes(currentStudent.batchId))
  );

  const handleSimulatedUpload = (e) => {
    e.preventDefault();
    if (uploadModalAsgn && currentStudent) {
      submitAssignment(uploadModalAsgn.id, currentStudent.id, fileName || 'my-solution.js');
      setUploadModalAsgn(null);
      setFileName('');
    }
  };

  return (
    <div>
      <Card className="border-0 shadow-sm rounded-3" style={{ backgroundColor: 'var(--card-bg)' }}>
        <Card.Header className="py-3 border-0 d-flex justify-content-between align-items-center" style={{ backgroundColor: 'var(--card-bg)' }}>
          <h5 className="fw-bold mb-0 d-flex align-items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <FaClipboardList className="text-primary" />
            <span>Assigned Coursework ({studentAssignments.length})</span>
          </h5>
          <span className="small text-muted">
            Batch: <strong>{currentStudent?.batchId}</strong>
          </span>
        </Card.Header>

        <Card.Body className="p-0">
          <ListGroup variant="flush">
            {studentAssignments.map((asgn) => {
              const submission = submissions.find(
                (s) => s.assignmentId === asgn.id && s.studentId === currentStudent?.id
              );
              const isPastDeadline = new Date() > new Date(asgn.deadline);

              return (
                <ListGroup.Item key={asgn.id} className="p-4" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3">
                    <div className="space-y-1">
                      <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                        <h6 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>{asgn.title}</h6>
                        <Badge className="border px-2.5 py-1" style={{ background: 'var(--card-bg-alt)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}>
                          Max Marks: {asgn.maxMarks}
                        </Badge>
                      </div>

                      <p className="text-muted small mb-2">{asgn.description}</p>

                      <div className="d-flex align-items-center gap-2 small text-muted font-monospace">
                        <FaClock size={12} className={isPastDeadline ? 'text-danger' : 'text-primary'} />
                        <span className={isPastDeadline ? 'text-danger fw-semibold' : ''}>
                          Due Date: {asgn.deadline} {isPastDeadline ? '(Deadline Passed)' : ''}
                        </span>
                      </div>
                    </div>

                    <div className="align-self-end align-self-md-center text-md-end">
                      {submission ? (
                        <div className="d-flex flex-column align-items-md-end gap-1">
                          <Badge bg="success" className="p-2 d-inline-flex align-items-center gap-1">
                            <FaCheckCircle size={12} />
                            <span>Submitted ({submission.submittedAt})</span>
                          </Badge>
                          {submission.grade !== null && (
                            <span className="small fw-bold text-success font-monospace">
                              Grade Awarded: {submission.grade} / {asgn.maxMarks}
                            </span>
                          )}
                        </div>
                      ) : (
                        <Button
                          variant="primary"
                          size="sm"
                          disabled={isPastDeadline}
                          onClick={() => {
                            setUploadModalAsgn(asgn);
                            setFileName('');
                          }}
                          className="d-flex align-items-center gap-1.5 shadow-sm"
                        >
                          <FaFileUpload size={12} />
                          <span>Upload Solution</span>
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Faculty Feedback Banner */}
                  {submission && submission.feedback && (
                    <div className="mt-3 p-3 rounded-3 border border-success-subtle small" style={{ background: 'var(--card-bg-alt)' }}>
                      <div className="fw-bold text-success d-flex align-items-center gap-1.5 mb-1">
                        <FaCommentDots />
                        <span>Faculty Evaluation & Qualitative Feedback:</span>
                      </div>
                      <p className="mb-0 fst-italic" style={{ color: 'var(--text-primary)' }}>{submission.feedback}</p>
                    </div>
                  )}
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </Card.Body>
      </Card>

      {/* Simulated File Upload Modal */}
      <Modal show={Boolean(uploadModalAsgn)} onHide={() => setUploadModalAsgn(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fs-5 fw-bold">Submit Assignment Solution</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSimulatedUpload}>
          <Modal.Body>
            <p className="small text-muted mb-3">
              Submitting solution for: <strong>{uploadModalAsgn?.title}</strong>
            </p>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Choose or Specify File Name</Form.Label>
              <Form.Control
                type="text"
                required
                placeholder="e.g. promise-implementation.js or solution.zip"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
              />
              <Form.Text className="text-muted">
                Simulated file upload will persist reference in submissions array.
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" size="sm" onClick={() => setUploadModalAsgn(null)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Submit Assignment
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
