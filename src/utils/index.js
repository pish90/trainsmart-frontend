export function weeksUntil(raceDateStr) {
  if (!raceDateStr) return 0;
  const race = new Date(raceDateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffMs = race - today;
  const weeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));
  return Math.max(0, weeks);
}

export function parseHours(targetTime) {
  if (!targetTime) return 0;
  const parts = targetTime.split(':');
  if (parts.length < 2) return parseFloat(targetTime) || 0;
  return parseFloat(parts[0]) + parseFloat(parts[1]) / 60;
}

export function avgSpeed(distanceKm, targetTime) {
  const hours = parseHours(targetTime);
  if (!hours || !distanceKm) return '0.0';
  return (distanceKm / hours).toFixed(1);
}

export function zoneColor(zone) {
  const map = {
    easy: 'var(--easy)',
    interval: 'var(--interval)',
    race: 'var(--race)',
    long: 'var(--long)',
    strength: 'var(--strength)',
    mobility: 'var(--mobility)',
    rest: 'var(--rest)',
  };
  return map[zone] || 'var(--text-muted)';
}

export function zoneEmoji(zone) {
  const map = {
    easy: '🚴',
    interval: '⚡',
    race: '🏁',
    long: '🌄',
    strength: '💪',
    mobility: '🧘',
    rest: '💤',
  };
  return map[zone] || '🚴';
}

export function formatDuration(seconds) {
  if (!seconds) return '—';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function formatDistance(meters) {
  if (!meters) return '—';
  return `${(meters / 1000).toFixed(1)} km`;
}

export function formatSpeed(mps) {
  if (!mps) return '—';
  return `${(mps * 3.6).toFixed(1)} km/h`;
}

export function getPlanStats(weeks, logs) {
  if (!weeks) return { done: 0, missed: 0, remaining: 0, total: 0 };
  let done = 0, missed = 0, total = 0;
  for (const week of weeks) {
    for (const session of week.sessions || []) {
      if (session.zone === 'rest') continue;
      total++;
      const key = `w${week.week}_${session.day}`;
      const log = logs?.[key];
      if (log?.status === 'done') done++;
      else if (log?.status === 'missed') missed++;
    }
  }
  return { done, missed, remaining: total - done - missed, total };
}
