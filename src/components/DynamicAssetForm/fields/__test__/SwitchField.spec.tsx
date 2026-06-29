import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import { describe, it, expect } from 'vitest';
import { SwitchField } from '../SwitchField';

function FormWrapper({ children }: { children: React.ReactNode }) {
  const methods = useForm();
  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe('SwitchField', () => {
  it('renders with the correct label', () => {
    render(
      <FormWrapper>
        <SwitchField name="field" label="Grounded Neutral" />
      </FormWrapper>,
    );
    expect(screen.getByLabelText(/grounded neutral/i)).toBeInTheDocument();
  });

  it('defaults to unchecked', () => {
    render(
      <FormWrapper>
        <SwitchField name="field" label="Grounded Neutral" />
      </FormWrapper>,
    );
    expect(screen.getByLabelText(/grounded neutral/i)).not.toBeChecked();
  });

  it('becomes checked when clicked', async () => {
    const user = userEvent.setup();
    render(
      <FormWrapper>
        <SwitchField name="field" label="Grounded Neutral" />
      </FormWrapper>,
    );
    await user.click(screen.getByLabelText(/grounded neutral/i));
    expect(screen.getByLabelText(/grounded neutral/i)).toBeChecked();
  });

  it('toggles back to unchecked when clicked twice', async () => {
    const user = userEvent.setup();
    render(
      <FormWrapper>
        <SwitchField name="field" label="Grounded Neutral" />
      </FormWrapper>,
    );
    const toggle = screen.getByLabelText(/grounded neutral/i);
    await user.click(toggle);
    await user.click(toggle);
    expect(toggle).not.toBeChecked();
  });
});
