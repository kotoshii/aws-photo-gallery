/** @jsxImportSource @emotion/react */
import React from 'react';
import { Pagination as MuiPagination } from '@mui/material';
import { pagination } from './styles';
import { useSelector } from 'react-redux';
import { pageSelector, setPage } from '@store/slices/files.slice';
import { useAppDispatch } from '@store';

function Pagination() {
  const dispatch = useAppDispatch();
  const page = useSelector(pageSelector);

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    dispatch(setPage(value));
  };

  return (
    <MuiPagination
      count={10}
      shape="rounded"
      size="large"
      color="primary"
      css={pagination}
      page={page}
      onChange={handleChangePage}
    />
  );
}

export default Pagination;
