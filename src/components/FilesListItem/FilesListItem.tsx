/** @jsxImportSource @emotion/react */
import React, { useEffect, useMemo, useState } from 'react';
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
import { getUrlByKey, toggleIsFavorite } from '@store/slices/files.slice';
import {
  card,
  fileIcon,
  fileName,
  imagePreview,
  nonImagePreview,
} from './styles';
import {
  InsertDriveFileOutlined,
  BrokenImageOutlined,
  FavoriteOutlined,
  MoreVertOutlined,
} from '@mui/icons-material';
import mime from 'mime';
import { File as FileModel } from '@models';
import { FileItemMenu } from '@components';

interface FilesListItemProps {
  file: FileModel;
}

function FilesListItem({ file }: FilesListItemProps) {
  const { id, s3key, filename, isFavorite } = file;

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  const { enqueueSnackbar } = useSnackbar();
  const mimeType = useMemo(() => mime.getType(s3key), []);
  const isImage = mimeType?.includes('image');

  const getUrl = async () => {
    setLoading(true);
    try {
      const url = await dispatch(
        getUrlByKey({ key: s3key, filename }),
      ).unwrap();
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

  const toggleFavorite = async () => {
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
    setMenuAnchor(e.currentTarget);
  };

  useEffect(() => {
    void getUrl();
  }, []);

  return (
    <>
      <Card css={card} elevation={0}>
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
          {isImage && <Button variant="text">open</Button>}
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
