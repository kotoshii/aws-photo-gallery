/** @jsxImportSource @emotion/react */
import React from 'react';
import { Alert, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import {
  isOfflineSelector,
  offlineModeSelector,
  setOfflineMode,
} from '@store/slices/common.slice';
import { offlineAlert, offlineAlertWithNavbar } from './styles';
import { AppRoutes } from '@constants/app-routes';
import { useAppDispatch } from '@store';
import { useNavigate } from 'react-router-dom';

interface OfflineAlertProps {
  standalone?: boolean;
  className?: string;
  noButton?: boolean;
}

function OfflineAlert({ standalone, className, noButton }: OfflineAlertProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isOffline = useSelector(isOfflineSelector);
  const offlineMode = useSelector(offlineModeSelector);

  const handleEnableOfflineMode = async () => {
    await dispatch(setOfflineMode(true));
    localStorage.setItem('offlineMode', 'true');
    navigate(AppRoutes.Root);
  };

  return isOffline && !offlineMode ? (
    <Alert
      css={[offlineAlert, !standalone ? offlineAlertWithNavbar : null]}
      className={className}
      severity="warning"
      action={
        !noButton ? (
          <Button onClick={handleEnableOfflineMode}>
            switch to offline mode
          </Button>
        ) : null
      }
    >
      Looks like you're having some connection issues. You can continue using
      the app in offline mode.
    </Alert>
  ) : null;
}

export default OfflineAlert;
