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
import VisibilityIcon from '@material-ui/icons/Visibility';
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
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Divider from '@material-ui/core/Divider';
import Fade from '@material-ui/core/Fade';
import Grow from '@material-ui/core/Grow';
import Zoom from '@material-ui/core/Zoom';
import Avatar from '@material-ui/core/Avatar';
import { blue, green, orange, red, purple } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  tableContainer: {
    marginBottom: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      boxShadow: '0 6px 25px rgba(0,0,0,0.15)',
    },
  },
  tableHead: {
    backgroundColor: theme.palette.primary.main,
  },
  tableHeadCell: {
    color: theme.palette.common.white,
    fontWeight: 'bold',
  },
  tableRow: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: theme.palette.action.selected,
    },
  },
  appChip: {
    margin: '2px',
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    },
  },
  buttonGroup: {
    marginTop: theme.spacing(4),
    '& .MuiButton-root': {
      transition: 'all 0.2s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      },
    },
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
  cardGrid: {
    marginTop: theme.spacing(3),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 12px 20px rgba(0,0,0,0.15)',
    },
  },
  cardHeader: {
    backgroundColor: theme.palette.grey[100],
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
  },
  cardContent: {
    flexGrow: 1,
  },
  cardActions: {
    padding: theme.spacing(2),
    justifyContent: 'space-between',
  },
  avatar: {
    marginRight: theme.spacing(2),
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  chip: {
    margin: theme.spacing(0.5),
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
    },
  },
  viewButton: {
    borderRadius: theme.shape.borderRadius,
    textTransform: 'none',
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
    },
  },
  tabs: {
    marginBottom: theme.spacing(2),
    '& .MuiTabs-indicator': {
      height: 3,
    },
    '& .MuiTab-root': {
      transition: 'all 0.2s',
      '&:hover': {
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.action.hover,
      },
    },
  },
  confidenceChip: {
    fontWeight: 'bold',
  },
  headerTypography: {
    position: 'relative',
    display: 'inline-block',
    marginBottom: theme.spacing(3),
    '&:after': {
      content: '""',
      position: 'absolute',
      width: '40%',
      height: '4px',
      bottom: '-10px',
      left: '0',
      backgroundColor: theme.palette.primary.main,
      borderRadius: '2px',
    },
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
      {value === index && (
        <Fade in={value === index} timeout={500}>
          <Box p={3}>{children}</Box>
        </Fade>
      )}
    </div>
  );
}

// Helper function to get avatar color based on name
const getAvatarColor = (name) => {
  if (name.toLowerCase().includes('hr')) return purple[500];
  if (name.toLowerCase().includes('finance')) return green[500];
  if (name.toLowerCase().includes('code') || name.toLowerCase().includes('engineer')) return blue[500];
  if (name.toLowerCase().includes('admin')) return red[500];
  return orange[500];
};

// Helper function to get avatar letter
const getAvatarLetter = (name) => {
  return name.charAt(0).toUpperCase();
};

