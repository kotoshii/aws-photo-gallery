import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@store';
import { fetchUserData, login } from '@store/slices/auth.slice';

export interface CommonState {
  globalLoading: boolean;
  offlineMode: boolean;
  isOffline: boolean;
}

const initialState: CommonState = {
  globalLoading: false,
  offlineMode: JSON.parse(localStorage.getItem('offlineMode') || 'false'),
  isOffline: !window.navigator.onLine,
};

export const commonStateSelector = (state: RootState) => state.common;
export const globalLoadingSelector = createSelector(
  commonStateSelector,
  (state) => state.globalLoading,
);
export const offlineModeSelector = createSelector(
  commonStateSelector,
  (state) => state.offlineMode,
);
export const isOfflineSelector = createSelector(
  commonStateSelector,
  (state) => state.isOffline,
);

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setOfflineMode(state, { payload }: PayloadAction<boolean>) {
      state.offlineMode = payload;
    },
    setIsOffline(state, { payload }: PayloadAction<boolean>) {
      state.isOffline = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserData.pending, (state) => {
      state.globalLoading = true;
    });

    builder.addCase(fetchUserData.fulfilled, (state) => {
      state.globalLoading = false;
    });

    builder.addCase(fetchUserData.rejected, (state) => {
      state.globalLoading = false;
    });

    builder.addCase(login.fulfilled, (state) => {
      state.globalLoading = false;
    });
  },
});

export const { setOfflineMode, setIsOffline } = commonSlice.actions;
export default commonSlice.reducer;
