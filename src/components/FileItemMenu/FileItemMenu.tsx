import React, { useContext } from 'react';
import {
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Popover,
} from '@mui/material';
import {
  Edit,
  Download,
  DownloadForOffline,
  Delete,
} from '@mui/icons-material';
import { File as FileModel } from '@models';
import { RenameDialogContext } from '@contexts/rename-dialog.context';
import {
  getBlobByKey,
  getUrlByKey,
  isSaveToOfflineSelector,
  markFilesAsOffline,
} from '@store/slices/files.slice';
import { useAppDispatch } from '@store';
import { useSnackbar } from 'notistack';
import localforage from 'localforage';
import { useSelector } from 'react-redux';

interface FileItemMenuProps {
  anchor: HTMLElement | null;
  onClose: () => void;
  file: FileModel;
}

function FileItemMenu({ anchor, onClose, file }: FileItemMenuProps) {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { id, s3key, filename } = file;
  const { setRenameFileId, setDeleteFileInfo } =
    useContext(RenameDialogContext);
  const isSavedToOffline = useSelector((state) =>
    isSaveToOfflineSelector(state, id),
  );

  const getDownloadUrl = async () => {
    const blob = await localforage.getItem<Blob>(id);

    if (isSavedToOffline && blob) return URL.createObjectURL(blob);
    else return dispatch(getUrlByKey({ key: s3key, filename })).unwrap();
  };

  const handleDeleteClick = async () => {
    setDeleteFileInfo({ id, s3key });
    onClose();
  };

  const handleDownload = async () => {
    try {
      const url = await getDownloadUrl();
      const a = document.createElement('a');
      a.href = url;
      a.hidden = true;
      a.download = filename;
      a.click();
      a.remove();
      onClose();
    } catch (e) {
      enqueueSnackbar('Error while downloading the file.', {
        autoHideDuration: 5000,
        variant: 'error',
      });
    }
  };

  const handleRenameClick = () => {
    setRenameFileId(id);
    onClose();
  };

  const handleSaveToOffline = async () => {
    try {
      onClose();

      const blob = await dispatch(getBlobByKey({ key: s3key })).unwrap();
      await localforage.setItem(id, blob);
      dispatch(markFilesAsOffline([id]));
      enqueueSnackbar('Successfully saved file to offline', {
        autoHideDuration: 5000,
        variant: 'success',
      });
    } catch (e) {
      enqueueSnackbar('Error while saving the file', {
        autoHideDuration: 5000,
        variant: 'error',
      });
    }
  };

  return (
    <Popover
      anchorEl={anchor}
      open={!!anchor}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      onClose={onClose}
    >
      <MenuList>
        <MenuItem onClick={handleRenameClick}>
          <ListItemIcon>
            <Edit />
          </ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDownload}>
          <ListItemIcon>
            <Download />
          </ListItemIcon>
          <ListItemText>Download</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleSaveToOffline}>
          <ListItemIcon>
            <DownloadForOffline />
          </ListItemIcon>
          <ListItemText>Download for offline</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <ListItemIcon>
            <Delete />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </MenuList>
    </Popover>
  );
}

export default FileItemMenu;
