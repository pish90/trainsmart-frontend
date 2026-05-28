export default function CoachNote({ note, loading }) {
  return (
    <div
      className="animate-slide-down"
      style={{
        background: 'var(--surface)',
        borderLeft: '3px solid var(--accent)',
        borderRadius: '0 12px 12px 0',
        padding: '14px 16px',
        marginBottom: 16,
        border: '1px solid var(--border)',
        borderLeftWidth: 3,
        borderLeftColor: 'var(--accent)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: '1.1rem' }}>🧠</span>
        <span style={{
          fontSize: '0.72rem', fontWeight: 600, color: 'var(--accent)',
          textTransform: 'uppercase', letterSpacing: '0.08em',
        }}>
          Coach
        </span>
      </div>
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div className="skeleton" style={{ height: 14, width: '90%' }} />
          <div className="skeleton" style={{ height: 14, width: '70%' }} />
        </div>
      ) : (
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text)', lineHeight: 1.6 }}>
          {note}
        </p>
      )}
    </div>
  );
}
