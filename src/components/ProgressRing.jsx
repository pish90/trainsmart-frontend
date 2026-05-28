import { useEffect, useState } from 'react';

export default function ProgressRing({ value = 0, size = 56, label }) {
  const [animated, setAnimated] = useState(0);
  const r = (size - 10) / 2;
  const circumference = 2 * Math.PI * r;

  useEffect(() => {
    const t = setTimeout(() => setAnimated(value), 50);
    return () => clearTimeout(t);
  }, [value]);

  const offset = circumference - (animated / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke="var(--border)"
          strokeWidth={5}
        />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 600ms ease-out' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Syne, sans-serif', fontWeight: 700,
        fontSize: size < 50 ? '0.6rem' : '0.75rem',
        color: 'var(--text)',
      }}>
        {label ?? `${Math.round(value)}%`}
      </div>
    </div>
  );
}
