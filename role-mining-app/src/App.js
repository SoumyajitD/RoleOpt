import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Box from '@material-ui/core/Box';

// Import components
import DataUpload from './components/DataUpload';
import DataSummary from './components/DataSummary';
import RoleMining from './components/RoleMining';
import RoleMiningResults from './components/RoleMiningResults';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

const steps = ['Upload Data', 'Data Summary', 'Configure Role Mining', 'Results'];

function App() {
  const [activeStep, setActiveStep] = useState(0);
  const [uploadedData, setUploadedData] = useState(null);
  const [dataSummary, setDataSummary] = useState(null);
  const [miningConfig, setMiningConfig] = useState({
    applications: [],
    organizationalUnits: [],
    minUsersPerRole: 2,
    maxPermissionsPerRole: 10
  });
  const [miningResults, setMiningResults] = useState(null);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleDataUpload = (data) => {
    setUploadedData(data);
    // Simulate getting a summary from backend
    const summary = {
      users: data.users ? data.users.length : 0,
      ous: data.ous ? data.ous.length : 0,
      applications: data.applications ? data.applications.length : 0,
      entitlements: data.entitlements ? data.entitlements.length : 0,
      assignments: data.assignments ? data.assignments.length : 0
    };
    setDataSummary(summary);
    handleNext();
  };

  const handleConfigureRoleMining = (config) => {
    setMiningConfig(config);
    // Simulate API call for role mining
    // In real app, this would call the backend
    setTimeout(() => {
      const mockResults = [
        { id: 1, name: 'Role 1', userCount: 15, applications: ['App1', 'App2'], permissionCount: 5 },
        { id: 2, name: 'Role 2', userCount: 8, applications: ['App2', 'App3'], permissionCount: 3 },
        { id: 3, name: 'Role 3', userCount: 12, applications: ['App1', 'App3', 'App4'], permissionCount: 7 }
      ];
      setMiningResults(mockResults);
      handleNext();
    }, 1500);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <DataUpload onUploadComplete={handleDataUpload} />;
      case 1:
        return <DataSummary summary={dataSummary} onNext={handleNext} onBack={handleBack} />;
      case 2:
        return <RoleMining onSubmit={handleConfigureRoleMining} onBack={handleBack} />;
      case 3:
        return <RoleMiningResults results={miningResults} onBack={handleBack} />;
      default:
        return 'Unknown step';
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="absolute">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Role Mining Application
          </Typography>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="lg" style={{ marginTop: 80, marginBottom: 40 }}>
        <Paper elevation={3} style={{ padding: 24 }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Role Analysis Dashboard
          </Typography>
          <Stepper activeStep={activeStep} style={{ margin: '30px 0' }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Box mt={4}>
            {getStepContent(activeStep)}
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default App; 