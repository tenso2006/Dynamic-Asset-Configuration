import { Controller, useFormContext } from 'react-hook-form';
import TextField from '@mui/material/TextField';

interface Props { name: string; label: string }

export function TextInputField({ name, label }: Props) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          label={label}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
          fullWidth
          margin="normal"
        />
      )}
    />
  );
}
