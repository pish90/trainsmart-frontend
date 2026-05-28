import { zoneColor, zoneEmoji, formatDistance, formatSpeed, formatDuration } from '../utils/index.js';

const ZONE_LABELS = { easy: 'Easy', interval: 'Interval', race: 'Race Pace', long: 'Long', strength: 'Strength', mobility: 'Mobility', rest: 'Rest' };

const STATUS_STYLE = {
  done:    { bg: 'rgba(52,211,153,0.15)', color: '#34d399', label: 'Done' },
  partial: { bg: 'rgba(251,191,36,0.15)',  color: '#fbbf24', label: 'Partial' },
  missed:  { bg: 'rgba(251,113,133,0.15)', color: '#fb7185', label: 'Missed' },
};

export default function SessionCard({ session, weekNum, log, stravaActivity, readOnly, onLog }) {
  const color = zoneColor(session.zone);
  const isRest = session.zone === 'rest';
  const statusStyle = log ? STATUS_STYLE[log.status] : null;

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        borderLeft: `3px solid ${color}`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
        transition: 'all 200ms ease',
        display: 'flex',
        flexDirection: 'column',
        ...(isRest && { gridColumn: '1 / -1', opacity: 0.6 }),
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.borderLeftColor = color;
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.borderLeftColor = color;
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ padding: '16px 16px 12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '1.3rem' }}>{zoneEmoji(session.zone)}</span>
            <div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>
                {session.label}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 1 }}>
                {session.day} · {session.duration || '—'}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
            <span style={{
              fontSize: '0.65rem', fontWeight: 600, padding: '3px 8px',
              borderRadius: 999, border: `1px solid ${color}`,
              color, background: `${color}18`,
            }}>
              {ZONE_LABELS[session.zone] || session.zone}
            </span>
            {statusStyle && (
              <span style={{
                fontSize: '0.65rem', fontWeight: 600, padding: '3px 8px',
                borderRadius: 999, background: statusStyle.bg, color: statusStyle.color,
              }}>
                {statusStyle.label}
              </span>
            )}
          </div>
        </div>

        {!isRest && (
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
            {session.detail}
          </p>
        )}

        {log && (
          <div style={{ marginTop: 10, padding: '8px 10px', background: 'var(--surface-2)', borderRadius: 8 }}>
            {log.rpe > 0 && (
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 3 }}>
                RPE {log.rpe}/10
              </div>
            )}
            {log.notes && (
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                "{log.notes}"
              </div>
            )}
          </div>
        )}

        {stravaActivity && (
          <div style={{
            marginTop: 10, padding: '8px 10px',
            background: 'rgba(252,76,2,0.08)', borderRadius: 8,
            border: '1px solid rgba(252,76,2,0.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span style={{
                fontSize: '0.6rem', fontWeight: 700, padding: '2px 7px',
                borderRadius: 999, background: '#FC4C02', color: 'white',
                letterSpacing: '0.05em',
              }}>
                STRAVA
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {stravaActivity.activityName}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text)' }}>{formatDistance(stravaActivity.distanceMeters)}</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text)' }}>{formatSpeed(stravaActivity.averageSpeedMps)}</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text)' }}>{formatDuration(stravaActivity.movingTimeSeconds)}</span>
              {stravaActivity.averageHeartrate && (
                <span style={{ fontSize: '0.72rem', color: 'var(--text)' }}>{Math.round(stravaActivity.averageHeartrate)} bpm</span>
              )}
            </div>
          </div>
        )}
      </div>

      {!isRest && !readOnly && (
        <div style={{ padding: '0 16px 16px', marginTop: 'auto' }}>
          <button
            className="btn-secondary"
            style={{ width: '100%', fontSize: '0.8rem', padding: '9px 16px' }}
            onClick={() => onLog(session, weekNum)}
          >
            {log ? 'Update log' : 'Log session'}
          </button>
        </div>
      )}
    </div>
  );
}
