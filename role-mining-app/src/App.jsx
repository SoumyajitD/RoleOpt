import React from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import RoleMiningContainer from './components/RoleMiningContainer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1E40AF',
    },
    background: {
      default: '#F9FAFB',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          width: '100%',
          minHeight: '100vh',
          margin: 0,
          padding: 0,
          backgroundColor: '#F9FAFB',
        },
        '#root': {
          width: '100%',
          minHeight: '100vh',
          margin: 0,
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          width: '100%',
          minHeight: '100vh',
          margin: 0,
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <RoleMiningContainer />
        <ToastContainer />
      </Box>
    </ThemeProvider>
  );
}

export default App;
