import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the application header', () => {
    render(<App />);
    expect(screen.getByText(/dynamic asset configuration/i)).toBeInTheDocument();
  });

  it('renders all three asset type tabs', () => {
    render(<App />);
    expect(screen.getByRole('tab', { name: 'TRANSFORMER' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'SECTION' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'BREAKER' })).toBeInTheDocument();
  });

  it('shows TRANSFORMER fields by default', () => {
    render(<App />);
    expect(screen.getByLabelText(/kva rating/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cooling type/i)).toBeInTheDocument();
  });

  it('switches to SECTION fields when SECTION tab is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('tab', { name: 'SECTION' }));

    expect(screen.getByLabelText(/grounded neutral/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/conductor type/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/kva rating/i)).not.toBeInTheDocument();
  });

  it('displays the payload section after a valid TRANSFORMER submission', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    await user.type(screen.getByLabelText(/kva rating/i), '250');
    await user.click(screen.getByLabelText(/cooling type/i));
    await user.click(await screen.findByRole('option', { name: 'ONAF' }));
    await user.click(screen.getByRole('button', { name: /save configuration/i }));

    await waitFor(() => {
      expect(screen.getByText(/submitted payload/i)).toBeInTheDocument();
    });

    const pre = container.querySelector('pre');
    expect(pre?.textContent).toContain('"assetType": "TRANSFORMER"');
    expect(pre?.textContent).toContain('"kvaRating": 250');
    expect(pre?.textContent).toContain('"coolingType": "ONAF"');
  });

  it('clears the payload display when switching tabs', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/kva rating/i), '100');
    await user.click(screen.getByLabelText(/cooling type/i));
    await user.click(await screen.findByRole('option', { name: 'ONAN' }));
    await user.click(screen.getByRole('button', { name: /save configuration/i }));

    await waitFor(() => {
      expect(screen.getByText(/submitted payload/i)).toBeInTheDocument();
    });

    await user.click(screen.getByRole('tab', { name: 'SECTION' }));

    expect(screen.queryByText(/submitted payload/i)).not.toBeInTheDocument();
  });
});
