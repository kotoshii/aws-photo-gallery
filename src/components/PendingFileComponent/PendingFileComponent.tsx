/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react';
import { Box, IconButton, Paper, Typography } from '@mui/material';
import { PendingFile } from '@interfaces/pending-file.interface';
import {
  filePreviewImage,
  filePreviewWrapper,
  pendingFileComponent,
  removeButton,
} from './styles';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import { filesize } from 'filesize';
import { EditableTitle } from '@components';

interface PendingFileComponentProps {
  file: PendingFile;
  onRemove: () => void;
  onSaveFilename: (newValue: string) => void;
}

function PendingFileComponent({
  file,
  onRemove,
  onSaveFilename,
}: PendingFileComponentProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const isImage = file._fileObj.type.includes('image');

  useEffect(() => {
    if (isImage) {
      const reader = new FileReader();

      reader.addEventListener('load', () => {
        setImageSrc(reader.result as string);
      });
      reader.readAsDataURL(file._fileObj);
    }
  }, []);

  return (
    <Paper elevation={0} css={pendingFileComponent}>
      <Box css={filePreviewWrapper}>
        {isImage && imageSrc ? (
          <img css={filePreviewImage} src={imageSrc} alt={file.filename} />
        ) : (
          <InsertDriveFileOutlinedIcon color="disabled" />
        )}
      </Box>
      <Box display="flex" flexDirection="column">
        <EditableTitle onEditConfirm={onSaveFilename} value={file.filename} />
        <Typography variant="caption">
          {filesize(file.size) as string}
        </Typography>
      </Box>
      <IconButton css={removeButton} onClick={onRemove}>
        <CancelIcon />
      </IconButton>
    </Paper>
  );
}

export default PendingFileComponent;
