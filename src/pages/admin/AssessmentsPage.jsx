import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, Tab, Card } from 'react-bootstrap';
import TestManager from '../../components/admin/TestManager';
import TestSubmissions from '../../components/admin/TestSubmissions';
import { FiClipboard, FiCheckSquare } from 'react-icons/fi';

export default function AssessmentsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'tests';

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
              eventKey="tests"
              title={
                <span className="d-inline-flex align-items-center gap-2 fw-semibold py-2">
                  <FiClipboard size={16} /> Test Manager
                </span>
              }
            />
            <Tab
              eventKey="submissions"
              title={
                <span className="d-inline-flex align-items-center gap-2 fw-semibold py-2">
                  <FiCheckSquare size={16} /> Test Submissions
                </span>
              }
            />
          </Tabs>
        </Card.Header>
        <Card.Body className="p-3 p-md-4">
          {activeTab === 'tests' && <TestManager />}
          {activeTab === 'submissions' && <TestSubmissions />}
        </Card.Body>
      </Card>
    </div>
  );
}
