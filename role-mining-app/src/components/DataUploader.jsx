import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, Button, Grid } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SecurityIcon from '@mui/icons-material/Security';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import { ToastContainer, toast } from 'react-toastify';
import { motion } from 'framer-motion';
import {
  UploaderContainer,
  HeroContent,
  HeroTitle,
  HeroDescription,
  FeatureCard,
  GradientText,
  UploadZone,
  FeatureGrid
} from '../styles/RoleMiningContainer.styles';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.2,
      duration: 0.8
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

const cardVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  },
  hover: {
    y: -8,
    transition: { duration: 0.2 }
  }
};

const features = [
  {
    icon: <AutoAwesomeIcon sx={{ fontSize: 40, color: '#1E40AF' }} />,
    title: 'AI-Powered Analysis',
    description: 'Leverage advanced AI algorithms to discover optimal role patterns and configurations.'
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 40, color: '#1E40AF' }} />,
    title: 'Enhanced Security',
    description: 'Strengthen your security posture with intelligent access management and role optimization.'
  },
  {
    icon: <AnalyticsIcon sx={{ fontSize: 40, color: '#1E40AF' }} />,
    title: 'Deep Insights',
    description: 'Gain comprehensive insights into your access patterns and role structures.'
  }
];

const REQUIRED_FILES = [
  'users.csv',
  'ou.csv',
  'applications.csv',
  'entitlements.csv',
  'assignment.csv',
];

const FILE_DESCRIPTIONS = {
  'users.csv': 'Contains user information and attributes',
  'ou.csv': 'Organizational unit structure and hierarchy',
  'applications.csv': 'List of applications and their details',
  'entitlements.csv': 'Available entitlements and permissions',
  'assignment.csv': 'User-entitlement assignments and relationships',
};

const DataUploader = ({ onFilesAccepted }) => {
  const onDrop = useCallback((acceptedFiles) => {
    const uploadedFileNames = acceptedFiles.map(file => file.name);
    const missingFiles = REQUIRED_FILES.filter(file => !uploadedFileNames.includes(file));

    if (missingFiles.length > 0) {
      toast.error(
        `Missing required files: ${missingFiles.join(', ')}`,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
      return;
    }

    onFilesAccepted(acceptedFiles);
  }, [onFilesAccepted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    multiple: true
  });

  return (
    <UploaderContainer>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <HeroContent>
          <motion.div variants={itemVariants}>
            <HeroTitle variant="h1">
              Optimize Your Access Management
            </HeroTitle>
          </motion.div>

          <motion.div variants={itemVariants}>
            <HeroDescription variant="h6">
              Transform your organization's security with AI-powered role mining.
              Discover optimal role patterns and streamline access management effortlessly.
            </HeroDescription>
          </motion.div>

          <motion.div variants={itemVariants}>
            <UploadZone
              {...getRootProps()}
              isDragActive={isDragActive}
            >
              <input {...getInputProps()} />
              
              {/* Background glow effect */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '200px',
                  height: '200px',
                  background: 'radial-gradient(circle, rgba(30, 64, 175, 0.1) 0%, rgba(30, 64, 175, 0) 70%)',
                  borderRadius: '50%',
                  zIndex: 0
                }}
              />

              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <motion.div
                  animate={{ y: [-10, 10] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                  style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}
                >
                  <CloudUploadIcon sx={{ fontSize: 64, color: '#1E40AF' }} />
                </motion.div>

                <Typography variant="h5" sx={{ textAlign: 'center', color: '#1F2937', mb: 2, fontWeight: 600 }}>
                  {isDragActive ? 'Drop your files here' : 'Drag and drop your files here'}
                </Typography>
                
                <Typography variant="body1" sx={{ textAlign: 'center', color: '#6B7280', mb: 3 }}>
                  or click to select files
                </Typography>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: '#1E40AF',
                      color: '#FFFFFF',
                      px: 4,
                      py: 1.5,
                      '&:hover': {
                        backgroundColor: '#1E3A8A',
                      },
                    }}
                  >
                    Select Files
                  </Button>
                </motion.div>
              </Box>
            </UploadZone>
          </motion.div>

          <FeatureGrid container spacing={4} sx={{ mt: 8 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <FeatureCard>
                    {feature.icon}
                    <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </FeatureCard>
                </motion.div>
              </Grid>
            ))}
          </FeatureGrid>

          <motion.div variants={itemVariants}>
            <Box sx={{ mt: 6, textAlign: 'center' }}>
              <GradientText variant="h4">
                Ready to transform your access management?
              </GradientText>
              <Typography variant="body1" sx={{ mt: 2, color: '#6B7280' }}>
                Start by uploading your CSV files and let our AI do the magic.
              </Typography>
            </Box>
          </motion.div>
        </HeroContent>
      </motion.div>
    </UploaderContainer>
  );
};

export default DataUploader; 