const API_BASE_URL = '/api';

const REQUIRED_FILES = [
  'users.csv',
  'ou.csv',
  'applications.csv',
  'entitlements.csv',
  'assignment.csv',
];

// Mock data for testing
const mockSummary = {
  users: {
    count: 1500,
    data: [
      { id: 1, username: 'john.doe', email: 'john@example.com', department: 'IT', role: 'Developer' },
      { id: 2, username: 'jane.smith', email: 'jane@example.com', department: 'HR', role: 'Manager' },
      { id: 3, username: 'bob.wilson', email: 'bob@example.com', department: 'Finance', role: 'Analyst' },
    ],
    columns: ['id', 'username', 'email', 'department', 'role']
  },
  ou: {
    count: 75,
    data: [
      { id: 1, name: 'IT Department', parent: 'Corporate', level: 1 },
      { id: 2, name: 'HR Division', parent: 'Corporate', level: 1 },
      { id: 3, name: 'Development Team', parent: 'IT Department', level: 2 },
    ],
    columns: ['id', 'name', 'parent', 'level']
  },
  applications: {
    count: 25,
    data: [
      { id: 1, name: 'Email System', description: 'Corporate email application', owner: 'IT' },
      { id: 2, name: 'HR Portal', description: 'HR management system', owner: 'HR' },
      { id: 3, name: 'Finance App', description: 'Financial management system', owner: 'Finance' },
    ],
    columns: ['id', 'name', 'description', 'owner']
  },
  entitlements: {
    count: 350,
    data: [
      { id: 1, name: 'Email Access', application: 'Email System', type: 'READ' },
      { id: 2, name: 'HR Admin', application: 'HR Portal', type: 'ADMIN' },
      { id: 3, name: 'Finance View', application: 'Finance App', type: 'READ' },
    ],
    columns: ['id', 'name', 'application', 'type']
  },
  assignment: {
    count: 4500,
    data: [
      { id: 1, user: 'john.doe', entitlement: 'Email Access', granted_date: '2024-01-01' },
      { id: 2, user: 'jane.smith', entitlement: 'HR Admin', granted_date: '2024-01-15' },
      { id: 3, user: 'bob.wilson', entitlement: 'Finance View', granted_date: '2024-02-01' },
    ],
    columns: ['id', 'user', 'entitlement', 'granted_date']
  }
};

export const uploadFiles = async (files) => {
  // Check if exactly 5 files are uploaded
  if (files.length !== 5) {
    throw new Error(`Please upload exactly 5 CSV files. You uploaded ${files.length} files.`);
  }

  // Check if all files are CSV files
  const nonCsvFiles = files.filter(file => !file.name.toLowerCase().endsWith('.csv'));
  if (nonCsvFiles.length > 0) {
    throw new Error('All files must be CSV files.');
  }

  // Simulate file upload delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Log the uploaded files
  console.log('Uploaded files:', files.map(f => f.name));
  
  return { success: true };
};

export const getDataSummary = async () => {
  // Simulating API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockSummary);
    }, 1000);
  });
};

export const getApplications = async () => {
  // Mock data for applications
  const mockApplications = [
    { id: 1, name: 'Email System' },
    { id: 2, name: 'HR Portal' },
    { id: 3, name: 'Finance App' },
    { id: 4, name: 'CRM System' },
    { id: 5, name: 'Project Management Tool' },
    { id: 6, name: 'Document Management' },
    { id: 7, name: 'Inventory System' },
    { id: 8, name: 'Accounting Software' }
  ];

  // Simulating API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockApplications);
    }, 500);
  });
};

export const getOrganizationalUnits = async () => {
  // Mock data for organizational units
  const mockOUs = [
    { id: 1, name: 'IT Department' },
    { id: 2, name: 'HR Division' },
    { id: 3, name: 'Finance Department' },
    { id: 4, name: 'Sales Team' },
    { id: 5, name: 'Marketing Division' },
    { id: 6, name: 'Development Team' },
    { id: 7, name: 'Quality Assurance' },
    { id: 8, name: 'Customer Support' }
  ];

  // Simulating API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockOUs);
    }, 500);
  });
}; 