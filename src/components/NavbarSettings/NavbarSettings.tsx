import React from 'react';
import { NavbarEmpty } from '@components';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '@constants/app-routes';

function NavbarSettings() {
  const navigate = useNavigate();

  return (
    <NavbarEmpty>
      <IconButton onClick={() => navigate(AppRoutes.Root)}>
        <ArrowBackIcon />
      </IconButton>
      <Typography variant="h6" ml={2}>
        Back to storage
      </Typography>
    </NavbarEmpty>
  );
}

export default NavbarSettings;
