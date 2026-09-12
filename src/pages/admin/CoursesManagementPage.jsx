import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, Tab, Card } from 'react-bootstrap';
import CourseManager from '../../components/admin/CourseManager';
import GradingPanel from '../../components/admin/GradingPanel';
import CertificateDesigner from '../../components/admin/CertificateDesigner';
import { FiBook, FiClipboard, FiAward } from 'react-icons/fi';

export default function CoursesManagementPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'courses';

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
              eventKey="courses"
              title={
                <span className="d-inline-flex align-items-center gap-2 fw-semibold py-2">
                  <FiBook size={16} /> Courses
                </span>
              }
            />
            <Tab
              eventKey="assignments"
              title={
                <span className="d-inline-flex align-items-center gap-2 fw-semibold py-2">
                  <FiClipboard size={16} /> Assignments & Grading
                </span>
              }
            />
            <Tab
              eventKey="certificates"
              title={
                <span className="d-inline-flex align-items-center gap-2 fw-semibold py-2">
                  <FiAward size={16} /> Certificates
                </span>
              }
            />
          </Tabs>
        </Card.Header>
        <Card.Body className="p-3 p-md-4">
          {activeTab === 'courses' && <CourseManager />}
          {activeTab === 'assignments' && <GradingPanel />}
          {activeTab === 'certificates' && <CertificateDesigner />}
        </Card.Body>
      </Card>
    </div>
  );
}
