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
import { getUrlByKey } from '@store/slices/files.slice';
import { useAppDispatch } from '@store';
import { useSnackbar } from 'notistack';

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

  const handleDeleteClick = async () => {
    setDeleteFileInfo({ id, s3key });
    onClose();
  };

  const handleDownload = async () => {
    try {
      const url = await dispatch(
        getUrlByKey({ key: s3key, filename }),
      ).unwrap();
      const a = document.createElement('a');
      a.href = url;
      a.hidden = true;
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
        <MenuItem>
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
