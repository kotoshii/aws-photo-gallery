/** @jsxImportSource @emotion/react */
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActionIconButton,
  NavbarEmpty,
  ExpandableAvatarProfile,
  FiltersDropdown,
} from '@components';
import { Box, Button, debounce, IconButton, TextField } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { actionButton, uploadButton } from './styles';
import { useAppDispatch } from '@store';
import {
  resetSearchBarHookSelector,
  setFilesFilters,
  setUploadDialogOpen,
  showFavoritesSelector,
  showOfflineSelector,
  toggleShowFavorites,
  toggleShowOffline,
} from '@store/slices/files.slice';
import { useSelector } from 'react-redux';
import { Close } from '@mui/icons-material';

function NavbarStorage() {
  const dispatch = useAppDispatch();
  const [filtersDropdownAnchor, setFiltersDropdownAnchor] =
    useState<HTMLElement | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const showFavorites = useSelector(showFavoritesSelector);
  const showOffline = useSelector(showOfflineSelector);
  const resetSearchBarHook = useSelector(resetSearchBarHookSelector);

  const debouncedSearchChange = useMemo(
    () =>
      debounce((search: string) => {
        dispatch(setFilesFilters({ search }));
      }, 500),
    [],
  );

  useEffect(() => {
    if (searchQuery) {
      setSearchQuery('');
    }
  }, [resetSearchBarHook]);

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

  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query);
    debouncedSearchChange(query);
  };

  return (
    <NavbarEmpty>
      <TextField
        placeholder="Search..."
        sx={{ width: 400 }}
        value={searchQuery}
        onChange={(e) => handleSearchQueryChange(e.target.value)}
        InputProps={{
          endAdornment: searchQuery ? (
            <IconButton onClick={() => handleSearchQueryChange('')}>
              <Close />
            </IconButton>
          ) : null,
        }}
      />
      <ActionIconButton
        icon={<FilterAltIcon />}
        onClick={handleFiltersClick}
        css={actionButton}
        active={!!filtersDropdownAnchor}
      />
      <ActionIconButton
        icon={<FavoriteIcon />}
        onClick={handleFavoritesClick}
        css={actionButton}
        active={showFavorites}
      />
      <ActionIconButton
        icon={<CloudDownloadIcon />}
        onClick={handleOfflineClick}
        css={actionButton}
        active={showOffline}
      />
      <Box ml="auto" display="flex" justifyContent="center" alignItems="center">
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
      </Box>
      <FiltersDropdown
        anchorEl={filtersDropdownAnchor}
        onClose={handleFiltersDropdownClose}
      />
    </NavbarEmpty>
  );
}

export default NavbarStorage;
