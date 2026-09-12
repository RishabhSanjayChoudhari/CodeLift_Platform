import React from 'react';
import { Row, Col, Card, Table, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import {
  FaUsers,
  FaLayerGroup,
  FaHourglassHalf,
  FaClipboardList,
  FaArrowRight,
  FaHistory
} from 'react-icons/fa';

export default function Dashboard() {
  const { students = [], batches = [], fees = [], tests = [], activities = [] } = useData();

  const totalStudents = (students || []).length;
  const activeBatches = (batches || []).filter((b) => b?.isActive).length;
  const pendingFeesCount = (fees || []).filter((f) => f?.status === 'PENDING').length;
  const totalTests = (tests || []).length;
  const activityList = Array.isArray(activities) ? activities : [];

  return (
    <div>
      {/* 4 KPI Cards */}
      <Row className="g-3 mb-3">
        <Col sm={6} lg={3}>
          <Card className="border shadow-sm rounded-3">
            <Card.Body className="p-3 p-md-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-uppercase small fw-bold text-muted">Total Students</div>
                  <div className="fs-2 fw-bold my-1" style={{ color: 'var(--text-primary, #171717)' }}>
                    {totalStudents}
                  </div>
                  <div className="small text-muted">Across all cohorts</div>
                </div>
                <div
                  className="rounded-3 p-3 d-flex align-items-center justify-content-center"
                  style={{ backgroundColor: 'rgba(var(--bs-primary-rgb), 0.1)', color: 'var(--bs-primary)' }}
                >
                  <FaUsers size={24} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col sm={6} lg={3}>
          <Card className="border shadow-sm rounded-3">
            <Card.Body className="p-3 p-md-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-uppercase small fw-bold text-muted">Active Batches</div>
                  <div className="fs-2 fw-bold my-1" style={{ color: 'var(--text-primary, #171717)' }}>
                    {activeBatches}
                  </div>
                  <div className="small text-muted">{(batches || []).length} total cohorts</div>
                </div>
                <div
                  className="rounded-3 p-3 d-flex align-items-center justify-content-center"
                  style={{ backgroundColor: 'rgba(var(--bs-primary-rgb), 0.1)', color: 'var(--bs-primary)' }}
                >
                  <FaLayerGroup size={24} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col sm={6} lg={3}>
          <Card className="border shadow-sm rounded-3">
            <Card.Body className="p-3 p-md-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-uppercase small fw-bold text-muted">Pending Fees</div>
                  <div className="fs-2 fw-bold text-warning my-1 font-monospace">
                    {pendingFeesCount}
                  </div>
                  <div className="small text-muted">Unreconciled invoices</div>
                </div>
                <div
                  className="rounded-3 p-3 d-flex align-items-center justify-content-center bg-warning bg-opacity-10 text-warning"
                >
                  <FaHourglassHalf size={24} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col sm={6} lg={3}>
          <Card className="border shadow-sm rounded-3">
            <Card.Body className="p-3 p-md-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-uppercase small fw-bold text-muted">Total Tests</div>
                  <div className="fs-2 fw-bold my-1" style={{ color: 'var(--text-primary, #171717)' }}>
                    {totalTests}
                  </div>
                  <div className="small text-muted">Assessments published</div>
                </div>
                <div
                  className="rounded-3 p-3 d-flex align-items-center justify-content-center"
                  style={{ backgroundColor: 'rgba(var(--bs-primary-rgb), 0.1)', color: 'var(--bs-primary)' }}
                >
                  <FaClipboardList size={24} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Action Buttons */}
      <Row className="g-3 mb-4">
        <Col md={4}>
          <Card className="border shadow-sm rounded-3 p-3 d-flex flex-row align-items-center justify-content-between">
            <div>
              <h6 className="fw-bold mb-0">Student Directory</h6>
              <span className="small text-muted">Add, search, and assign students</span>
            </div>
            <Button as={Link} to="/admin/students" variant="outline-primary" size="sm">
              <FaArrowRight />
            </Button>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="border shadow-sm rounded-3 p-3 d-flex flex-row align-items-center justify-content-between">
            <div>
              <h6 className="fw-bold mb-0">Fee Collection</h6>
              <span className="small text-muted">Record payments and reconcile</span>
            </div>
            <Button as={Link} to="/admin/fees" variant="outline-primary" size="sm">
              <FaArrowRight />
            </Button>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="border shadow-sm rounded-3 p-3 d-flex flex-row align-items-center justify-content-between">
            <div>
              <h6 className="fw-bold mb-0">Test Builder</h6>
              <span className="small text-muted">Build MCQs and publish quizzes</span>
            </div>
            <Button as={Link} to="/admin/tests" variant="outline-primary" size="sm">
              <FaArrowRight />
            </Button>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity Table */}
      <Card className="border shadow-sm rounded-3">
        <Card.Header className="bg-transparent py-3 border-bottom d-flex justify-content-between align-items-center" style={{ borderColor: 'var(--border-color, #e5e7eb)' }}>
          <h6 className="fw-bold mb-0 d-flex align-items-center gap-2" style={{ color: 'var(--text-primary, #171717)' }}>
            <FaHistory className="brand-text" />
            <span>Recent System Activity</span>
          </h6>
          <span
            className="badge rounded-pill px-2.5 py-1.5 small border"
            style={{
              backgroundColor: 'var(--bg-body, #F8FAFC)',
              color: 'var(--text-secondary, #64748b)',
              borderColor: 'var(--border-color, #e5e7eb)'
            }}
          >
            Last {activityList.length} Actions
          </span>
        </Card.Header>

        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle" style={{ color: 'var(--text-primary)' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color, #e5e7eb)' }}>
                  <th
                    style={{
                      width: '70%',
                      backgroundColor: 'var(--bg-body, #F8FAFC)',
                      color: 'var(--text-secondary, #64748b)',
                      borderColor: 'var(--border-color, #e5e7eb)'
                    }}
                  >
                    Action Description
                  </th>
                  <th
                    className="text-end"
                    style={{
                      backgroundColor: 'var(--bg-body, #F8FAFC)',
                      color: 'var(--text-secondary, #64748b)',
                      borderColor: 'var(--border-color, #e5e7eb)'
                    }}
                  >
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody>
                {activityList.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="text-center py-4 small" style={{ color: 'var(--text-secondary)' }}>
                      No recent activities recorded yet.
                    </td>
                  </tr>
                ) : (
                  activityList.map((act) => (
                    <tr key={act.id} style={{ borderColor: 'var(--border-color, #e5e7eb)' }}>
                      <td style={{ borderColor: 'var(--border-color, #e5e7eb)', color: 'var(--text-primary)' }}>
                        <div className="d-flex align-items-center gap-2">
                          <span
                            className="rounded-circle d-inline-block flex-shrink-0"
                            style={{ width: 8, height: 8, backgroundColor: 'var(--bs-primary)' }}
                          />
                          <span className="small fw-medium" style={{ color: 'var(--text-primary)' }}>
                            {act.message || act.text || '—'}
                          </span>
                        </div>
                      </td>
                      <td className="text-end small font-monospace" style={{ borderColor: 'var(--border-color, #e5e7eb)', color: 'var(--text-secondary)' }}>
                        {act.createdAt ? new Date(act.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : (act.timestamp || '—')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
