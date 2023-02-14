/** @jsxImportSource @emotion/react */
import React from 'react';
import { Paper } from '@mui/material';
import { navbarEmpty, withAlert } from './styles';
import { useSelector } from 'react-redux';
import {
  isOfflineSelector,
  offlineModeSelector,
} from '@store/slices/common.slice';
import { OfflineAlert } from '@components';

interface NavbarEmptyProps {
  children?: React.ReactNode;
}

function NavbarEmpty({ children }: NavbarEmptyProps) {
  const isOffline = useSelector(isOfflineSelector);
  const offlineMode = useSelector(offlineModeSelector);

  return (
    <>
      <Paper
        css={[navbarEmpty, isOffline && !offlineMode ? withAlert : null]}
        elevation={0}
      >
        {children}
      </Paper>
      <OfflineAlert />
    </>
  );
}

export default NavbarEmpty;
