/** @jsxImportSource @emotion/react */
import React from 'react';
import {
  Box,
  Dialog,
  Divider,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import {
  fullscreenFileSelector,
  setFullscreenFile,
} from '@store/slices/files.slice';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@store';
import { fileInfoWrapper, image, preview } from './styles';
import dayjs from 'dayjs';
import { filesize } from 'filesize';
import { DATE_FORMAT } from '@constants/common';
import { Close } from '@mui/icons-material';

function FullScreenPreview() {
  const dispatch = useAppDispatch();
  const fullscreenFile = useSelector(fullscreenFileSelector);

  const handleClose = () => {
    dispatch(setFullscreenFile(null));
  };

  const { file, url } = fullscreenFile || {};

  return (
    <Dialog open={!!fullscreenFile} onClose={handleClose} css={preview}>
      <Box css={image(url as string)}></Box>
      <Box css={fileInfoWrapper}>
        <Box display="flex">
          <IconButton onClick={handleClose} sx={{ marginLeft: 'auto' }}>
            <Close />
          </IconButton>
        </Box>
        <Divider flexItem sx={{ marginBottom: 2 }} />
        <Box overflow="auto" px={2}>
          {file?.description ? (
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
          <Divider flexItem sx={{ marginBottom: 2, marginTop: 2 }} />
          <Grid container spacing={1.5}>
            <Grid item xs={12}>
              <Box display="flex" flexDirection="column">
                <Typography variant="body2" fontWeight="bold">
                  File name:
                </Typography>
                <Typography variant="body2">{file?.filename}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" flexDirection="column">
                <Typography variant="body2" fontWeight="bold">
                  Created:
                </Typography>
                <Typography variant="body2">
                  {dayjs(file?.createdAt).format(DATE_FORMAT)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" flexDirection="column">
                <Typography variant="body2" fontWeight="bold">
                  Last update:
                </Typography>
                <Typography variant="body2">
                  {dayjs(file?.updatedAt).format(DATE_FORMAT)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" flexDirection="column">
                <Typography variant="body2" fontWeight="bold">
                  Size:
                </Typography>
                <Typography variant="body2">
                  {filesize(file?.size || 0) as string}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Dialog>
  );
}

export default FullScreenPreview;
