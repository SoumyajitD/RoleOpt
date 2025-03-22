import { styled } from '@mui/material/styles';
import { Box, Paper, Button, Typography, TableCell } from '@mui/material';

export const SummaryContainer = styled(Box)({
  width: '100%',
  maxWidth: '1400px',
  margin: '0 auto',
  padding: '32px',
  backgroundColor: '#F9FAFB',
  boxSizing: 'border-box',
});

export const SummaryHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '32px',
  width: '100%',
  padding: '0',
  boxSizing: 'border-box',
});

export const SummaryTitle = styled(Typography)({
  color: '#1F2937',
  fontWeight: 600
});

export const UploadNewButton = styled(Button)({
  borderColor: '#6B7280',
  color: '#6B7280',
  '&:hover': {
    backgroundColor: '#F3F4F6',
    borderColor: '#4B5563',
    color: '#4B5563',
  }
});

export const StartMiningButton = styled(Button)({
  backgroundColor: '#1E40AF',
  color: '#FFFFFF',
  '&:hover': {
    backgroundColor: '#1E3A8A',
  },
  '&:disabled': {
    backgroundColor: '#E5E7EB',
    color: '#9CA3AF',
  }
});

export const DataTableContainer = styled(Paper)({
  padding: '24px',
  marginBottom: '24px',
  backgroundColor: '#FFFFFF',
  border: '1px solid #E5E7EB',
  borderLeft: '4px solid #1E40AF',
  transition: 'all 0.3s ease',
  borderRadius: '8px',
  width: '100%',
  boxSizing: 'border-box',
  '&:hover': {
    backgroundColor: '#F9FAFB',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  }
});

export const TableHeaderCell = styled(TableCell)({
  color: '#1F2937',
  fontWeight: 600,
  textTransform: 'capitalize',
  borderBottom: '1px solid #E5E7EB',
  whiteSpace: 'nowrap',
  backgroundColor: '#F9FAFB',
  padding: '16px',
});

export const TableBodyCell = styled(TableCell)({
  color: '#374151',
  borderBottom: '1px solid #E5E7EB',
  padding: '16px',
});

export const ExpandButton = styled(Button)({
  color: '#1F2937',
  minWidth: '40px',
  width: '40px',
  height: '40px',
  padding: '8px',
  borderRadius: '8px',
  backgroundColor: 'transparent',
  '&:hover': {
    backgroundColor: '#F3F4F6',
    color: '#1E40AF',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '24px',
  }
});

export const TableTitle = styled(Typography)({
  color: '#6B7280',
  marginBottom: '8px',
  textTransform: 'capitalize'
});

export const TableCount = styled(Typography)({
  color: '#1F2937',
  marginBottom: '16px',
  fontWeight: 600
});

export const TableDescription = styled(Typography)({
  color: '#4B5563',
  marginBottom: '16px'
});

export const ProcessedStatus = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  '& .MuiSvgIcon-root': {
    color: '#10B981',
    marginRight: '8px'
  },
  '& .MuiTypography-root': {
    color: '#10B981'
  }
}); 