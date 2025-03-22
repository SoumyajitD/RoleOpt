import { styled } from '@mui/material/styles';
import { Box, Paper, Button, Typography } from '@mui/material';

// Styled components
export const ConfigContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto',
  padding: theme.spacing(3),
  backgroundColor: '#F9FAFB',
  minHeight: 'calc(100vh - 64px)'
}));

export const ConfigHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(4)
}));

export const ConfigTitle = styled(Typography)({
  color: '#1F2937',
  fontWeight: 600
});

export const ResetButton = styled(Button)({
  borderColor: '#6B7280',
  color: '#6B7280',
  '&:hover': {
    backgroundColor: '#F3F4F6',
    borderColor: '#4B5563',
    color: '#4B5563',
  },
  '&:focus': {
    outline: 'none',
    backgroundColor: '#F3F4F6',
  }
});

export const ConfigPaper = styled(Paper)({
  padding: '24px',
  backgroundColor: '#FFFFFF',
  border: '1px solid #E5E7EB'
});

export const StartMiningButton = styled(Button)({
  backgroundColor: '#1E40AF',
  color: '#FFFFFF',
  minWidth: '200px',
  '&:hover': {
    backgroundColor: '#1E3A8A',
  },
  '&:focus': {
    outline: 'none',
    backgroundColor: '#1E3A8A',
  },
  '&.Mui-disabled': {
    backgroundColor: '#E5E7EB',
    color: '#9CA3AF',
  }
});

// Common styles for inputs
export const inputStyles = {
  '& .MuiInputLabel-root': {
    color: '#000000',
    backgroundColor: '#FFFFFF',
    padding: '0 8px',
  },
  '& .MuiOutlinedInput-root': {
    color: '#000000',
    '& fieldset': {
      borderColor: '#E5E7EB',
    },
    '&:hover fieldset': {
      borderColor: '#D1D5DB',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#1E40AF',
    },
  },
  '& .MuiInputAdornment-root': {
    color: '#000000',
  }
};

// Styles for Select components
export const selectStyles = {
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#E5E7EB',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#D1D5DB',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#1E40AF',
  },
  minHeight: '56px',
  '& .MuiSelect-select': {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 14px',
    minHeight: '56px !important',
    '& > div': {
      flex: 1,
    }
  }
};

// Menu Props styles
export const menuProps = {
  PaperProps: {
    sx: {
      backgroundColor: '#FFFFFF',
      maxHeight: 300,
      marginTop: 1,
      '& .MuiMenuItem-root': {
        padding: '4px 16px',
        height: '40px',
        color: '#000000',
        '&:hover': {
          backgroundColor: '#F3F4F6',
        },
        '&.Mui-selected': {
          backgroundColor: '#E5E7EB',
          '&:hover': {
            backgroundColor: '#D1D5DB',
          }
        }
      }
    }
  },
  MenuListProps: {
    sx: {
      backgroundColor: '#FFFFFF',
      color: '#000000',
    }
  }
};

// Chip styles
export const chipStyles = {
  backgroundColor: '#E5E7EB',
  color: '#000000',
  maxWidth: '120px',
  height: '24px',
  '& .MuiChip-label': {
    fontSize: '0.8125rem',
    lineHeight: 1.2,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  '& .MuiChip-deleteIcon': {
    color: '#000000',
    marginRight: '4px',
    '&:hover': {
      color: '#EF4444'
    }
  }
}; 