import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, AppBar, Toolbar, Typography, Button } from '@mui/material';
import RoleMiningContainer from './components/RoleMiningContainer';
import SecurityIcon from '@mui/icons-material/Security';
import './styles.css';

const theme = createTheme({
  palette: {
    background: {
      default: '#F9FAFB',
      paper: '#FFFFFF',
    },
    primary: {
      main: '#1E40AF',
      light: '#3B82F6',
      dark: '#1E3A8A',
    },
    text: {
      primary: '#1F2937',
      secondary: '#4B5563',
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
      dark: '#DC2626',
    },
    success: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      color: '#F2F2F2',
    },
    h6: {
      color: '#F2F2F2',
      fontWeight: 600,
    },
    body1: {
      lineHeight: 1.7,
      color: '#DAD8D8',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
          padding: '12px 32px',
          fontSize: '1.1rem',
          backgroundColor: '#251A1A',
          color: '#F2F2F2',
          border: '2px solid #251A1A',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: '#554D4D',
            borderColor: '#251A1A',
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(13, 1, 1, 0.2)',
          }
        },
        contained: {
          '&:hover': {
            backgroundColor: '#554D4D',
          }
        },
        outlined: {
          backgroundColor: 'transparent',
          borderColor: '#B6B2B2',
          color: '#F2F2F2',
          '&:hover': {
            backgroundColor: '#B6B2B2',
            borderColor: '#B6B2B2',
            color: '#251A1A',
          }
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#251A1A',
          boxShadow: 'none',
          borderBottom: '1px solid #0D0101',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#F2F2F2',
          '&:hover': {
            backgroundColor: '#554D4D',
          }
        },
      },
    },
  },
});

function App() {
  const [showUploader, setShowUploader] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app-container">
        <AppBar position="static">
          <Toolbar className="toolbar">
            <Button
              onClick={() => setShowUploader(false)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 16px',
                minWidth: 'auto',
                textTransform: 'none',
                backgroundColor: 'transparent',
                border: 'none',
                '&:hover': {
                  backgroundColor: 'transparent',
                  border: 'none',
                },
                '&:focus': {
                  backgroundColor: 'transparent',
                  border: 'none',
                  outline: 'none',
                },
                '&:active': {
                  backgroundColor: 'transparent',
                  border: 'none',
                }
              }}
            >
              <div className="logo-container">
                <SecurityIcon sx={{ color: '#F2F2F2', fontSize: 28 }} />
                <Typography variant="h6" sx={{ ml: 2 }}>
                  Role Mining App
                </Typography>
              </div>
            </Button>
          </Toolbar>
        </AppBar>
        
        {!showUploader ? (
          <main className="landing-container">
            <div className="hero-content">
              <h1 className="hero-title">
                Optimize Your Access Management
              </h1>
              <p className="hero-description">
                Transform your organization's access patterns into efficient role-based structures. 
                Our intelligent role mining solution analyzes user entitlements to suggest optimal 
                role definitions, improving security and reducing administrative overhead.
              </p>
              <Button 
                variant="contained"
                size="large"
                onClick={() => setShowUploader(true)}
              >
                Get Started
              </Button>
            </div>
          </main>
        ) : (
          <main className="uploader-container">
            <RoleMiningContainer />
          </main>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
