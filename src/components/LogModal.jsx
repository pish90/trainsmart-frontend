import { useState } from 'react';
import Modal from './Modal.jsx';

const STATUSES = [
  { key: 'done',    label: 'Done',    color: '#34d399', bg: 'rgba(52,211,153,0.15)' },
  { key: 'partial', label: 'Partial', color: '#fbbf24', bg: 'rgba(251,191,36,0.15)' },
  { key: 'missed',  label: 'Missed',  color: '#fb7185', bg: 'rgba(251,113,133,0.15)' },
];

export default function LogModal({ open, onClose, session, weekNum, existingLog, onSave }) {
  const [status, setStatus] = useState(existingLog?.status || 'done');
  const [rpe, setRpe] = useState(existingLog?.rpe || 0);
  const [notes, setNotes] = useState(existingLog?.notes || '');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!session) return;
    setSaving(true);
    try {
      await onSave({
        sessionKey: `w${weekNum}_${session.day}`,
        status,
        rpe,
        notes,
        week: weekNum,
        day: session.day,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={session ? `${session.label} — Week ${weekNum}` : ''}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8 }}>Status</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {STATUSES.map((s) => (
              <button
                key={s.key}
                onClick={() => setStatus(s.key)}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  borderRadius: 999,
                  border: `1px solid ${status === s.key ? s.color : 'var(--border)'}`,
                  background: status === s.key ? s.bg : 'var(--surface-2)',
                  color: status === s.key ? s.color : 'var(--text-muted)',
                  fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
                  transition: 'all 150ms ease',
                  minHeight: 44,
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8 }}>
            RPE (Rate of Perceived Exertion)
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setRpe(n)}
                style={{
                  width: 40, height: 40, borderRadius: 8, border: 'none',
                  background: rpe === n ? 'var(--accent)' : 'var(--surface-2)',
                  color: rpe === n ? 'white' : 'var(--text-muted)',
                  fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
                  transition: 'all 150ms ease',
                }}
              >
                {n}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            {['Easy', 'Moderate', 'Hard', 'Max'].map((l) => (
              <span key={l} style={{ fontSize: '0.65rem', color: 'var(--text-faint)' }}>{l}</span>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8 }}>Notes</div>
          <textarea
            className="input"
            rows={3}
            style={{ resize: 'none', height: 'auto' }}
            placeholder="How did it feel? Did you hit the targets?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: 10, paddingBottom: 8 }}>
          <button className="btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
          <button className="btn-primary" style={{ flex: 2 }} onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                  <path d="M21 12a9 9 0 11-6.219-8.56"/>
                </svg>
                Saving…
              </>
            ) : 'Save & Update Plan'}
          </button>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </Modal>
  );
}
