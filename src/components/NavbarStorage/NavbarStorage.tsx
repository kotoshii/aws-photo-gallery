/** @jsxImportSource @emotion/react */
import React from 'react';
import { ActionIconButton, NavbarEmpty } from '@components';
import { TextField } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { filterButton } from './styles';

function NavbarStorage() {
  return (
    <NavbarEmpty>
      <TextField placeholder="Search..." />
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
    </NavbarEmpty>
  );
}

export default NavbarStorage;
