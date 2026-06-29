import { lazy, Suspense, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { CircularProgress } from '@mui/material';
import type { AssetFormPayload, AssetType } from './types/asset';

const DynamicAssetFormPage = lazy(() =>
  import('./pages/DynamicAssetFormPage/DynamicAssetFormPage'),
);

const ASSET_TYPES: AssetType[] = ['TRANSFORMER', 'SECTION', 'BREAKER'];

const App = () => {
  const [assetType, setAssetType] = useState<AssetType>('TRANSFORMER');
  const [lastPayload, setLastPayload] = useState<AssetFormPayload | null>(null);

  const handleTabChange = (_: React.SyntheticEvent, next: AssetType) => {
    setAssetType(next);
    setLastPayload(null);
  };

  return (
    <>
      <AppBar position="sticky" color="primary">
        <Toolbar variant="dense">
          <Typography sx={{ mr: 1, fontSize: '1.1rem' }}>⚡</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
            Dynamic Asset Configuration
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" gutterBottom>Configure Assets</Typography>
          <Typography variant="body2" color="text.secondary">
            Select an asset type and fill in the configuration fields.
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, mb: 3 }}
        >
          <Tabs value={assetType} onChange={handleTabChange} sx={{ px: 1 }}>
            {ASSET_TYPES.map((t) => <Tab key={t} label={t} value={t} />)}
          </Tabs>
          <Divider />
          <Box sx={{ p: 3 }}>
            <Suspense
              fallback={
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress size={28} />
                </Box>
              }
            >
              <DynamicAssetFormPage assetType={assetType} onSubmit={setLastPayload} />
            </Suspense>
          </Box>
        </Paper>

        {lastPayload && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom color="text.secondary">
              Submitted Payload
            </Typography>
            <Paper
              component="pre"
              elevation={0}
              sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2, fontSize: '0.82rem', overflow: 'auto' }}
            >
              {JSON.stringify(lastPayload, null, 2)}
            </Paper>
          </Box>
        )}
      </Container>
    </>
  );
}

export default App;
