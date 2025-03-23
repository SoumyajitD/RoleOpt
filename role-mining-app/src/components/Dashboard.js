import React, { useState } from 'react';
import { 
  Typography, 
  Grid, 
  Paper, 
  Button, 
  Card, 
  CardContent, 
  CardActions, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  ListItemAvatar, 
  Avatar, 
  Box, 
  Divider,
  IconButton,
  Badge
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import AssignmentIcon from '@material-ui/icons/Assignment';
import GroupIcon from '@material-ui/icons/Group';
import SecurityIcon from '@material-ui/icons/Security';
import SettingsIcon from '@material-ui/icons/Settings';
import AssessmentIcon from '@material-ui/icons/Assessment';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import StorageIcon from '@material-ui/icons/Storage';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import TimelineIcon from '@material-ui/icons/Timeline';
import NotificationsIcon from '@material-ui/icons/Notifications';
import WarningIcon from '@material-ui/icons/Warning';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import DashboardIcon from '@material-ui/icons/Dashboard';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  welcomeSection: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    background: 'linear-gradient(45deg, #5c6bc0 30%, #8e99f3 90%)',
    color: 'white',
    borderRadius: theme.spacing(1),
    boxShadow: '0 3px 15px rgba(0,0,0,0.2)',
  },
  welcomeTitle: {
    fontWeight: 600,
    marginBottom: theme.spacing(1),
  },
  welcomeMessage: {
    marginBottom: theme.spacing(2),
  },
  welcomeActions: {
    display: 'flex',
    gap: theme.spacing(2),
  },
  statsCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: theme.spacing(1),
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
    },
  },
  statIcon: {
    backgroundColor: theme.palette.primary.main,
    padding: theme.spacing(2),
    borderRadius: '50%',
    color: 'white',
    marginBottom: theme.spacing(1),
  },
  moduleCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: theme.spacing(1),
    transition: 'all 0.3s ease',
    borderLeft: '4px solid transparent',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
      borderLeft: `4px solid ${theme.palette.primary.main}`,
    },
  },
  roleMiningCard: {
    borderLeft: `4px solid ${theme.palette.primary.main}`,
  },
  moduleIcon: {
    color: theme.palette.primary.main,
    fontSize: theme.spacing(6),
    marginBottom: theme.spacing(1),
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  cardTitle: {
    fontWeight: 500,
  },
  activityItem: {
    borderLeft: '3px solid transparent',
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  activityItemNew: {
    borderLeft: `3px solid ${theme.palette.primary.main}`,
  },
  activityTime: {
    color: theme.palette.text.secondary,
    fontSize: '0.8rem',
  },
  activityAvatar: {
    backgroundColor: (props) => {
      switch (props.type) {
        case 'warning':
          return theme.palette.warning.main;
        case 'success':
          return theme.palette.success.main;
        case 'info':
          return theme.palette.info.main;
        default:
          return theme.palette.primary.main;
      }
    }
  },
  notificationBadge: {
    margin: theme.spacing(0, 2),
  },
  sectionTitle: {
    fontWeight: 600,
    marginBottom: theme.spacing(2),
  },
  sidebarNav: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(1),
    marginRight: theme.spacing(3),
  },
  navItem: {
    borderLeft: '4px solid transparent',
    transition: 'all 0.2s ease',
    '&:hover': {
      borderLeft: `4px solid ${theme.palette.primary.main}`,
      backgroundColor: theme.palette.action.hover,
    },
  },
  navItemActive: {
    borderLeft: `4px solid ${theme.palette.primary.main}`,
    backgroundColor: theme.palette.action.selected,
  },
  navIcon: {
    color: theme.palette.text.secondary,
  },
  contentBox: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(1),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(3),
  },
}));

