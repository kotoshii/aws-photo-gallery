/** @jsxImportSource @emotion/react */
import React from 'react';
import { Box, Divider, Grid, Paper, Typography } from '@mui/material';
import { fileIcon, filePreview, filePreviewImage, sidebar } from './styles';
import { useSelector } from 'react-redux';
import { selectedFileSelector } from '@store/slices/files.slice';
import { InsertDriveFileOutlined } from '@mui/icons-material';
import { useIsImage } from '@hooks/use-is-image';
import dayjs from 'dayjs';
import { filesize } from 'filesize';

interface FilePreviewProps {
  src?: string;
  isImage?: boolean;
}

const DATE_FORMAT = 'YYYY-MM-DD, HH:mm:ss';

function FilePreview({ src, isImage }: FilePreviewProps) {
  return (
    <Box css={[filePreview, filePreviewImage(src)]}>
      {!src || !isImage ? (
        <InsertDriveFileOutlined
          color="disabled"
          fontSize="large"
          css={fileIcon}
        />
      ) : null}
    </Box>
  );
}

function SidebarContentPlaceholder() {
  return (
    <Paper css={sidebar}>
      <FilePreview />
      <Typography variant="body1" color="text.secondary" fontStyle="italic">
        Select any file to see the information...
      </Typography>
    </Paper>
  );
}

function FileInfoSidebar() {
  const selectedFile = useSelector(selectedFileSelector);
  const { isImage } = useIsImage(selectedFile?.file?.s3key as string);

  if (!selectedFile) {
    return <SidebarContentPlaceholder />;
  }

  const { file, url } = selectedFile;

  return (
    <Paper css={sidebar} elevation={0}>
      <FilePreview src={url} isImage={isImage} />
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
