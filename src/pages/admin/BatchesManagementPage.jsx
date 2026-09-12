import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, Tab, Card } from 'react-bootstrap';
import BatchManager from '../../components/admin/BatchManager';
import CompletedBatches from '../../components/admin/CompletedBatches';
import { FiLayers, FiCheckCircle } from 'react-icons/fi';

export default function BatchesManagementPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'batches';

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
              eventKey="batches"
              title={
                <span className="d-inline-flex align-items-center gap-2 fw-semibold py-2">
                  <FiLayers size={16} /> Active Batches
                </span>
              }
            />
            <Tab
              eventKey="completed"
              title={
                <span className="d-inline-flex align-items-center gap-2 fw-semibold py-2">
                  <FiCheckCircle size={16} /> Completed Batches
                </span>
              }
            />
          </Tabs>
        </Card.Header>
        <Card.Body className="p-3 p-md-4">
          {activeTab === 'batches' && <BatchManager />}
          {activeTab === 'completed' && <CompletedBatches />}
        </Card.Body>
      </Card>
    </div>
  );
}
