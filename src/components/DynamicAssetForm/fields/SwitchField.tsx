import { Controller, useFormContext } from 'react-hook-form';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

interface Props { name: string; label: string }

export function SwitchField({ name, label }: Props) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={false}
      render={({ field }) => (
        <FormControlLabel
          label={label}
          control={
            <Switch {...field} checked={field.value as boolean} />
          }
          sx={{ mt: 1, mb: 0.5 }}
        />
      )}
    />
  );
}
