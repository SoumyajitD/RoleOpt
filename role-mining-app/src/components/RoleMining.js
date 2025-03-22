import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import FormHelperText from '@material-ui/core/FormHelperText';
import Divider from '@material-ui/core/Divider';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  section: {
    marginBottom: theme.spacing(4),
  },
  buttonGroup: {
    marginTop: theme.spacing(4),
  },
  divider: {
    margin: theme.spacing(4, 0),
  },
  aiSection: {
    padding: theme.spacing(3),
    backgroundColor: '#f8f9fa',
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(4),
  },
}));

// Mock data - In a real app, this would come from the backend
const mockApplications = [
  { id: 1, name: 'Email System' },
  { id: 2, name: 'HR Portal' },
  { id: 3, name: 'Finance System' },
  { id: 4, name: 'CRM' },
  { id: 5, name: 'Document Management' },
  { id: 6, name: 'ERP System' },
  { id: 7, name: 'Intranet' },
];

const mockOrganizationalUnits = [
  { id: 1, name: 'IT Department' },
  { id: 2, name: 'HR Department' },
  { id: 3, name: 'Finance' },
  { id: 4, name: 'Sales' },
  { id: 5, name: 'Marketing' },
  { id: 6, name: 'Operations' },
  { id: 7, name: 'Executive' },
];

const RoleMining = ({ onSubmit, onBack }) => {
  const classes = useStyles();
  
  const [filters, setFilters] = useState({
    applications: [],
    organizationalUnits: [],
    minUsersPerRole: 2,
    maxPermissionsPerRole: 10,
  });
  
  const [useAi, setUseAi] = useState(true);
  const [validationErrors, setValidationErrors] = useState({});

  // In a real app, fetch options from the backend
  const [applicationOptions, setApplicationOptions] = useState([]);
  const [ouOptions, setOuOptions] = useState([]);
  
  useEffect(() => {
    // Simulate fetching data from API
    setTimeout(() => {
      setApplicationOptions(mockApplications);
      setOuOptions(mockOrganizationalUnits);
    }, 500);
  }, []);
  
  const handleApplicationChange = (event) => {
    setFilters({
      ...filters,
      applications: event.target.value,
    });
  };
  
  const handleOUChange = (event) => {
    setFilters({
      ...filters,
      organizationalUnits: event.target.value,
    });
  };
  
  const handleNumberChange = (event) => {
    const { name, value } = event.target;
    let numValue = parseInt(value, 10);
    
    if (isNaN(numValue) || numValue < 0) {
      numValue = 0;
    }
    
    setFilters({
      ...filters,
      [name]: numValue,
    });
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (filters.minUsersPerRole < 1) {
      errors.minUsersPerRole = 'Must be at least 1';
    }
    
    if (filters.maxPermissionsPerRole < 1) {
      errors.maxPermissionsPerRole = 'Must be at least 1';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        ...filters,
        useAi,
      });
    }
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Configure Role Mining
      </Typography>
      
      <Typography variant="body1" paragraph>
        Customize the role discovery process using the filters below. All filters are optional.
      </Typography>
      
      <div className={classes.section}>
        <Typography variant="subtitle1" gutterBottom>
          Filter by Applications
        </Typography>
        <FormControl className={classes.formControl}>
          <InputLabel id="application-select-label">Applications</InputLabel>
          <Select
            labelId="application-select-label"
            id="application-select"
            multiple
            value={filters.applications}
            onChange={handleApplicationChange}
            renderValue={(selected) => (
              <div className={classes.chips}>
                {selected.map((value) => {
                  const app = applicationOptions.find(a => a.id === value);
                  return (
                    <Chip 
                      key={value} 
                      label={app ? app.name : value} 
                      className={classes.chip} 
                    />
                  );
                })}
              </div>
            )}
          >
            {applicationOptions.map((app) => (
              <MenuItem key={app.id} value={app.id}>
                {app.name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>Select applications to include in role mining</FormHelperText>
        </FormControl>
      </div>
      
      <div className={classes.section}>
        <Typography variant="subtitle1" gutterBottom>
          Filter by Organizational Units
        </Typography>
        <FormControl className={classes.formControl}>
          <InputLabel id="ou-select-label">Organizational Units</InputLabel>
          <Select
            labelId="ou-select-label"
            id="ou-select"
            multiple
            value={filters.organizationalUnits}
            onChange={handleOUChange}
            renderValue={(selected) => (
              <div className={classes.chips}>
                {selected.map((value) => {
                  const ou = ouOptions.find(o => o.id === value);
                  return (
                    <Chip 
                      key={value} 
                      label={ou ? ou.name : value} 
                      className={classes.chip} 
                    />
                  );
                })}
              </div>
            )}
          >
            {ouOptions.map((ou) => (
              <MenuItem key={ou.id} value={ou.id}>
                {ou.name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>Select organizational units to include in role mining</FormHelperText>
        </FormControl>
      </div>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            Minimum Users per Role
          </Typography>
          <TextField
            id="min-users-per-role"
            name="minUsersPerRole"
            type="number"
            value={filters.minUsersPerRole}
            onChange={handleNumberChange}
            fullWidth
            InputProps={{ inputProps: { min: 1 } }}
            error={!!validationErrors.minUsersPerRole}
            helperText={validationErrors.minUsersPerRole || "Minimum number of users that must have the same permissions to form a role"}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            Maximum Permissions per Role
          </Typography>
          <TextField
            id="max-permissions-per-role"
            name="maxPermissionsPerRole"
            type="number"
            value={filters.maxPermissionsPerRole}
            onChange={handleNumberChange}
            fullWidth
            InputProps={{ inputProps: { min: 1 } }}
            error={!!validationErrors.maxPermissionsPerRole}
            helperText={validationErrors.maxPermissionsPerRole || "Maximum number of permissions to include in a single role"}
          />
        </Grid>
      </Grid>
      
      <Divider className={classes.divider} />
      
      <Paper className={classes.aiSection} variant="outlined">
        <Typography variant="subtitle1" gutterBottom>
          AI-Assisted Role Discovery
        </Typography>
        
        <FormControlLabel
          control={
            <Switch
              checked={useAi}
              onChange={(e) => setUseAi(e.target.checked)}
              name="useAi"
              color="primary"
            />
          }
          label="Enable AI to analyze access patterns and suggest optimal roles"
        />
        
        <Typography variant="body2" color="textSecondary">
          AI will analyze user access patterns to identify common groupings and suggest roles that might not be apparent through manual filtering.
        </Typography>
      </Paper>
      
      <div className={classes.buttonGroup}>
        <ButtonGroup variant="contained" color="primary">
          <Button startIcon={<ArrowBackIcon />} onClick={onBack}>
            Back
          </Button>
          <Button 
            startIcon={<PlayCircleFilledIcon />} 
            onClick={handleSubmit}
            color="secondary"
          >
            Run Role Mining
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
};

export default RoleMining; 