import React, { useMemo } from 'react';
import { Outlet, useMatch } from 'react-router-dom';
import { Box } from '@mui/material';
import { AppRoutes } from '@constants/app-routes';
import { NavbarStorage, NavbarSettings } from '@components';

function NavbarLayout() {
  const matchRoot = useMatch(AppRoutes.Root);
  const matchSettings = useMatch(AppRoutes.AccountSettings);

  const navbar = useMemo(() => {
    if (matchRoot) return <NavbarStorage />;
    if (matchSettings) return <NavbarSettings />;
  }, []);

  return (
    <>
      {navbar}
      <Box px={4} height={1} width={1} overflow="auto">
        <Outlet />
      </Box>
    </>
  );
}

export default NavbarLayout;
