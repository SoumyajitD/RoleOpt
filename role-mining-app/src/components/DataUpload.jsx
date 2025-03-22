import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Button,
  Fade,
  Zoom,
  Divider,
  Chip,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RefreshIcon from '@mui/icons-material/Refresh';
import DescriptionIcon from '@mui/icons-material/Description';

const REQUIRED_FILES = [
  'users.csv',
  'ou.csv',
  'applications.csv',
  'entitlements.csv',
  'assignment.csv',
];

const FILE_DESCRIPTIONS = {
  'users.csv': 'Contains user information and attributes',
  'ou.csv': 'Organizational unit structure and hierarchy',
  'applications.csv': 'List of applications and their details',
  'entitlements.csv': 'Available entitlements and permissions',
  'assignment.csv': 'User-entitlement assignments and relationships',
};

const DataUpload = () => {
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [summary, setSummary] = useState(null);

  const onDrop = useCallback(() => {
    setUploadStatus('uploading');

    // Simulate file processing and summary generation
    setTimeout(() => {
      setSummary({
        users: Math.floor(Math.random() * 1000),
        ou: Math.floor(Math.random() * 100),
        applications: Math.floor(Math.random() * 50),
        entitlements: Math.floor(Math.random() * 2000),
        assignments: Math.floor(Math.random() * 5000),
      });
      setUploadStatus('success');
    }, 2000);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    multiple: true,
  });

  const handleReupload = () => {
    setSummary(null);
    setUploadStatus('idle');
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Fade in timeout={500}>
        <Box>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
              Data Upload
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
              Upload your CSV files to analyze user access patterns and perform role mining. 
              The application will process the data to identify potential roles and optimize access management.
            </Typography>
          </Box>

          <Paper
            {...getRootProps()}
            sx={{
              p: 6,
              textAlign: 'center',
              backgroundColor: isDragActive ? 'info.light' : 'background.paper',
              border: '2px dashed',
              borderColor: isDragActive ? 'info.main' : 'grey.300',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              borderRadius: 3,
              maxWidth: '900px',
              mx: 'auto',
              '&:hover': {
                borderColor: 'info.main',
                backgroundColor: 'info.light',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            <input {...getInputProps()} />
            <CloudUploadIcon sx={{ fontSize: 72, color: 'info.main', mb: 3 }} />
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 500, mb: 2 }}>
              {isDragActive
                ? 'Drop the files here'
                : 'Drag and drop CSV files here, or click to select files'}
            </Typography>
            <Box sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Required files:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                {REQUIRED_FILES.map((file) => (
                  <Chip
                    key={file}
                    label={file}
                    icon={<DescriptionIcon />}
                    sx={{ 
                      backgroundColor: 'info.light', 
                      color: 'white',
                      px: 1,
                      '& .MuiChip-icon': {
                        color: 'white'
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Paper>

          {uploadStatus === 'uploading' && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <CircularProgress size={48} sx={{ color: 'info.main' }} />
            </Box>
          )}

          {uploadStatus === 'success' && summary && (
            <Fade in timeout={500}>
              <Box sx={{ mt: 6 }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  mb: 4,
                  maxWidth: '900px',
                  mx: 'auto'
                }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    Upload Summary
                  </Typography>
                  <Button
                    variant="outlined"
                    color="info"
                    onClick={handleReupload}
                    startIcon={<RefreshIcon />}
                    sx={{ borderRadius: 2 }}
                  >
                    Re-upload
                  </Button>
                </Box>
                <Divider sx={{ mb: 4 }} />
                <Grid container spacing={3} sx={{ maxWidth: '1200px', mx: 'auto' }}>
                  {Object.entries(summary).map(([key, value], index) => (
                    <Grid item xs={12} sm={6} md={4} key={key}>
                      <Zoom in timeout={500} style={{ transitionDelay: `${index * 100}ms` }}>
                        <Card sx={{ 
                          height: '100%', 
                          borderTop: '4px solid', 
                          borderColor: 'info.main',
                          borderRadius: 2,
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                        }}>
                          <CardContent sx={{ p: 3 }}>
                            <Typography color="textSecondary" gutterBottom sx={{ textTransform: 'capitalize' }}>
                              {key}
                            </Typography>
                            <Typography variant="h3" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                              {value.toLocaleString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {FILE_DESCRIPTIONS[`${key}.csv`]}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                              <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                              <Typography variant="body2" color="success.main">
                                Successfully processed
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Zoom>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Fade>
          )}
        </Box>
      </Fade>
    </Box>
  );
};

export default DataUpload; 