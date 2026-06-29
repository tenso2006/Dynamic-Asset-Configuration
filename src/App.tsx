import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import { Box, Container, Typography } from '@mui/material'
import BoltIcon from '@mui/icons-material/Bolt'

function App() {

  return (
    <>
      <AppBar position="sticky" color="primary">
        <Toolbar variant="dense">
          <BoltIcon sx={{ mr: 1, fontSize: 20 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.01em' }}>
            Dynamic Asset Configuration
          </Typography>
          <Box sx={{ flex: 1 }} />
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            v1.0.0
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4 }}>
       <Box sx={{ mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Configure Assets
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Select an asset type below and fill in the configuration fields.
          </Typography>
        </Box>
       </Container>
    </>
  )
}

export default App