// Helper function to get confidence color
const getConfidenceColor = (confidence) => {
  if (confidence >= 80) return green[500];
  if (confidence >= 60) return orange[500];
  return red[500];
};

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
      <Fade in={true}>
        <div>
          <Typography variant="h6" gutterBottom className={classes.headerTypography}>
            No Results Found
          </Typography>
          <Typography variant="body1" paragraph>
            No roles were discovered with the current filters. Please try again with different filters.
          </Typography>
          <Button startIcon={<ArrowBackIcon />} variant="contained" color="primary" onClick={onBack}
            className={classes.viewButton}>
            Back to Filters
          </Button>
        </div>
      </Fade>
    );
  }

  const renderRolesAsCards = (roles, showConfidence = false) => {
    return (
      <Grid container spacing={3} className={classes.cardGrid}>
        {roles.map((role, index) => (
          <Grow in={true} timeout={(index + 1) * 300} key={role.id}>
            <Grid item xs={12} sm={6} md={4}>
              <Card className={classes.card}>
                <div className={classes.cardHeader}>
                  <Avatar 
                    className={classes.avatar} 
                    style={{ backgroundColor: getAvatarColor(role.name) }}
                  >
                    {getAvatarLetter(role.name)}
                  </Avatar>
                  <Typography variant="h6" component="h2">
                    {role.name}
                  </Typography>
                </div>
                <CardContent className={classes.cardContent}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" color="textSecondary">
                      Users
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {role.userCount}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" color="textSecondary">
                      Permissions
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {role.permissionCount}
                    </Typography>
                  </Box>
                  {showConfidence && (
                    <Box display="flex" justifyContent="space-between" mb={2}>
                      <Typography variant="body2" color="textSecondary">
                        AI Confidence
                      </Typography>
                      <Chip 
                        label={`${role.confidence}%`} 
                        size="small" 
                        className={classes.confidenceChip}
                        style={{ 
                          backgroundColor: getConfidenceColor(role.confidence),
                          color: 'white'
                        }}
                      />
                    </Box>
                  )}
                  <Divider style={{ margin: '12px 0' }}/>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Applications
                  </Typography>
                  <Box mt={1}>
                    {role.applications.map((app, index) => (
                      <Zoom in={true} timeout={600 + (index * 100)} key={index}>
                        <Chip
                          label={app}
                          size="small"
                          className={classes.chip}
                        />
                      </Zoom>
                    ))}
                  </Box>
                </CardContent>
                <CardActions className={classes.cardActions}>
                  <Button 
                    startIcon={<VisibilityIcon />}
                    variant="outlined" 
                    color="primary"
                    size="small"
                    className={classes.viewButton}
                    onClick={() => handleOpenDetails(role)}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grow>
        ))}
      </Grid>
    );
  };

  return (
    <Fade in={true}>
      <div className={classes.root}>
        <Typography variant="h5" gutterBottom className={classes.headerTypography}>
          Role Mining Results
        </Typography>
        
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          className={classes.tabs}
        >
          <Tab label="Filter-Based Roles" />
          <Tab label="AI-Suggested Roles" />
        </Tabs>
        
        <TabPanel value={tabValue} index={0}>
          <Typography variant="body1" paragraph>
            The following roles were discovered based on your filter criteria:
          </Typography>
          
          {renderRolesAsCards(results)}
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
            <Box display="flex" justifyContent="center" alignItems="center" p={4}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" style={{ marginBottom: '16px' }}>
              {error}
            </Alert>
          ) : aiSuggestedRoles.length === 0 ? (
            <Alert severity="info">
              No AI suggestions available. Try running role mining with AI enabled.
            </Alert>
          ) : (
            renderRolesAsCards(aiSuggestedRoles, true)
          )}
        </TabPanel>
        
        <Zoom in={true} timeout={800}>
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
        </Zoom>
        
        {/* Role Details Dialog */}
        <Dialog
          open={detailDialogOpen}
          onClose={() => setDetailDialogOpen(false)}
          aria-labelledby="role-detail-dialog-title"
          TransitionComponent={Zoom}
        >
          <DialogTitle id="role-detail-dialog-title">
            <Box display="flex" alignItems="center">
              {selectedRole && (
                <>
                  <Avatar 
                    className={classes.avatar} 
                    style={{ backgroundColor: getAvatarColor(selectedRole.name) }}
                  >
                    {getAvatarLetter(selectedRole.name)}
                  </Avatar>
                  <Typography variant="h6">
                    {selectedRole?.name}
                  </Typography>
                </>
              )}
            </Box>
          </DialogTitle>
          <DialogContent className={classes.dialogContent}>
            {selectedRole && (
              <>
                <Typography variant="subtitle1" gutterBottom>
                  Users ({selectedRole.userCount})
                </Typography>
                <List dense>
                  {selectedRole.users ? (
                    selectedRole.users.map((user, index) => (
                      <Fade in={true} timeout={(index + 1) * 200} key={index}>
                        <ListItem>
                          <ListItemText 
                            primary={user} 
                          />
                        </ListItem>
                      </Fade>
                    ))
                  ) : (
                    Array(Math.min(selectedRole.userCount, 5)).fill(0).map((_, index) => (
                      <Fade in={true} timeout={(index + 1) * 200} key={index}>
                        <ListItem>
                          <ListItemText 
                            primary={`User ${index + 1}`} 
                            secondary={`user${index + 1}@example.com`} 
                          />
                        </ListItem>
                      </Fade>
                    ))
                  )}
                  {!selectedRole.users && selectedRole.userCount > 5 && (
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
                    <Zoom in={true} timeout={400 + (index * 100)} key={index}>
                      <Chip
                        label={app}
                        className={classes.chip}
                      />
                    </Zoom>
                  ))}
                </Box>
                
                <Typography variant="subtitle1" gutterBottom>
                  Permissions ({selectedRole.permissionCount})
                </Typography>
                <List dense>
                  {selectedRole.permissions ? (
                    selectedRole.permissions.map((permission, index) => (
                      <Fade in={true} timeout={(index + 1) * 200} key={index}>
                        <ListItem>
                          <ListItemText primary={permission} />
                        </ListItem>
                      </Fade>
                    ))
                  ) : (
                    Array(Math.min(selectedRole.permissionCount, 5)).fill(0).map((_, index) => (
                      <Fade in={true} timeout={(index + 1) * 200} key={index}>
                        <ListItem>
                          <ListItemText 
                            primary={`Permission ${index + 1}`} 
                            secondary={`${selectedRole.applications[index % selectedRole.applications.length]} - Access Level ${index + 1}`} 
                          />
                        </ListItem>
                      </Fade>
                    ))
                  )}
                  {!selectedRole.permissions && selectedRole.permissionCount > 5 && (
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
            <Button onClick={() => setDetailDialogOpen(false)} color="primary" variant="contained">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </Fade>
  );
};

export default RoleMiningResults; 