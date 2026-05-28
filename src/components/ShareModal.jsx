import { useState } from 'react';
import Modal from './Modal.jsx';

export default function ShareModal({ open, onClose, shareCode }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(shareCode || '').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  return (
    <Modal open={open} onClose={onClose} title="Share your plan">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8 }}>Share code</div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'var(--surface-2)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '12px 16px',
          }}>
            <span style={{
              flex: 1,
              fontFamily: 'monospace', fontSize: '1.3rem', fontWeight: 700,
              letterSpacing: '0.15em', color: 'var(--text)', textAlign: 'center',
            }}>
              {shareCode || '——'}
            </span>
            <button
              onClick={handleCopy}
              style={{
                background: copied ? 'rgba(52,211,153,0.15)' : 'var(--surface)',
                border: `1px solid ${copied ? '#34d399' : 'var(--border)'}`,
                borderRadius: 8, padding: '8px 14px', cursor: 'pointer',
                color: copied ? '#34d399' : 'var(--text-muted)',
                fontSize: '0.75rem', fontWeight: 600,
                transition: 'all 200ms ease',
                whiteSpace: 'nowrap',
              }}
            >
              {copied ? 'Copied ✓' : 'Copy'}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            ['1', 'Share the code above with your friend or training partner'],
            ['2', 'They open TrainSmart and click "View someone\'s dashboard"'],
            ['3', 'They enter the code to view your full training plan'],
            ['4', 'Read-only access — they can\'t modify your logs'],
          ].map(([n, text]) => (
            <div key={n} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{
                width: 24, height: 24, borderRadius: '50%',
                background: 'var(--accent-glow)', border: '1px solid var(--accent)',
                color: 'var(--accent)', fontSize: '0.7rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>{n}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, paddingTop: 4 }}>{text}</span>
            </div>
          ))}
        </div>

        <button className="btn-secondary" style={{ width: '100%' }} onClick={onClose}>Close</button>
      </div>
    </Modal>
  );
}
