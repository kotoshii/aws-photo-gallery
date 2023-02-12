/** @jsxImportSource @emotion/react */
import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  CircularProgress,
  Dialog,
  Divider,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import {
  filesDataSelector,
  fullscreenFileSelector,
  getUrlByKey,
  setFullscreenFile,
} from '@store/slices/files.slice';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@store';
import { fileInfoWrapper, image, nextPrevButton, preview } from './styles';
import dayjs from 'dayjs';
import { filesize } from 'filesize';
import { DATE_FORMAT } from '@constants/common';
import {
  ArrowBackIosOutlined,
  ArrowForwardIosOutlined,
  Close,
} from '@mui/icons-material';
import { File as FileModel } from '@models';
import mime from 'mime';
import { useSnackbar } from 'notistack';
import localforage from 'localforage';

function FullScreenPreview() {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const fullscreenFile = useSelector(fullscreenFileSelector);
  const files = useSelector(filesDataSelector);
  const { file, url: fileUrl } = fullscreenFile || {};

  const filesIds = useMemo(() => Object.keys(files), [files]);
  const currentIndex = fullscreenFile
    ? filesIds.indexOf(fullscreenFile?.file?.id)
    : -1;

  const isImage = (file: FileModel) => {
    const mimeType = mime.getType(file.s3key);
    return !!mimeType?.includes('image');
  };

  const findNextImageIndex = (currentIndex: number): number => {
    if (currentIndex === filesIds.length - 1) {
      return currentIndex;
    }

    const index = currentIndex + 1;
    const id = filesIds[index];

    if (!isImage(files[id])) {
      return findNextImageIndex(index);
    }

    return index;
  };

  const findPrevImageIndex = (currentIndex: number): number => {
    if (currentIndex === 0) {
      return currentIndex;
    }

    const index = currentIndex - 1;
    const id = filesIds[index];

    if (!isImage(files[id])) {
      return findPrevImageIndex(index);
    }

    return index;
  };

  const prevImageIndex =
    currentIndex !== -1 ? findPrevImageIndex(currentIndex) : -1;
  const nextImageIndex =
    currentIndex !== -1 ? findNextImageIndex(currentIndex) : -1;

  const handleClose = () => {
    dispatch(setFullscreenFile(null));
  };

  const _getDownloadUrl = async () => {
    if (!file) return;
    const blob = await localforage.getItem<Blob>(file.id);

    if (blob) return URL.createObjectURL(blob);
    else
      return dispatch(
        getUrlByKey({ key: file.s3key, filename: file.filename }),
      ).unwrap();
  };

  const getUrl = async () => {
    if (!file) return;

    setLoading(true);
    try {
      const url = await _getDownloadUrl();
      setUrl(url || '');
    } catch (e) {
      enqueueSnackbar('Error while loading image preview.', {
        autoHideDuration: 5000,
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fileUrl) {
      setUrl(fileUrl);
    } else if (fullscreenFile) {
      void getUrl();
    }
  }, [fullscreenFile]);

  const handleNextClick = () => {
    if (
      currentIndex === filesIds.length - 1 ||
      currentIndex === nextImageIndex
    ) {
      return;
    }

    const id = filesIds[nextImageIndex];
    const file = files[id];

    dispatch(setFullscreenFile({ file }));
  };

  const handlePrevClick = () => {
    if (currentIndex === 0 || currentIndex === prevImageIndex) {
      return;
    }

    const id = filesIds[prevImageIndex];
    const file = files[id];

    dispatch(setFullscreenFile({ file }));
  };

  return (
    <Dialog open={!!fullscreenFile} onClose={handleClose} css={preview}>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width={1}
          height={1}
          bgcolor="#212121"
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box css={image(url as string)}>
          <Box css={nextPrevButton} onClick={handlePrevClick}>
            <ArrowBackIosOutlined />
          </Box>
          <Box css={nextPrevButton} onClick={handleNextClick}>
            <ArrowForwardIosOutlined />
          </Box>
        </Box>
      )}
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
