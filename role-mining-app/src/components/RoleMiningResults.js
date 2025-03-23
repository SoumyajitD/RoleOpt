import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import GetAppIcon from '@material-ui/icons/GetApp';
import AddIcon from '@material-ui/icons/Add';
import RefreshIcon from '@material-ui/icons/Refresh';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import axios from 'axios';
import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  tableContainer: {
    marginBottom: theme.spacing(4),
  },
  appChip: {
    margin: '2px',
  },
  buttonGroup: {
    marginTop: theme.spacing(4),
  },
  tabPanel: {
    padding: theme.spacing(2, 0),
  },
  dialogContent: {
    minWidth: 400,
  },
  aiSection: {
    marginBottom: theme.spacing(4),
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`role-results-tabpanel-${index}`}
      aria-labelledby={`role-results-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

const RoleMiningResults = ({ results, onBack }) => {
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);
  const [downloadingReport, setDownloadingReport] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [aiSuggestedRoles, setAiSuggestedRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [addingToIdentityManager, setAddingToIdentityManager] = useState(false);

  // Fetch AI-suggested roles from the API
  useEffect(() => {
    const fetchAiSuggestions = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8080/api/role-mining/ai-suggest');
        console.log('AI suggestions response:', response.data);
        setAiSuggestedRoles(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching AI suggestions:', err);
        setError('Failed to load AI suggestions. Please try again later.');
        // Fallback to mock data if API call fails
        setAiSuggestedRoles([
          { id: 101, name: 'AI Role 1 - Sales Team', userCount: 18, applications: ['CRM', 'Document Management', 'Email System'], permissionCount: 6, confidence: 92 },
          { id: 102, name: 'AI Role 2 - Finance Staff', userCount: 9, applications: ['Finance System', 'ERP System'], permissionCount: 8, confidence: 88 },
          { id: 103, name: 'AI Role 3 - HR Team', userCount: 7, applications: ['HR Portal', 'Document Management'], permissionCount: 5, confidence: 79 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    // Call the function to fetch AI suggestions
    fetchAiSuggestions();
  }, []);  // Empty dependency array means this runs once when component mounts

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDownloadReport = () => {
    setDownloadingReport(true);

    // Simulate download delay
    setTimeout(() => {
      // In a real app, this would trigger a download from the backend
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `RoleMiningReport_${timestamp}.csv`;
      
      // Create CSV content
      let csvContent = 'Role ID,Role Name,User Count,Applications,Permission Count\n';
      
      const rolesToExport = tabValue === 0 ? results : aiSuggestedRoles;
      
      rolesToExport.forEach(role => {
        csvContent += `${role.id},"${role.name}",${role.userCount},"${role.applications.join(', ')}",${role.permissionCount}\n`;
      });
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setDownloadingReport(false);
    }, 1500);
  };

  const handleOpenDetails = (role) => {
    setSelectedRole(role);
    setDetailDialogOpen(true);
  };

  const handleAddToIdentityManager = () => {
    setAddingToIdentityManager(true);
    
    // Simulate adding to identity manager
    setTimeout(() => {
      alert('Roles have been successfully added to Identity Manager');
      setAddingToIdentityManager(false);
    }, 1500);
  };

  const handleStartNewRoleMining = () => {
    // Go back to the first step by calling onBack multiple times
    onBack(); // Go back to Configure Role Mining
    onBack(); // Go back to Data Summary
    onBack(); // Go back to Upload Data
  };

  if (!results || results.length === 0) {
    return (
      <div>
        <Typography variant="h6" gutterBottom>
          No Results Found
        </Typography>
        <Typography variant="body1" paragraph>
          No roles were discovered with the current filters. Please try again with different filters.
        </Typography>
        <Button startIcon={<ArrowBackIcon />} variant="contained" color="primary" onClick={onBack}>
          Back to Filters
        </Button>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <Typography variant="h6" gutterBottom>
        Role Mining Results
      </Typography>
      
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
      >
        <Tab label="Filter-Based Roles" />
        <Tab label="AI-Suggested Roles" />
      </Tabs>
      
      <TabPanel value={tabValue} index={0}>
        <Typography variant="body1" paragraph>
          The following roles were discovered based on your filter criteria:
        </Typography>
        
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Role Name</TableCell>
                <TableCell align="center">Users</TableCell>
                <TableCell>Applications</TableCell>
                <TableCell align="center">Permissions</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((role) => (
                <TableRow key={role.id}>
                  <TableCell component="th" scope="row">
                    {role.name}
                  </TableCell>
                  <TableCell align="center">{role.userCount}</TableCell>
                  <TableCell>
                    {role.applications.map((app, index) => (
                      <Chip
                        key={index}
                        label={app}
                        size="small"
                        className={classes.appChip}
                      />
                    ))}
                  </TableCell>
                  <TableCell align="center">{role.permissionCount}</TableCell>
                  <TableCell align="center">
                    <Button 
                      size="small" 
                      color="primary"
                      onClick={() => handleOpenDetails(role)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        <div className={classes.aiSection}>
          <Typography variant="h6" gutterBottom>
            AI-Suggested Roles
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            These roles are suggested by AI based on analysis of user access patterns.
            The confidence score indicates the AI's certainty about the role suggestion.
          </Typography>
        </div>
        
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
            <CircularProgress />
          </div>
        ) : error ? (
          <Alert severity="error" style={{ marginBottom: '16px' }}>
            {error}
          </Alert>
        ) : aiSuggestedRoles.length === 0 ? (
          <Alert severity="info">
            No AI suggestions available. Try running role mining with AI enabled.
          </Alert>
        ) : (
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Role Name</TableCell>
                  <TableCell align="center">Users</TableCell>
                  <TableCell>Applications</TableCell>
                  <TableCell align="center">Permissions</TableCell>
                  <TableCell align="center">AI Confidence</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {aiSuggestedRoles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell component="th" scope="row">
                      {role.name}
                    </TableCell>
                    <TableCell align="center">{role.userCount}</TableCell>
                    <TableCell>
                      {role.applications.map((app, index) => (
                        <Chip
                          key={index}
                          label={app}
                          size="small"
                          className={classes.appChip}
                        />
                      ))}
                    </TableCell>
                    <TableCell align="center">{role.permissionCount}</TableCell>
                    <TableCell align="center">{role.confidence}%</TableCell>
                    <TableCell align="center">
                      <Button 
                        size="small" 
                        color="primary"
                        onClick={() => handleOpenDetails(role)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </TabPanel>
      
      <div className={classes.buttonGroup}>
        <ButtonGroup variant="contained" color="primary">
          <Button startIcon={<ArrowBackIcon />} onClick={onBack}>
            Back to Filters
          </Button>
          <Button 
            startIcon={downloadingReport ? <CircularProgress size={20} color="inherit" /> : <GetAppIcon />}
            onClick={handleDownloadReport}
            disabled={downloadingReport}
          >
            {downloadingReport ? 'Downloading...' : 'Download Report'}
          </Button>
          <Button 
            startIcon={addingToIdentityManager ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
            onClick={handleAddToIdentityManager}
            disabled={addingToIdentityManager}
          >
            {addingToIdentityManager ? 'Adding...' : 'Add to Identity Manager'}
          </Button>
          <Button 
            startIcon={<RefreshIcon />}
            onClick={handleStartNewRoleMining}
          >
            Start New Role Mining
          </Button>
        </ButtonGroup>
      </div>
      
      {/* Role Details Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        aria-labelledby="role-detail-dialog-title"
      >
        <DialogTitle id="role-detail-dialog-title">
          Role Details: {selectedRole?.name}
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          {selectedRole && (
            <>
              <Typography variant="subtitle1" gutterBottom>
                Users ({selectedRole.userCount})
              </Typography>
              <List dense>
                {/* Mock user list - in a real app, this would come from the backend */}
                {Array(Math.min(selectedRole.userCount, 5)).fill(0).map((_, index) => (
                  <ListItem key={index}>
                    <ListItemText 
                      primary={`User ${index + 1}`} 
                      secondary={`user${index + 1}@example.com`} 
                    />
                  </ListItem>
                ))}
                {selectedRole.userCount > 5 && (
                  <ListItem>
                    <ListItemText 
                      primary={`... and ${selectedRole.userCount - 5} more users`}
                    />
                  </ListItem>
                )}
              </List>
              
              <Typography variant="subtitle1" gutterBottom>
                Applications
              </Typography>
              <Box mb={2}>
                {selectedRole.applications.map((app, index) => (
                  <Chip
                    key={index}
                    label={app}
                    className={classes.appChip}
                  />
                ))}
              </Box>
              
              <Typography variant="subtitle1" gutterBottom>
                Permissions ({selectedRole.permissionCount})
              </Typography>
              <List dense>
                {/* Mock permission list - in a real app, this would come from the backend */}
                {Array(Math.min(selectedRole.permissionCount, 5)).fill(0).map((_, index) => (
                  <ListItem key={index}>
                    <ListItemText 
                      primary={`Permission ${index + 1}`} 
                      secondary={`${selectedRole.applications[index % selectedRole.applications.length]} - Access Level ${index + 1}`} 
                    />
                  </ListItem>
                ))}
                {selectedRole.permissionCount > 5 && (
                  <ListItem>
                    <ListItemText 
                      primary={`... and ${selectedRole.permissionCount - 5} more permissions`}
                    />
                  </ListItem>
                )}
              </List>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RoleMiningResults; 