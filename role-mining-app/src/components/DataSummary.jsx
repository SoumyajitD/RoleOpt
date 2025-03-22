import React, { useState } from 'react';
import { 
  Box,
  Typography,
  Button,
  Table,
  TableBody,
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
import {
  SummaryContainer,
  SummaryHeader,
  SummaryTitle,
  UploadNewButton,
  StartMiningButton,
  DataTableContainer,
  TableHeaderCell,
  TableBodyCell,
  ExpandButton,
  TableTitle,
  TableCount,
  TableDescription,
  ProcessedStatus
} from '../styles/DataSummary.styles';

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

  return (
    <DataTableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ExpandButton onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </ExpandButton>
          <Box>
            <TableTitle>{title}</TableTitle>
            <TableCount variant="h4">{count.toLocaleString()}</TableCount>
            <TableDescription variant="body2">{description}</TableDescription>
          </Box>
        </Box>
        <ProcessedStatus>
          <CheckCircleIcon />
          <Typography variant="body2">Successfully processed</Typography>
        </ProcessedStatus>
      </Box>
      <Collapse in={open}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableHeaderCell key={column}>
                    {column.replace('_', ' ')}
                  </TableHeaderCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow key={index}>
                    {columns.map((column) => (
                      <TableBodyCell key={column}>
                        {row[column]}
                      </TableBodyCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Collapse>
    </DataTableContainer>
  );
};

const DataSummary = ({ summary, onReupload, onStartRoleMining }) => {
  return (
    <SummaryContainer>
      <SummaryHeader>
        <SummaryTitle variant="h5">
          Upload Summary
        </SummaryTitle>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <UploadNewButton
            variant="outlined"
            onClick={onReupload}
            startIcon={<RefreshIcon />}
          >
            Upload New Files
          </UploadNewButton>
          <StartMiningButton
            variant="contained"
            onClick={onStartRoleMining}
            startIcon={<PlayArrowIcon />}
          >
            Set Configurations
          </StartMiningButton>
        </Box>
      </SummaryHeader>
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
    </SummaryContainer>
  );
};

export default DataSummary; 