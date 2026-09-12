import React, { useState } from 'react';
import { Card, Button, Row, Col, Alert, Badge, Form } from 'react-bootstrap';
import { useData } from '../../contexts/DataContext';
import {
  FaDatabase,
  FaFileDownload,
  FaFileUpload,
  FaRedoAlt,
  FaCheck,
  FaExclamationTriangle,
  FaHistory,
  FaShieldAlt
} from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function DataManager() {
  const data = useData();
  const { resetToDefaults, importAllData } = data;
  const [importJsonText, setImportJsonText] = useState('');
  const [jsonValidationErr, setJsonValidationErr] = useState('');

  // Extract pure collections for export
  const exportPayload = {
    version: 'codelift_v4',
    exportedAt: new Date().toISOString(),
    batches: data.batches,
    students: data.students,
    fees: data.fees,
    tests: data.tests,
    testAttempts: data.testAttempts,
    reviews: data.reviews,
    courses: data.courses,
    assignments: data.assignments,
    submissions: data.submissions,
    certificates: data.certificates,
    activities: data.activities
  };

  // 1. Download Backup as .json file
  const handleDownloadBackup = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
      const downloadAnchor = document.createElement('a');
      const timestamp = new Date().toISOString().slice(0, 10);
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `codelift-backup-${timestamp}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast.success('Unified backup downloaded successfully.');
    } catch (err) {
      toast.error('Failed to export JSON: ' + err.message);
    }
  };

  // 2. Handle File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        setImportJsonText(text);
        const parsed = JSON.parse(text);
        setJsonValidationErr('');
        toast.success(`Loaded "${file.name}" (${(file.size / 1024).toFixed(1)} KB)`);
      } catch (err) {
        setJsonValidationErr('Invalid JSON syntax: ' + err.message);
        toast.error('Could not parse JSON file');
      }
    };
    reader.readAsText(file);
  };

  // 3. Apply Import to State & LocalStorage
  const handleApplyImport = () => {
    try {
      if (!importJsonText.trim()) {
        toast.error('Please paste JSON or upload a file first');
        return;
      }
      const parsed = JSON.parse(importJsonText);
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Payload is not a valid JSON object');
      }

      importAllData(parsed);
      toast.success('Data restored successfully from JSON backup.');
      setImportJsonText('');
      setJsonValidationErr('');
    } catch (err) {
      setJsonValidationErr(err.message);
      toast.error('Import failed: ' + err.message);
    }
  };

  return (
    <div className="space-y-4">
      {/* Snapshot Summary Cards */}
      <Row className="g-3 mb-4">
        <Col md={3} sm={6}>
          <Card className="shadow-sm border rounded-3 p-3">
            <div className="small text-muted fw-semibold">Students Enrolled</div>
            <div className="fs-4 fw-bold text-primary">{data.students?.length || 0}</div>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="shadow-sm border rounded-3 p-3">
            <div className="small text-muted fw-semibold">Batches Active</div>
            <div className="fs-4 fw-bold text-success">{data.batches?.length || 0}</div>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="shadow-sm border rounded-3 p-3">
            <div className="small text-muted fw-semibold">Fee Ledgers</div>
            <div className="fs-4 fw-bold text-info">{data.fees?.length || 0}</div>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="shadow-sm border rounded-3 p-3">
            <div className="small text-muted fw-semibold">Certificates Issued</div>
            <div className="fs-4 fw-bold text-warning">{data.certificates?.length || 0}</div>
          </Card>
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        {/* Export Backup Card */}
        <Col lg={6}>
          <Card className="shadow-sm border rounded-3 h-100">
            <Card.Header className="bg-transparent py-3 border-bottom">
              <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                <FaFileDownload className="text-success" />
                <span>Export System Snapshot</span>
              </h6>
            </Card.Header>
            <Card.Body className="p-4 d-flex flex-column justify-content-between">
              <div>
                <p className="text-muted small">
                  Generate a complete, self-contained JSON file with all records (batches, students, fee ledgers, tests, submissions, reviews, and certificates).
                </p>
                <div className="p-3 bg-light rounded-3 border mb-3">
                  <div className="d-flex justify-content-between small py-1 border-bottom">
                    <span>Courses & Modules</span>
                    <strong className="text-dark">{data.courses?.length || 0} courses</strong>
                  </div>
                  <div className="d-flex justify-content-between small py-1 border-bottom">
                    <span>Tests & Quizzes</span>
                    <strong className="text-dark">{data.tests?.length || 0} tests</strong>
                  </div>
                  <div className="d-flex justify-content-between small py-1">
                    <span>Storage Engine</span>
                    <Badge bg="success">Local-First (localStorage v4)</Badge>
                  </div>
                </div>
              </div>

              <Button
                variant="success"
                onClick={handleDownloadBackup}
                className="w-100 d-flex align-items-center justify-content-center gap-2 py-2 fw-bold shadow-sm"
              >
                <FaFileDownload />
                <span>Download Full JSON Backup</span>
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Restore / Import Card */}
        <Col lg={6}>
          <Card className="shadow-sm border rounded-3 h-100">
            <Card.Header className="bg-transparent py-3 border-bottom">
              <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                <FaFileUpload className="text-primary" />
                <span>Restore Snapshot from JSON</span>
              </h6>
            </Card.Header>
            <Card.Body className="p-4">
              <p className="text-muted small mb-3">
                Upload a valid CodeLift JSON file or paste the JSON content directly to restore your database.
              </p>

              {jsonValidationErr && (
                <Alert variant="danger" className="py-2 small">
                  <FaExclamationTriangle className="me-2" />
                  {jsonValidationErr}
                </Alert>
              )}

              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold">Upload Backup File (.json)</Form.Label>
                <Form.Control
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  size="sm"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold">Or Paste Raw JSON</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={importJsonText}
                  onChange={(e) => {
                    setImportJsonText(e.target.value);
                    setJsonValidationErr('');
                  }}
                  placeholder='{"version":"codelift_v4","students":[...]}'
                  className="font-monospace small"
                />
              </Form.Group>

              <Button
                variant="primary"
                onClick={handleApplyImport}
                disabled={!importJsonText.trim()}
                className="w-100 d-flex align-items-center justify-content-center gap-2 py-2 fw-bold"
              >
                <FaCheck />
                <span>Verify & Restore Database</span>
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Danger Zone: Factory Reset */}
      <Card className="shadow-sm border-danger border rounded-3">
        <Card.Header className="bg-danger bg-opacity-10 py-3 border-bottom border-danger">
          <h6 className="fw-bold text-danger mb-0 d-flex align-items-center gap-2">
            <FaShieldAlt />
            <span>Factory Reset & Default Seeding</span>
          </h6>
        </Card.Header>
        <Card.Body className="p-4 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
          <div>
            <div className="fw-bold text-dark">Reset to Fresh Institute Defaults</div>
            <p className="text-muted small mb-0">
              Discards local edits and re-seeds the platform with default batches, 10 sample students, full course content, and verified test quizzes.
            </p>
          </div>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => {
              if (window.confirm('Are you sure you want to reset all data to default seeds? Any unsaved local edits will be replaced.')) {
                resetToDefaults();
                toast.success('Database reset to fresh seeds.');
              }
            }}
            className="d-flex align-items-center gap-2 flex-shrink-0"
          >
            <FaRedoAlt size={12} />
            <span>Reset to Factory Seeds</span>
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
}
