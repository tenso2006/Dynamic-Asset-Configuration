import { Controller, useFormContext } from 'react-hook-form';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import type { SelectOption } from '../../../types/asset';

interface Props { name: string; label: string; options: SelectOption[] }

export function SelectField({ name, label, options }: Props) {
  const { control } = useFormContext();
  const labelId = `${name}-label`;
  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field, fieldState }) => (
        <FormControl fullWidth margin="normal" error={!!fieldState.error}>
          <InputLabel id={labelId}>{label}</InputLabel>
          <Select {...field} labelId={labelId} label={label} inputProps={{ 'aria-label': label }}>
            {options.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </Select>
          {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
}
