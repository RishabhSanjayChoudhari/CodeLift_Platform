import React, { useState } from 'react';
import { Card, Table, Button, Badge, Modal, Form, Row, Col, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useData } from '../../contexts/DataContext';
import toast from 'react-hot-toast';
import {
  FaUsersCog,
  FaUserShield,
  FaUserGraduate,
  FaUserPlus,
  FaUserCheck,
  FaUserSlash,
  FaSearch,
  FaFilter,
  FaEnvelope,
  FaCalendarAlt
} from 'react-icons/fa';

export default function UserManager() {
  const { users = [], addUser, updateUser } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State for new user
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('student');

  const toggleUserStatus = (userId, currentActive) => {
    updateUser(userId, { isActive: !currentActive });
    toast.success(`User account ${!currentActive ? 'activated' : 'suspended'}.`, { duration: 3000 });
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      toast.error('Please provide name and email.', { duration: 3000 });
      return;
    }

    // Check email uniqueness
    if (users.some((u) => u.email.toLowerCase() === newEmail.trim().toLowerCase())) {
      toast.error('A user with this email already exists.', { duration: 3000 });
      return;
    }

    addUser({
      name: newName.trim(),
      email: newEmail.trim().toLowerCase(),
      role: newRole,
      isActive: true
    });

    toast.success(`User ${newName.trim()} created successfully.`, { duration: 3000 });
    setNewName('');
    setNewEmail('');
    setNewRole('student');
    setShowAddModal(false);
  };

  // Metrics
  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const studentCount = users.filter((u) => u.role === 'student').length;
  const activeCount = users.filter((u) => u.isActive !== false).length;

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      roleFilter === 'ALL' ? true : u.role?.toLowerCase() === roleFilter.toLowerCase();

    const matchesStatus =
      statusFilter === 'ALL'
        ? true
        : statusFilter === 'ACTIVE'
        ? u.isActive !== false
        : u.isActive === false;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1 d-flex align-items-center gap-2" style={{ color: 'var(--text-primary, #171717)' }}>
            <FaUsersCog className="brand-text text-primary" />
            <span>User & Access Management</span>
          </h4>
          <p className="text-muted small mb-0">
            Control platform administrators, registered learners, access permissions, and account statuses.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowAddModal(true)}
          className="d-flex align-items-center gap-2 align-self-start align-self-sm-auto shadow-sm"
        >
          <FaUserPlus size={14} />
          <span>Add New User</span>
        </Button>
      </div>

      {/* KPI Cards */}
      <Row className="g-3 mb-4">
        <Col sm={6} lg={3}>
          <Card className="border shadow-sm rounded-3">
            <Card.Body className="p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-uppercase small fw-bold text-muted">Total Accounts</div>
                  <div className="fs-3 fw-bold my-1 font-monospace" style={{ color: 'var(--text-primary, #171717)' }}>
                    {totalUsers}
                  </div>
                  <div className="small text-muted">Registered platform-wide</div>
                </div>
                <div
                  className="rounded-3 p-3 d-flex align-items-center justify-content-center"
                  style={{ backgroundColor: 'rgba(var(--bs-primary-rgb), 0.1)', color: 'var(--bs-primary)' }}
                >
                  <FaUsersCog size={22} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col sm={6} lg={3}>
          <Card className="border shadow-sm rounded-3">
            <Card.Body className="p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-uppercase small fw-bold text-muted">Admins</div>
                  <div className="fs-3 fw-bold text-danger my-1 font-monospace">
                    {adminCount}
                  </div>
                  <div className="small text-muted">Full administrative rights</div>
                </div>
                <div className="rounded-3 p-3 d-flex align-items-center justify-content-center bg-danger bg-opacity-10 text-danger">
                  <FaUserShield size={22} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col sm={6} lg={3}>
          <Card className="border shadow-sm rounded-3">
            <Card.Body className="p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-uppercase small fw-bold text-muted">Students</div>
                  <div className="fs-3 fw-bold text-primary my-1 font-monospace">
                    {studentCount}
                  </div>
                  <div className="small text-muted">Enrolled learners</div>
                </div>
                <div className="rounded-3 p-3 d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary">
                  <FaUserGraduate size={22} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col sm={6} lg={3}>
          <Card className="border shadow-sm rounded-3">
            <Card.Body className="p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-uppercase small fw-bold text-muted">Active Users</div>
                  <div className="fs-3 fw-bold text-success my-1 font-monospace">
                    {activeCount}
                  </div>
                  <div className="small text-muted">Enabled login status</div>
                </div>
                <div className="rounded-3 p-3 d-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success">
                  <FaUserCheck size={22} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filter and Search Bar */}
      <Card className="shadow-sm border rounded-3 mb-4">
        <Card.Body className="p-3">
          <Row className="g-3 align-items-center">
            <Col md={5} lg={6}>
              <InputGroup>
                <InputGroup.Text className="bg-transparent border-end-0">
                  <FaSearch className="text-muted" size={13} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search users by name or email address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-start-0 ps-0"
                />
              </InputGroup>
            </Col>

            <Col md={7} lg={6}>
              <div className="d-flex flex-wrap align-items-center justify-content-md-end gap-2">
                <div className="d-flex align-items-center gap-1.5">
                  <span className="small text-muted me-1">Role:</span>
                  <div className="btn-group btn-group-sm">
                    {['ALL', 'admin', 'student'].map((r) => (
                      <Button
                        key={r}
                        variant={roleFilter === r ? 'primary' : 'outline-secondary'}
                        onClick={() => setRoleFilter(r)}
                        className="text-capitalize"
                      >
                        {r === 'ALL' ? 'All Roles' : r}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="d-flex align-items-center gap-1.5">
                  <span className="small text-muted me-1">Status:</span>
                  <div className="btn-group btn-group-sm">
                    {['ALL', 'ACTIVE', 'SUSPENDED'].map((s) => (
                      <Button
                        key={s}
                        variant={statusFilter === s ? 'dark' : 'outline-secondary'}
                        onClick={() => setStatusFilter(s)}
                        className="text-capitalize"
                      >
                        {s === 'ALL' ? 'All' : s.toLowerCase()}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Users Table */}
      <Card className="shadow-sm border rounded-3">
        <Card.Header className="bg-transparent py-3 border-bottom d-flex justify-content-between align-items-center" style={{ borderColor: 'var(--border-color, #e5e7eb)' }}>
          <div className="fw-bold d-flex align-items-center gap-2" style={{ color: 'var(--text-primary, #171717)' }}>
            <span>Directory ({filteredUsers.length})</span>
            {roleFilter !== 'ALL' && (
              <Badge bg="primary" className="text-uppercase">
                {roleFilter}
              </Badge>
            )}
            {statusFilter !== 'ALL' && (
              <Badge bg={statusFilter === 'ACTIVE' ? 'success' : 'warning'} className="text-uppercase">
                {statusFilter}
              </Badge>
            )}
          </div>
        </Card.Header>

        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover striped className="mb-0 align-middle">
              <thead>
                <tr>
                  <th>User Profile</th>
                  <th>Contact Email</th>
                  <th>Role</th>
                  <th>Joined Date</th>
                  <th>Account Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-5 text-muted">
                      No users match the specified criteria.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isActive = u.isActive !== false;
                    const isAdmin = u.role === 'admin';

                    return (
                      <tr key={u.id}>
                        <td>
                          <div className="d-flex align-items-center gap-2.5">
                            <div
                              className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
                              style={{
                                width: '36px',
                                height: '36px',
                                fontSize: '0.85rem',
                                background: isAdmin
                                  ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
                                  : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
                              }}
                            >
                              {u.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div>
                              <div className="fw-semibold" style={{ color: 'var(--text-primary, #171717)' }}>
                                {u.name}
                              </div>
                              <div className="small text-muted font-monospace" style={{ fontSize: '0.75rem' }}>
                                ID: {u.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-1.5 text-muted small">
                            <FaEnvelope size={11} />
                            <span>{u.email}</span>
                          </div>
                        </td>
                        <td>
                          <Badge
                            bg={isAdmin ? 'danger' : 'primary'}
                            className="text-uppercase px-2.5 py-1"
                          >
                            {u.role || 'student'}
                          </Badge>
                        </td>
                        <td className="small text-muted">
                          <div className="d-flex align-items-center gap-1.5">
                            <FaCalendarAlt size={11} />
                            <span>{u.joinedAt ? new Date(u.joinedAt).toLocaleDateString() : 'Active Member'}</span>
                          </div>
                        </td>
                        <td>
                          <Badge
                            bg={isActive ? 'success' : 'warning'}
                            text={isActive ? 'white' : 'dark'}
                            className="px-2.5 py-1"
                          >
                            {isActive ? 'Active' : 'Suspended'}
                          </Badge>
                        </td>
                        <td className="text-end">
                          <OverlayTrigger
                            overlay={
                              <Tooltip>
                                {isActive ? 'Suspend account access' : 'Restore active access'}
                              </Tooltip>
                            }
                          >
                            <Button
                              variant={isActive ? 'outline-danger' : 'outline-success'}
                              size="sm"
                              className="d-inline-flex align-items-center justify-content-center rounded-2 p-1.5"
                              style={{ width: 32, height: 32 }}
                              onClick={() => toggleUserStatus(u.id, isActive)}
                              aria-label={isActive ? 'Suspend account access' : 'Restore active access'}
                            >
                              {isActive ? <FaUserSlash size={13} /> : <FaUserCheck size={13} />}
                            </Button>
                          </OverlayTrigger>
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

      {/* Add User Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fs-5 fw-bold d-flex align-items-center gap-2">
            <FaUserPlus className="text-primary" />
            <span>Create New User Account</span>
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateUser}>
          <Modal.Body className="space-y-3">
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. Aditi Sharma"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="name@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Account Role</Form.Label>
              <Form.Select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
              >
                <option value="student">Student (Learner Access)</option>
                <option value="admin">Admin (Full Management Rights)</option>
              </Form.Select>
              <Form.Text className="text-muted small">
                Choose Student for enrolled learners or Admin for platform managers.
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" size="sm" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Create Account
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
