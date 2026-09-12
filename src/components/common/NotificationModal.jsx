import React, { useState } from 'react';
import { Modal, Button, Tabs, Tab, Badge } from 'react-bootstrap';
import { FaWhatsapp, FaEnvelope, FaCopy, FaCheck, FaExternalLinkAlt, FaPaperPlane } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function NotificationModal({ show, onHide, notification }) {
  const [copiedKey, setCopiedKey] = useState(null);

  if (!notification) return null;

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success('Copied to clipboard.');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleOpenWhatsApp = () => {
    if (notification.whatsappUrl) {
      window.open(notification.whatsappUrl, '_blank', 'noopener,noreferrer');
      toast.success('Opening WhatsApp Web / App...');
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="border-bottom">
        <Modal.Title className="fs-6 fw-bold d-flex align-items-center gap-2">
          <FaPaperPlane className="text-primary" />
          <span>Send Notification to {notification.recipientName}</span>
          <Badge bg="secondary" className="small fw-normal">
            {notification.type?.replace('_', ' ').toUpperCase()}
          </Badge>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        {/* Recipient summary banner */}
        <div className="p-3 mb-3 rounded-3 border d-flex justify-content-between align-items-center flex-wrap gap-2" style={{ background: 'var(--card-bg-alt, rgba(255,255,255,0.04))', borderColor: 'var(--border-color)' }}>
          <div>
            <div className="small text-muted">Recipient</div>
            <div className="fw-bold" style={{ color: 'var(--text-primary)' }}>{notification.recipientName}</div>
          </div>
          <div>
            <div className="small text-muted">Phone (WhatsApp)</div>
            <div className="fw-semibold text-success">{notification.recipientPhone || 'Not provided'}</div>
          </div>
          <div>
            <div className="small text-muted">Email</div>
            <div className="fw-semibold" style={{ color: 'var(--text-primary)' }}>{notification.recipientEmail || 'Not provided'}</div>
          </div>
        </div>

        <Tabs defaultActiveKey="whatsapp" id="notify-tabs" className="mb-3">
          {/* WhatsApp Tab */}
          <Tab
            eventKey="whatsapp"
            title={
              <span className="d-flex align-items-center gap-1.5 text-success fw-semibold">
                <FaWhatsapp /> WhatsApp Message
              </span>
            }
          >
            <div className="position-relative">
              <pre
                className="p-3 rounded-3 border mb-3"
                style={{
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '0.9rem',
                  lineHeight: 1.5,
                  maxHeight: 280,
                  overflowY: 'auto',
                  background: 'var(--card-bg-alt, rgba(255,255,255,0.04))',
                  color: 'var(--text-primary)',
                  borderColor: 'var(--border-color)'
                }}
              >
                {notification.whatsappMessage}
              </pre>

              <div className="d-flex gap-2 justify-content-end">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => handleCopy(notification.whatsappMessage, 'wa')}
                  className="d-flex align-items-center gap-1"
                >
                  {copiedKey === 'wa' ? <FaCheck className="text-success" /> : <FaCopy />}
                  <span>{copiedKey === 'wa' ? 'Copied' : 'Copy Message'}</span>
                </Button>

                <Button
                  variant="success"
                  size="sm"
                  onClick={handleOpenWhatsApp}
                  className="d-flex align-items-center gap-1.5 fw-bold"
                >
                  <FaWhatsapp />
                  <span>Send via WhatsApp</span>
                  <FaExternalLinkAlt size={11} />
                </Button>
              </div>
            </div>
          </Tab>

          {/* Email Tab */}
          <Tab
            eventKey="email"
            title={
              <span className="d-flex align-items-center gap-1.5 text-primary fw-semibold">
                <FaEnvelope /> Email Preview
              </span>
            }
          >
            <div className="mb-2">
              <label className="small text-muted fw-bold">SUBJECT LINE:</label>
              <div className="p-2 border rounded small fw-semibold" style={{ background: 'var(--card-bg-alt, rgba(255,255,255,0.04))', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}>
                {notification.emailSubject}
              </div>
            </div>

            <div className="mb-3">
              <label className="small text-muted fw-bold">MESSAGE BODY:</label>
              <pre
                className="p-3 rounded-3 border"
                style={{
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  lineHeight: 1.5,
                  maxHeight: 240,
                  overflowY: 'auto',
                  background: 'var(--card-bg-alt, rgba(255,255,255,0.04))',
                  color: 'var(--text-primary)',
                  borderColor: 'var(--border-color)'
                }}
              >
                {notification.emailBody}
              </pre>
            </div>

            <div className="d-flex gap-2 justify-content-end">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => handleCopy(notification.emailBody, 'email')}
                className="d-flex align-items-center gap-1"
              >
                {copiedKey === 'email' ? <FaCheck className="text-success" /> : <FaCopy />}
                <span>{copiedKey === 'email' ? 'Copied' : 'Copy Email Body'}</span>
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  const mailto = `mailto:${notification.recipientEmail}?subject=${encodeURIComponent(notification.emailSubject)}&body=${encodeURIComponent(notification.emailBody)}`;
                  window.location.href = mailto;
                }}
                className="d-flex align-items-center gap-1.5 fw-bold"
              >
                <FaEnvelope />
                <span>Open Mail Client</span>
                <FaExternalLinkAlt size={11} />
              </Button>
            </div>
          </Tab>
        </Tabs>
      </Modal.Body>

      <Modal.Footer className="border-top py-2">
        <Button variant="outline-secondary" size="sm" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
