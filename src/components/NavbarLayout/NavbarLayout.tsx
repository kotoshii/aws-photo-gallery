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
import {
  deleteUploadingFileById,
  uploadFiles,
} from '@store/slices/files.slice';
import { useAppDispatch } from '@store';
import { ActiveUploadsMap } from '@interfaces/storage/uploading-info.interface';

function NavbarLayout() {
  const dispatch = useAppDispatch();

  const matchRoot = useMatch(AppRoutes.Root);
  const matchSettings = useMatch(AppRoutes.AccountSettings);

  const [pendingFiles, setPendingFiles] = useState<Record<string, PendingFile>>(
    {},
  );
  const [uploads, setUploads] = useState<ActiveUploadsMap>({});

  const navbar = useMemo(() => {
    if (matchSettings) return <NavbarSettings />;
    if (matchRoot) return <NavbarStorage />;
  }, [matchRoot, matchSettings]);

  const removeFinishedUpload = (fileId: string) => {
    setUploads((prevUploads) => {
      const newUploads = { ...prevUploads };
      delete newUploads[fileId];
      return prevUploads;
    });
  };

  const handleCancelUpload = (fileId: string) => {
    removeFinishedUpload(fileId);
    dispatch(deleteUploadingFileById(fileId));
    setPendingFiles((prevFiles) => {
      const newFiles = { ...prevFiles };
      delete newFiles[fileId];
      return newFiles;
    });
  };

  const handleUploadClick = async (filesArr: PendingFile[]) => {
    const uploads = await dispatch(
      uploadFiles({ files: filesArr, onCompleteOrError: removeFinishedUpload }),
    ).unwrap();
    setUploads((prevUploads) => ({
      ...prevUploads,
      ...uploads,
    }));
  };

  return (
    <>
      {navbar}
      <PendingFilesContext.Provider value={{ pendingFiles, setPendingFiles }}>
        <UploadFileDialog onUpload={handleUploadClick} />
        <UploadingOverlay
          uploads={uploads}
          onCancelUpload={handleCancelUpload}
        />
      </PendingFilesContext.Provider>
      <Box px={4} height={1} width={1} css={navbarLayout}>
        <Outlet />
      </Box>
    </>
  );
}

export default NavbarLayout;
