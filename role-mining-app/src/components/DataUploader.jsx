import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Fade } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DescriptionIcon from '@mui/icons-material/Description';
import {
  UploaderContainer,
  DropzonePaper,
  UploadIcon,
  UploadTitle,
  RequiredFilesContainer,
  RequiredFilesText,
  ChipsContainer,
  FileChip,
  activeDropzoneStyles
} from '../styles/DataUploader.styles';

const REQUIRED_FILES = [
  'users.csv',
  'ou.csv',
  'applications.csv',
  'entitlements.csv',
  'assignment.csv',
];

const DataUploader = ({ onFilesAccepted }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onFilesAccepted,
    accept: {
      'text/csv': ['.csv'],
    },
    multiple: true,
  });

  return (
    <Fade in timeout={800}>
      <UploaderContainer>
        <DropzonePaper
          {...getRootProps()}
          sx={isDragActive ? activeDropzoneStyles : {}}
        >
          <input {...getInputProps()} />
          <UploadIcon>
            <CloudUploadIcon />
          </UploadIcon>
          <UploadTitle variant="h5">
            {isDragActive
              ? 'Drop the files here'
              : 'Drag and drop CSV files here, or click to select files'}
          </UploadTitle>
          <RequiredFilesContainer>
            <RequiredFilesText variant="body2">
              Required files:
            </RequiredFilesText>
            <ChipsContainer>
              {REQUIRED_FILES.map((file) => (
                <FileChip
                  key={file}
                  label={file}
                  icon={<DescriptionIcon />}
                />
              ))}
            </ChipsContainer>
          </RequiredFilesContainer>
        </DropzonePaper>
      </UploaderContainer>
    </Fade>
  );
};

export default DataUploader; 