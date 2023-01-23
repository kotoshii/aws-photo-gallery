/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import {
  ActionIconButton,
  NavbarEmpty,
  Pagination,
  ExpandableAvatarProfile,
  FiltersDropdown,
} from '@components';
import { Button, TextField } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { filterButton, uploadButton } from './styles';
import { useAppDispatch } from '@store';
import {
  setUploadDialogOpen,
  showFavoritesSelector,
  showOfflineSelector,
  toggleShowFavorites,
  toggleShowOffline,
} from '@store/slices/files.slice';
import { useSelector } from 'react-redux';

function NavbarStorage() {
  const dispatch = useAppDispatch();
  const [filtersDropdownAnchor, setFiltersDropdownAnchor] =
    useState<HTMLElement | null>(null);

  const showFavorites = useSelector(showFavoritesSelector);
  const showOffline = useSelector(showOfflineSelector);

  const handleFiltersClick = (event: React.MouseEvent<HTMLElement>) => {
    setFiltersDropdownAnchor(event.currentTarget);
  };

  const handleFavoritesClick = () => {
    dispatch(toggleShowFavorites());
  };

  const handleOfflineClick = () => {
    dispatch(toggleShowOffline());
  };

  const handleFiltersDropdownClose = () => {
    setFiltersDropdownAnchor(null);
  };

  const handleUploadDialogButtonClick = () => {
    dispatch(setUploadDialogOpen(true));
  };

  return (
    <NavbarEmpty>
      <TextField placeholder="Search..." sx={{ width: 400 }} />
      <ActionIconButton
        icon={<FilterAltIcon />}
        onClick={handleFiltersClick}
        css={filterButton}
        active={!!filtersDropdownAnchor}
      />
      <ActionIconButton
        icon={<FavoriteIcon />}
        onClick={handleFavoritesClick}
        css={filterButton}
        active={showFavorites}
      />
      <ActionIconButton
        icon={<CloudDownloadIcon />}
        onClick={handleOfflineClick}
        css={filterButton}
        active={showOffline}
      />
      <Pagination />
      <Button
        color="inherit"
        startIcon={<CloudUploadIcon />}
        variant="contained"
        css={uploadButton}
        onClick={handleUploadDialogButtonClick}
      >
        upload new file
      </Button>
      <ExpandableAvatarProfile />
      <FiltersDropdown
        anchorEl={filtersDropdownAnchor}
        onClose={handleFiltersDropdownClose}
      />
    </NavbarEmpty>
  );
}

export default NavbarStorage;
