import React from 'react';
import toast, { Toaster, ToastBar } from 'react-hot-toast';
import { FiX } from 'react-icons/fi';

/**
 * Custom Toast Component with Dismiss Button
 * Renders centered, vibrant, high-contrast toasts with close buttons
 */
export function CustomToaster() {
  return (
    <Toaster
      position="top-center"
      gutter={10}
      containerStyle={{
        top: 24,
        zIndex: 999999, // Supercede Bootstrap modals (z-1055) and navbars (z-1050)
      }}
      toastOptions={{
        duration: 3000,
        className: 'custom-toast',
        style: {
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          fontSize: '0.88rem',
          fontWeight: 500,
          borderRadius: '50px',
          padding: '10px 18px',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.3), 0 2px 6px rgba(0, 0, 0, 0.15)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: '8px',
          maxWidth: '540px',
          color: '#ffffff',
          background: '#0f172a',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          pointerEvents: 'auto',
        },
        success: {
          iconTheme: { primary: '#ffffff', secondary: '#16a34a' },
          style: {
            background: 'linear-gradient(135deg, #15803d 0%, #16a34a 100%)',
            color: '#ffffff',
            boxShadow: '0 12px 32px rgba(22, 163, 74, 0.45), 0 2px 6px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
          },
        },
        error: {
          iconTheme: { primary: '#ffffff', secondary: '#dc2626' },
          style: {
            background: 'linear-gradient(135deg, #b91c1c 0%, #dc2626 100%)',
            color: '#ffffff',
            boxShadow: '0 12px 32px rgba(220, 38, 38, 0.45), 0 2px 6px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
          },
        },
        loading: {
          style: {
            background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
            color: '#ffffff',
            boxShadow: '0 12px 32px rgba(37, 99, 235, 0.45), 0 2px 6px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
          },
        },
      }}
    >
      {(t) => (
        <ToastBar
          toast={t}
          style={{
            ...t.style,
          }}
        >
          {({ icon, message }) => (
            <div
              className="d-flex align-items-center justify-content-center gap-2"
              style={{
                textAlign: 'center',
                margin: '0 auto',
                width: '100%',
              }}
            >
              {icon && (
                <span className="d-inline-flex align-items-center justify-content-center flex-shrink-0" style={{ fontSize: '1.15rem' }}>
                  {icon}
                </span>
              )}
              <div
                style={{
                  textAlign: 'center',
                  fontWeight: 500,
                  fontSize: '0.88rem',
                  lineHeight: 1.4,
                  wordBreak: 'break-word',
                  flex: '1 1 auto',
                  margin: '0 4px',
                }}
              >
                {message}
              </div>
              {t.type !== 'loading' && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toast.dismiss(t.id);
                  }}
                  className="btn btn-sm p-0 border-0 d-inline-flex align-items-center justify-content-center"
                  style={{
                    background: 'rgba(255, 255, 255, 0.22)',
                    color: '#ffffff',
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    marginLeft: '8px',
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.4)';
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.22)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  aria-label="Dismiss notification"
                >
                  <FiX size={13} strokeWidth={3} />
                </button>
              )}
            </div>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
}

export default CustomToaster;
