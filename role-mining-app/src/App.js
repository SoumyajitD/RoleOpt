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
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Divider from '@material-ui/core/Divider';
import NotificationsIcon from '@material-ui/icons/Notifications';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import HelpIcon from '@material-ui/icons/Help';
import { makeStyles } from '@material-ui/core/styles';

// Import components
import Dashboard from './components/Dashboard';
import DataUpload from './components/DataUpload';
import DataSummary from './components/DataSummary';
import RoleMining from './components/RoleMining';
import RoleMiningResults from './components/RoleMiningResults';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'fixed',
    background: 'linear-gradient(45deg, #3f51b5 30%, #7986cb 90%)',
    boxShadow: '0 3px 15px rgba(0,0,0,0.2)',
    zIndex: theme.zIndex.drawer + 1,
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 2),
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
  },
  logoText: {
    marginLeft: theme.spacing(1),
    fontWeight: 'bold',
  },
  navSection: {
    display: 'flex',
    alignItems: 'center',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: theme.palette.secondary.main,
    cursor: 'pointer',
  },
  iconButton: {
    margin: theme.spacing(0, 0.5),
  },
  contentContainer: {
    marginTop: 80,
    marginBottom: 40,
    flexGrow: 1,
  },
  roleMiningContainer: {
    padding: 24,
  },
}));

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
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
    },
    h2: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
    },
    h3: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 500,
    },
    h6: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 500,
    },
    subtitle1: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 500,
    },
    button: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 500,
    },
    body1: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 400,
    },
  },
});

const steps = ['Upload Data', 'Data Summary', 'Configure Role Mining', 'Results'];

function App() {
  const classes = useStyles();
  const [showDashboard, setShowDashboard] = useState(true);
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
    // If we're at the first step of role mining, go back to dashboard
    if (activeStep === 0) {
      setShowDashboard(true);
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
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

  const handleConfigureRoleMining = async (config) => {
    setMiningConfig(config);
    
    try {
      // Make an actual API call to the backend
      const response = await fetch('http://localhost:8080/api/role-mining/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setMiningResults(data);
    } catch (error) {
      console.error('Error running role mining:', error);
      // Fallback to mock data if API call fails
      const mockResults = [
        { id: 1, name: 'Role 1', userCount: 15, applications: ['App1', 'App2'], permissionCount: 5 },
        { id: 2, name: 'Role 2', userCount: 8, applications: ['App2', 'App3'], permissionCount: 3 },
        { id: 3, name: 'Role 3', userCount: 12, applications: ['App1', 'App3', 'App4'], permissionCount: 7 },
      ];
      setMiningResults(mockResults);
    } finally {
      handleNext();
    }
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

  const handleStartRoleMining = () => {
    setShowDashboard(false);
    setActiveStep(0);
  };

  const handleGoHome = () => {
    setShowDashboard(true);
    setActiveStep(0);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <div className={classes.logo}>
            <Avatar className={classes.avatar}>R</Avatar>
            <Typography variant="h6" className={classes.logoText} color="inherit" noWrap>
              Verify Role Optimization
            </Typography>
          </div>
          
          <div className={classes.navSection}>
            <IconButton
              className={classes.iconButton}
              color="inherit"
              onClick={handleGoHome}
            >
              <HomeIcon />
            </IconButton>
            <Divider orientation="vertical" flexItem style={{ backgroundColor: 'rgba(255,255,255,0.2)', margin: '0 10px' }} />
            <IconButton
              className={classes.iconButton}
              color="inherit"
            >
              <Badge badgeContent={3} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              className={classes.iconButton}
              color="inherit"
            >
              <HelpIcon />
            </IconButton>
            <IconButton
              edge="end"
              className={classes.iconButton}
              color="inherit"
            >
              <AccountCircleIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      
      <Container component="main" maxWidth="lg" className={classes.contentContainer}>
        {showDashboard ? (
          <Dashboard onStartRoleMining={handleStartRoleMining} />
        ) : (
          <Paper elevation={3} className={classes.roleMiningContainer}>
            <Typography component="h1" variant="h4" align="center" gutterBottom>
              Role Mining Module
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
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App; 