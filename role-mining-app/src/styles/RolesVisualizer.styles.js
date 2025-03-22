import { styled } from '@mui/material/styles';
import { Box, Tabs, Accordion } from '@mui/material';

export const VisualizerContainer = styled(Box)({
  width: '100%',
  maxWidth: '1400px',
  margin: '0 auto',
  padding: '32px',
  backgroundColor: '#F9FAFB',
  minHeight: '100vh',
  boxSizing: 'border-box',
  overflowX: 'hidden',
});

export const StyledTabs = styled(Tabs)({
  marginBottom: '32px',
  borderBottom: '1px solid #E5E7EB',
  width: '100%',
  '& .MuiTabs-indicator': {
    backgroundColor: '#1E40AF',
    width: '100%',
  },
  '& .MuiTab-root': {
    color: '#6B7280',
    width: '100%',
    '&.Mui-selected': {
      color: '#1E40AF',
    },
  },
});

export const StyledAccordion = styled(Accordion)({
  width: '100%',
  boxShadow: 'none',
  '&:before': {
    display: 'none',
  },
  marginBottom: '16px',
  '& .MuiAccordionSummary-root': {
    backgroundColor: '#F3F4F6',
    borderRadius: '8px',
    padding: '0 16px',
    width: '100%',
    '&:hover': {
      backgroundColor: '#E5E7EB',
    },
  },
  '& .MuiAccordionDetails-root': {
    padding: '24px',
    width: '100%',
  },
  '& .MuiTypography-root': {
    color: '#000000',
    width: '100%',
  },
});

export const ChartContainer = styled(Box)({
  width: '100%',
  height: '400px',
  marginTop: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  overflowX: 'hidden',
  backgroundColor: '#FFFFFF',
  borderRadius: '8px',
  padding: '24px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
});

export const TableContainer = styled(Box)({
  width: '100%',
  overflowX: 'auto',
  backgroundColor: '#FFFFFF',
  borderRadius: '8px',
  marginBottom: '24px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  '& table': {
    width: '100%',
  }
}); 