/** @jsxImportSource @emotion/react */
import React from 'react';
import { Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { filesDataSelector } from '@store/slices/files.slice';
import { FilesListItem } from '@components';
import { fileList } from './styles';

function FilesList() {
  const files = useSelector(filesDataSelector);
  const filesArr = Object.values(files);

  return (
    <Grid container css={fileList} flexShrink="inherit" gap={3}>
      {filesArr.map((file) => (
        <Grid item key={file.id}>
          <FilesListItem file={file} />
        </Grid>
      ))}
    </Grid>
  );
}

export default FilesList;
