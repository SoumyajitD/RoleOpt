import React, { useState } from 'react';
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
  TablePagination,
  IconButton,
  Collapse,
  Grid,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RefreshIcon from '@mui/icons-material/Refresh';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const FILE_DESCRIPTIONS = {
  'users.csv': 'Contains user information and attributes',
  'ou.csv': 'Organizational unit structure and hierarchy',
  'applications.csv': 'List of applications and their details',
  'entitlements.csv': 'Available entitlements and permissions',
  'assignment.csv': 'User-entitlement assignments and relationships',
};

const DataTable = ({ data, columns, title, description, count }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(true);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate available row options based on data length
  const getRowsPerPageOptions = (totalItems) => {
    const baseOptions = [5, 10, 25, 50];
    return baseOptions.filter(option => option <= totalItems || option === 5);
  };

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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            onClick={() => setOpen(!open)}
            sx={{
              color: '#6B7280',
              '&:hover': {
                backgroundColor: '#F3F4F6',
              }
            }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
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
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CheckCircleIcon sx={{ color: '#10B981', mr: 1 }} />
          <Typography variant="body2" sx={{ color: '#10B981' }}>
            Successfully processed
          </Typography>
        </Box>
      </Box>
      <Collapse in={open}>
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
              {data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
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
        <TablePagination
          component="div"
          count={data.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={getRowsPerPageOptions(data.length)}
          sx={{
            '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
              color: '#6B7280',
            },
            '.MuiTablePagination-select': {
              color: '#1F2937',
              backgroundColor: '#FFFFFF',
            },
            '.MuiTablePagination-menuItem': {
              color: '#374151',
              backgroundColor: '#FFFFFF',
              '&:hover': {
                backgroundColor: '#F3F4F6',
              },
              '&.Mui-selected': {
                backgroundColor: '#E5E7EB',
              },
            },
            '& .MuiSelect-select': {
              backgroundColor: '#FFFFFF',
              '&:focus': {
                backgroundColor: '#FFFFFF',
              },
            },
          }}
        />
      </Collapse>
    </Paper>
  );
};

const DataSummary = ({ summary, onReupload, onStartRoleMining }) => {
  return (
    <Box sx={{ width: '100%', maxWidth: '1400px', mx: 'auto', p: 2, backgroundColor: '#F9FAFB' }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4 
      }}>
        <Typography variant="h5" sx={{ color: '#1F2937', fontWeight: 600 }}>
          Upload Summary
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={onReupload}
            startIcon={<RefreshIcon />}
            sx={{
              borderColor: '#6B7280',
              color: '#6B7280',
              '&:hover': {
                backgroundColor: '#F3F4F6',
                borderColor: '#4B5563',
                color: '#4B5563',
              }
            }}
          >
            Upload New Files
          </Button>
          <Button
            variant="contained"
            onClick={onStartRoleMining}
            startIcon={<PlayArrowIcon />}
            sx={{
              backgroundColor: '#1E40AF',
              color: '#FFFFFF',
              '&:hover': {
                backgroundColor: '#1E3A8A',
              },
              '&:disabled': {
                backgroundColor: '#E5E7EB',
                color: '#9CA3AF',
              }
            }}
          >
            Start Role Mining
          </Button>
        </Box>
      </Box>
      {Object.entries(summary).map(([key, value]) => (
        <DataTable
          key={key}
          title={key}
          description={FILE_DESCRIPTIONS[`${key}.csv`]}
          count={value.count}
          data={value.data}
          columns={value.columns}
        />
      ))}
    </Box>
  );
};

export default DataSummary; 