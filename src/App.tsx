import { Route, Routes } from 'react-router-dom';
import { AppRoutes } from '@constants/app-routes';
import { AccountSettings, Authentication, Homepage } from '@pages';
import CssBaseline from '@mui/material/CssBaseline';
import { useEffect } from 'react';
import { Hub } from 'aws-amplify';
import { HubCallback } from '@aws-amplify/core/src/Hub';
import { useAppDispatch } from '@store';
import { resetUser } from '@store/slices/auth.slice';
import { ProtectedRoute } from '@components';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const listener: HubCallback = (data) => {
      switch (data.payload.event) {
        case 'signOut' ||
          'signIn_failure' ||
          'tokenRefresh_failure' ||
          'autoSignIn_failure':
          dispatch(resetUser());
          break;
      }
    };

    Hub.listen('auth', listener);
  }, []);

  return (
    <>
      <CssBaseline />
      <div className="App">
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path={AppRoutes.Root} element={<Homepage />} />
            <Route
              path={AppRoutes.AccountSettings}
              element={<AccountSettings />}
            />
          </Route>
          <Route path={AppRoutes.Auth} element={<Authentication />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
