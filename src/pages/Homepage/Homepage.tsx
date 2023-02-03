/** @jsxImportSource @emotion/react */
import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { homepage } from './styles';
import { FilesList } from '@components';
import { DataStore, Predicates } from 'aws-amplify';
import { File } from '@models';
import { useAppDispatch } from '@store';
import {
  fetchFiles,
  filtersSelector,
  pageSelector,
  setFileData,
} from '@store/slices/files.slice';
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';

function Homepage() {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const page = useSelector(pageSelector);
  const { dateFrom, dateTo, sizeFrom, sizeTo, search } =
    useSelector(filtersSelector);

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
  }, [page, dateFrom, dateTo, sizeFrom, sizeTo, search]);

  useEffect(() => {
    const subscription = DataStore.observe(File, Predicates.ALL).subscribe(
      (msg) => {
        if (msg.opType === 'UPDATE') {
          dispatch(setFileData(msg.element));
        }
      },
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Box css={homepage}>
      <FilesList />
    </Box>
  );
}

export default Homepage;
