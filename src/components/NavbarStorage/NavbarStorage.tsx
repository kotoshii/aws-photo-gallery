/** @jsxImportSource @emotion/react */
import React from 'react';
import { ActionIconButton, NavbarEmpty, Pagination } from '@components';
import { Avatar, Box, Button, TextField } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { avatarWrapper, filterButton, uploadButton } from './styles';
import { userSelector } from '@store/slices/auth.slice';
import { useSelector } from 'react-redux';

function NavbarStorage() {
  const user = useSelector(userSelector);

  const handleAvatarClick = () => {};

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
        <Avatar alt={user?.name}>{user?.name[0]}</Avatar>
      </Box>
    </NavbarEmpty>
  );
}

export default NavbarStorage;
