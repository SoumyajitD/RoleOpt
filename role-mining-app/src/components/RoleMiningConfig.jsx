import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button,
  TextField,
  Autocomplete,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  FormHelperText,
  Tooltip,
  Chip,
  Grid,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Checkbox,
  ListItemText,
  Collapse,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { getApplications, getOrganizationalUnits } from '../services/api';
import {
  ConfigContainer,
  ConfigHeader,
  ConfigTitle,
  ResetButton,
  ConfigPaper,
  StartMiningButton,
  inputStyles,
  selectStyles,
  menuProps,
  chipStyles
} from '../styles/RoleMiningConfig.styles';

const RoleMiningConfig = ({ summary, onRunRoleMining }) => {
  const [roleMiningConfig, setRoleMiningConfig] = useState({
    applications: [],
    organizationalUnits: [],
    minEntitlements: 1,
    maxEntitlements: 10,
  });
  const [configErrors, setConfigErrors] = useState({});
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [error, setError] = useState(null);
  
  // New state for dropdown options
  const [applicationOptions, setApplicationOptions] = useState([]);
  const [ouOptions, setOUOptions] = useState([]);
  const [isLoading, setIsLoading] = useState({
    applications: false,
    organizationalUnits: false
  });

  // New state for AI suggestions expansion
  const [isAISuggestionsExpanded, setIsAISuggestionsExpanded] = useState(false);

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading({ applications: true, organizationalUnits: true });
        setError(null);

        // Fetch applications
        const [appsData, ousData] = await Promise.all([
          getApplications(),
          getOrganizationalUnits()
        ]);

        setApplicationOptions(appsData);
        setOUOptions(ousData);
      } catch (err) {
        setError('Failed to fetch dropdown options. Please try again later.');
        console.error('Error fetching options:', err);
      } finally {
        setIsLoading({ applications: false, organizationalUnits: false });
      }
    };

    fetchData();
  }, []);

  // Add effect to fetch suggestions when expanded
  useEffect(() => {
    if (isAISuggestionsExpanded && !aiSuggestions && !isLoadingSuggestions) {
      handleGetAISuggestions();
    }
  }, [isAISuggestionsExpanded]);

  const handleConfigChange = (field, value) => {
    let errors = { ...configErrors };
    
    if (['minEntitlements', 'maxEntitlements'].includes(field)) {
      if (value && (!Number.isInteger(Number(value)) || Number(value) <= 0)) {
        errors[field] = 'Please enter a positive integer';
      } else {
        delete errors[field];
      }
    }

    setConfigErrors(errors);
    setRoleMiningConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRunRoleMining = () => {
    // Validation
    const errors = {};
    if (roleMiningConfig.minEntitlements && 
        (!Number.isInteger(Number(roleMiningConfig.minEntitlements)) || 
         Number(roleMiningConfig.minEntitlements) <= 0)) {
      errors.minEntitlements = 'Please enter a positive integer';
    }
    if (roleMiningConfig.maxEntitlements && 
        (!Number.isInteger(Number(roleMiningConfig.maxEntitlements)) || 
         Number(roleMiningConfig.maxEntitlements) <= 0)) {
      errors.maxEntitlements = 'Please enter a positive integer';
    }
    if (roleMiningConfig.minEntitlements > roleMiningConfig.maxEntitlements) {
      errors.minEntitlements = 'Minimum entitlements cannot be greater than maximum';
    }

    if (Object.keys(errors).length > 0) {
      setConfigErrors(errors);
      return;
    }

    onRunRoleMining(roleMiningConfig);
  };

  const handleResetFilters = () => {
    setRoleMiningConfig({
      applications: [],
      organizationalUnits: [],
      minEntitlements: 1,
      maxEntitlements: 10,
    });
    setConfigErrors({});
    setError(null);
  };

  const handleGetAISuggestions = async () => {
    setIsLoadingSuggestions(true);
    setError(null);
    try {
      // TODO: Implement AI suggestions API call
      // Mock response for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      setAiSuggestions({
        applications: ['SAP', 'Salesforce'],
        organizationalUnits: ['IT', 'Finance'],
        entitlementRange: {
          min: 1,
          max: 10,
        },
        confidence: 0.85
      });
    } catch (error) {
      setError('Failed to get AI suggestions. Please try again.');
      console.error('Failed to get AI suggestions:', error);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleAcceptAllSuggestions = () => {
    if (aiSuggestions) {
      setRoleMiningConfig({
        applications: aiSuggestions.applications,
        organizationalUnits: aiSuggestions.organizationalUnits,
        minEntitlements: aiSuggestions.entitlementRange.min,
        maxEntitlements: aiSuggestions.entitlementRange.max,
      });
      setConfigErrors({});
    }
  };

//   // Extract unique applications and OUs from summary data with null checks
//   const applications = summary?.applications?.data?.map(app => app.name) || [];
//   const organizationalUnits = summary?.ou?.data?.map(ou => ou.name) || [];

  // Add null check for summary
  if (!summary) {
    return (
      <Box sx={{ 
        width: '100%', 
        maxWidth: '1200px', 
        mx: 'auto', 
        p: 3,
        backgroundColor: '#F9FAFB',
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2
      }}>
        <Typography variant="h5" sx={{ color: '#1F2937', fontWeight: 600 }}>
          No Data Available
        </Typography>
        <Typography variant="body1" sx={{ color: '#6B7280' }}>
          Please upload files first to configure role mining.
        </Typography>
        <Button
          variant="contained"
          onClick={() => window.location.href = '/'}
          startIcon={<RefreshIcon />}
          sx={{
            backgroundColor: '#1E40AF',
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: '#1E3A8A',
            }
          }}
        >
          Back to Upload
        </Button>
      </Box>
    );
  }

  // Check if the configuration is valid
  const isValid = Object.keys(configErrors).length === 0 && 
    (roleMiningConfig.applications.length > 0 || roleMiningConfig.organizationalUnits.length > 0);

  return (
    <ConfigContainer>
      <ConfigHeader>
        <ConfigTitle variant="h5">
          Role Mining Configuration
        </ConfigTitle>
        <ResetButton
          variant="outlined"
          onClick={handleResetFilters}
          startIcon={<RestartAltIcon />}
        >
          Reset Filters
        </ResetButton>
      </ConfigHeader>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <ConfigPaper>
            <Typography variant="h6" sx={{ color: '#1F2937', mb: 3, fontWeight: 600 }}>
              Filter Configuration
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!configErrors.applications}>
                  <InputLabel id="applications-label" sx={{ 
                    color: '#000000',
                    backgroundColor: '#FFFFFF',
                    px: 1,
                  }}>Applications</InputLabel>
                  <Select
                    labelId="applications-label"
                    multiple
                    value={roleMiningConfig.applications}
                    onChange={(e) => handleConfigChange('applications', e.target.value)}
                    renderValue={(selected) => {
                      const maxDisplay = 2;
                      const selectedApps = applicationOptions
                        .filter(app => selected.includes(app.name))
                        .slice(0, maxDisplay);
                      const remainingCount = selected.length - maxDisplay;
                      
                      return (
                        <Box sx={{ 
                          display: 'flex', 
                          flexWrap: 'wrap', 
                          gap: 0.5,
                          minHeight: '32px',
                          alignItems: 'center',
                          overflow: 'hidden'
                        }}>
                          {selectedApps.map((app) => (
                            <Chip 
                              key={app.id} 
                              label={app.name}
                              size="small"
                              onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                              }}
                              onDelete={() => {
                                const newApps = roleMiningConfig.applications.filter(a => a !== app.name);
                                handleConfigChange('applications', newApps);
                              }}
                              deleteIcon={
                                <CancelIcon 
                                  onMouseDown={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                  }}
                                  sx={{ 
                                    fontSize: '16px',
                                    '&:hover': { color: '#EF4444' }
                                  }} 
                                />
                              }
                              sx={chipStyles}
                            />
                          ))}
                          {remainingCount > 0 && (
                            <Tooltip 
                              title={
                                <Box>
                                  {selected.slice(maxDisplay).map((value) => (
                                    <div key={value}>{value}</div>
                                  ))}
                                </Box>
                              }
                            >
                              <Chip 
                                size="small"
                                label={`+${remainingCount} more`}
                                sx={chipStyles}
                              />
                            </Tooltip>
                          )}
                        </Box>
                      );
                    }}
                    sx={selectStyles}
                    MenuProps={menuProps}
                  >
                    {isLoading.applications ? (
                      <MenuItem disabled>
                        <CircularProgress size={20} sx={{ mr: 2 }} />
                        Loading applications...
                      </MenuItem>
                    ) : (
                      applicationOptions.map((app) => (
                        <MenuItem 
                          key={app.id} 
                          value={app.name}
                          sx={{
                            color: '#000000',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <Checkbox 
                            checked={roleMiningConfig.applications.indexOf(app.name) > -1}
                            sx={{
                              color: '#000000',
                              '&.Mui-checked': {
                                color: '#1E40AF',
                              },
                              padding: '4px',
                            }}
                          />
                          <ListItemText 
                            primary={app.name}
                            sx={{
                              '& .MuiTypography-root': {
                                fontSize: '14px',
                                color: '#000000',
                              }
                            }}
                          />
                        </MenuItem>
                      ))
                    )}
                  </Select>
                  {configErrors.applications && (
                    <FormHelperText>{configErrors.applications}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!configErrors.organizationalUnits}>
                  <InputLabel id="ou-label" sx={{ 
                    color: '#000000',
                    backgroundColor: '#FFFFFF',
                    px: 1,
                  }}>Organizational Units</InputLabel>
                  <Select
                    labelId="ou-label"
                    multiple
                    value={roleMiningConfig.organizationalUnits}
                    onChange={(e) => handleConfigChange('organizationalUnits', e.target.value)}
                    renderValue={(selected) => {
                      const maxDisplay = 2;
                      const selectedOUs = ouOptions
                        .filter(ou => selected.includes(ou.name))
                        .slice(0, maxDisplay);
                      const remainingCount = selected.length - maxDisplay;
                      
                      return (
                        <Box sx={{ 
                          display: 'flex', 
                          flexWrap: 'wrap', 
                          gap: 0.5,
                          minHeight: '32px',
                          alignItems: 'center',
                          overflow: 'hidden'
                        }}>
                          {selectedOUs.map((ou) => (
                            <Chip 
                              key={ou.id} 
                              label={ou.name}
                              size="small"
                              onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                              }}
                              onDelete={() => {
                                const newOUs = roleMiningConfig.organizationalUnits.filter(o => o !== ou.name);
                                handleConfigChange('organizationalUnits', newOUs);
                              }}
                              deleteIcon={
                                <CancelIcon 
                                  onMouseDown={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                  }}
                                  sx={{ 
                                    fontSize: '16px',
                                    '&:hover': { color: '#EF4444' }
                                  }} 
                                />
                              }
                              sx={chipStyles}
                            />
                          ))}
                          {remainingCount > 0 && (
                            <Tooltip 
                              title={
                                <Box>
                                  {selected.slice(maxDisplay).map((value) => (
                                    <div key={value}>{value}</div>
                                  ))}
                                </Box>
                              }
                            >
                              <Chip 
                                size="small"
                                label={`+${remainingCount} more`}
                                sx={chipStyles}
                              />
                            </Tooltip>
                          )}
                        </Box>
                      );
                    }}
                    sx={selectStyles}
                    MenuProps={menuProps}
                  >
                    {isLoading.organizationalUnits ? (
                      <MenuItem disabled>
                        <CircularProgress size={20} sx={{ mr: 2 }} />
                        Loading organizational units...
                      </MenuItem>
                    ) : (
                      ouOptions.map((ou) => (
                        <MenuItem 
                          key={ou.id} 
                          value={ou.name}
                          sx={{
                            color: '#000000',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <Checkbox 
                            checked={roleMiningConfig.organizationalUnits.indexOf(ou.name) > -1}
                            sx={{
                              color: '#000000',
                              '&.Mui-checked': {
                                color: '#1E40AF',
                              },
                              padding: '4px',
                            }}
                          />
                          <ListItemText 
                            primary={ou.name}
                            sx={{
                              '& .MuiTypography-root': {
                                fontSize: '14px',
                                color: '#000000',
                              }
                            }}
                          />
                        </MenuItem>
                      ))
                    )}
                  </Select>
                  {configErrors.organizationalUnits && (
                    <FormHelperText>{configErrors.organizationalUnits}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Number of users per role"
                  type="number"
                  value={roleMiningConfig.minEntitlements}
                  onChange={(e) => handleConfigChange('minEntitlements', e.target.value)}
                  error={!!configErrors.minEntitlements}
                  helperText={configErrors.minEntitlements}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">#</InputAdornment>,
                  }}
                  sx={inputStyles}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Number of permissions per role"
                  type="number"
                  value={roleMiningConfig.maxEntitlements}
                  onChange={(e) => handleConfigChange('maxEntitlements', e.target.value)}
                  error={!!configErrors.maxEntitlements}
                  helperText={configErrors.maxEntitlements}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">#</InputAdornment>,
                  }}
                  sx={inputStyles}
                />
              </Grid>
            </Grid>
          </ConfigPaper>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            mt: 3
          }}>
            <StartMiningButton
              variant="contained"
              onClick={handleRunRoleMining}
              disabled={!isValid}
              startIcon={<PlayArrowIcon />}
            >
              Start Role Mining
            </StartMiningButton>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ 
            backgroundColor: '#FFFFFF', 
            border: '1px solid #E5E7EB',
            overflow: 'hidden'
          }}>
            <Button
              fullWidth
              onClick={() => setIsAISuggestionsExpanded(!isAISuggestionsExpanded)}
              sx={{
                p: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                textTransform: 'none',
                color: '#1F2937',
                backgroundColor: 'transparent',
                '&:hover': {
                  backgroundColor: '#F9FAFB',
                },
                '&:focus': {
                  outline: 'none',
                  backgroundColor: '#F9FAFB',
                }
              }}
            >
              <Typography variant="h6" sx={{ 
                fontWeight: 600,
                color: '#1F2937'
              }}>
                AI Suggestions
              </Typography>
              {isAISuggestionsExpanded ? (
                <KeyboardArrowUpIcon sx={{ color: '#1F2937' }} />
              ) : (
                <KeyboardArrowDownIcon sx={{ color: '#1F2937' }} />
              )}
            </Button>
            <Collapse in={isAISuggestionsExpanded}>
              <Box sx={{ p: 3, pt: 0 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {isLoadingSuggestions ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                      <CircularProgress size={24} sx={{ color: '#1E40AF' }} />
                    </Box>
                  ) : aiSuggestions && (
                    <>
                      <Typography variant="subtitle2" sx={{ color: '#6B7280', mt: 2, fontWeight: 500 }}>
                        Suggested Applications:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {aiSuggestions.applications.map((app) => (
                          <Chip
                            key={app}
                            label={app}
                            sx={{
                              backgroundColor: '#E5E7EB',
                              color: '#374151',
                              '&:focus': {
                                outline: 'none',
                              }
                            }}
                          />
                        ))}
                      </Box>

                      <Typography variant="subtitle2" sx={{ color: '#6B7280', mt: 2, fontWeight: 500 }}>
                        Suggested Organizational Units:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {aiSuggestions.organizationalUnits.map((ou) => (
                          <Chip
                            key={ou}
                            label={ou}
                            sx={{
                              backgroundColor: '#E5E7EB',
                              color: '#374151',
                              '&:focus': {
                                outline: 'none',
                              }
                            }}
                          />
                        ))}
                      </Box>

                      <Typography variant="subtitle2" sx={{ color: '#6B7280', mt: 2, fontWeight: 500 }}>
                        Suggested Entitlement Range:
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#374151' }}>
                        {aiSuggestions.entitlementRange.min} - {aiSuggestions.entitlementRange.max}
                      </Typography>

                      <Button
                        variant="contained"
                        onClick={handleAcceptAllSuggestions}
                        startIcon={<CheckCircleIcon />}
                        sx={{
                          backgroundColor: '#1E40AF',
                          color: '#FFFFFF',
                          mt: 2,
                          '&:hover': {
                            backgroundColor: '#1E3A8A',
                          },
                          '&:focus': {
                            outline: 'none',
                            backgroundColor: '#1E3A8A',
                          }
                        }}
                      >
                        Accept All Suggestions
                      </Button>
                    </>
                  )}
                </Box>
              </Box>
            </Collapse>
          </Paper>
        </Grid>
      </Grid>
    </ConfigContainer>
  );
};

export default RoleMiningConfig; 