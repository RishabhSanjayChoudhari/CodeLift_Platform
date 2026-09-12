import React from 'react';
import { Nav } from 'react-bootstrap';
import {
  FiLayers,
  FiUsers,
  FiCreditCard,
  FiCheckSquare,
  FiPieChart
} from 'react-icons/fi';

export default function AdminSidebar({ activeTab, onSelectTab }) {
  return (
    <div className="admin-sidebar p-3 p-md-4">
      <div className="d-flex align-items-center gap-2 mb-4 pb-2 border-bottom border-secondary border-opacity-25">
        <FiPieChart className="text-primary fs-5" />
        <span className="fw-bold text-uppercase small tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          Management
        </span>
      </div>

      <Nav className="flex-column nav-pills">
        <Nav.Item>
          <Nav.Link
            active={activeTab === 'batches'}
            onClick={() => onSelectTab('batches')}
            className="cursor-pointer"
          >
            <FiLayers />
            <span>Batches</span>
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link
            active={activeTab === 'students'}
            onClick={() => onSelectTab('students')}
            className="cursor-pointer"
          >
            <FiUsers />
            <span>Students</span>
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link
            active={activeTab === 'fees'}
            onClick={() => onSelectTab('fees')}
            className="cursor-pointer"
          >
            <FiCreditCard />
            <span>Fee Entry</span>
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link
            active={activeTab === 'grading'}
            onClick={() => onSelectTab('grading')}
            className="cursor-pointer"
          >
            <FiCheckSquare />
            <span>Assignments & Grading</span>
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
}
