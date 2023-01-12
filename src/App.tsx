import { Route, Routes } from 'react-router-dom';
import { AppRoutes } from '@constants/app-routes';
import { AccountSettings, Authentication, Homepage } from '@pages';
import CssBaseline from '@mui/material/CssBaseline';

function App() {
  return (
    <>
      <CssBaseline />
      <div className="App">
        <Routes>
          <Route path={AppRoutes.Root} element={<Homepage />} />
          <Route path={AppRoutes.Auth} element={<Authentication />} />
          <Route
            path={AppRoutes.AccountSettings}
            element={<AccountSettings />}
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
