/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import {
  uploadAreaWrapper,
  uploadArea,
  inputElement,
  uploadAreaWrapperActive,
  uploadAreaWrapperDecreasedHeight,
} from './styles';
import { Box, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useDropzone } from 'react-dropzone';
import { FIFTY_MB } from '@constants/common';

interface DragDropAreaProps {
  onDrop: (acceptedFiles: File[]) => void;
  decreaseHeight: boolean;
}

function DragDropArea({ onDrop, decreaseHeight }: DragDropAreaProps) {
  const [draggingOver, setDraggingOver] = useState(false);

  const { getInputProps, getRootProps } = useDropzone({
    multiple: true,
    maxSize: FIFTY_MB,
    onDragEnter: () => {
      setDraggingOver(true);
    },
    onDragLeave: () => {
      setDraggingOver(false);
    },
    onDrop: (acceptedFiles: File[]) => {
      setDraggingOver(false);
      onDrop(acceptedFiles);
    },
  });

  return (
    <Box
      css={[
        uploadAreaWrapper,
        draggingOver ? uploadAreaWrapperActive : null,
        decreaseHeight ? uploadAreaWrapperDecreasedHeight : null,
      ]}
      width={1}
    >
      <Box css={uploadArea} {...getRootProps()}>
        <Typography variant="h6">Drag files here or click to select</Typography>
        <CloudUploadIcon fontSize="large" />
        <input css={inputElement} {...getInputProps()} />
      </Box>
    </Box>
  );
}

export default DragDropArea;
