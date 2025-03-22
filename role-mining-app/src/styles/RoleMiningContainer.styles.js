import { styled } from '@mui/material/styles';
import { Box, Typography, Grid } from '@mui/material';

export const LoadingContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: '100%',
  height: '100%',
  backgroundColor: '#F9FAFB',
  zIndex: 1000,
  gap: '24px',
});

export const LoadingText = styled(Typography)({
  color: '#1F2937',
  fontWeight: 500,
  textAlign: 'center',
  fontSize: '18px',
  position: 'relative',
  top: '50%',
  transform: 'translateY(-50%)',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const MainContainer = styled(Box)({
  width: '100%',
  margin: '0',
  padding: '0',
  backgroundColor: '#F9FAFB',
  minHeight: '100vh',
  boxSizing: 'border-box',
  overflowX: 'hidden',
});

export const UploaderContainer = styled('main')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  width: '100%',
  margin: '0',
  padding: '64px 0',
  backgroundColor: '#F9FAFB',
  position: 'relative',
  overflow: 'hidden',
  boxSizing: 'border-box',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    background: 'linear-gradient(180deg, rgba(30, 64, 175, 0.03) 0%, rgba(30, 64, 175, 0) 100%)',
    zIndex: 0,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '20%',
    right: '-10%',
    width: '50%',
    height: '50%',
    background: 'radial-gradient(circle, rgba(30, 64, 175, 0.05) 0%, rgba(30, 64, 175, 0) 70%)',
    borderRadius: '50%',
    zIndex: 0,
  }
});

export const HeroContent = styled(Box)({
  width: '100%',
  maxWidth: '1400px',
  textAlign: 'center',
  margin: '0 auto',
  position: 'relative',
  zIndex: 1,
  padding: '0 32px',
  boxSizing: 'border-box',
});

export const HeroTitle = styled(Typography)({
  fontSize: '72px',
  fontWeight: 800,
  background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: '24px',
  lineHeight: 1.1,
  letterSpacing: '-0.02em',
  '@media (max-width: 900px)': {
    fontSize: '56px',
  },
  '@media (max-width: 600px)': {
    fontSize: '40px',
  }
});

export const HeroDescription = styled(Typography)({
  fontSize: '24px',
  color: '#4B5563',
  marginBottom: '48px',
  lineHeight: 1.6,
  '@media (max-width: 900px)': {
    fontSize: '20px',
    marginBottom: '40px',
  },
  '@media (max-width: 600px)': {
    fontSize: '18px',
    marginBottom: '32px',
  }
});

export const UploadZone = styled(Box)(({ isDragActive }) => ({
  position: 'relative',
  width: '100%',
  maxWidth: '1400px',
  margin: '48px auto 32px',
  padding: '48px',
  border: '2px dashed',
  borderColor: isDragActive ? '#1E40AF' : '#E5E7EB',
  borderRadius: '16px',
  backgroundColor: isDragActive ? 'rgba(30, 64, 175, 0.05)' : '#FFFFFF',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  overflow: 'hidden',
  boxSizing: 'border-box',
  '&:hover': {
    borderColor: '#1E40AF',
    backgroundColor: 'rgba(30, 64, 175, 0.05)',
  }
}));

export const FeatureGrid = styled(Grid)({
  marginTop: '96px',
  width: '100%',
  maxWidth: '1400px',
  marginLeft: 'auto',
  marginRight: 'auto',
  padding: '0 32px',
  boxSizing: 'border-box',
});

export const FeatureCard = styled(Box)({
  padding: '32px',
  backgroundColor: '#FFFFFF',
  borderRadius: '16px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  transition: 'all 0.3s ease',
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  boxSizing: 'border-box',
  '&:hover': {
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    transform: 'translateY(-4px)',
  }
});

export const GradientText = styled(Typography)({
  background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 700,
  fontSize: '36px',
  '@media (max-width: 600px)': {
    fontSize: '28px',
  }
}); 