import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Badge, Modal, Form, Alert } from 'react-bootstrap';
import {
  FaBug,
  FaTrashAlt,
  FaSync,
  FaSearch,
  FaFileDownload,
  FaChevronDown,
  FaChevronUp,
  FaExclamationTriangle,
  FaShieldAlt,
  FaClock,
  FaCheck
} from 'react-icons/fa';
import { fetchErrorLogs, clearErrorLogs, deleteErrorLog } from '../../services/loggerService';
import toast from 'react-hot-toast';

export default function ErrorLogsManager() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [expandedLogId, setExpandedLogId] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await fetchErrorLogs();
      setLogs(data || []);
    } catch (err) {
      toast.error('Failed to load error logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleClearAll = async () => {
    setIsClearing(true);
    try {
      await clearErrorLogs();
      setLogs([]);
      setShowClearConfirm(false);
      toast.success('All error logs cleared successfully');
    } catch (err) {
      toast.error('Failed to clear error logs');
    } finally {
      setIsClearing(false);
    }
  };

  const handleDeleteSingle = async (id, e) => {
    e.stopPropagation();
    try {
      await deleteErrorLog(id);
      setLogs(prev => prev.filter(l => l.id !== id));
      toast.success('Log entry deleted');
    } catch {
      toast.error('Could not delete log');
    }
  };

  const handleExportJson = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
      const anchor = document.createElement('a');
      anchor.setAttribute('href', dataStr);
      anchor.setAttribute('download', `codelift-error-logs-${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      toast.success('Error logs exported');
    } catch (err) {
      toast.error('Export failed: ' + err.message);
    }
  };

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      if (levelFilter !== 'ALL' && log.level?.toLowerCase() !== levelFilter.toLowerCase()) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const msg = (log.message || '').toLowerCase();
        const stack = (log.stack || '').toLowerCase();
        const url = (log.url || '').toLowerCase();
        const source = (log.source || '').toLowerCase();
        if (!msg.includes(q) && !stack.includes(q) && !url.includes(q) && !source.includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [logs, levelFilter, searchQuery]);

  const errorCount = logs.filter(l => l.level === 'error' || !l.level).length;
  const warnCount = logs.filter(l => l.level === 'warn').length;

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1 d-flex align-items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <FaBug style={{ color: '#ef4444' }} />
            <span>System Error Logs</span>
          </h4>
          <p className="text-secondary small mb-0">
            Real-time diagnostics and unhandled exception telemetries recorded in Supabase PostgreSQL database.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={loadLogs}
            disabled={loading}
            className="d-flex align-items-center gap-1.5"
          >
            <FaSync className={loading ? 'fa-spin' : ''} size={12} />
            <span>Refresh</span>
          </Button>

          <Button
            variant="outline-primary"
            size="sm"
            onClick={handleExportJson}
            disabled={logs.length === 0}
            className="d-flex align-items-center gap-1.5"
          >
            <FaFileDownload size={12} />
            <span>Export JSON</span>
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowClearConfirm(true)}
            disabled={logs.length === 0}
            className="d-flex align-items-center gap-1.5 fw-bold"
          >
            <FaTrashAlt size={12} />
            <span>Clear Logs</span>
          </Button>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-4">
          <Card className="border-0 rounded-4 p-3 shadow-sm" style={{ background: 'var(--card-bg)' }}>
            <div className="small text-secondary fw-semibold">Total Logged Events</div>
            <div className="fs-3 fw-bold mt-1" style={{ color: 'var(--text-primary)' }}>{logs.length}</div>
          </Card>
        </div>
        <div className="col-12 col-sm-4">
          <Card className="border-0 rounded-4 p-3 shadow-sm" style={{ background: 'var(--card-bg)' }}>
            <div className="small text-danger fw-semibold">Exceptions & Errors</div>
            <div className="fs-3 fw-bold mt-1 text-danger">{errorCount}</div>
          </Card>
        </div>
        <div className="col-12 col-sm-4">
          <Card className="border-0 rounded-4 p-3 shadow-sm" style={{ background: 'var(--card-bg)' }}>
            <div className="small text-warning fw-semibold">Warnings</div>
            <div className="fs-3 fw-bold mt-1 text-warning">{warnCount}</div>
          </Card>
        </div>
      </div>

      {/* Filter Toolbar */}
      <Card className="border-0 rounded-4 p-3 shadow-sm mb-3" style={{ background: 'var(--card-bg)' }}>
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-8">
            <div className="input-group">
              <span className="input-group-text border-0" style={{ background: 'var(--bg-body)', color: 'var(--text-secondary)' }}>
                <FaSearch size={13} />
              </span>
              <Form.Control
                type="text"
                placeholder="Search error message, stack trace, source or URL..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="border-0"
                style={{ background: 'var(--bg-body)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          <div className="col-12 col-md-4 d-flex justify-content-md-end gap-2">
            <Form.Select
              value={levelFilter}
              onChange={e => setLevelFilter(e.target.value)}
              size="sm"
              style={{ maxWidth: 160, background: 'var(--bg-body)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
            >
              <option value="ALL">All Levels</option>
              <option value="error">Errors Only</option>
              <option value="warn">Warnings Only</option>
            </Form.Select>
          </div>
        </div>
      </Card>

      {/* Logs Table / List */}
      <Card className="border-0 rounded-4 shadow-sm overflow-hidden" style={{ background: 'var(--card-bg)' }}>
        {filteredLogs.length === 0 ? (
          <div className="text-center py-5 text-secondary">
            <FaCheck size={36} className="text-success mb-2 opacity-75" />
            <h6 className="fw-bold" style={{ color: 'var(--text-primary)' }}>No Error Logs Found</h6>
            <p className="small mb-0">System is running cleanly with zero reported unhandled exceptions.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0" style={{ borderColor: 'var(--border-color)' }}>
              <thead style={{ background: 'var(--card-bg-alt, rgba(0,0,0,0.02))' }}>
                <tr className="small text-secondary">
                  <th style={{ width: 100 }}>Level</th>
                  <th>Error Message</th>
                  <th style={{ width: 140 }}>Source</th>
                  <th style={{ width: 170 }}>Timestamp</th>
                  <th style={{ width: 90 }} className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map(log => {
                  const isExpanded = expandedLogId === log.id;
                  const isError = log.level === 'error' || !log.level;
                  const dateStr = log.created_at ? new Date(log.created_at).toLocaleString() : 'Just now';

                  return (
                    <React.Fragment key={log.id || `${log.created_at}-${log.message}`}>
                      <tr
                        onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <td>
                          {isError ? (
                            <Badge bg="danger" className="px-2 py-1 rounded-pill">ERROR</Badge>
                          ) : (
                            <Badge bg="warning" text="dark" className="px-2 py-1 rounded-pill">WARN</Badge>
                          )}
                        </td>
                        <td>
                          <div className="fw-semibold text-truncate" style={{ maxWidth: 450, color: 'var(--text-primary)' }}>
                            {log.message}
                          </div>
                          {log.url && (
                            <div className="small text-secondary text-truncate" style={{ maxWidth: 450, fontSize: '0.74rem' }}>
                              {log.url}
                            </div>
                          )}
                        </td>
                        <td>
                          <Badge bg="secondary" className="px-2 py-1 rounded-pill" style={{ fontSize: '0.72rem' }}>
                            {log.source || 'client'}
                          </Badge>
                        </td>
                        <td className="small text-secondary" style={{ fontSize: '0.78rem' }}>
                          <FaClock size={11} className="me-1 opacity-75" />
                          {dateStr}
                        </td>
                        <td className="text-end">
                          <Button
                            variant="link"
                            className="p-1 text-danger text-decoration-none"
                            onClick={(e) => handleDeleteSingle(log.id, e)}
                            title="Delete log"
                          >
                            <FaTrashAlt size={12} />
                          </Button>
                          <span className="text-secondary ms-1">
                            {isExpanded ? <FaChevronUp size={11} /> : <FaChevronDown size={11} />}
                          </span>
                        </td>
                      </tr>

                      {/* Expanded Details Drawer */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={5} className="p-0">
                            <div className="p-3 border-top border-bottom" style={{ background: 'var(--bg-body)' }}>
                              <div className="mb-2">
                                <span className="fw-bold small text-secondary">Full Message: </span>
                                <div className="p-2 rounded-2 mt-1 small font-monospace" style={{ background: 'var(--card-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
                                  {log.message}
                                </div>
                              </div>

                              {log.stack && (
                                <div className="mb-2">
                                  <span className="fw-bold small text-secondary">Stack Trace: </span>
                                  <pre className="p-2 rounded-2 mt-1 small font-monospace" style={{ background: 'var(--card-bg)', color: '#ef4444', border: '1px solid var(--border-color)', maxHeight: 200, overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
                                    {log.stack}
                                  </pre>
                                </div>
                              )}

                              {log.context && Object.keys(log.context).length > 0 && (
                                <div>
                                  <span className="fw-bold small text-secondary">Context Metadata: </span>
                                  <pre className="p-2 rounded-2 mt-1 small font-monospace" style={{ background: 'var(--card-bg)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', maxHeight: 150, overflowY: 'auto' }}>
                                    {JSON.stringify(log.context, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Confirmation Modal to Clear Logs */}
      <Modal show={showClearConfirm} onHide={() => setShowClearConfirm(false)} centered>
        <Modal.Header closeButton style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
          <Modal.Title className="fs-5 fw-bold d-flex align-items-center gap-2 text-danger">
            <FaExclamationTriangle />
            <span>Clear All Error Logs</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: 'var(--card-bg)', color: 'var(--text-primary)' }}>
          Are you sure you want to delete all {logs.length} error logs from the Supabase database and local storage?
          This action cannot be undone.
        </Modal.Body>
        <Modal.Footer style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
          <Button variant="outline-secondary" size="sm" onClick={() => setShowClearConfirm(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleClearAll}
            disabled={isClearing}
            className="fw-bold"
          >
            {isClearing ? 'Clearing...' : 'Yes, Delete All Logs'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
