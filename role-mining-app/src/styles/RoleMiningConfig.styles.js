import { styled } from '@mui/material/styles';
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  Select,
  Chip,
  OutlinedInput,
} from '@mui/material';

// Styled components
export const ConfigContainer = styled(Box)({
  padding: '32px',
  backgroundColor: '#FFFFFF',
  borderRadius: '8px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  maxWidth: '1200px',
  margin: '0 auto',
});

export const ConfigHeader = styled(Box)({
  marginBottom: '32px',
});

export const ConfigTitle = styled(Typography)({
  color: '#000000',
  marginBottom: '8px',
});

export const ConfigDescription = styled(Typography)({
  color: '#000000',
});

export const ConfigSection = styled(Box)({
  marginBottom: '32px',
});

export const SectionTitle = styled(Typography)({
  color: '#000000',
  marginBottom: '8px',
});

export const SectionDescription = styled(Typography)({
  color: '#000000',
  marginBottom: '16px',
});

export const FormRow = styled(Box)({
  marginBottom: '24px',
});

export const FormGroup = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

export const SelectContainer = styled(Box)({
  width: '100%',
});

export const StyledFormControl = styled(FormControl)({
  width: '100%',
  '& .MuiInputLabel-root': {
    color: '#000000',
  },
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#1E40AF',
    },
  },
});

export const StyledOutlinedInput = styled(OutlinedInput)({
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#E5E7EB',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#9CA3AF',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#1E40AF',
  },
});

export const StyledSelect = styled(Select)({
  '& .MuiSelect-select': {
    padding: '12px',
    minHeight: '56px !important',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
});

export const ChipContainer = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
});

export const StyledChip = styled(Chip)({
  backgroundColor: '#F3F4F6',
  color: '#000000',
  '& .MuiChip-deleteIcon': {
    color: '#6B7280',
    '&:hover': {
      color: '#EF4444',
    },
  },
});

export const StyledTextField = styled(TextField)({
  '& .MuiInputLabel-root': {
    color: '#000000',
    '&.Mui-focused': {
      color: '#1E40AF',
    },
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#E5E7EB',
    },
    '&:hover fieldset': {
      borderColor: '#9CA3AF',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#1E40AF',
    },
  },
  '& .MuiInputBase-input': {
    color: '#000000',
  },
  '& .MuiFormHelperText-root': {
    color: '#EF4444',
    '&.Mui-error': {
      color: '#EF4444',
    },
  },
});

export const StartMiningButton = styled(Button)({
  backgroundColor: '#1E40AF',
  color: '#FFFFFF',
  padding: '8px 24px',
  '&:hover': {
    backgroundColor: '#1E3A8A',
  },
  '&.Mui-disabled': {
    backgroundColor: '#E5E7EB',
    color: '#9CA3AF',
  },
});

export const ResetButton = styled(Button)({
  color: '#1E40AF',
  borderColor: '#1E40AF',
  padding: '8px 24px',
  '&:hover': {
    backgroundColor: 'rgba(30, 64, 175, 0.04)',
    borderColor: '#1E3A8A',
  },
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