import { useLocation, useNavigate } from 'react-router-dom';

const items = [
  { label: 'Home', path: '/', icon: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'var(--accent)' : 'none'} stroke={active ? 'var(--accent)' : 'var(--text-muted)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )},
  { label: 'Dashboard', path: null, icon: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? 'var(--accent)' : 'var(--text-muted)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  )},
  { label: 'Weeks', path: null, icon: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? 'var(--accent)' : 'var(--text-muted)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  )},
  { label: 'Profile', path: null, icon: (active) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? 'var(--accent)' : 'var(--text-muted)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  )},
];

export default function BottomNav({ planId }) {
  const location = useLocation();
  const navigate = useNavigate();

  function getPath(item) {
    if (item.label === 'Dashboard' && planId) return `/dashboard/${planId}`;
    return item.path;
  }

  function isActive(item) {
    const p = getPath(item);
    if (!p) return false;
    if (p === '/') return location.pathname === '/';
    return location.pathname.startsWith(p.split('/').slice(0, 2).join('/'));
  }

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'rgba(19,19,26,0.95)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid var(--border)',
      paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
      zIndex: 40,
      display: 'none',
    }}
    className="block-md-up"
    >
      <style>{`@media (max-width: 768px) { .block-md-up { display: flex !important; } }`}</style>
      <div style={{ display: 'flex', justifyContent: 'space-around', paddingTop: 8 }}>
        {items.map((item) => {
          const active = isActive(item);
          const path = getPath(item);
          return (
            <button
              key={item.label}
              onClick={() => path && navigate(path)}
              style={{
                flex: 1,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                background: 'none', border: 'none', cursor: path ? 'pointer' : 'default',
                padding: '8px 4px',
                color: active ? 'var(--accent)' : 'var(--text-muted)',
                opacity: !path && item.label !== 'Home' ? 0.4 : 1,
              }}
            >
              {item.icon(active)}
              <span style={{
                fontSize: '0.65rem', fontFamily: 'Inter, sans-serif',
                fontWeight: active ? 600 : 400,
              }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
