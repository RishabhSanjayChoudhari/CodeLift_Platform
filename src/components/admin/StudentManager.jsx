import React, { useState } from 'react';
import { Table, Button, Badge, Modal, Form, Card, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useData } from '../../contexts/DataContext';
import {
  FaUserPlus,
  FaEdit,
  FaUserSlash,
  FaUserCheck,
  FaFilter,
  FaSearch,
  FaUsers,
  FaKey,
  FaRupeeSign
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { supabase } from '../../services/supabaseClient';

// Zod schema for student form validation
const studentSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please provide a valid email address'),
  phone: z.string().min(8, 'Phone number must be at least 8 digits'),
  batchId: z.string().min(1, 'Please select a batch')
});

export default function StudentManager() {
  const { students = [], batches = [], addStudent, updateStudent, toggleStudentActive, addFee } = useData();

  const [selectedBatchFilter, setSelectedBatchFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [feeModalStudent, setFeeModalStudent] = useState(null);
  const [quickFeeAmount, setQuickFeeAmount] = useState('15000');
  const [quickFeeMode, setQuickFeeMode] = useState('UPI');
  const [quickFeeStatus, setQuickFeeStatus] = useState('PAID');

  // Password Reset Modal State
  const [resetPasswordStudent, setResetPasswordStudent] = useState(null);
  const [isSendingReset, setIsSendingReset] = useState(false);

  const handleConfirmResetPassword = async () => {
    if (!resetPasswordStudent?.email) {
      toast.error('Student does not have a valid email address.');
      return;
    }

    setIsSendingReset(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetPasswordStudent.email, {
        redirectTo: `${window.location.origin}/login`
      });
      if (error) throw error;
      toast.success(`Password reset instructions sent to ${resetPasswordStudent.email}.`);
      setResetPasswordStudent(null);
    } catch (err) {
      toast.error(err.message || 'Failed to send password reset email.');
    } finally {
      setIsSendingReset(false);
    }
  };

  const studentList = Array.isArray(students) ? students : [];
  const batchList = Array.isArray(batches) ? batches : [];

  // Form for Adding Student
  const {
    register: registerAdd,
    handleSubmit: handleAddSubmit,
    reset: resetAdd,
    formState: { errors: addErrors }
  } = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      batchId: batchList[0]?.id || ''
    }
  });

  // Form for Editing Student
  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    setValue: setEditValue,
    formState: { errors: editErrors }
  } = useForm({
    resolver: zodResolver(studentSchema)
  });

  const onAddSubmit = (data) => {
    addStudent(data);
    resetAdd();
    setShowAddModal(false);
  };

  const onStartEdit = (student) => {
    setEditingStudent(student);
    setEditValue('name', student.name);
    setEditValue('email', student.email);
    setEditValue('phone', student.phone || '');
    setEditValue('batchId', student.batchId);
  };

  const onEditSubmit = (data) => {
    if (editingStudent) {
      updateStudent(editingStudent.id, {
        name: data.name,
        phone: data.phone,
        batchId: data.batchId
      });
      setEditingStudent(null);
    }
  };

  // Filter students based on batch selection and search term
  const filteredStudents = studentList.filter((s) => {
    if (!s) return false;
    const matchesBatch = selectedBatchFilter === 'ALL' || s.batchId === selectedBatchFilter;
    const nameStr = s.name || '';
    const emailStr = s.email || '';
    const phoneStr = s.phone || '';
    const matchesSearch =
      nameStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emailStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phoneStr.includes(searchTerm);
    return matchesBatch && matchesSearch;
  });

  return (
    <div>
      {/* Header Bar */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1 d-flex align-items-center gap-2" style={{ color: 'var(--text-primary, #171717)' }}>
            <FaUsers className="brand-text" />
            <span>Student Management</span>
          </h4>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            resetAdd({
              name: '',
              email: '',
              phone: '',
              batchId: batchList[0]?.id || ''
            });
            setShowAddModal(true);
          }}
          className="d-flex align-items-center gap-2 align-self-start align-self-sm-auto shadow-sm"
        >
          <FaUserPlus size={14} />
          <span>Add New Student</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="shadow-sm border mb-4 rounded-3">
        <Card.Body className="p-3">
          <div className="row g-3 align-items-center">
            {/* Filter by Batch Dropdown */}
            <div className="col-md-5 col-lg-4">
              <Form.Group className="d-flex align-items-center gap-2">
                <Form.Label className="small fw-semibold text-nowrap mb-0 d-flex align-items-center gap-1 text-muted">
                  <FaFilter size={12} />
                  <span>Batch:</span>
                </Form.Label>
                <Form.Select
                  size="sm"
                  value={selectedBatchFilter}
                  onChange={(e) => setSelectedBatchFilter(e.target.value)}
                  className="rounded-2"
                >
                  <option value="ALL">All Batches ({studentList.length} students)</option>
                  {batchList.map((b) => {
                    const count = studentList.filter((s) => s.batchId === b.id).length;
                    return (
                      <option key={b.id} value={b.id}>
                        {b.name} ({count})
                      </option>
                    );
                  })}
                </Form.Select>
              </Form.Group>
            </div>

            {/* Search Input */}
            <div className="col-md-7 col-lg-5 ms-auto">
              <InputGroup size="sm">
                <InputGroup.Text className="bg-light text-muted border-end-0">
                  <FaSearch size={12} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search student by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-start-0"
                />
              </InputGroup>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Students Table */}
      <Card className="shadow-sm border rounded-3">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover striped className="mb-0 align-middle">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Email & Phone</th>
                  <th>Assigned Batch</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-5 text-muted">
                      No students found matching current filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((std) => {
                    const batch = batchList.find((b) => b.id === std.batchId);

                    return (
                      <tr key={std.id}>
                        <td>
                          <div className="fw-semibold" style={{ color: 'var(--text-primary, #171717)' }}>
                            {std.name}
                          </div>
                          <div className="text-muted font-monospace" style={{ fontSize: '0.75rem' }}>
                            ID: {std.id}
                          </div>
                        </td>
                        <td>
                          <div className="small" style={{ color: 'var(--text-primary, #171717)' }}>{std.email}</div>
                          <div className="small text-muted">{std.phone || 'No phone'}</div>
                        </td>
                        <td>
                          <Badge className="badge-theme px-2 py-1 fw-semibold">
                            {batch ? batch.name : std.batchId}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg={std.isActive !== false ? 'success' : 'danger'}>
                            {std.isActive !== false ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="text-end">
                          <div className="d-inline-flex gap-1.5 align-items-center">
                            <OverlayTrigger overlay={<Tooltip>Record tuition fee payment</Tooltip>}>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="d-inline-flex align-items-center justify-content-center rounded-2 p-1.5"
                                style={{ width: 32, height: 32 }}
                                onClick={() => {
                                  setFeeModalStudent(std);
                                  const batch = batchList.find((b) => b.id === std.batchId);
                                  const total = Number(std.totalFee) || batch?.feeAmount || 45000;
                                  const paid = Number(std.paidFee) || 0;
                                  const pending = Math.max(0, total - paid);
                                  setQuickFeeAmount(pending > 0 ? String(pending) : '15000');
                                  setQuickFeeStatus('PAID');
                                  setQuickFeeMode('UPI');
                                }}
                                aria-label="Record tuition fee payment"
                              >
                                <FaRupeeSign size={11} />
                              </Button>
                            </OverlayTrigger>

                            <OverlayTrigger overlay={<Tooltip>Edit student profile and batch</Tooltip>}>
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                className="d-inline-flex align-items-center justify-content-center rounded-2 p-1.5"
                                style={{ width: 32, height: 32 }}
                                onClick={() => onStartEdit(std)}
                                aria-label="Edit student"
                              >
                                <FaEdit size={12} />
                              </Button>
                            </OverlayTrigger>

                            <OverlayTrigger overlay={<Tooltip>Send Password Reset Link via Email</Tooltip>}>
                              <Button
                                variant="outline-warning"
                                size="sm"
                                className="d-inline-flex align-items-center justify-content-center rounded-2 p-1.5"
                                style={{ width: 32, height: 32 }}
                                onClick={() => setResetPasswordStudent(std)}
                                aria-label="Reset password"
                              >
                                <FaKey size={12} />
                              </Button>
                            </OverlayTrigger>

                            <OverlayTrigger overlay={<Tooltip>{std.isActive !== false ? 'Suspend student access' : 'Activate student account'}</Tooltip>}>
                              <Button
                                variant={std.isActive !== false ? 'outline-danger' : 'outline-success'}
                                size="sm"
                                className="d-inline-flex align-items-center justify-content-center rounded-2 p-1.5"
                                style={{ width: 32, height: 32 }}
                                onClick={() => toggleStudentActive(std.id)}
                                aria-label={std.isActive !== false ? 'Deactivate student' : 'Activate student'}
                              >
                                {std.isActive !== false ? <FaUserSlash size={12} /> : <FaUserCheck size={12} />}
                              </Button>
                            </OverlayTrigger>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Add Student Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fs-5 fw-bold">Enroll New Student</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddSubmit(onAddSubmit)}>
          <Modal.Body className="space-y-3">
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. Sumanth Kumar"
                {...registerAdd('name')}
                isInvalid={!!addErrors.name}
              />
              <Form.Control.Feedback type="invalid">
                {addErrors.name?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="student@example.com"
                {...registerAdd('email')}
                isInvalid={!!addErrors.email}
              />
              <Form.Control.Feedback type="invalid">
                {addErrors.email?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Phone Number</Form.Label>
              <Form.Control
                type="tel"
                placeholder="+91 98765 43210"
                {...registerAdd('phone')}
                isInvalid={!!addErrors.phone}
              />
              <Form.Control.Feedback type="invalid">
                {addErrors.phone?.message}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Mandatory Form.Select populated with existing Batches */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Select Batch (Mandatory)</Form.Label>
              <Form.Select
                {...registerAdd('batchId')}
                isInvalid={!!addErrors.batchId}
              >
                {batchList.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} (Fee: ₹{(b.feeAmount || 0).toLocaleString()})
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {addErrors.batchId?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" size="sm" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Enroll Student
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit Student Modal */}
      <Modal show={Boolean(editingStudent)} onHide={() => setEditingStudent(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fs-5 fw-bold">Edit Student Details</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditSubmit(onEditSubmit)}>
          <Modal.Body className="space-y-3">
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Full Name</Form.Label>
              <Form.Control
                type="text"
                {...registerEdit('name')}
                isInvalid={!!editErrors.name}
              />
              <Form.Control.Feedback type="invalid">
                {editErrors.name?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Email Address (Read only)</Form.Label>
              <Form.Control
                type="email"
                disabled
                {...registerEdit('email')}
                className="bg-light"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Phone Number</Form.Label>
              <Form.Control
                type="tel"
                {...registerEdit('phone')}
                isInvalid={!!editErrors.phone}
              />
              <Form.Control.Feedback type="invalid">
                {editErrors.phone?.message}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Reassign Batch */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Reassign Batch</Form.Label>
              <Form.Select
                {...registerEdit('batchId')}
                isInvalid={!!editErrors.batchId}
              >
                {batchList.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} (Fee: ₹{(b.feeAmount || 0).toLocaleString()})
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {editErrors.batchId?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" size="sm" onClick={() => setEditingStudent(null)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Quick Record Fee Modal */}
      <Modal show={Boolean(feeModalStudent)} onHide={() => setFeeModalStudent(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fs-5 fw-bold d-flex align-items-center gap-2">
            <FaRupeeSign className="text-primary" />
            <span>Record Fee: {feeModalStudent?.name}</span>
          </Modal.Title>
        </Modal.Header>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            if (feeModalStudent && Number(quickFeeAmount) > 0) {
              addFee({
                studentId: feeModalStudent.id,
                amount: Number(quickFeeAmount),
                mode: quickFeeMode,
                status: quickFeeStatus,
                paidAt: new Date().toISOString().split('T')[0],
                receiptNo: `REC-${Date.now().toString().slice(-6)}`
              });
              setFeeModalStudent(null);
            }
          }}
        >
          <Modal.Body className="space-y-3">
            <div className="p-3 bg-light rounded-3 mb-3 small border">
              <div><strong>Student:</strong> {feeModalStudent?.name} ({feeModalStudent?.email})</div>
              <div><strong>Batch:</strong> {batchList.find((b) => b.id === feeModalStudent?.batchId)?.name || 'Cohort'}</div>
              <div className="mt-1">
                <span>Total Fee: <strong>₹{Number(feeModalStudent?.totalFee || 45000).toLocaleString()}</strong></span>
                <span className="ms-3">Paid: <strong className="text-success">₹{Number(feeModalStudent?.paidFee || 0).toLocaleString()}</strong></span>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Payment Amount (₹) *</Form.Label>
              <Form.Control
                type="number"
                min="1"
                required
                value={quickFeeAmount}
                onChange={(e) => setQuickFeeAmount(e.target.value)}
              />
            </Form.Group>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <Form.Label className="fw-semibold small">Tuition Status</Form.Label>
                <Form.Select
                  value={quickFeeStatus}
                  onChange={(e) => setQuickFeeStatus(e.target.value)}
                >
                  <option value="PAID">PAID</option>
                  <option value="PENDING">PENDING</option>
                </Form.Select>
              </div>

              <div className="col-md-6">
                <Form.Label className="fw-semibold small">Payment Mode</Form.Label>
                <Form.Select
                  value={quickFeeMode}
                  onChange={(e) => setQuickFeeMode(e.target.value)}
                >
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Cheque">Cheque</option>
                </Form.Select>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" size="sm" onClick={() => setFeeModalStudent(null)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Payment
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Reset Password Confirmation Modal */}
      <Modal show={Boolean(resetPasswordStudent)} onHide={() => setResetPasswordStudent(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fs-5 fw-bold d-flex align-items-center gap-2">
            <FaKey className="text-warning" />
            <span>Reset Student Password</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-2">
            Are you sure you want to send an official password reset link to:
          </p>
          <div className="p-3 rounded-3 border bg-light mb-3">
            <div className="fw-bold">{resetPasswordStudent?.name}</div>
            <div className="text-muted small">{resetPasswordStudent?.email}</div>
          </div>
          <p className="text-muted small mb-0">
            A secure link will be sent to their email via Supabase Auth, allowing the student to reset their password safely.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={() => setResetPasswordStudent(null)}>
            Cancel
          </Button>
          <Button
            variant="warning"
            size="sm"
            disabled={isSendingReset}
            onClick={handleConfirmResetPassword}
            className="fw-semibold px-3"
          >
            {isSendingReset ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
