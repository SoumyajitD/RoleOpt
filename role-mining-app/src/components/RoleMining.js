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

  // State for options from the backend
  const [applicationOptions, setApplicationOptions] = useState([]);
  const [ouOptions, setOuOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Fetch data from the backend
    const fetchMetadata = async () => {
      setLoading(true);
      try {
        // Fetch applications
        const appResponse = await fetch('http://localhost:8080/api/metadata/applications');
        if (!appResponse.ok) {
          throw new Error(`Applications API error: ${appResponse.statusText}`);
        }
        const appData = await appResponse.json();
        
        // Fetch organizational units
        const ouResponse = await fetch('http://localhost:8080/api/metadata/organizational-units');
        if (!ouResponse.ok) {
          throw new Error(`Organizational Units API error: ${ouResponse.statusText}`);
        }
        const ouData = await ouResponse.json();
        
        setApplicationOptions(appData || []);
        setOuOptions(ouData || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching metadata:', err);
        setError('Failed to load filter options. Using default values.');
        // Fallback to empty arrays
        setApplicationOptions([]);
        setOuOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
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
      
      {error && (
        <Typography variant="body2" color="error" paragraph>
          {error}
        </Typography>
      )}
      
      <div className={classes.section}>
        <Typography variant="subtitle1" gutterBottom>
          Filter by Applications
        </Typography>
        <FormControl className={classes.formControl} disabled={loading}>
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
            {loading ? (
              <MenuItem disabled>Loading applications...</MenuItem>
            ) : applicationOptions.length === 0 ? (
              <MenuItem disabled>No applications available</MenuItem>
            ) : (
              applicationOptions.map((app) => (
                <MenuItem key={app.id} value={app.id}>
                  {app.name}
                </MenuItem>
              ))
            )}
          </Select>
          <FormHelperText>
            {loading ? 'Loading applications...' : 'Select applications to include in role mining'}
          </FormHelperText>
        </FormControl>
      </div>
      
      <div className={classes.section}>
        <Typography variant="subtitle1" gutterBottom>
          Filter by Organizational Units
        </Typography>
        <FormControl className={classes.formControl} disabled={loading}>
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
            {loading ? (
              <MenuItem disabled>Loading organizational units...</MenuItem>
            ) : ouOptions.length === 0 ? (
              <MenuItem disabled>No organizational units available</MenuItem>
            ) : (
              ouOptions.map((ou) => (
                <MenuItem key={ou.id} value={ou.id}>
                  {ou.name}
                </MenuItem>
              ))
            )}
          </Select>
          <FormHelperText>
            {loading ? 'Loading organizational units...' : 'Select organizational units to include in role mining'}
          </FormHelperText>
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