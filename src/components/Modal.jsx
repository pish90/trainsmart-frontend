import { useEffect } from 'react';

export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'flex-end',
      }}
      onClick={onClose}
    >
      <div
        className="animate-slide-up"
        style={{
          width: '100%',
          background: 'var(--surface)',
          borderRadius: '24px 24px 0 0',
          maxHeight: '90vh',
          overflowY: 'auto',
          paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 8px' }}>
          <div style={{
            width: 40, height: 4, borderRadius: 4,
            background: 'var(--border)',
          }} />
        </div>
        {title && (
          <div style={{
            padding: '8px 24px 16px',
            fontFamily: 'Syne, sans-serif',
            fontWeight: 700,
            fontSize: '1.1rem',
            color: 'var(--text)',
          }}>
            {title}
          </div>
        )}
        <div style={{ padding: '0 24px 8px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
