import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, Tab, Card } from 'react-bootstrap';
import StudentManager from '../../components/admin/StudentManager';
import UserManager from '../../components/admin/UserManager';
import { FiUsers, FiUserCheck } from 'react-icons/fi';

export default function UsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'students';

  const handleSelectTab = (k) => {
    setSearchParams({ tab: k });
  };

  return (
    <div className="container-fluid px-0">

      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        <Card.Header className="bg-transparent border-bottom px-4 pt-3 pb-0">
          <Tabs
            activeKey={activeTab}
            onSelect={handleSelectTab}
            className="border-bottom-0 custom-admin-tabs"
          >
            <Tab
              eventKey="students"
              title={
                <span className="d-inline-flex align-items-center gap-2 fw-semibold py-2">
                  <FiUsers size={16} /> Students
                </span>
              }
            />
            <Tab
              eventKey="users"
              title={
                <span className="d-inline-flex align-items-center gap-2 fw-semibold py-2">
                  <FiUserCheck size={16} /> User Manager
                </span>
              }
            />
          </Tabs>
        </Card.Header>
        <Card.Body className="p-3 p-md-4">
          {activeTab === 'students' && <StudentManager />}
          {activeTab === 'users' && <UserManager />}
        </Card.Body>
      </Card>
    </div>
  );
}
