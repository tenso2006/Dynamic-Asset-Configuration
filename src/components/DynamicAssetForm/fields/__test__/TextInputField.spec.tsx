import { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import { describe, it, expect } from 'vitest';
import { TextInputField } from '../TextInputField';

function FormWrapper({
  children,
  errorMessage,
}: {
  children: React.ReactNode;
  errorMessage?: string;
}) {
  const methods = useForm();
  const { setError } = methods;

  useEffect(() => {
    if (errorMessage) setError('field', { message: errorMessage });
  }, [errorMessage, setError]);

  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe('TextInputField', () => {
  it('renders with the correct label', () => {
    render(
      <FormWrapper>
        <TextInputField name="field" label="kVA Rating" />
      </FormWrapper>,
    );
    expect(screen.getByLabelText(/kva rating/i)).toBeInTheDocument();
  });

  it('accepts user input', async () => {
    const user = userEvent.setup();
    render(
      <FormWrapper>
        <TextInputField name="field" label="kVA Rating" />
      </FormWrapper>,
    );
    const input = screen.getByLabelText(/kva rating/i);
    await user.type(input, '100');
    expect(input).toHaveValue('100');
  });

  it('shows an error message when field has an error', async () => {
    render(
      <FormWrapper errorMessage="kVA Rating must be a positive number">
        <TextInputField name="field" label="kVA Rating" />
      </FormWrapper>,
    );
    expect(
      await screen.findByText(/kva rating must be a positive number/i),
    ).toBeInTheDocument();
  });

  it('marks the input as invalid when field has an error', async () => {
    render(
      <FormWrapper errorMessage="Required">
        <TextInputField name="field" label="kVA Rating" />
      </FormWrapper>,
    );
    const input = await screen.findByLabelText(/kva rating/i);
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });
});
