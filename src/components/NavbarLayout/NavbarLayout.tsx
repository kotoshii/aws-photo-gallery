/** @jsxImportSource @emotion/react */
import React, { useMemo, useState } from 'react';
import { Outlet, useMatch } from 'react-router-dom';
import { Box } from '@mui/material';
import { AppRoutes } from '@constants/app-routes';
import {
  NavbarStorage,
  NavbarSettings,
  UploadFileDialog,
  UploadingOverlay,
} from '@components';
import { navbarLayout } from './styles';
import { PendingFile } from '@interfaces/pending-file.interface';
import { PendingFilesContext } from '@contexts/pending-files.context';

function NavbarLayout() {
  const matchRoot = useMatch(AppRoutes.Root);
  const matchSettings = useMatch(AppRoutes.AccountSettings);

  const [pendingFiles, setPendingFiles] = useState<Record<string, PendingFile>>(
    {},
  );

  const navbar = useMemo(() => {
    if (matchSettings) return <NavbarSettings />;
    if (matchRoot) return <NavbarStorage />;
  }, [matchRoot, matchSettings]);

  return (
    <>
      {navbar}
      <PendingFilesContext.Provider value={{ pendingFiles, setPendingFiles }}>
        <UploadFileDialog />
        <UploadingOverlay />
      </PendingFilesContext.Provider>
      <Box px={4} height={1} width={1} overflow="auto" css={navbarLayout}>
        <Outlet />
      </Box>
    </>
  );
}

export default NavbarLayout;
