import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  FormHelperText,
  Checkbox,
  ListItemText,
  FormControlLabel,
  Switch,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ConfigContainer,
  ConfigHeader,
  ConfigTitle,
  ConfigDescription,
  ConfigSection,
  SectionTitle,
  SectionDescription,
  FormRow,
  FormGroup,
  SelectContainer,
  ChipContainer,
  StyledChip,
  StyledSelect,
  StyledTextField,
  StartMiningButton,
  ResetButton,
  StyledFormControl,
  StyledOutlinedInput,
} from '../styles/RoleMiningConfig.styles';
import { getApplications, getOrganizationalUnits } from '../services/api';
import RolesVisualizer from './RolesVisualizer';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const sectionVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 }
  }
};

const LoadingSpinner = () => (
  <motion.div
    style={{
      width: 24,
      height: 24,
      borderRadius: '50%',
      border: '2px solid #E5E7EB',
      borderTopColor: '#1E40AF',
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
  />
);

const RoleMiningConfig = ({ onRunRoleMining }) => {
  const [config, setConfig] = useState({
    applications: [],
    organizationalUnits: [],
    usersPerRole: '',
    permissionsPerRole: '',
    enableAI: false,
  });

  const [errors, setErrors] = useState({
    usersPerRole: false,
    permissionsPerRole: false,
  });

  const [applications, setApplications] = useState([]);
  const [organizationalUnits, setOrganizationalUnits] = useState([]);
  const [loading, setLoading] = useState({
    applications: false,
    organizationalUnits: false,
  });

  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading({ applications: true, organizationalUnits: true });
        const [appsData, ousData] = await Promise.all([
          getApplications(),
          getOrganizationalUnits()
        ]);
        setApplications(appsData);
        setOrganizationalUnits(ousData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading({ applications: false, organizationalUnits: false });
      }
    };

    fetchData();
  }, []);

  const handleConfigChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleNumberChange = (field, value) => {
    const numValue = value === '' ? '' : Number(value);
    handleConfigChange(field, numValue);
    
    // Validate number inputs
    setErrors(prev => ({
      ...prev,
      [field]: numValue !== '' && (isNaN(numValue) || numValue < 0 || !Number.isInteger(numValue))
    }));
  };

  const handleApplicationChange = (event) => {
    const value = event.target.value;
    handleConfigChange('applications', value);
  };

  const handleOUChange = (event) => {
    const value = event.target.value;
    handleConfigChange('organizationalUnits', value);
  };

  const handleDeleteApplication = (valueToDelete) => {
    handleConfigChange(
      'applications',
      config.applications.filter((value) => value !== valueToDelete)
    );
  };

  const handleDeleteOU = (valueToDelete) => {
    handleConfigChange(
      'organizationalUnits',
      config.organizationalUnits.filter((value) => value !== valueToDelete)
    );
  };

  const isFormValid = () => {
    return (
      config.usersPerRole !== '' &&
      config.permissionsPerRole !== '' &&
      !Object.values(errors).some(error => error)
    );
  };

  const handleStartMining = () => {
    if (isFormValid()) {
      onRunRoleMining(config);
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setConfig({
      applications: [],
      organizationalUnits: [],
      usersPerRole: '',
      permissionsPerRole: '',
      enableAI: false,
    });
    setErrors({
      usersPerRole: false,
      permissionsPerRole: false,
    });
    setShowResults(false);
  };

  const handleAIToggle = (event) => {
    setConfig(prev => ({
      ...prev,
      enableAI: event.target.checked
    }));
  };

  if (showResults) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <RolesVisualizer enableAI={config.enableAI} />
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <ConfigContainer>
        <ConfigHeader>
          <ConfigTitle variant="h4">
            Role Mining Configuration
          </ConfigTitle>
          <ConfigDescription variant="body1">
            Configure the parameters for role mining. Select applications and organizational units, and set the number of users and permissions per role.
          </ConfigDescription>
        </ConfigHeader>

        <motion.div variants={sectionVariants}>
          <ConfigSection>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <SectionTitle sx={{ fontWeight: 700 }}>Application Selection</SectionTitle>
              <Typography
                variant="caption"
                sx={{
                  backgroundColor: '#E5E7EB',
                  color: '#6B7280',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontWeight: 500,
                }}
              >
                Optional
              </Typography>
            </Box>
            <SectionDescription>
              Select specific applications to analyze. Leave empty to analyze all applications.
            </SectionDescription>
            <FormRow>
              <FormGroup>
                <SelectContainer>
                  <StyledFormControl fullWidth>
                    <InputLabel>Applications</InputLabel>
                    <StyledSelect
                      multiple
                      value={config.applications}
                      onChange={handleApplicationChange}
                      input={<StyledOutlinedInput label="Applications" />}
                      renderValue={(selected) => (
                        <ChipContainer>
                          {selected.map((value) => (
                            <motion.div
                              key={value}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              <StyledChip
                                label={value}
                                deleteIcon={
                                  <DeleteIcon 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteApplication(value);
                                    }}
                                    sx={{ 
                                      cursor: 'pointer',
                                      '&:hover': { color: '#EF4444' }
                                    }}
                                  />
                                }
                              />
                            </motion.div>
                          ))}
                        </ChipContainer>
                      )}
                    >
                      {loading.applications ? (
                        <MenuItem disabled sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          py: 2
                        }}>
                          <LoadingSpinner />
                          <Typography sx={{ ml: 1 }}>Loading applications...</Typography>
                        </MenuItem>
                      ) : (
                        applications.map((app) => (
                          <MenuItem 
                            key={app.id} 
                            value={app.name}
                            sx={{
                              color: '#000000',
                              '&:hover': {
                                backgroundColor: '#F3F4F6',
                              },
                            }}
                          >
                            <Checkbox 
                              checked={config.applications.indexOf(app.name) > -1}
                              sx={{
                                color: '#000000',
                                '&.Mui-checked': {
                                  color: '#1E40AF',
                                },
                              }}
                            />
                            <ListItemText 
                              primary={app.name}
                              sx={{
                                '& .MuiTypography-root': {
                                  color: '#000000',
                                }
                              }}
                            />
                          </MenuItem>
                        ))
                      )}
                    </StyledSelect>
                  </StyledFormControl>
                </SelectContainer>
              </FormGroup>
            </FormRow>
          </ConfigSection>
        </motion.div>

        <motion.div variants={sectionVariants}>
          <ConfigSection>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <SectionTitle sx={{ fontWeight: 700 }}>Organizational Unit Selection</SectionTitle>
              <Typography
                variant="caption"
                sx={{
                  backgroundColor: '#E5E7EB',
                  color: '#6B7280',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontWeight: 500,
                }}
              >
                Optional
              </Typography>
            </Box>
            <SectionDescription>
              Select specific organizational units to analyze. Leave empty to analyze all units.
            </SectionDescription>
            <FormRow>
              <FormGroup>
                <SelectContainer>
                  <StyledFormControl fullWidth>
                    <InputLabel>Organizational Units</InputLabel>
                    <StyledSelect
                      multiple
                      value={config.organizationalUnits}
                      onChange={handleOUChange}
                      input={<StyledOutlinedInput label="Organizational Units" />}
                      renderValue={(selected) => (
                        <ChipContainer>
                          {selected.map((value) => (
                            <motion.div
                              key={value}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              <StyledChip
                                label={value}
                                deleteIcon={
                                  <DeleteIcon 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteOU(value);
                                    }}
                                    sx={{ 
                                      cursor: 'pointer',
                                      '&:hover': { color: '#EF4444' }
                                    }}
                                  />
                                }
                              />
                            </motion.div>
                          ))}
                        </ChipContainer>
                      )}
                    >
                      {loading.organizationalUnits ? (
                        <MenuItem disabled sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          py: 2
                        }}>
                          <LoadingSpinner />
                          <Typography sx={{ ml: 1 }}>Loading organizational units...</Typography>
                        </MenuItem>
                      ) : (
                        organizationalUnits.map((ou) => (
                          <MenuItem 
                            key={ou.id} 
                            value={ou.name}
                            sx={{
                              color: '#000000',
                              '&:hover': {
                                backgroundColor: '#F3F4F6',
                              },
                            }}
                          >
                            <Checkbox 
                              checked={config.organizationalUnits.indexOf(ou.name) > -1}
                              sx={{
                                color: '#000000',
                                '&.Mui-checked': {
                                  color: '#1E40AF',
                                },
                              }}
                            />
                            <ListItemText 
                              primary={ou.name}
                              sx={{
                                '& .MuiTypography-root': {
                                  color: '#000000',
                                }
                              }}
                            />
                          </MenuItem>
                        ))
                      )}
                    </StyledSelect>
                  </StyledFormControl>
                </SelectContainer>
              </FormGroup>
            </FormRow>
          </ConfigSection>
        </motion.div>

        <motion.div variants={sectionVariants}>
          <ConfigSection sx={{ 
            p: 2,
            border: '2px solid #DC2626',
            borderRadius: '8px',
            backgroundColor: '#FEF2F2',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="h6" sx={{ 
                color: '#000000',
                fontWeight: 600,
              }}>
                Role Parameters
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  px: 1,
                  py: 0.5,
                  borderRadius: '4px',
                  fontWeight: 500,
                }}
              >
                Required
              </Typography>
            </Box>
            <SectionDescription variant="body2" sx={{ color: '#1F2937' }}>
              Set the number of users and permissions per role. These parameters are mandatory for role mining.
            </SectionDescription>
            <FormRow>
              <FormGroup>
                <StyledTextField
                  label="Number of Users per Role"
                  type="number"
                  value={config.usersPerRole}
                  onChange={(e) => handleNumberChange('usersPerRole', e.target.value)}
                  error={errors.usersPerRole}
                  helperText={errors.usersPerRole ? "Please enter a valid positive integer" : ""}
                  required
                />
                <StyledTextField
                  label="Number of Permissions per Role"
                  type="number"
                  value={config.permissionsPerRole}
                  onChange={(e) => handleNumberChange('permissionsPerRole', e.target.value)}
                  error={errors.permissionsPerRole}
                  helperText={errors.permissionsPerRole ? "Please enter a valid positive integer" : ""}
                  required
                />
              </FormGroup>
            </FormRow>
          </ConfigSection>
        </motion.div>

        <motion.div variants={sectionVariants}>
          <Box sx={{ 
            mb: 3, 
            mt: 2,
            p: 2,
            border: '2px solid #1E40AF',
            borderRadius: '8px',
            backgroundColor: '#F0F7FF',
          }}>
            <FormControlLabel
              control={
                <Switch
                  checked={config.enableAI}
                  onChange={handleAIToggle}
                  color="primary"
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#1E40AF',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#1E40AF',
                    },
                  }}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AutoAwesomeIcon sx={{ color: '#1E40AF' }} />
                  <Typography variant="subtitle1" sx={{ 
                    color: '#000000',
                    fontWeight: 600,
                  }}>
                    Enable AI-Assisted Role Mining
                  </Typography>
                </Box>
              }
            />
            <Typography variant="body2" sx={{ 
              mt: 1, 
              color: '#1F2937',
              pl: 7, // Align with the label text
            }}>
              Use AI to analyze patterns and suggest optimized role configurations based on historical data.
            </Typography>
          </Box>
        </motion.div>

        <motion.div 
          variants={sectionVariants}
          style={{ display: 'flex', gap: '8px', marginTop: '24px' }}
        >
          <ResetButton
            variant="outlined"
            onClick={handleReset}
            component={motion.button}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Reset Filters
          </ResetButton>
          <StartMiningButton
            variant="contained"
            onClick={handleStartMining}
            disabled={!isFormValid()}
            component={motion.button}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Start Role Mining
          </StartMiningButton>
        </motion.div>
      </ConfigContainer>
    </motion.div>
  );
};

export default RoleMiningConfig;