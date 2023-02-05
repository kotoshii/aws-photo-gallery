/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { homepage } from './styles';
import {
  ConfirmationModal,
  FileInfoSidebar,
  FilesList,
  RenameDialog,
  FullScreenPreview,
} from '@components';
import { DataStore, Predicates } from 'aws-amplify';
import { File } from '@models';
import { useAppDispatch } from '@store';
import {
  deleteFile,
  deleteFileData,
  fetchFiles,
  filtersSelector,
  setFileData,
  showFavoritesSelector,
} from '@store/slices/files.slice';
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';
import { RenameDialogContext } from '@contexts/rename-dialog.context';

function Homepage() {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [renameFileId, setRenameFileId] = useState<string | null>(null);
  const [deleteFileInfo, setDeleteFileInfo] = useState<{
    id: string;
    s3key: string;
  }>({ id: '', s3key: '' });

  const { dateFrom, dateTo, sizeFrom, sizeTo, search } =
    useSelector(filtersSelector);
  const showOnlyFavs = useSelector(showFavoritesSelector);

  const fetchFilesData = async () => {
    try {
      await dispatch(fetchFiles()).unwrap();
    } catch (e) {
      const msg = e.message
        ? `Error while loading files: ${e.message}`
        : 'Something went wrong while loading files. Please try again later.';
      enqueueSnackbar(msg, { autoHideDuration: 5000, variant: 'error' });
    }
  };

  useEffect(() => {
    void fetchFilesData();
  }, [dateFrom, dateTo, sizeFrom, sizeTo, search, showOnlyFavs]);

  useEffect(() => {
    const subscription = DataStore.observe(File, Predicates.ALL).subscribe(
      (msg) => {
        if (msg.opType === 'UPDATE') {
          dispatch(setFileData(msg.element));
        }

        if (msg.opType === 'DELETE') {
          dispatch(deleteFileData(msg.element.id));
        }
      },
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleDeleteFile = async () => {
    try {
      const { id, s3key } = deleteFileInfo;
      await dispatch(deleteFile({ id, s3key })).unwrap();
    } catch (e) {
      enqueueSnackbar('Error while deleting the file.', {
        autoHideDuration: 5000,
        variant: 'error',
      });
    }
  };

  return (
    <RenameDialogContext.Provider
      value={{ setRenameFileId, setDeleteFileInfo }}
    >
      <Box css={homepage}>
        <FilesList />
        <FileInfoSidebar />
        <FullScreenPreview />
      </Box>
      <RenameDialog
        open={!!renameFileId}
        onClose={() => setRenameFileId(null)}
        fileId={renameFileId}
      />
      <ConfirmationModal
        open={!!deleteFileInfo.id && !!deleteFileInfo.s3key}
        onClose={() => setDeleteFileInfo({ s3key: '', id: '' })}
        onConfirm={handleDeleteFile}
        color="error"
      >
        <Typography variant="body1">
          Are you sure you want to delete this file?
        </Typography>
      </ConfirmationModal>
    </RenameDialogContext.Provider>
  );
}

export default Homepage;
