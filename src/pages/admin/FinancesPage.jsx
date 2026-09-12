import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, Tab, Card } from 'react-bootstrap';
import FeeManager from '../../components/admin/FeeManager';
import PaymentQueue from '../../components/admin/PaymentQueue';
import RevenueReports from '../../components/admin/RevenueReports';
import { FiDollarSign, FiClock, FiTrendingUp } from 'react-icons/fi';

export default function FinancesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'fees';

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
              eventKey="fees"
              title={
                <span className="d-inline-flex align-items-center gap-2 fw-semibold py-2">
                  <FiDollarSign size={16} /> Fee Manager
                </span>
              }
            />
            <Tab
              eventKey="payments"
              title={
                <span className="d-inline-flex align-items-center gap-2 fw-semibold py-2">
                  <FiClock size={16} /> Payment Queue
                </span>
              }
            />
            <Tab
              eventKey="reports"
              title={
                <span className="d-inline-flex align-items-center gap-2 fw-semibold py-2">
                  <FiTrendingUp size={16} /> Revenue Reports
                </span>
              }
            />
          </Tabs>
        </Card.Header>
        <Card.Body className="p-3 p-md-4">
          {activeTab === 'fees' && <FeeManager />}
          {activeTab === 'payments' && <PaymentQueue />}
          {activeTab === 'reports' && <RevenueReports />}
        </Card.Body>
      </Card>
    </div>
  );
}
