/** @jsxImportSource @emotion/react */
import React from 'react';
import {
  ActionIconButton,
  NavbarEmpty,
  Pagination,
  ExpandableAvatarProfile,
} from '@components';
import { Button, TextField } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { filterButton, uploadButton } from './styles';

function NavbarStorage() {
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
      <ExpandableAvatarProfile />
    </NavbarEmpty>
  );
}

export default NavbarStorage;
