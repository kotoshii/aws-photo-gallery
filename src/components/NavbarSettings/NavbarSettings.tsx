import React from 'react';
import { ExpandableAvatarProfile, NavbarEmpty } from '@components';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '@constants/app-routes';
import { useSelector } from 'react-redux';
import { offlineModeSelector } from '@store/slices/common.slice';

function NavbarSettings() {
  const navigate = useNavigate();
  const offlineMode = useSelector(offlineModeSelector);

  return (
    <NavbarEmpty>
      <IconButton onClick={() => navigate(AppRoutes.Root)}>
        <ArrowBackIcon />
      </IconButton>
      <Typography variant="h6" ml={2}>
        Back to storage
      </Typography>
      {!offlineMode && <ExpandableAvatarProfile />}
    </NavbarEmpty>
  );
}

export default NavbarSettings;
