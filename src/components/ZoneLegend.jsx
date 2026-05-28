const ZONES = [
  { key: 'easy', label: 'Easy', color: 'var(--easy)' },
  { key: 'interval', label: 'Interval', color: 'var(--interval)' },
  { key: 'race', label: 'Race Pace', color: 'var(--race)' },
  { key: 'long', label: 'Long', color: 'var(--long)' },
  { key: 'strength', label: 'Strength', color: 'var(--strength)' },
  { key: 'mobility', label: 'Mobility', color: 'var(--mobility)' },
];

export default function ZoneLegend() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', padding: '16px 0' }}>
      {ZONES.map(({ key, label, color }) => (
        <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{label}</span>
        </div>
      ))}
    </div>
  );
}
