import React, { useEffect } from 'react';
import { useAppDispatch } from '@store';
import { fetchUserData } from '@store/slices/auth.slice';
import { Navigate, Outlet } from 'react-router-dom';
import { AppRoutes } from '@constants/app-routes';
import { useSelector } from 'react-redux';
import { globalLoadingSelector } from '@store/slices/common.slice';
import { Box, CircularProgress } from '@mui/material';
import { useIsAuthenticated } from '@hooks/use-is-authenticated';

function ProtectedRoute() {
  const dispatch = useAppDispatch();
  const globalLoading = useSelector(globalLoadingSelector);
  const isAuthenticated = useIsAuthenticated();

  const fetchUser = async () => {
    await dispatch(fetchUserData());
  };

  useEffect(() => {
    void fetchUser();
  }, []);

  if (globalLoading) {
    return (
      <Box
        bgcolor="transparent"
        width={1}
        height={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to={AppRoutes.Auth} />;
}

export default ProtectedRoute;
