import { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import { describe, it, expect } from 'vitest';
import { SelectField } from '../SelectField';

const OPTIONS = [
  { label: 'ONAN', value: 'ONAN' },
  { label: 'ONAF', value: 'ONAF' },
];

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

describe('SelectField', () => {
  it('renders with the correct label', () => {
    render(
      <FormWrapper>
        <SelectField name="field" label="Cooling Type" options={OPTIONS} />
      </FormWrapper>,
    );
    expect(screen.getByLabelText(/cooling type/i)).toBeInTheDocument();
  });

  it('renders all provided options when opened', async () => {
    const user = userEvent.setup();
    render(
      <FormWrapper>
        <SelectField name="field" label="Cooling Type" options={OPTIONS} />
      </FormWrapper>,
    );
    await user.click(screen.getByLabelText(/cooling type/i));
    expect(await screen.findByRole('option', { name: 'ONAN' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'ONAF' })).toBeInTheDocument();
  });

  it('reflects the selected value after choosing an option', async () => {
    const user = userEvent.setup();
    render(
      <FormWrapper>
        <SelectField name="field" label="Cooling Type" options={OPTIONS} />
      </FormWrapper>,
    );
    await user.click(screen.getByLabelText(/cooling type/i));
    await user.click(await screen.findByRole('option', { name: 'ONAN' }));
    expect(screen.getByLabelText(/cooling type/i)).toHaveTextContent('ONAN');
  });

  it('shows an error message when field has an error', async () => {
    render(
      <FormWrapper errorMessage="Please select a cooling type">
        <SelectField name="field" label="Cooling Type" options={OPTIONS} />
      </FormWrapper>,
    );
    expect(
      await screen.findByText(/please select a cooling type/i),
    ).toBeInTheDocument();
  });
});
