import React, { useState, useCallback } from 'react';
import { ScaleLoader } from 'react-spinners';
import { uploadFiles, getDataSummary } from '../services/api';
import RoleMiningConfig from './RoleMiningConfig';
import DataSummary from './DataSummary';
import DataUploader from './DataUploader';
import {
  LoadingContainer,
  LoadingText,
  MainContainer
} from '../styles/RoleMiningContainer.styles';

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
  const [view, setView] = useState('upload');

  const onDrop = useCallback(async (acceptedFiles) => {
    setIsLoading(true);
    try {
      await uploadFiles(acceptedFiles);
      const summaryData = await getDataSummary();
      setSummary(summaryData);
      setView('summary');
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReupload = () => {
    setSummary(null);
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
      <LoadingContainer>
        <ScaleLoader
          color="#1E40AF"
          height={50}
          width={6}
          radius={2}
          margin={2}
          speedMultiplier={0.8}
        />
        <LoadingText variant="h6" sx={{ mt: 3 }}>
          Processing your files...
        </LoadingText>
      </LoadingContainer>
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
    <MainContainer>
      <DataUploader onFilesAccepted={onDrop} />
    </MainContainer>
  );
};

export default RoleMiningContainer; 