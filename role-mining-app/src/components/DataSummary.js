import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import PeopleIcon from '@material-ui/icons/People';
import BusinessIcon from '@material-ui/icons/Business';
import AppsIcon from '@material-ui/icons/Apps';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import LinkIcon from '@material-ui/icons/Link';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
  cardRoot: {
    minWidth: 200,
    textAlign: 'center',
    height: '100%',
  },
  iconContainer: {
    marginBottom: theme.spacing(1),
  },
  icon: {
    fontSize: 48,
    color: theme.palette.primary.main,
  },
  title: {
    fontSize: 14,
    color: theme.palette.text.secondary,
  },
  value: {
    marginBottom: theme.spacing(1),
  },
  buttonGroup: {
    marginTop: theme.spacing(4),
  },
}));

const DataSummary = ({ summary, onNext, onBack }) => {
  const classes = useStyles();
  
  if (!summary) {
    return (
      <Typography variant="body1" color="error">
        No data summary available. Please go back and upload data files.
      </Typography>
    );
  }

  const summaryCards = [
    { title: 'Users', value: summary.users, icon: <PeopleIcon className={classes.icon} /> },
    { title: 'Organizational Units', value: summary.ous, icon: <BusinessIcon className={classes.icon} /> },
    { title: 'Applications', value: summary.applications, icon: <AppsIcon className={classes.icon} /> },
    { title: 'Entitlements', value: summary.entitlements, icon: <VpnKeyIcon className={classes.icon} /> },
    { title: 'User Assignments', value: summary.assignments, icon: <LinkIcon className={classes.icon} /> },
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Data Summary
      </Typography>
      
      <Typography variant="body1" paragraph>
        Review the summary of uploaded data before proceeding to role mining.
      </Typography>
      
      <Grid container spacing={4}>
        {summaryCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
            <Card className={classes.cardRoot} variant="outlined">
              <CardContent>
                <div className={classes.iconContainer}>
                  {card.icon}
                </div>
                <Typography className={classes.title} gutterBottom>
                  {card.title}
                </Typography>
                <Typography variant="h4" component="p" className={classes.value}>
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <div className={classes.buttonGroup}>
        <ButtonGroup variant="contained" color="primary">
          <Button startIcon={<ArrowBackIcon />} onClick={onBack}>
            Back to Upload
          </Button>
          <Button endIcon={<ArrowForwardIcon />} onClick={onNext}>
            Continue to Role Mining
          </Button>
        </ButtonGroup>
      </div>
    </Box>
  );
};

export default DataSummary; 