import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SetupPage from '../pages/SetupPage.jsx';

vi.mock('../api/client.js', () => ({
  api: {
    createPlan: vi.fn().mockResolvedValue({ id: 'test-plan-123' }),
    getSharedPlan: vi.fn().mockResolvedValue({ id: 'shared-123' }),
  },
}));

const renderSetup = () =>
  render(
    <MemoryRouter>
      <SetupPage />
    </MemoryRouter>
  );

describe('SetupPage', () => {
  it('renders all form fields', () => {
    renderSetup();
    expect(screen.getByPlaceholderText('e.g. Alex Johnson')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. 106')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('4:30')).toBeInTheDocument();
    expect(screen.getByText('Beginner')).toBeInTheDocument();
    expect(screen.getByText('Intermediate')).toBeInTheDocument();
    expect(screen.getByText('Advanced')).toBeInTheDocument();
  });

  it('shows error if name is empty on submit', async () => {
    renderSetup();
    fireEvent.click(screen.getByText('Generate my plan →'));
    await waitFor(() => {
      expect(screen.getByText('Please enter your name.')).toBeInTheDocument();
    });
  });

  it('displays correct avg speed as form values change', () => {
    renderSetup();
    const distanceInput = screen.getByPlaceholderText('e.g. 106');
    const timeInput = screen.getByPlaceholderText('4:30');
    const dateInput = screen.getAllByDisplayValue('').find(el => el.type === 'date');

    const future = new Date();
    future.setDate(future.getDate() + 84);
    const dateStr = future.toISOString().split('T')[0];

    fireEvent.change(dateInput, { target: { value: dateStr } });
    fireEvent.change(distanceInput, { target: { value: '106' } });
    fireEvent.change(timeInput, { target: { value: '4:30' } });

    expect(screen.getByText(/23\.6 km\/h avg/)).toBeInTheDocument();
  });

  it('fitness option cards toggle selected state', () => {
    renderSetup();
    const beginnerBtn = screen.getByText('Beginner').closest('button');
    const intermediateBtn = screen.getByText('Intermediate').closest('button');

    // Before clicking — neither is selected, style uses --border
    expect(beginnerBtn.getAttribute('style')).toContain('var(--border)');

    // After clicking Beginner — style switches to --accent
    fireEvent.click(beginnerBtn);
    expect(beginnerBtn.getAttribute('style')).toContain('var(--accent)');

    // After clicking Intermediate — Beginner reverts, Intermediate becomes selected
    fireEvent.click(intermediateBtn);
    expect(beginnerBtn.getAttribute('style')).toContain('var(--border)');
    expect(intermediateBtn.getAttribute('style')).toContain('var(--accent)');
  });
});
