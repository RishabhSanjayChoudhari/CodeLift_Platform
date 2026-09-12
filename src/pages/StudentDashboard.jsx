import React, { useState } from 'react';
import { Container, Row, Col, Card, ProgressBar, Badge, Button, Nav } from 'react-bootstrap';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import CourseViewer from '../components/student/CourseViewer';
import AssignmentList from '../components/student/AssignmentList';
import TestTaker from '../components/student/TestTaker';
import FeeStatus from '../components/student/FeeStatus';
import CertificateModal from '../components/student/CertificateModal';
import {
  FaGraduationCap,
  FaBookOpen,
  FaTasks,
  FaFileAlt,
  FaMoneyBillWave,
  FaAward,
  FaClock,
  FaCalendarAlt
} from 'react-icons/fa';

export default function StudentDashboard() {
  const { courses, assignments, submissions, batches, fees } = useData();
  const { currentStudent } = useAuth();

  const [activeTab, setActiveTab] = useState('courses');
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const studentBatch = batches.find((b) => b.id === currentStudent?.batchId) || batches[0];
  const progress = currentStudent?.progress || {};

  // Compute progress
  let totalTopics = 0;
  courses.forEach((c) => {
    c.modules?.forEach((m) => {
      totalTopics += m.topics?.length || 0;
    });
  });

  const completedCount = Object.keys(progress).length;
  const progressPercent = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  // Next upcoming assignment
  const nextAssignment = assignments[0];

  return (
    <Container className="py-4 py-md-5">
      {/* Welcome Banner */}
      <div className="p-4 p-md-5 rounded-4 shadow-sm border mb-4" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <Badge bg="primary" className="px-2.5 py-1.5 fw-semibold">
                {studentBatch?.name || 'Cohort'}
              </Badge>
              <span className="text-muted small font-monospace">
                ID: {currentStudent?.id}
              </span>
            </div>
            <h2 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              Welcome back, {currentStudent?.name || 'Rahul Sharma'}!
            </h2>
            <p className="text-muted small mb-0">
              Access your modules, submit programming tasks, verify tuition, and track milestones.
            </p>
          </div>

          <div className="d-flex gap-2 align-self-start align-self-md-center">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => setShowCertificateModal(true)}
              className="d-flex align-items-center gap-1.5 shadow-sm"
            >
              <FaAward />
              <span>{progressPercent === 100 ? 'Claim Certificate' : 'Certificate Status'}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Overview Cards Row */}
      <Row className="g-3 mb-4">
        {/* Enrolled Batch */}
        <Col md={4}>
          <Card className="border-0 shadow-sm rounded-3 h-100" style={{ backgroundColor: 'var(--card-bg)' }}>
            <Card.Body className="p-3 p-md-4">
              <div className="text-uppercase small fw-bold text-muted mb-1 d-flex align-items-center gap-1.5">
                <FaGraduationCap className="text-primary" />
                <span>Enrolled Batch</span>
              </div>
              <h5 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>{studentBatch?.name}</h5>
              <div className="small text-muted font-monospace">
                Starts: {studentBatch?.startDate} • Cap: {studentBatch?.capacity}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Course Progress with Bootstrap ProgressBar */}
        <Col md={4}>
          <Card className="border-0 shadow-sm rounded-3 h-100" style={{ backgroundColor: 'var(--card-bg)' }}>
            <Card.Body className="p-3 p-md-4">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="text-uppercase small fw-bold text-muted">Course Progress</span>
                <span className="fw-bold text-success font-monospace">{progressPercent}%</span>
              </div>
              <ProgressBar
                variant="success"
                now={progressPercent}
                style={{ height: 8 }}
                className="my-2 rounded-pill"
              />
              <div className="small text-muted">
                {completedCount} of {totalTopics} syllabus topics completed
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Upcoming Deadlines */}
        <Col md={4}>
          <Card className="border-0 shadow-sm rounded-3 h-100" style={{ backgroundColor: 'var(--card-bg)' }}>
            <Card.Body className="p-3 p-md-4">
              <div className="text-uppercase small fw-bold text-muted mb-1 d-flex align-items-center gap-1.5">
                <FaClock className="text-warning" />
                <span>Next Deadline</span>
              </div>
              <h6 className="fw-bold mb-1 text-truncate" style={{ color: 'var(--text-primary)' }}>
                {nextAssignment ? nextAssignment.title : 'No upcoming tasks'}
              </h6>
              <div className="small text-muted font-monospace">
                {nextAssignment ? `Due: ${nextAssignment.deadline}` : 'All caught up!'}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Navigation Tabs for Student Sections */}
      <Nav
        variant="pills"
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4 p-2 rounded-3 shadow-sm border d-flex flex-wrap gap-1"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
      >
        <Nav.Item>
          <Nav.Link eventKey="courses" className="d-flex align-items-center gap-2 cursor-pointer">
            <FaBookOpen />
            <span>My Courses</span>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="assignments" className="d-flex align-items-center gap-2 cursor-pointer">
            <FaFileAlt />
            <span>Assignments</span>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="tests" className="d-flex align-items-center gap-2 cursor-pointer">
            <FaTasks />
            <span>Assessments</span>
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="fees" className="d-flex align-items-center gap-2 cursor-pointer">
            <FaMoneyBillWave />
            <span>Fees & Invoices</span>
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {/* Tab Content Display */}
      <div>
        {activeTab === 'courses' && <CourseViewer />}
        {activeTab === 'assignments' && <AssignmentList />}
        {activeTab === 'tests' && <TestTaker />}
        {activeTab === 'fees' && <FeeStatus />}
      </div>

      {/* Printable Certificate Modal */}
      <CertificateModal
        show={showCertificateModal}
        onHide={() => setShowCertificateModal(false)}
      />
    </Container>
  );
}
