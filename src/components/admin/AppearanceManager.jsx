import React from 'react';
import { Card, Row, Col, Badge, Button } from 'react-bootstrap';
import { useTheme } from '../../contexts/ThemeContext';
import { FaPalette, FaCheck, FaSun, FaMoon, FaUndo, FaCookieBite } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function AppearanceManager() {
  const { currentTheme, setTheme, themes } = useTheme();

  const lightThemes = themes.filter((t) => !t.dark);
  const darkThemes = themes.filter((t) => t.dark);

  const activeTheme = themes.find((t) => t.id === currentTheme) || {
    id: currentTheme,
    name: currentTheme ? currentTheme.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'Forest Green (Default)',
    color: '#15803D',
    dark: false,
  };

  const handleSelectTheme = (t) => {
    setTheme(t.id);
    toast.success(`Theme changed to ${t.name}. Saved to your device.`, {
      id: 'theme-toast',
    });
  };

  const handleResetDefault = () => {
    setTheme('forest-green');
    toast.success('Theme changed to Forest Green (Default). Saved to your device.', {
      id: 'theme-toast',
    });
  };

  return (
    <div className="space-y-4">
      {/* Header & Active Theme Display */}
      <div
        className="mb-4 d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3 p-3 p-md-4 rounded-3 border shadow-sm"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
      >
        <div>
          <h4 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <FaPalette className="text-primary" />
            <span>Appearance & Design System</span>
          </h4>
        </div>

        {/* Top Controls: Active Theme Display & Reset Button */}
        <div className="d-flex flex-wrap align-items-center gap-2">
          {/* Active Theme Display */}
          <div
            className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill border shadow-xs"
            style={{ fontSize: '0.88rem', backgroundColor: 'var(--bg-body)', borderColor: 'var(--border-color)' }}
          >
            <span className="text-muted small">Active Theme:</span>
            <span
              className="rounded-circle d-inline-block border flex-shrink-0"
              style={{ width: 14, height: 14, backgroundColor: activeTheme.color }}
            />
            <span className="fw-bold" style={{ color: 'var(--text-primary)' }}>{activeTheme.name}</span>
            <span
              className="badge d-inline-flex align-items-center gap-1 ms-1 text-uppercase"
              style={{
                fontSize: '0.65rem',
                backgroundColor: 'rgba(var(--bs-primary-rgb, 21, 128, 61), 0.12)',
                color: 'var(--bs-primary)',
              }}
            >
              <FaCookieBite size={10} /> Saved
            </span>
          </div>

          {/* Reset to Default Button */}
          <Button
            variant="outline-secondary"
            size="sm"
            className="rounded-pill px-3 d-flex align-items-center gap-2 fw-medium"
            onClick={handleResetDefault}
            title="Reset theme to Forest Green (Default)"
            disabled={currentTheme === 'forest-green'}
          >
            <FaUndo size={11} />
            <span>Reset to Default</span>
          </Button>
        </div>
      </div>

      {/* Light Themes Section */}
      <Card className="shadow-sm border rounded-3 mb-4">
        <Card.Header className="bg-transparent py-3 border-bottom d-flex align-items-center gap-2">
          <FaSun className="text-warning" />
          <h6 className="fw-bold mb-0">Professional Light Themes ({lightThemes.length})</h6>
        </Card.Header>
        <Card.Body className="p-4">
          <Row className="g-3">
            {lightThemes.map((t) => {
              const isSelected = currentTheme === t.id;
              return (
                <Col key={t.id} lg={3} md={4} sm={6}>
                  <div
                    onClick={() => handleSelectTheme(t)}
                    className={`p-3 rounded-3 border h-100 cursor-pointer transition position-relative ${isSelected ? 'border-primary shadow-sm' : ''
                      }`}
                    style={{
                      cursor: 'pointer',
                      borderColor: isSelected ? 'var(--bs-primary)' : 'var(--border-color)',
                      borderWidth: isSelected ? 2 : 1,
                      backgroundColor: isSelected ? 'rgba(var(--bs-primary-rgb), 0.12)' : 'var(--card-bg)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <span
                          className="rounded-circle d-inline-block border"
                          style={{ width: 20, height: 20, backgroundColor: t.color }}
                        />
                        <span className="fw-bold small">{t.name}</span>
                      </div>
                      {isSelected && (
                        <Badge bg="primary" className="d-flex align-items-center gap-1">
                          <FaCheck size={10} /> Active
                        </Badge>
                      )}
                    </div>
                    <div className="d-flex gap-1 mt-2">
                      <span className="rounded flex-grow-1" style={{ height: 6, backgroundColor: t.color }} />
                      <span className="rounded flex-grow-1 bg-secondary bg-opacity-25" style={{ height: 6 }} />
                      <span className="rounded flex-grow-1 border opacity-50" style={{ height: 6, backgroundColor: 'var(--border-color)' }} />
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        </Card.Body>
      </Card>

      {/* Dark Themes Section */}
      <Card className="shadow-sm border rounded-3">
        <Card.Header className="bg-transparent py-3 border-bottom d-flex align-items-center gap-2">
          <FaMoon className="text-info" />
          <h6 className="fw-bold mb-0">Engineered Dark Themes ({darkThemes.length})</h6>
        </Card.Header>
        <Card.Body className="p-4">
          <Row className="g-3">
            {darkThemes.map((t) => {
              const isSelected = currentTheme === t.id;
              return (
                <Col key={t.id} md={4}>
                  <div
                    onClick={() => handleSelectTheme(t)}
                    className={`p-3 rounded-3 border h-100 cursor-pointer transition position-relative ${isSelected ? 'border-primary shadow-sm' : ''
                      }`}
                    style={{
                      cursor: 'pointer',
                      borderColor: isSelected ? 'var(--bs-primary)' : 'var(--border-color)',
                      borderWidth: isSelected ? 2 : 1,
                      backgroundColor: isSelected ? 'rgba(var(--bs-primary-rgb), 0.15)' : 'var(--card-bg)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <span
                          className="rounded-circle d-inline-block border"
                          style={{ width: 20, height: 20, backgroundColor: t.color }}
                        />
                        <span className="fw-bold small">{t.name}</span>
                      </div>
                      {isSelected && (
                        <Badge bg="primary" text="dark" className="d-flex align-items-center gap-1 fw-bold">
                          <FaCheck size={10} /> Active
                        </Badge>
                      )}
                    </div>
                    <div className="d-flex gap-1 mt-2">
                      <span className="rounded flex-grow-1" style={{ height: 6, backgroundColor: t.color }} />
                      <span className="rounded flex-grow-1" style={{ height: 6, backgroundColor: '#334155' }} />
                      <span className="rounded flex-grow-1" style={{ height: 6, backgroundColor: '#0F172A' }} />
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
}
