import React from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box, AppBar, Toolbar, Typography, Container, Paper } from '@mui/material';
import DataUpload from './components/DataUpload';
import SecurityIcon from '@mui/icons-material/Security';
import InfoIcon from '@mui/icons-material/Info';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2c3e50', // Deep blue-gray
      light: '#34495e',
      dark: '#1a252f',
    },
    secondary: {
      main: '#e74c3c', // Vibrant red
      light: '#ff6b6b',
      dark: '#c0392b',
    },
    success: {
      main: '#27ae60', // Forest green
      light: '#2ecc71',
      dark: '#219a52',
    },
    info: {
      main: '#3498db', // Sky blue
      light: '#5dade2',
      dark: '#2980b9',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    body1: {
      lineHeight: 1.7,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="static" elevation={1} sx={{ backgroundColor: 'white', borderBottom: 1, borderColor: 'grey.200' }}>
          <Container maxWidth="lg">
            <Toolbar disableGutters>
              <SecurityIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
                Role Mining App
              </Typography>
            </Toolbar>
          </Container>
        </AppBar>
        
        <Container 
          maxWidth={false} 
          sx={{ 
            flex: 1,
            py: 6,
            px: { xs: 2, sm: 4, md: 6 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ mb: 6 }}>
              <Paper 
                sx={{ 
                  p: 4, 
                  backgroundColor: 'info.light', 
                  color: 'white',
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <InfoIcon sx={{ mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    Welcome to Role Mining App
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  This application helps you analyze and optimize user access patterns in your organization. 
                  By uploading your access data, you can:
                </Typography>
                <Box component="ul" sx={{ pl: 2, mb: 0 }}>
                  <Typography component="li" sx={{ mb: 1 }}>
                    Identify common access patterns and potential roles
                  </Typography>
                  <Typography component="li" sx={{ mb: 1 }}>
                    Optimize access management and reduce security risks
                  </Typography>
                  <Typography component="li" sx={{ mb: 1 }}>
                    Improve compliance and audit readiness
                  </Typography>
                  <Typography component="li">
                    Streamline role-based access control implementation
                  </Typography>
                </Box>
              </Paper>
            </Box>
            <DataUpload />
          </Container>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
