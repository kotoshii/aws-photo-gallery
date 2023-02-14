import React from 'react';
import ReactDOM from 'react-dom/client';
import { Amplify, Storage } from 'aws-amplify';
import AwsConfig from './aws-exports.js';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import App from './App';
import { theme } from './theme';
import { Provider as StoreProvider } from 'react-redux';
import { store } from '@store';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './global.css';
import { SnackbarProvider } from 'notistack';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import localforage from 'localforage';
import { IDB_DATABASE, IDB_STORE } from '@constants/common';

Amplify.configure(AwsConfig);
Storage.configure({ level: 'private' });

localforage.config({
  driver: localforage.INDEXEDDB,
  name: IDB_DATABASE,
  version: 1,
  storeName: IDB_STORE,
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <StoreProvider store={store}>
        <SnackbarProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <App />
          </LocalizationProvider>
        </SnackbarProvider>
      </StoreProvider>
    </ThemeProvider>
  </BrowserRouter>,
);
