import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/client.js';
import { getPlanStats, weeksUntil, avgSpeed } from '../utils/index.js';
import SessionCard from '../components/SessionCard.jsx';
import LogModal from '../components/LogModal.jsx';
import ShareModal from '../components/ShareModal.jsx';
import CoachNote from '../components/CoachNote.jsx';
import ZoneLegend from '../components/ZoneLegend.jsx';
import ProgressRing from '../components/ProgressRing.jsx';
import BottomNav from '../components/BottomNav.jsx';

export default function DashboardPage({ readOnly = false }) {
  const { id, shareCode } = useParams();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeWeek, setActiveWeek] = useState(0);
  const [logModal, setLogModal] = useState({ open: false, session: null, weekNum: null });
  const [shareModal, setShareModal] = useState(false);
  const [coachNote, setCoachNote] = useState(null);
  const [coachLoading, setCoachLoading] = useState(false);
  const [stravaDismissed, setStravaDismissed] = useState(() => localStorage.getItem('strava_dismissed') === 'true');
  const [syncing, setSyncing] = useState(false);
  const weekTabsRef = useRef(null);

  const isReadOnly = readOnly || plan?.readOnly;

  useEffect(() => {
    load();
  }, [id, shareCode]);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = readOnly
        ? await api.getSharedPlan(shareCode)
        : await api.getPlan(id);
      setPlan(data);
      const savedWeek = parseInt(localStorage.getItem(`trainsmart_week_${data.id}`), 10);
      setActiveWeek(savedWeek || 0);
    } catch (err) {
      setError(err.message || 'Failed to load plan');
    } finally {
      setLoading(false);
    }
  }

  function selectWeek(idx) {
    setActiveWeek(idx);
    if (plan) localStorage.setItem(`trainsmart_week_${plan.id}`, idx);
    const tab = weekTabsRef.current?.children[idx];
    tab?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  async function handleSaveLog(logEntry) {
    setCoachLoading(true);
    setCoachNote(null);
    try {
      const result = await api.saveLog(plan.id, logEntry);
      setCoachNote(result.coachNote);
      await load();
    } finally {
      setCoachLoading(false);
    }
  }

  async function handleShare() {
    if (!plan.shareCode) {
      try {
        const result = await api.generateShareCode(plan.id);
        setPlan((p) => ({ ...p, shareCode: result.shareCode }));
      } catch {}
    }
    setShareModal(true);
  }

  async function handleSyncStrava() {
    setSyncing(true);
    try {
      await api.syncStrava(plan.id);
      await load();
    } finally {
      setSyncing(false);
    }
  }

  if (loading) return <SkeletonDashboard />;
  if (error) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 16px' }}>{error}</p>
        <button className="btn-secondary" onClick={load}>Retry</button>
      </div>
    </div>
  );
  if (!plan) return null;

  const stats = getPlanStats(plan.weeks, plan.logs);
  const progress = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;
  const currentWeek = plan.weeks?.[activeWeek];
  const weeks = weeksUntil(plan.raceDate);

  return (
    <div className="page-enter" style={{ minHeight: '100vh', paddingBottom: 80 }}>
      <header style={{
        position: 'sticky', top: 0, zIndex: 30,
        background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        padding: '12px 16px',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '1.2rem' }}>🚴</span>
            <div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>TrainSmart</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1 }}>{plan.athleteName}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ textAlign: 'right', display: 'none' }} className="show-sm">
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{weeks}w left</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{plan.targetTime}</div>
            </div>
            {!isReadOnly && (
              <button
                onClick={handleShare}
                style={{
                  background: 'var(--surface-2)', border: '1px solid var(--border)',
                  borderRadius: 8, padding: '8px 12px', cursor: 'pointer',
                  color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6,
                  fontSize: '0.75rem', fontWeight: 500,
                  transition: 'all 150ms ease',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
                Share
              </button>
            )}
          </div>
        </div>
        <style>{`@media (min-width: 400px) { .show-sm { display: block !important; } }`}</style>
      </header>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '16px 16px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 12, marginBottom: 16, alignItems: 'center' }}>
          {[
            { label: 'Done', value: stats.done, color: '#34d399' },
            { label: 'Missed', value: stats.missed, color: '#fb7185' },
            { label: 'To go', value: stats.remaining, color: 'var(--text-muted)' },
          ].map(({ label, value, color }) => (
            <div key={label} className="card" style={{ padding: '14px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', fontFamily: 'Syne, sans-serif', fontWeight: 800, color }}>{value}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
            </div>
          ))}
          <ProgressRing value={progress} size={56} />
        </div>

        <div className="card" style={{ padding: '12px 16px', marginBottom: 16, overflowX: 'auto' }}>
          <div style={{ display: 'flex', gap: 12, whiteSpace: 'nowrap', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>{plan.raceDate}</span>
            <span>·</span>
            <span>{plan.raceDistanceKm} km</span>
            <span>·</span>
            <span>Target {plan.targetTime}</span>
            <span>·</span>
            <span>{avgSpeed(plan.raceDistanceKm, plan.targetTime)} km/h avg</span>
            <span>·</span>
            <span>{plan.totalWeeks} weeks</span>
          </div>
        </div>

        {!isReadOnly && !plan.stravaAthleteId && !stravaDismissed && (
          <div className="animate-fade-in" style={{
            background: 'var(--surface)', borderLeft: '3px solid var(--strava)',
            borderRadius: '0 12px 12px 0', border: '1px solid var(--border)',
            borderLeftColor: 'var(--strava)', padding: '14px 16px', marginBottom: 16,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 2 }}>Connect Strava</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Auto-sync your rides to track progress</div>
            </div>
            <button
              onClick={() => api.connectStrava(plan.id)}
              style={{
                background: 'var(--strava)', color: 'white', border: 'none',
                borderRadius: 999, padding: '8px 16px', fontSize: '0.8rem',
                fontWeight: 600, cursor: 'pointer',
              }}
            >
              Connect
            </button>
            <button
              onClick={() => { setStravaDismissed(true); localStorage.setItem('strava_dismissed', 'true'); }}
              style={{ background: 'none', border: 'none', color: 'var(--text-faint)', cursor: 'pointer', fontSize: '1.1rem' }}
            >
              ×
            </button>
          </div>
        )}

        {!isReadOnly && plan.stravaAthleteId && (
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '10px 16px', marginBottom: 16,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399', flexShrink: 0 }} />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', flex: 1 }}>Strava connected</span>
            <button
              className="btn-secondary"
              style={{ fontSize: '0.75rem', padding: '6px 14px' }}
              onClick={handleSyncStrava}
              disabled={syncing}
            >
              {syncing ? 'Syncing…' : 'Sync now'}
            </button>
          </div>
        )}

        {(coachNote || coachLoading) && (
          <CoachNote note={coachNote} loading={coachLoading} />
        )}

        <div style={{ overflowX: 'auto', marginBottom: 16, paddingBottom: 4 }}>
          <div ref={weekTabsRef} style={{ display: 'flex', gap: 8, width: 'max-content' }}>
            {plan.weeks?.map((week, idx) => {
              const weekSessions = week.sessions?.filter(s => s.zone !== 'rest') || [];
              const weekDone = weekSessions.filter(s => plan.logs?.[`w${week.week}_${s.day}`]?.status === 'done').length;
              const isComplete = weekDone === weekSessions.length && weekSessions.length > 0;
              const isActive = idx === activeWeek;
              return (
                <button
                  key={week.week}
                  onClick={() => selectWeek(idx)}
                  style={{
                    padding: '8px 16px', borderRadius: 999, border: 'none',
                    background: isActive ? 'var(--accent)' : isComplete ? 'transparent' : 'var(--surface-2)',
                    border: isComplete && !isActive ? '1px solid var(--easy)' : isActive ? 'none' : '1px solid var(--border)',
                    color: isActive ? 'white' : isComplete ? 'var(--easy)' : 'var(--text-muted)',
                    cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600,
                    boxShadow: isActive ? '0 0 12px rgba(108,99,255,0.25)' : 'none',
                    transition: 'all 150ms ease',
                    minHeight: 44,
                    flexShrink: 0,
                  }}
                >
                  <div>W{week.week}</div>
                  <div style={{ fontSize: '0.6rem', fontWeight: 400, marginTop: 1 }}>{weekDone}/{weekSessions.length}</div>
                </button>
              );
            })}
          </div>
        </div>

        {currentWeek && (
          <>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem' }}>
                Week {currentWeek.week} — {currentWeek.theme || 'Training'}
              </div>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 12,
              marginBottom: 16,
            }}>
              {currentWeek.sessions?.map((session) => (
                <SessionCard
                  key={`${currentWeek.week}_${session.day}`}
                  session={session}
                  weekNum={currentWeek.week}
                  log={plan.logs?.[`w${currentWeek.week}_${session.day}`]}
                  stravaActivity={null}
                  readOnly={isReadOnly}
                  onLog={(s, w) => setLogModal({ open: true, session: s, weekNum: w })}
                />
              ))}
            </div>
            <ZoneLegend />
          </>
        )}
      </div>

      <LogModal
        open={logModal.open}
        onClose={() => setLogModal({ open: false, session: null, weekNum: null })}
        session={logModal.session}
        weekNum={logModal.weekNum}
        existingLog={logModal.session ? plan.logs?.[`w${logModal.weekNum}_${logModal.session?.day}`] : null}
        onSave={handleSaveLog}
      />

      <ShareModal
        open={shareModal}
        onClose={() => setShareModal(false)}
        shareCode={plan.shareCode}
      />

      <BottomNav planId={plan.id} />
    </div>
  );
}

function SkeletonDashboard() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
      <div style={{ height: 56, background: 'var(--surface)', borderRadius: 12, marginBottom: 16 }} className="skeleton" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 12, marginBottom: 16 }}>
        {[1,2,3].map(i => <div key={i} style={{ height: 80 }} className="skeleton" />)}
        <div style={{ width: 56, height: 56, borderRadius: '50%' }} className="skeleton" />
      </div>
      <div style={{ height: 40, marginBottom: 16 }} className="skeleton" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        {[1,2,3,4,5,6].map(i => <div key={i} style={{ height: 160 }} className="skeleton" />)}
      </div>
    </div>
  );
}
