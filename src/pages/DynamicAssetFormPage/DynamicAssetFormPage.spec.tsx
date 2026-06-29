import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DynamicAssetFormPage from './DynamicAssetFormPage';
import type { AssetFormPayload } from '../../types/asset';

function setup(
  assetType: 'TRANSFORMER' | 'SECTION' | 'BREAKER',
  onSubmit: (payload: AssetFormPayload) => void = vi.fn(),
) {
  const user = userEvent.setup();
  render(<DynamicAssetFormPage assetType={assetType} onSubmit={onSubmit} />);
  return { user, onSubmit };
}

const submitBtn = () => screen.getByRole('button', { name: /save configuration/i });

describe('DynamicAssetForm — TRANSFORMER', () => {
  it('renders kvaRating and coolingType fields', () => {
    setup('TRANSFORMER');
    expect(screen.getByLabelText(/kva rating/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cooling type/i)).toBeInTheDocument();
  });

  it('shows error when kvaRating is empty', async () => {
    const { user } = setup('TRANSFORMER');
    await user.click(submitBtn());
    expect(await screen.findByText(/kva rating must be a positive number/i)).toBeInTheDocument();
  });

  it('shows error when kvaRating is zero or negative', async () => {
    const { user } = setup('TRANSFORMER');
    await user.type(screen.getByLabelText(/kva rating/i), '-5');
    await user.click(submitBtn());
    expect(await screen.findByText(/kva rating must be a positive number/i)).toBeInTheDocument();
  });

  it('shows error when coolingType is not selected', async () => {
    const { user } = setup('TRANSFORMER');
    await user.type(screen.getByLabelText(/kva rating/i), '100');
    await user.click(submitBtn());
    expect(await screen.findByText(/please select a cooling type/i)).toBeInTheDocument();
  });

  it('calls onSubmit with correctly typed TRANSFORMER payload', async () => {
    const { user, onSubmit } = setup('TRANSFORMER');
    await user.type(screen.getByLabelText(/kva rating/i), '100');
    await user.click(screen.getByLabelText(/cooling type/i));
    await user.click(await screen.findByRole('option', { name: 'ONAN' }));
    await user.click(submitBtn());
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledOnce();
      expect(onSubmit).toHaveBeenCalledWith({ assetType: 'TRANSFORMER', kvaRating: 100, coolingType: 'ONAN' });
    });
  });
    it('shows error when kvaRating is zero', async () => {
    const { user } = setup('TRANSFORMER');
    await user.type(screen.getByLabelText(/kva rating/i), '0');
    await user.click(submitBtn());
    expect(
      await screen.findByText(/kva rating must be a positive number/i),
    ).toBeInTheDocument();
  });

  it('shows error when kvaRating is non-numeric', async () => {
    const { user } = setup('TRANSFORMER');
    await user.type(screen.getByLabelText(/kva rating/i), 'abc');
    await user.click(submitBtn());
    expect(
      await screen.findByText(/kva rating must be a (positive number|number)/i),
    ).toBeInTheDocument();
  });

  it('calls onSubmit with ONAF coolingType on valid input', async () => {
    const { user, onSubmit } = setup('TRANSFORMER');
    await user.type(screen.getByLabelText(/kva rating/i), '500');
    await user.click(screen.getByLabelText(/cooling type/i));
    await user.click(await screen.findByRole('option', { name: 'ONAF' }));
    await user.click(submitBtn());
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        assetType: 'TRANSFORMER',
        kvaRating: 500,
        coolingType: 'ONAF',
      });
    });
  });
});

describe('DynamicAssetForm — SECTION', () => {
  let user: ReturnType<typeof userEvent.setup>;
  let onSubmit: (payload: AssetFormPayload) => void;

  beforeEach(() => {
    onSubmit = vi.fn();
    ({ user } = setup('SECTION', onSubmit));
  });

  it('renders groundedNeutral switch and conductorType field', () => {
    expect(screen.getByLabelText(/grounded neutral/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/conductor type/i)).toBeInTheDocument();
  });

  it('shows error when conductorType is fewer than 3 characters', async () => {
    await user.type(screen.getByLabelText(/conductor type/i), 'Cu');
    await user.click(submitBtn());
    expect(await screen.findByText(/conductor type must be at least 3 characters/i)).toBeInTheDocument();
  });

  it('does not show error for conductorType with 3+ characters', async () => {
    await user.type(screen.getByLabelText(/conductor type/i), 'Cop');
    await user.click(submitBtn());
    await waitFor(() => {
      expect(screen.queryByText(/conductor type must be at least 3 characters/i)).not.toBeInTheDocument();
    });
  });

  it('calls onSubmit with correctly typed SECTION payload', async () => {
    await user.type(screen.getByLabelText(/conductor type/i), 'Copper');
    await user.click(screen.getByLabelText(/grounded neutral/i));
    await user.click(submitBtn());
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ assetType: 'SECTION', groundedNeutral: true, conductorType: 'Copper' });
    });
  });

  it('defaults groundedNeutral to false when switch is not toggled', async () => {
    await user.type(screen.getByLabelText(/conductor type/i), 'Copper');
    await user.click(submitBtn());
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ assetType: 'SECTION', groundedNeutral: false, conductorType: 'Copper' });
    });
  });
  it('shows error when conductorType is empty', async () => {
    await user.click(submitBtn());
    expect(
      await screen.findByText(/conductor type must be at least 3 characters/i),
    ).toBeInTheDocument();
  });
});
