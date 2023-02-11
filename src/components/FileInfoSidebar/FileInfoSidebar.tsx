/** @jsxImportSource @emotion/react */
import React from 'react';
import { Box, Divider, Grid, Paper, Typography } from '@mui/material';
import {
  backdrop,
  eyeIcon,
  fileIcon,
  filePreview,
  filePreviewImage,
  sidebar,
} from './styles';
import { useSelector } from 'react-redux';
import {
  setFullscreenFile,
  selectedFileSelector,
} from '@store/slices/files.slice';
import {
  InsertDriveFileOutlined,
  VisibilityOutlined,
} from '@mui/icons-material';
import { useIsImage } from '@hooks/use-is-image';
import dayjs from 'dayjs';
import { filesize } from 'filesize';
import { useAppDispatch } from '@store';
import { DATE_FORMAT } from '@constants/common';

interface FilePreviewProps {
  src?: string;
  isImage?: boolean;
  onFullscreenOpen?: () => void;
}

function FilePreview({ src, isImage, onFullscreenOpen }: FilePreviewProps) {
  const handleBackdropClick = () => {
    if (onFullscreenOpen) {
      onFullscreenOpen();
    }
  };

  return (
    <Box css={[filePreview, filePreviewImage(src)]}>
      {!src || !isImage ? (
        <InsertDriveFileOutlined
          color="disabled"
          fontSize="large"
          css={fileIcon}
        />
      ) : (
        <Box css={backdrop} onClick={handleBackdropClick}>
          <VisibilityOutlined css={eyeIcon} />
        </Box>
      )}
    </Box>
  );
}

function SidebarContentPlaceholder() {
  return (
    <Paper css={sidebar} elevation={0}>
      <FilePreview />
      <Typography variant="body1" color="text.secondary" fontStyle="italic">
        Select any file to see the information...
      </Typography>
    </Paper>
  );
}

function FileInfoSidebar() {
  const dispatch = useAppDispatch();

  const selectedFile = useSelector(selectedFileSelector);
  const { isImage } = useIsImage(selectedFile?.file?.s3key as string);

  if (!selectedFile) {
    return <SidebarContentPlaceholder />;
  }

  const { file, url } = selectedFile;

  const handleFullscreenOpen = () => {
    dispatch(setFullscreenFile(selectedFile));
  };

  return (
    <Paper css={sidebar} elevation={0}>
      <FilePreview
        src={url}
        isImage={isImage}
        onFullscreenOpen={handleFullscreenOpen}
      />
      <Box overflow="auto">
        <Box mb={2}>
          {file.description ? (
            <Typography variant="body2">{file.description}</Typography>
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              fontStyle="italic"
            >
              No description
            </Typography>
          )}
        </Box>
        <Divider flexItem sx={{ marginBottom: 2 }} />
        <Grid container spacing={1.5}>
          <Grid item xs={12}>
            <Box display="flex" flexDirection="column">
              <Typography variant="body2" fontWeight="bold">
                File name:
              </Typography>
              <Typography variant="body2">{file.filename}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" flexDirection="column">
              <Typography variant="body2" fontWeight="bold">
                Created:
              </Typography>
              <Typography variant="body2">
                {dayjs(file.createdAt).format(DATE_FORMAT)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" flexDirection="column">
              <Typography variant="body2" fontWeight="bold">
                Last update:
              </Typography>
              <Typography variant="body2">
                {dayjs(file.updatedAt).format(DATE_FORMAT)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" flexDirection="column">
              <Typography variant="body2" fontWeight="bold">
                Size:
              </Typography>
              <Typography variant="body2">
                {filesize(file.size) as string}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}

export default FileInfoSidebar;
