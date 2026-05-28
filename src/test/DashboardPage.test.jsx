import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage.jsx';

vi.mock('../api/client.js', () => ({
  api: {
    getPlan: vi.fn(),
    getSharedPlan: vi.fn(),
    generateShareCode: vi.fn(),
    saveLog: vi.fn(),
    syncStrava: vi.fn(),
    connectStrava: vi.fn(),
  },
}));

const basePlan = {
  id: 'plan-abc',
  athleteName: 'Test Athlete',
  raceDate: '2026-10-01',
  raceDistanceKm: 106,
  targetTime: '4:30',
  fitnessLevel: 'intermediate',
  totalWeeks: 12,
  shareCode: null,
  stravaAthleteId: null,
  readOnly: false,
  weeks: [
    {
      week: 1,
      theme: 'Base Building',
      sessions: [
        { day: 'Tue', type: 'Cycling', label: 'Easy spin', duration: '1h', detail: 'Keep it easy', zone: 'easy' },
        { day: 'Wed', type: 'Strength', label: 'Leg day', duration: '45m', detail: 'Squats', zone: 'strength' },
        { day: 'Thu', type: 'Cycling', label: 'Tempo', duration: '1h 15m', detail: 'Tempo intervals', zone: 'interval' },
        { day: 'Fri', type: 'Rest', label: 'Rest day', duration: '0m', detail: 'Full recovery', zone: 'rest' },
        { day: 'Sat', type: 'Cycling', label: 'Long ride', duration: '3h', detail: 'Steady pace', zone: 'long' },
        { day: 'Sun', type: 'Mobility', label: 'Recovery yoga', duration: '30m', detail: 'Stretch', zone: 'mobility' },
      ],
    },
    {
      week: 2,
      theme: 'Build',
      sessions: [
        { day: 'Tue', type: 'Cycling', label: 'Easy spin', duration: '1h 15m', detail: 'Base', zone: 'easy' },
        { day: 'Wed', type: 'Strength', label: 'Leg day', duration: '45m', detail: 'Squats', zone: 'strength' },
        { day: 'Thu', type: 'Cycling', label: 'Intervals', duration: '1h 30m', detail: 'VO2 max', zone: 'interval' },
        { day: 'Fri', type: 'Rest', label: 'Rest day', duration: '0m', detail: 'Full recovery', zone: 'rest' },
        { day: 'Sat', type: 'Cycling', label: 'Long ride', duration: '3h 30m', detail: 'Endurance', zone: 'long' },
        { day: 'Sun', type: 'Mobility', label: 'Yoga', duration: '30m', detail: 'Recovery', zone: 'mobility' },
      ],
    },
  ],
  logs: {
    'w1_Tue': { status: 'done', rpe: 6, notes: 'Felt good' },
    'w1_Thu': { status: 'missed', rpe: 0, notes: '' },
  },
};

const renderDashboard = () =>
  render(
    <MemoryRouter initialEntries={['/dashboard/plan-abc']}>
      <Routes>
        <Route path="/dashboard/:id" element={<DashboardPage />} />
      </Routes>
    </MemoryRouter>
  );

describe('DashboardPage', () => {
  beforeEach(async () => {
    const { api } = await import('../api/client.js');
    api.getPlan.mockResolvedValue({ ...basePlan });
    api.getSharedPlan.mockResolvedValue({ ...basePlan, readOnly: true });
    api.generateShareCode.mockResolvedValue({ shareCode: 'ABC12345' });
    api.saveLog.mockResolvedValue({ coachNote: 'Well done!', success: true });
    api.syncStrava.mockResolvedValue([]);
  });

  it('renders athlete name in header', async () => {
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByText('Test Athlete')).toBeInTheDocument();
    });
  });

  it('shows correct done count', async () => {
    renderDashboard();
    await waitFor(() => screen.getByText('Test Athlete'));
    // w1_Tue=done → done=1, w1_Thu=missed → missed=1
    const doneEl = screen.getAllByText('1');
    expect(doneEl.length).toBeGreaterThanOrEqual(1);
  });

  it('week tab shows correct done/total', async () => {
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByText('W1')).toBeInTheDocument();
      expect(screen.getByText('1/5')).toBeInTheDocument();
    });
  });

  it('session card renders label, duration, zone badge', async () => {
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByText('Easy spin')).toBeInTheDocument();
    });
    const durations = screen.getAllByText(/1h/);
    expect(durations.length).toBeGreaterThan(0);
    const easyBadge = screen.getAllByText('Easy');
    expect(easyBadge.length).toBeGreaterThan(0);
  });

  it('log modal opens on button click', async () => {
    renderDashboard();
    await waitFor(() => screen.getByText('Easy spin'));
    const logBtns = screen.getAllByText('Log session');
    fireEvent.click(logBtns[0]);
    await waitFor(() => {
      expect(screen.getByText('Save & Update Plan')).toBeInTheDocument();
    });
  });

  it('log modal closes on cancel', async () => {
    renderDashboard();
    await waitFor(() => screen.getByText('Easy spin'));
    const logBtns = screen.getAllByText('Log session');
    fireEvent.click(logBtns[0]);
    await waitFor(() => screen.getByText('Cancel'));
    fireEvent.click(screen.getByText('Cancel'));
    await waitFor(() => {
      expect(screen.queryByText('Save & Update Plan')).not.toBeInTheDocument();
    });
  });

  it('read-only mode: log buttons not rendered', async () => {
    const { api } = await import('../api/client.js');
    api.getSharedPlan.mockResolvedValue({ ...basePlan, readOnly: true });
    render(
      <MemoryRouter initialEntries={['/view/SHARE123']}>
        <Routes>
          <Route path="/view/:shareCode" element={<DashboardPage readOnly />} />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => screen.getByText('Test Athlete'));
    expect(screen.queryByText('Log session')).not.toBeInTheDocument();
  });

  it('Strava banner shown when stravaAthleteId is null', async () => {
    renderDashboard();
    await waitFor(() => {
      expect(screen.getByText('Connect Strava')).toBeInTheDocument();
    });
  });

  it('Strava banner hidden when stravaAthleteId is set', async () => {
    const { api } = await import('../api/client.js');
    api.getPlan.mockResolvedValue({ ...basePlan, stravaAthleteId: 12345678 });
    renderDashboard();
    await waitFor(() => screen.getByText('Test Athlete'));
    expect(screen.queryByText('Connect Strava')).not.toBeInTheDocument();
    expect(screen.getByText('Strava connected')).toBeInTheDocument();
  });
});
