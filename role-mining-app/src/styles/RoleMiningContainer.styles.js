import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

export const LoadingContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '400px',
  gap: '16px',
  backgroundColor: '#F9FAFB'
});

export const LoadingText = styled(Typography)({
  color: '#000000',
  fontWeight: 500
});

export const MainContainer = styled(Box)({
  width: '100%',
  maxWidth: '800px',
  margin: '0 auto',
  padding: '16px',
  backgroundColor: '#F9FAFB'
});

export const LandingContainer = styled('main')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 'calc(100vh - 64px)',
  padding: '32px',
  backgroundColor: '#F9FAFB'
});

export const HeroContent = styled(Box)({
  maxWidth: '800px',
  textAlign: 'center',
  margin: '0 auto'
});

export const HeroTitle = styled(Typography)({
  fontSize: '48px',
  fontWeight: 700,
  color: '#000000',
  marginBottom: '24px',
  lineHeight: 1.2
});

export const HeroDescription = styled(Typography)({
  fontSize: '18px',
  color: '#000000',
  marginBottom: '32px',
  lineHeight: 1.6
});

export const UploaderContainer = styled('main')({
  padding: '32px',
  backgroundColor: '#F9FAFB',
  minHeight: 'calc(100vh - 64px)'
}); 