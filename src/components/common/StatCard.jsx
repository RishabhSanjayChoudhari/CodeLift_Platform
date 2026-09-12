import React from 'react';
import { Card } from 'react-bootstrap';

export default function StatCard({ title, value, subtitle, variant = 'primary', icon: Icon }) {
  return (
    <Card className={`border-0 shadow-sm text-white bg-${variant} rounded-3`}>
      <Card.Body className="p-3 p-md-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <div className="text-uppercase small fw-bold opacity-75">{title}</div>
            <div className="fs-2 fw-bold my-1">{value}</div>
            {subtitle && <div className="small opacity-75">{subtitle}</div>}
          </div>
          {Icon && (
            <div className="bg-white bg-opacity-25 rounded-3 p-3 d-flex align-items-center justify-content-center">
              <Icon size={24} />
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}
