/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  IconButton,
  Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useAppDispatch } from '@store';
import {
  getUrlByKey,
  isSaveToOfflineSelector,
  selectedFileSelector,
  selectFile,
  setFullscreenFile,
  toggleIsFavorite,
} from '@store/slices/files.slice';
import {
  card,
  fileIcon,
  fileName,
  imagePreview,
  nonImagePreview,
  offlineIcon,
  selected,
} from './styles';
import {
  InsertDriveFileOutlined,
  BrokenImageOutlined,
  FavoriteOutlined,
  MoreVertOutlined,
  OfflinePin,
} from '@mui/icons-material';
import { File as FileModel } from '@models';
import { FileItemMenu } from '@components';
import { useSelector } from 'react-redux';
import { useIsImage } from '@hooks/use-is-image';
import localforage from 'localforage';

interface FilesListItemProps {
  file: FileModel;
}

function FilesListItem({ file }: FilesListItemProps) {
  const { id, s3key, filename, isFavorite } = file;

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const selectedFile = useSelector(selectedFileSelector);
  const isSavedToOffline = useSelector((state) =>
    isSaveToOfflineSelector(state, id),
  );

  const { enqueueSnackbar } = useSnackbar();
  const { isImage } = useIsImage(s3key);

  const _getDownloadUrl = async () => {
    const blob = await localforage.getItem<Blob>(id);

    if (isSavedToOffline && blob) return URL.createObjectURL(blob);
    else return dispatch(getUrlByKey({ key: s3key, filename })).unwrap();
  };

  const getUrl = async () => {
    setLoading(true);
    try {
      const url = await _getDownloadUrl();
      setUrl(url);
    } catch (e) {
      enqueueSnackbar('Error while loading image preview.', {
        autoHideDuration: 5000,
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();

    try {
      await dispatch(
        toggleIsFavorite({ id, isFavorite: !isFavorite }),
      ).unwrap();
    } catch (e) {
      enqueueSnackbar('Error while performing the action.', {
        autoHideDuration: 5000,
        variant: 'error',
      });
    }
  };

  const handleMenuClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
  };

  const handleItemClick = () => {
    if (selectedFile?.file.id === id) {
      dispatch(selectFile(null));
    } else if (url) {
      dispatch(selectFile({ file, url }));
    }
  };

  const handleOpenFullscreen = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    dispatch(setFullscreenFile({ file, url }));
  };

  useEffect(() => {
    void getUrl();
  }, []);

  return (
    <>
      <Card
        css={[card, id === selectedFile?.file.id ? selected : null]}
        elevation={0}
        onClick={handleItemClick}
      >
        {isSavedToOffline && (
          <OfflinePin
            css={offlineIcon}
            fontSize="large"
            color="action"
            titleAccess="Saved to offline"
          />
        )}
        {isImage ? (
          loading ? (
            <CardContent css={imagePreview}>
              <CircularProgress color="primary" />
            </CardContent>
          ) : url ? (
            <CardMedia src={url} component="img" css={imagePreview} />
          ) : (
            <CardContent css={imagePreview}>
              <BrokenImageOutlined css={fileIcon} color="disabled" />
            </CardContent>
          )
        ) : (
          <CardContent css={[imagePreview, nonImagePreview]}>
            <InsertDriveFileOutlined
              color="disabled"
              fontSize="large"
              css={fileIcon}
            />
            <Typography
              variant="body2"
              css={fileName}
              color="text.secondary"
              mt={1}
            >
              {filename}
            </Typography>
          </CardContent>
        )}
        <CardActions>
          {isImage && (
            <Button variant="text" onClick={handleOpenFullscreen}>
              open
            </Button>
          )}
          <Box ml="auto">
            <IconButton onClick={toggleFavorite}>
              <FavoriteOutlined
                fontSize="medium"
                color={isFavorite ? 'error' : 'action'}
              />
            </IconButton>
            <IconButton onClick={handleMenuClick}>
              <MoreVertOutlined fontSize="medium" color="action" />
            </IconButton>
          </Box>
        </CardActions>
      </Card>
      <FileItemMenu
        onClose={() => setMenuAnchor(null)}
        anchor={menuAnchor}
        file={file}
      />
    </>
  );
}

export default FilesListItem;
