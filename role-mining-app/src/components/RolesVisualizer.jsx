import React, { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { PulseLoader, BeatLoader, HashLoader } from 'react-spinners';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Mock API responses
const mockRoleMiningResults = {
  roles: [
    {
      id: 1,
      name: 'Admin Role',
      applications: ['Salesforce', 'Jira', 'Confluence'],
      users: 25,
      permissions: 150,
      risk: 'High',
    },
    {
      id: 2,
      name: 'Developer Role',
      applications: ['GitHub', 'Jenkins', 'Docker'],
      users: 45,
      permissions: 200,
      risk: 'Medium',
    },
    {
      id: 3,
      name: 'Analyst Role',
      applications: ['Tableau', 'Excel', 'Power BI'],
      users: 30,
      permissions: 100,
      risk: 'Low',
    },
  ],
  statistics: {
    totalRoles: 3,
    totalUsers: 100,
    totalPermissions: 450,
    riskDistribution: {
      High: 1,
      Medium: 1,
      Low: 1,
    },
  },
};

const mockAISuggestions = {
  suggestions: [
    {
      id: 1,
      name: 'Super Admin Role',
      applications: ['All Applications'],
      users: 5,
      permissions: 300,
      confidence: '95%',
    },
    {
      id: 2,
      name: 'Read-Only Role',
      applications: ['Salesforce', 'Jira'],
      users: 20,
      permissions: 50,
      confidence: '85%',
    },
    {
      id: 3,
      name: 'Developer Lead Role',
      applications: ['GitHub', 'Jenkins', 'Docker', 'Confluence'],
      users: 10,
      permissions: 250,
      confidence: '90%',
    },
  ],
  statistics: {
    totalSuggestions: 3,
    averageConfidence: '90%',
    potentialUsers: 35,
    potentialPermissions: 600,
  },
};

// Styled components
const VisualizerContainer = styled(Box)({
  padding: '24px',
  backgroundColor: '#FFFFFF',
  borderRadius: '8px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  maxWidth: '1400px',
  margin: '0 auto',
  width: '100%',
});

const StyledTabs = styled(Tabs)({
  borderBottom: '1px solid #E5E7EB',
  marginBottom: '24px',
  '& .MuiTab-root': {
    color: '#000000',
    '&.Mui-selected': {
      color: '#1E40AF',
    },
  },
});

const ChartContainer = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '24px',
  marginBottom: '24px',
  '& canvas': {
    maxHeight: '400px',
    width: '100% !important',
    height: '100% !important',
  },
});

const TablePaper = styled(Paper)({
  width: '100%',
  overflow: 'hidden',
  '& .MuiTableCell-root': {
    color: '#000000',
  },
  '& .MuiTableHead-root .MuiTableCell-root': {
    backgroundColor: '#F3F4F6',
    fontWeight: 600,
  },
});

const StyledAccordion = styled(Accordion)({
  '&:before': {
    display: 'none',
  },
  marginBottom: '16px',
  '& .MuiAccordionSummary-root': {
    backgroundColor: '#F3F4F6',
    borderRadius: '8px',
    padding: '0 16px',
    '&:hover': {
      backgroundColor: '#E5E7EB',
    },
  },
  '& .MuiAccordionDetails-root': {
    padding: '24px',
  },
  '& .MuiTypography-root': {
    color: '#000000',
  },
});

const LoadingContainer = styled(Box)({
  width: '100%',
  minHeight: '400px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '32px',
});

const LoadingAnimation = ({ enableAI }) => {
  return (
    <LoadingContainer>
      <HashLoader
        color="#1E40AF"
        size={50}
        speedMultiplier={0.8}
      />
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom sx={{ color: '#000000' }}>
          Analyzing Role Data
        </Typography>
        <Typography variant="body1" sx={{ color: '#1F2937' }}>
          Please wait while we process and visualize your role mining data
          {enableAI && " and generate AI suggestions"}...
        </Typography>
      </Box>
      {enableAI && (
        <Box sx={{ mt: 2 }}>
          <BeatLoader color="#1E40AF" size={12} speedMultiplier={0.8} />
        </Box>
      )}
    </LoadingContainer>
  );
};

