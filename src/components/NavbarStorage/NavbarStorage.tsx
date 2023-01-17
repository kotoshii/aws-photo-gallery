/** @jsxImportSource @emotion/react */
import React from 'react';
import {
  ActionIconButton,
  NavbarEmpty,
  Pagination,
  ProfileMenu,
} from '@components';
import { Avatar, Box, Button, Popover, TextField } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import {
  avatar,
  avatarWrapper,
  filterButton,
  popover,
  uploadButton,
} from './styles';
import { userSelector } from '@store/slices/auth.slice';
import { useSelector } from 'react-redux';
import { User } from '@interfaces/user.interface';

function NavbarStorage() {
  const [profileMenuAnchor, setProfileMenuAnchor] =
    React.useState<null | HTMLElement>(null);
  const user = useSelector(userSelector) as User;

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  return (
    <NavbarEmpty>
      <TextField placeholder="Search..." sx={{ width: 400 }} />
      <ActionIconButton
        icon={<FilterAltIcon />}
        onClick={() => {}}
        css={filterButton}
      />
      <ActionIconButton
        icon={<FavoriteIcon />}
        onClick={() => {}}
        css={filterButton}
      />
      <ActionIconButton
        icon={<CloudDownloadIcon />}
        onClick={() => {}}
        css={filterButton}
      />
      <Pagination />
      <Button
        color="inherit"
        startIcon={<CloudUploadIcon />}
        variant="contained"
        css={uploadButton}
      >
        upload new file
      </Button>
      <Box onClick={handleAvatarClick} css={avatarWrapper}>
        <Avatar alt={user?.name} css={avatar} />
      </Box>
      <Popover
        css={popover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        anchorEl={profileMenuAnchor}
        open={!!profileMenuAnchor}
        onClose={handleProfileMenuClose}
        elevation={0}
      >
        <ProfileMenu user={user} />
      </Popover>
    </NavbarEmpty>
  );
}

export default NavbarStorage;
