/** @jsxImportSource @emotion/react */
import React from 'react';
import { Pagination as MuiPagination } from '@mui/material';
import { pagination } from './styles';

function Pagination() {
  return (
    <MuiPagination
      count={10}
      shape="rounded"
      size="large"
      color="primary"
      css={pagination}
    />
  );
}

export default Pagination;
