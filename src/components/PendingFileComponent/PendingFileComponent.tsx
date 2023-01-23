/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { PendingFile } from '@interfaces/pending-file.interface';
import {
  filePreviewImage,
  filePreviewWrapper,
  pendingFileComponent,
} from './styles';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { filesize } from 'filesize';

interface PendingFileComponentProps {
  file: PendingFile;
}

function PendingFileComponent({ file }: PendingFileComponentProps) {
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
        <Typography variant="subtitle2">{file.filename}</Typography>
        <Typography variant="caption">
          {filesize(file.size) as string}
        </Typography>
      </Box>
    </Paper>
  );
}

export default PendingFileComponent;
