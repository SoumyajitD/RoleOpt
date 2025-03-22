import React from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Fade,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DescriptionIcon from '@mui/icons-material/Description';

const REQUIRED_FILES = [
  'users.csv',
  'ou.csv',
  'applications.csv',
  'entitlements.csv',
  'assignment.csv',
];

const DataUploader = ({ onFilesAccepted }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onFilesAccepted,
    accept: {
      'text/csv': ['.csv'],
    },
    multiple: true,
  });

  return (
    <Fade in timeout={800}>
      <Box>
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
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
              borderColor: 'info.main',
              backgroundColor: 'info.light',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
            },
            '&::before': isDragActive ? {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at center, rgba(52, 152, 219, 0.2) 0%, rgba(52, 152, 219, 0) 70%)',
              animation: 'pulse 1.5s infinite',
            } : {},
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
                    transition: 'all 0.2s ease',
                    '& .MuiChip-icon': {
                      color: 'white'
                    },
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        </Paper>
      </Box>
    </Fade>
  );
};

export default DataUploader; 