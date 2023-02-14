import { Route, Routes, useNavigate } from 'react-router-dom';
import { AppRoutes } from '@constants/app-routes';
import { AccountSettings, Authentication, Homepage } from '@pages';
import CssBaseline from '@mui/material/CssBaseline';
import { useEffect } from 'react';
import { Hub } from 'aws-amplify';
import { HubCallback } from '@aws-amplify/core/src/Hub';
import { useAppDispatch } from '@store';
import { resetUser } from '@store/slices/auth.slice';
import { NavbarLayout, ProtectedRoute } from '@components';
import { useSelector } from 'react-redux';
import { offlineModeSelector, setIsOffline } from '@store/slices/common.slice';

function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const offlineMode = useSelector(offlineModeSelector);

  useEffect(() => {
    const listener: HubCallback = (data) => {
      switch (data.payload.event) {
        case 'signOut' ||
          'signIn_failure' ||
          'tokenRefresh_failure' ||
          'autoSignIn_failure':
          dispatch(resetUser());
          navigate(AppRoutes.Auth);
          break;
      }
    };

    const unsubscribeHubAuthListener = Hub.listen('auth', listener);

    const offlineListener = () => {
      dispatch(setIsOffline(true));
    };

    const onlineListener = () => {
      dispatch(setIsOffline(false));
    };

    window.addEventListener('offline', offlineListener);
    window.addEventListener('online', onlineListener);

    return () => {
      unsubscribeHubAuthListener();

      window.removeEventListener('offline', offlineListener);
      window.removeEventListener('online', onlineListener);
    };
  }, []);

  return (
    <>
      <CssBaseline />
      <div className="App">
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route element={<NavbarLayout />}>
              <Route path={AppRoutes.Root} element={<Homepage />} />
              {!offlineMode && (
                <Route
                  path={AppRoutes.AccountSettings}
                  element={<AccountSettings />}
                />
              )}
            </Route>
          </Route>
          <Route path={AppRoutes.Auth} element={<Authentication />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