const Dashboard = ({ onStartRoleMining }) => {
  const classes = useStyles();
  
  const [statistics] = useState({
    users: 1458,
    roles: 87,
    applications: 32,
    pendingReviews: 14
  });
  
  const [activities] = useState([
    { id: 1, type: 'warning', text: 'Access review for Finance team is pending', time: '10 minutes ago', new: true, icon: <WarningIcon /> },
    { id: 2, type: 'success', text: 'New role "Engineering Lead" created', time: '1 hour ago', new: true, icon: <CheckCircleIcon /> },
    { id: 3, type: 'info', text: 'User John Doe joined Engineering team', time: '3 hours ago', new: false, icon: <GroupIcon /> },
    { id: 4, type: 'info', text: 'Role mining completed for Sales department', time: '1 day ago', new: false, icon: <AssessmentIcon /> },
    { id: 5, type: 'warning', text: 'Unusual access pattern detected', time: '2 days ago', new: false, icon: <SecurityIcon /> },
  ]);
  
  const [notifications] = useState(3);
  
  const [activeNav] = useState('dashboard');
  
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        {/* Welcome Section */}
        <Grid item xs={12}>
          <Paper className={classes.welcomeSection}>
            <Typography variant="h4" className={classes.welcomeTitle}>
              Welcome to Verify Role Optimization
            </Typography>
            <Typography variant="body1" className={classes.welcomeMessage}>
              Your modern identity governance platform. Optimize roles, manage access, and ensure compliance with ease.
            </Typography>
            <div className={classes.welcomeActions}>
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={onStartRoleMining}
                endIcon={<ArrowForwardIcon />}
              >
                Start Role Mining
              </Button>
              <Button variant="outlined" style={{ color: 'white', borderColor: 'white' }}>
                View Tutorial
              </Button>
            </div>
          </Paper>
        </Grid>
        
        {/* Main Content */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            {/* Sidebar Navigation */}
            <Grid item xs={12} md={3}>
              <Paper className={classes.sidebarNav}>
                <List component="nav" aria-label="main navigation">
                  <ListItem button className={`${classes.navItem} ${activeNav === 'dashboard' ? classes.navItemActive : ''}`}>
                    <ListItemIcon className={classes.navIcon}>
                      <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                  </ListItem>
                  <ListItem button className={classes.navItem}>
                    <ListItemIcon className={classes.navIcon}>
                      <AssessmentIcon />
                    </ListItemIcon>
                    <ListItemText primary="Role Mining" />
                    <Badge badgeContent="New" color="secondary" className={classes.notificationBadge} />
                  </ListItem>
                  <ListItem button className={classes.navItem}>
                    <ListItemIcon className={classes.navIcon}>
                      <VerifiedUserIcon />
                    </ListItemIcon>
                    <ListItemText primary="Access Reviews" />
                  </ListItem>
                  <ListItem button className={classes.navItem}>
                    <ListItemIcon className={classes.navIcon}>
                      <GroupIcon />
                    </ListItemIcon>
                    <ListItemText primary="User Management" />
                  </ListItem>
                  <ListItem button className={classes.navItem}>
                    <ListItemIcon className={classes.navIcon}>
                      <SecurityIcon />
                    </ListItemIcon>
                    <ListItemText primary="Compliance" />
                    <Badge badgeContent={3} color="error" className={classes.notificationBadge} />
                  </ListItem>
                  <ListItem button className={classes.navItem}>
                    <ListItemIcon className={classes.navIcon}>
                      <StorageIcon />
                    </ListItemIcon>
                    <ListItemText primary="Connectors" />
                  </ListItem>
                  <ListItem button className={classes.navItem}>
                    <ListItemIcon className={classes.navIcon}>
                      <SupervisorAccountIcon />
                    </ListItemIcon>
                    <ListItemText primary="Admin" />
                  </ListItem>
                  <ListItem button className={classes.navItem}>
                    <ListItemIcon className={classes.navIcon}>
                      <SettingsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Settings" />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
            
            {/* Main Content Area */}
            <Grid item xs={12} md={9}>
              {/* Statistics */}
              <Box className={classes.contentBox}>
                <Typography variant="h5" className={classes.sectionTitle}>
                  Key Statistics
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper className={classes.statsCard}>
                      <CardContent>
                        <Box display="flex" flexDirection="column" alignItems="center">
                          <Avatar className={classes.statIcon}>
                            <GroupIcon />
                          </Avatar>
                          <Typography variant="h4" component="h2">
                            {statistics.users.toLocaleString()}
                          </Typography>
                          <Typography color="textSecondary">
                            Users
                          </Typography>
                        </Box>
                      </CardContent>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper className={classes.statsCard}>
                      <CardContent>
                        <Box display="flex" flexDirection="column" alignItems="center">
                          <Avatar className={classes.statIcon}>
                            <AssignmentIcon />
                          </Avatar>
                          <Typography variant="h4" component="h2">
                            {statistics.roles}
                          </Typography>
                          <Typography color="textSecondary">
                            Roles
                          </Typography>
                        </Box>
                      </CardContent>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper className={classes.statsCard}>
                      <CardContent>
                        <Box display="flex" flexDirection="column" alignItems="center">
                          <Avatar className={classes.statIcon}>
                            <StorageIcon />
                          </Avatar>
                          <Typography variant="h4" component="h2">
                            {statistics.applications}
                          </Typography>
                          <Typography color="textSecondary">
                            Applications
                          </Typography>
                        </Box>
                      </CardContent>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper className={classes.statsCard}>
                      <CardContent>
                        <Box display="flex" flexDirection="column" alignItems="center">
                          <Avatar className={classes.statIcon}>
                            <VerifiedUserIcon />
                          </Avatar>
                          <Typography variant="h4" component="h2">
                            {statistics.pendingReviews}
                          </Typography>
                          <Typography color="textSecondary">
                            Pending Reviews
                          </Typography>
                        </Box>
                      </CardContent>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
              
              {/* Key Modules */}
              <Box className={classes.contentBox}>
                <Typography variant="h5" className={classes.sectionTitle}>
                  Key Modules
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Card className={`${classes.moduleCard} ${classes.roleMiningCard}`}>
                      <CardContent>
                        <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                          <AssessmentIcon className={classes.moduleIcon} />
                          <Typography variant="h6" className={classes.cardTitle}>
                            Role Mining
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Discover and create optimized roles based on user access patterns
                          </Typography>
                        </Box>
                      </CardContent>
                      <CardActions>
                        <Button 
                          color="primary" 
                          fullWidth
                          onClick={onStartRoleMining}
                          endIcon={<ArrowForwardIcon />}
                        >
                          Start Now
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Card className={classes.moduleCard}>
                      <CardContent>
                        <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                          <VerifiedUserIcon className={classes.moduleIcon} />
                          <Typography variant="h6" className={classes.cardTitle}>
                            Access Reviews
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Streamline certification campaigns to ensure proper access
                          </Typography>
                        </Box>
                      </CardContent>
                      <CardActions>
                        <Button 
                          color="primary" 
                          fullWidth
                          endIcon={<ArrowForwardIcon />}
                        >
                          View Reviews
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Card className={classes.moduleCard}>
                      <CardContent>
                        <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                          <GroupIcon className={classes.moduleIcon} />
                          <Typography variant="h6" className={classes.cardTitle}>
                            User Management
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Manage users, their roles, and entitlements across your systems
                          </Typography>
                        </Box>
                      </CardContent>
                      <CardActions>
                        <Button 
                          color="primary" 
                          fullWidth
                          endIcon={<ArrowForwardIcon />}
                        >
                          Manage Users
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
              
              {/* Recent Activity and Notifications */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Paper className={classes.contentBox}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="h5" className={classes.sectionTitle}>
                        Recent Activity
                      </Typography>
                      <Button color="primary" endIcon={<TimelineIcon />}>
                        View All
                      </Button>
                    </Box>
                    <List>
                      {activities.map((activity) => (
                        <React.Fragment key={activity.id}>
                          <ListItem className={`${classes.activityItem} ${activity.new ? classes.activityItemNew : ''}`}>
                            <ListItemAvatar>
                              <Avatar className={classes.activityAvatar} type={activity.type}>
                                {activity.icon}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText 
                              primary={activity.text}
                              secondary={<span className={classes.activityTime}>{activity.time}</span>}
                            />
                            {activity.new && (
                              <Badge badgeContent="New" color="secondary" />
                            )}
                          </ListItem>
                          {activity.id < activities.length && <Divider variant="inset" component="li" />}
                        </React.Fragment>
                      ))}
                    </List>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper className={classes.contentBox}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="h5" className={classes.sectionTitle}>
                        Notifications
                      </Typography>
                      <Badge badgeContent={notifications} color="secondary">
                        <NotificationsIcon />
                      </Badge>
                    </Box>
                    <List>
                      <ListItem className={`${classes.activityItem} ${classes.activityItemNew}`}>
                        <ListItemText 
                          primary="Access review for Finance team needs approval"
                          secondary={<span className={classes.activityTime}>2 hours ago</span>}
                        />
                        <IconButton size="small" color="primary">
                          <ArrowForwardIcon />
                        </IconButton>
                      </ListItem>
                      <Divider component="li" />
                      <ListItem className={`${classes.activityItem} ${classes.activityItemNew}`}>
                        <ListItemText 
                          primary="Role Mining results ready for review"
                          secondary={<span className={classes.activityTime}>Yesterday</span>}
                        />
                        <IconButton size="small" color="primary">
                          <ArrowForwardIcon />
                        </IconButton>
                      </ListItem>
                      <Divider component="li" />
                      <ListItem className={classes.activityItem}>
                        <ListItemText 
                          primary="New compliance policy needs review"
                          secondary={<span className={classes.activityTime}>2 days ago</span>}
                        />
                        <IconButton size="small" color="primary">
                          <ArrowForwardIcon />
                        </IconButton>
                      </ListItem>
                    </List>
                    <Box mt={2} display="flex" justifyContent="center">
                      <Button color="primary">
                        View All Notifications
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard; 