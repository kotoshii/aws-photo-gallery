/** @jsxImportSource @emotion/react */
import React, { useEffect, useMemo, useState } from 'react';
import {
  filePreviewImage,
  filePreviewWrapper,
  uploadingFileComponent,
  cancelButton,
} from './styles';
import { Box, IconButton, Paper, Typography, useTheme } from '@mui/material';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { filesize } from 'filesize';
import Cancel from '@mui/icons-material/Cancel';
import { FileUploadingInfo } from '@interfaces/storage/uploading-info.interface';
import { PendingFile } from '@interfaces/pending-file.interface';
import { useParseFilename } from '@hooks/use-parse-filename';

interface UploadingFileComponentProps {
  fileInfo: FileUploadingInfo;
  pendingFile: PendingFile;
  onCancel: () => void;
}

function UploadingFileComponent({
  fileInfo,
  pendingFile,
  onCancel,
}: UploadingFileComponentProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const isImage = pendingFile._fileObj.type.includes('image');

  useEffect(() => {
    if (isImage) {
      const reader = new FileReader();

      reader.addEventListener('load', () => {
        setImageSrc(reader.result as string);
      });
      reader.readAsDataURL(pendingFile._fileObj);
    }
  }, []);

  const { name, ext } = useParseFilename(pendingFile.filename);
  const progress = (fileInfo.loaded / pendingFile.size) * 100;

  const theme = useTheme();
  const statusColor = useMemo(() => {
    switch (fileInfo.status) {
      case 'completed':
        return theme.palette.success.light;
      case 'error':
        return theme.palette.error.main;
      case 'in_progress':
        return theme.palette.primary.main;
    }
  }, [fileInfo.status]);

  return (
    <Paper
      elevation={0}
      css={uploadingFileComponent(progress, fileInfo.status, statusColor)}
    >
      <Box width={1} display="flex">
        <Box css={filePreviewWrapper}>
          {isImage && imageSrc ? (
            <img
              css={filePreviewImage}
              src={imageSrc}
              alt={pendingFile.filename}
            />
          ) : (
            <InsertDriveFileOutlinedIcon color="disabled" />
          )}
        </Box>
        <Box display="flex" flexDirection="column" justifyContent="center">
          <Box display="flex">
            <Typography
              variant="subtitle2"
              noWrap
              width={300}
              display="flex"
              alignItems="center"
            >
              <Box
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
                title={pendingFile.filename}
              >
                {name}
              </Box>
              {ext ? <Box title={pendingFile.filename}>.{ext}</Box> : null}
            </Typography>
          </Box>
          <Typography variant="caption">
            {filesize(pendingFile.size) as string}
          </Typography>
        </Box>
        <IconButton css={cancelButton} onClick={onCancel}>
          <Cancel />
        </IconButton>
      </Box>
    </Paper>
  );
}

export default UploadingFileComponent;
