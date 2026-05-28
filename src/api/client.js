const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  createPlan: (profile) =>
    request('/api/plans', { method: 'POST', body: JSON.stringify(profile) }),

  getPlan: (id) => request(`/api/plans/${id}`),

  getSharedPlan: (shareCode) => request(`/api/plans/share/${shareCode}`),

  generateShareCode: (planId) =>
    request(`/api/plans/${planId}/share`, { method: 'POST' }),

  saveLog: (planId, logEntry) =>
    request(`/api/plans/${planId}/logs`, { method: 'POST', body: JSON.stringify(logEntry) }),

  connectStrava: (planId) => {
    window.location.href = `${BASE_URL}/api/auth/strava?planId=${planId}`;
  },

  syncStrava: (planId) => request(`/api/strava/activities/${planId}`),
};
