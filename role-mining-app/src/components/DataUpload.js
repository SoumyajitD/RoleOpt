import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import Papa from 'papaparse';

const useStyles = makeStyles((theme) => ({
  dropzone: {
    border: '2px dashed #cccccc',
    borderRadius: '4px',
    padding: theme.spacing(5),
    textAlign: 'center',
    cursor: 'pointer',
    marginBottom: theme.spacing(2),
    '&:hover': {
      borderColor: theme.palette.primary.main,
      backgroundColor: '#f8f8f8',
    },
  },
  fileInput: {
    display: 'none',
  },
  fileInfo: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  uploadButton: {
    marginTop: theme.spacing(2),
  },
  progress: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
  uploadSection: {
    marginBottom: theme.spacing(4),
  },
}));

// Expected file types for role mining
const expectedFiles = [
  { name: 'users', label: 'Users File (.csv)', ext: '.csv' },
  { name: 'ous', label: 'Organizational Units File (.csv)', ext: '.csv' },
  { name: 'applications', label: 'Applications File (.csv)', ext: '.csv' },
  { name: 'entitlements', label: 'Entitlements File (.csv)', ext: '.csv' },
  { name: 'assignments', label: 'Assignments File (.csv)', ext: '.csv' },
];

const DataUpload = ({ onUploadComplete }) => {
  const classes = useStyles();
  const [files, setFiles] = useState({});
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event, fileType) => {
    const selectedFile = event.target.files[0];
    
    if (!selectedFile) return;
    
    // Validate file size (10MB limit)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError(`${selectedFile.name} exceeds the 10MB file size limit.`);
      return;
    }
    
    // Validate file extension
    const expectedExt = fileType.ext;
    if (!selectedFile.name.toLowerCase().endsWith(expectedExt)) {
      setError(`${selectedFile.name} must be a${expectedExt} file.`);
      return;
    }
    
    setFiles((prevFiles) => ({
      ...prevFiles,
      [fileType.name]: selectedFile,
    }));
    
    setError(null);
  };

  const parseCSV = (file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          resolve(results.data);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  };

  const handleUpload = async () => {
    // Validate that all required files are present
    const missingFiles = expectedFiles.filter(
      (fileType) => !files[fileType.name]
    );
    
    if (missingFiles.length > 0) {
      setError(`Missing required files: ${missingFiles.map(f => f.label).join(', ')}`);
      return;
    }
    
    setUploading(true);
    setError(null);
    
    try {
      // In a real application, you would upload to a server here
      // For demo, we'll just parse the CSV files locally
      const parsedData = {};
      
      for (const fileType of expectedFiles) {
        if (files[fileType.name]) {
          parsedData[fileType.name] = await parseCSV(files[fileType.name]);
        }
      }
      
      // Wait a bit to simulate server processing
      setTimeout(() => {
        setUploading(false);
        onUploadComplete(parsedData);
      }, 1500);
    } catch (err) {
      setUploading(false);
      setError('Error processing files: ' + err.message);
    }
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Upload Data Files
      </Typography>
      
      {error && (
        <Alert severity="error" style={{ marginBottom: '16px' }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {expectedFiles.map((fileType) => (
          <Grid item xs={12} sm={6} key={fileType.name}>
            <Paper className={classes.uploadSection} elevation={1} style={{ padding: '16px' }}>
              <Typography variant="subtitle1" gutterBottom>
                {fileType.label}
              </Typography>
              
              <input
                accept=".csv"
                className={classes.fileInput}
                id={`file-input-${fileType.name}`}
                type="file"
                onChange={(e) => handleFileChange(e, fileType)}
              />
              
              <label htmlFor={`file-input-${fileType.name}`}>
                <Paper className={classes.dropzone} variant="outlined">
                  <CloudUploadIcon color="primary" style={{ fontSize: 40, marginBottom: 8 }} />
                  <Typography>
                    {files[fileType.name]
                      ? files[fileType.name].name
                      : `Drag & drop or click to select ${fileType.label}`}
                  </Typography>
                </Paper>
              </label>
              
              {files[fileType.name] && (
                <Typography variant="body2" className={classes.fileInfo}>
                  Size: {(files[fileType.name].size / 1024).toFixed(2)} KB
                </Typography>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
      
      {uploading ? (
        <div className={classes.progress}>
          <CircularProgress />
        </div>
      ) : (
        <Button
          variant="contained"
          color="primary"
          size="large"
          className={classes.uploadButton}
          onClick={handleUpload}
          disabled={Object.keys(files).length === 0}
        >
          Upload and Process Files
        </Button>
      )}
    </div>
  );
};

export default DataUpload; 