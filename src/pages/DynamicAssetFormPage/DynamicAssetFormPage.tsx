import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { getSchema } from '../../schemas/assetSchemas';
import { fieldConfig } from '../../config/fieldConfig';
import { TextInputField } from '../../components/DynamicAssetForm/fields/TextInputField';
import { SelectField } from '../../components/DynamicAssetForm/fields/SelectField';
import { SwitchField } from '../../components/DynamicAssetForm/fields/SwitchField';
import type { AssetFormPayload, AssetType, SelectFieldDescriptor } from '../../types/asset';

interface DynamicAssetFormProps {
  assetType: AssetType;
  onSubmit: (payload: AssetFormPayload) => void;
}

const  DynamicAssetForm = ({ assetType, onSubmit }: DynamicAssetFormProps) => {
  const methods = useForm({
    resolver: zodResolver(getSchema(assetType)),
    mode: 'onSubmit',
  });

  useEffect(() => {
    methods.reset();
  }, [assetType, methods]);

  const handleSubmit = methods.handleSubmit((data) => {
    onSubmit({ assetType, ...data } as AssetFormPayload);
  });

  const renderFields = () => {
    return fieldConfig[assetType].map((field) => {
      const { type, name, label } = field;
      switch (type) {
        case 'text':
          return <TextInputField key={name} name={name} label={label} />;
        case 'select':
          return (
            <SelectField
              key={name}
              name={name}
              label={label}
              options={(field as SelectFieldDescriptor).options}
            />
          );
        case 'switch':
          return <SwitchField key={name} name={name} label={label} />;
        default:
          return null;
      }
    });
  };

  return (
    <FormProvider {...methods}>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Typography variant="h6" gutterBottom>
          {assetType} Configuration
        </Typography>
        {renderFields()}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained">
            Save Configuration
          </Button>
        </Box>
      </Box>
    </FormProvider>
  );
}

export default DynamicAssetForm;