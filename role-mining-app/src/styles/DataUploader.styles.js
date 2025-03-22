import { styled } from '@mui/material/styles';
import { Box, Paper, Typography, Chip } from '@mui/material';

export const UploaderContainer = styled(Box)({
  width: '100%'
});

export const DropzonePaper = styled(Paper)({
  padding: '48px',
  textAlign: 'center',
  backgroundColor: '#FFFFFF',
  border: '2px dashed',
  borderColor: '#D1D5DB',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  borderRadius: '24px',
  maxWidth: '900px',
  margin: '0 auto',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    borderColor: '#1E40AF',
    backgroundColor: '#F3F4F6',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
  }
});

export const UploadIcon = styled('div')({
  '& .MuiSvgIcon-root': {
    fontSize: 72,
    color: '#000000',
    marginBottom: '24px'
  }
});

export const UploadTitle = styled(Typography)({
  fontWeight: 500,
  marginBottom: '16px',
  color: '#000000'
});

export const RequiredFilesContainer = styled(Box)({
  marginBottom: '32px',
  maxWidth: '600px',
  margin: '0 auto'
});

export const RequiredFilesText = styled(Typography)({
  marginBottom: '16px',
  color: '#000000',
  fontWeight: 500
});

export const ChipsContainer = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  justifyContent: 'center'
});

export const FileChip = styled(Chip)({
  backgroundColor: '#F3F4F6',
  color: '#000000',
  paddingLeft: '8px',
  paddingRight: '8px',
  transition: 'all 0.2s ease',
  '& .MuiChip-icon': {
    color: '#000000'
  },
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#E5E7EB'
  }
});

// Active dropzone styles
export const activeDropzoneStyles = {
  borderColor: '#1E40AF',
  backgroundColor: '#F3F4F6',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at center, rgba(30, 64, 175, 0.1) 0%, rgba(30, 64, 175, 0) 70%)',
    animation: 'pulse 1.5s infinite',
  }
}; 