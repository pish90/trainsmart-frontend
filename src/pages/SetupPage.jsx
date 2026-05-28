import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import { weeksUntil, avgSpeed, parseHours } from '../utils/index.js';

const FITNESS_OPTIONS = [
  { key: 'beginner', label: 'Beginner', desc: 'Less than 1 year cycling, or returning after a long break' },
  { key: 'intermediate', label: 'Intermediate', desc: '1–3 years of regular riding, completed sportives before' },
  { key: 'advanced', label: 'Advanced', desc: '3+ years, racing or high-volume training background' },
];

export default function SetupPage() {
  const navigate = useNavigate();
  const [showView, setShowView] = useState(false);
  const [shareCodeInput, setShareCodeInput] = useState('');
  const [form, setForm] = useState({ athleteName: '', raceDate: '', raceDistanceKm: '', targetTime: '', fitnessLevel: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const weeks = weeksUntil(form.raceDate);
  const speed = avgSpeed(Number(form.raceDistanceKm), form.targetTime);

  function update(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.athleteName.trim()) { setError('Please enter your name.'); return; }
    if (!form.raceDate) { setError('Please select a race date.'); return; }
    if (!form.raceDistanceKm) { setError('Please enter a race distance.'); return; }
    if (!form.targetTime) { setError('Please enter your target time.'); return; }
    if (!form.fitnessLevel) { setError('Please select a fitness level.'); return; }

    setLoading(true);
    try {
      const plan = await api.createPlan({ ...form, raceDistanceKm: Number(form.raceDistanceKm) });
      localStorage.setItem('trainsmart_plan_id', plan.id);
      navigate(`/dashboard/${plan.id}`);
    } catch (err) {
      setError(err.message || 'Failed to generate plan. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleViewShared() {
    if (!shareCodeInput.trim()) return;
    try {
      await api.getSharedPlan(shareCodeInput.trim().toUpperCase());
      navigate(`/view/${shareCodeInput.trim().toUpperCase()}`);
    } catch {
      setError('Share code not found. Please check and try again.');
    }
  }

  return (
    <div style={{
      minHeight: '100vh', minHeight: '100dvh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px 16px 80px',
    }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>🚴</div>
          <h1 style={{ fontSize: '2rem', margin: 0, color: 'var(--text)' }}>TrainSmart</h1>
          <p style={{ color: 'var(--text-muted)', margin: '8px 0 0', fontSize: '0.9rem' }}>
            AI-powered cycling training plans built for your race
          </p>
        </div>

        {!showView ? (
          <>
            <div className="card" style={{ padding: 24 }}>
              {error && (
                <div style={{
                  background: 'rgba(251,113,133,0.1)', border: '1px solid rgba(251,113,133,0.3)',
                  borderRadius: 12, padding: '12px 16px', marginBottom: 20,
                  color: '#fb7185', fontSize: '0.82rem',
                }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Your name</label>
                  <input className="input" placeholder="e.g. Alex Johnson" value={form.athleteName} onChange={(e) => update('athleteName', e.target.value)} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Race date</label>
                    <input className="input" type="date" value={form.raceDate} onChange={(e) => update('raceDate', e.target.value)} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Distance (km)</label>
                    <input className="input" type="number" placeholder="e.g. 106" value={form.raceDistanceKm} onChange={(e) => update('raceDistanceKm', e.target.value)} />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                    Target time <span style={{ color: 'var(--text-faint)' }}>e.g. 4:30</span>
                  </label>
                  <input className="input" placeholder="4:30" value={form.targetTime} onChange={(e) => update('targetTime', e.target.value)} />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 10 }}>Fitness level</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {FITNESS_OPTIONS.map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => update('fitnessLevel', opt.key)}
                        style={{
                          textAlign: 'left', padding: '14px 16px', borderRadius: 12,
                          border: `1px solid ${form.fitnessLevel === opt.key ? 'var(--accent)' : 'var(--border)'}`,
                          background: form.fitnessLevel === opt.key ? 'var(--accent-glow)' : 'var(--surface-2)',
                          cursor: 'pointer', transition: 'all 150ms ease',
                        }}
                      >
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: form.fitnessLevel === opt.key ? 'var(--accent)' : 'var(--text)' }}>
                          {opt.label}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 3 }}>
                          {opt.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {form.raceDate && form.raceDistanceKm && form.targetTime && (
                  <div style={{
                    padding: '12px 16px', borderRadius: 12,
                    background: 'var(--surface-2)', border: '1px solid var(--border)',
                    fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center',
                  }}>
                    {weeks > 0 ? `${weeks} weeks to race` : 'Race date passed'} · {speed} km/h avg needed
                  </div>
                )}

                <button className="btn-primary" style={{ width: '100%', marginTop: 4 }} type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                        <path d="M21 12a9 9 0 11-6.219-8.56"/>
                      </svg>
                      Building your plan…
                    </>
                  ) : 'Generate my plan →'}
                </button>
              </form>
            </div>

            <div style={{ textAlign: 'center', margin: '24px 0 16px' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>or</span>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              </div>
            </div>

            <button className="btn-secondary" style={{ width: '100%' }} onClick={() => setShowView(true)}>
              View someone's dashboard →
            </button>
          </>
        ) : (
          <div className="card animate-fade-in" style={{ padding: 24 }}>
            {error && (
              <div style={{
                background: 'rgba(251,113,133,0.1)', border: '1px solid rgba(251,113,133,0.3)',
                borderRadius: 12, padding: '12px 16px', marginBottom: 20,
                color: '#fb7185', fontSize: '0.82rem',
              }}>
                {error}
              </div>
            )}
            <h3 style={{ margin: '0 0 16px', fontSize: '1rem' }}>Enter share code</h3>
            <input
              className="input"
              placeholder="e.g. ABC123XY"
              style={{ textAlign: 'center', fontFamily: 'monospace', fontSize: '1.2rem', letterSpacing: '0.1em', marginBottom: 12 }}
              value={shareCodeInput}
              onChange={(e) => setShareCodeInput(e.target.value.toUpperCase())}
            />
            <button className="btn-primary" style={{ width: '100%', marginBottom: 12 }} onClick={handleViewShared}>
              View dashboard →
            </button>
            <button
              onClick={() => { setShowView(false); setError(''); }}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.82rem', cursor: 'pointer', width: '100%', textAlign: 'center' }}
            >
              ← Back
            </button>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
