import React, { useState, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  IconButton,
  TextField,
  Autocomplete,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  FormHelperText,
  Tooltip,
  Divider,
  Chip,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { BoxesLoader } from 'react-awesome-loaders';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DescriptionIcon from '@mui/icons-material/Description';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { uploadFiles, getDataSummary } from '../services/api';
import RoleMiningConfig from './RoleMiningConfig';
import DataSummary from './DataSummary';

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

const DataTable = ({ data, columns, title, description, count }) => {
  return (
    <Paper
      sx={{
        p: 3,
        mb: 3,
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderLeft: '4px solid #1E40AF',
        transition: 'all 0.3s ease',
        borderRadius: 1,
        '&:hover': {
          backgroundColor: '#F9FAFB',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.05)',
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography sx={{ color: '#6B7280', mb: 1, textTransform: 'capitalize' }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ color: '#1F2937', mb: 2, fontWeight: 600 }}>
            {count.toLocaleString()}
          </Typography>
          <Typography variant="body2" sx={{ color: '#4B5563', mb: 2 }}>
            {description}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CheckCircleIcon sx={{ color: '#10B981', mr: 1 }} />
          <Typography variant="body2" sx={{ color: '#10B981' }}>
            Successfully processed
          </Typography>
        </Box>
      </Box>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell 
                  key={column}
                  sx={{ 
                    color: '#1F2937', 
                    fontWeight: 600,
                    textTransform: 'capitalize',
                    borderBottom: '1px solid #E5E7EB',
                    whiteSpace: 'nowrap',
                    backgroundColor: '#F9FAFB'
                  }}
                >
                  {column.replace('_', ' ')}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow 
                key={index}
                sx={{ 
                  '&:hover': { 
                    backgroundColor: '#F9FAFB'
                  }
                }}
              >
                {columns.map((column) => (
                  <TableCell 
                    key={column}
                    sx={{ 
                      color: '#374151',
                      borderBottom: '1px solid #E5E7EB'
                    }}
                  >
                    {row[column]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

const RoleMiningContainer = () => {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [view, setView] = useState('upload');

  const onDrop = useCallback(async (acceptedFiles) => {
    setIsLoading(true);
    setError(null);
    try {
      await uploadFiles(acceptedFiles);
      const summaryData = await getDataSummary();
      setSummary(summaryData);
      setView('summary');
    } catch (error) {
      setError('Failed to upload files. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    multiple: true
  });

  const handleReupload = () => {
    setSummary(null);
    setError(null);
    setView('upload');
  };

  const handleStartRoleMining = () => {
    setView('roleMining');
  };

  const handleRunRoleMining = async (config) => {
    console.log('Running role mining with config:', config);
    // TODO: Implement role mining logic
  };

  if (isLoading) {
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        gap: 2,
        backgroundColor: '#F9FAFB',
      }}>
        <BoxesLoader
          boxColor="#1E40AF"
          style={{ marginBottom: "20px" }}
          desktopSize="128px"
          mobileSize="80px"
        />
        <Typography variant="body1" sx={{ color: '#374151' }}>
          Processing your files...
        </Typography>
      </Box>
    );
  }

  if (view === 'roleMining' && summary) {
    return <RoleMiningConfig summary={summary} onRunRoleMining={handleRunRoleMining} />;
  }

  if (view === 'summary' && summary) {
    return (
      <DataSummary 
        summary={summary} 
        onReupload={handleReupload}
        onStartRoleMining={handleStartRoleMining}
      />
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: '800px', mx: 'auto', p: 2, backgroundColor: '#F9FAFB' }}>
      <Paper
        {...getRootProps()}
        sx={{
          p: 6,
          textAlign: 'center',
          backgroundColor: isDragActive ? '#E5E7EB' : '#F3F4F6',
          border: '2px dashed',
          borderColor: isDragActive ? '#1E40AF' : '#D1D5DB',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          borderRadius: 2,
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            borderColor: '#1E40AF',
            backgroundColor: '#E5E7EB',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon sx={{ 
          fontSize: 72, 
          color: isDragActive ? '#1E40AF' : '#6B7280',
          mb: 3,
          transition: 'color 0.3s ease'
        }} />
        <Typography variant="h5" sx={{ 
          fontWeight: 500, 
          mb: 2,
          color: isDragActive ? '#1E40AF' : '#374151'
        }}>
          {isDragActive
            ? 'Drop the files here'
            : 'Drag and drop CSV files here, or click to select files'}
        </Typography>
        {error && (
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#EF4444', 
              mb: 2,
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              p: 2,
              borderRadius: 1
            }}
          >
            {error}
          </Typography>
        )}
        <Box sx={{ mb: 4 }}>
          <Typography variant="body2" sx={{ mb: 2, color: '#6B7280' }}>
            Required files:
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 1, 
            justifyContent: 'center' 
          }}>
            {REQUIRED_FILES.map((file) => (
              <Box
                key={file}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#FFFFFF',
                  color: '#374151',
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  fontSize: '0.875rem',
                  transition: 'all 0.3s ease',
                  border: '1px solid #E5E7EB',
                  '&:hover': {
                    backgroundColor: '#F3F4F6',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
                  }
                }}
              >
                <DescriptionIcon sx={{ 
                  fontSize: 20, 
                  mr: 1,
                  color: '#6B7280'
                }} />
                {file}
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default RoleMiningContainer; 