const RolesVisualizer = ({ enableAI }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [roleMiningData, setRoleMiningData] = useState(null);
  const [aiSuggestions, setAISuggestions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    table: true,
    charts: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setRoleMiningData(mockRoleMiningResults);
        
        // Only fetch AI suggestions if enabled
        if (enableAI) {
          // In real implementation:
          // const aiSuggestionsResponse = await fetch('/api/ai/suggest-roles');
          setAISuggestions(mockAISuggestions);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [enableAI]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAccordionChange = (section) => (event, isExpanded) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: isExpanded,
    }));
  };

  const renderCharts = (data, type) => {
    if (!data) return null;

    const { statistics } = data;

    if (type === 'mining') {
      return (
        <>
          <Bar
            data={{
              labels: ['Total Roles', 'Total Users', 'Total Permissions'],
              datasets: [
                {
                  label: 'Role Mining Statistics',
                  data: [
                    statistics.totalRoles,
                    statistics.totalUsers,
                    statistics.totalPermissions,
                  ],
                  backgroundColor: [
                    'rgba(99, 102, 241, 0.5)',
                    'rgba(99, 102, 241, 0.5)',
                    'rgba(99, 102, 241, 0.5)',
                  ],
                  borderColor: [
                    'rgb(79, 70, 229)',
                    'rgb(79, 70, 229)',
                    'rgb(79, 70, 229)',
                  ],
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                  },
                },
                x: {
                  grid: {
                    display: false,
                  },
                },
              },
              plugins: {
                legend: {
                  display: false,
                },
                title: {
                  display: true,
                  text: 'Role Mining Overview',
                  font: {
                    size: 16,
                    weight: 'bold',
                  },
                  padding: 20,
                },
              },
            }}
          />
          <Box sx={{ height: '400px', display: 'flex', justifyContent: 'center' }}>
            <Pie
              data={{
                labels: Object.keys(statistics.riskDistribution),
                datasets: [
                  {
                    data: Object.values(statistics.riskDistribution),
                    backgroundColor: [
                      'rgba(239, 68, 68, 0.7)',
                      'rgba(245, 158, 11, 0.7)',
                      'rgba(34, 197, 94, 0.7)',
                    ],
                    borderColor: [
                      'rgb(239, 68, 68)',
                      'rgb(245, 158, 11)',
                      'rgb(34, 197, 94)',
                    ],
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                    labels: {
                      font: {
                        size: 14,
                      },
                      padding: 20,
                    },
                  },
                  title: {
                    display: true,
                    text: 'Risk Distribution',
                    font: {
                      size: 16,
                      weight: 'bold',
                    },
                    padding: 20,
                  },
                },
              }}
            />
          </Box>
        </>
      );
    }

    return (
      <Bar
        data={{
          labels: ['Total Suggestions', 'Potential Users', 'Potential Permissions'],
          datasets: [
            {
              label: 'AI Suggestions Overview',
              data: [
                statistics.totalSuggestions,
                statistics.potentialUsers,
                statistics.potentialPermissions,
              ],
              backgroundColor: [
                'rgba(99, 102, 241, 0.5)',
                'rgba(99, 102, 241, 0.5)',
                'rgba(99, 102, 241, 0.5)',
              ],
              borderColor: [
                'rgb(79, 70, 229)',
                'rgb(79, 70, 229)',
                'rgb(79, 70, 229)',
              ],
              borderWidth: 1,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.1)',
              },
            },
            x: {
              grid: {
                display: false,
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: true,
              text: 'AI Suggestions Overview',
              font: {
                size: 16,
                weight: 'bold',
              },
              padding: 20,
            },
          },
        }}
      />
    );
  };

  const renderTable = (data, type) => {
    if (!data) return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <PulseLoader color="#1E40AF" size={10} speedMultiplier={0.8} />
      </Box>
    );

    const { roles, suggestions } = data;
    const items = type === 'mining' ? roles : suggestions;

    return (
      <TableContainer component={TablePaper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Applications</TableCell>
              <TableCell>Users</TableCell>
              <TableCell>Permissions</TableCell>
              <TableCell>{type === 'mining' ? 'Risk' : 'Confidence'}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.applications.join(', ')}</TableCell>
                <TableCell>{item.users}</TableCell>
                <TableCell>{item.permissions}</TableCell>
                <TableCell>{type === 'mining' ? item.risk : item.confidence}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderContent = (data, type) => {
    if (!data) return null;

    return (
      <>
        <StyledAccordion
          expanded={expandedSections.table}
          onChange={handleAccordionChange('table')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Role Details Table</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {renderTable(data, type)}
          </AccordionDetails>
        </StyledAccordion>

        <StyledAccordion
          expanded={expandedSections.charts}
          onChange={handleAccordionChange('charts')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Analytics & Visualizations</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ChartContainer>
              {renderCharts(data, type)}
            </ChartContainer>
          </AccordionDetails>
        </StyledAccordion>
      </>
    );
  };

  if (loading) {
    return (
      <VisualizerContainer>
        <LoadingAnimation enableAI={enableAI} />
      </VisualizerContainer>
    );
  }

  return (
    <VisualizerContainer>
      <Typography variant="h5" gutterBottom sx={{ color: '#000000' }}>
        Role Mining Results
      </Typography>
      <StyledTabs 
        value={activeTab} 
        onChange={handleTabChange}
        sx={{
          '& .MuiTabs-flexContainer': {
            gap: '16px',
          },
        }}
      >
        <Tab label="Role Mining Results" />
        {enableAI && <Tab label="AI Suggestions" />}
      </StyledTabs>

      {activeTab === 0 && renderContent(roleMiningData, 'mining')}
      {activeTab === 1 && enableAI && renderContent(aiSuggestions, 'ai')}
    </VisualizerContainer>
  );
};

RolesVisualizer.defaultProps = {
  enableAI: false,
};

export default RolesVisualizer; 