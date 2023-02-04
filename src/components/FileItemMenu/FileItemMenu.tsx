import React from 'react';
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

interface FileItemMenuProps {
  anchor: HTMLElement | null;
  onClose: () => void;
}

function FileItemMenu({ anchor, onClose }: FileItemMenuProps) {
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
        <MenuItem>
          <ListItemIcon>
            <Edit />
          </ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>
        <MenuItem>
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
        <MenuItem>
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
