/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import { Outlet, useMatch } from 'react-router-dom';
import { Box } from '@mui/material';
import { AppRoutes } from '@constants/app-routes';
import { NavbarStorage, NavbarSettings, UploadFileDialog } from '@components';
import { navbarLayout } from './styles';

function NavbarLayout() {
  const matchRoot = useMatch(AppRoutes.Root);
  const matchSettings = useMatch(AppRoutes.AccountSettings);

  const navbar = useMemo(() => {
    if (matchSettings) return <NavbarSettings />;
    if (matchRoot) return <NavbarStorage />;
  }, [matchRoot, matchSettings]);

  return (
    <>
      {navbar}
      <UploadFileDialog />
      <Box px={4} height={1} width={1} overflow="auto" css={navbarLayout}>
        <Outlet />
      </Box>
    </>
  );
}

export default NavbarLayout;
