import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@store';
import { fetchUserData, login } from '@store/slices/auth.slice';

export interface CommonState {
  globalLoading: boolean;
  offlineMode: boolean;
}

const initialState: CommonState = {
  globalLoading: true,
  offlineMode: false,
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

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setOfflineMode(state, { payload }: PayloadAction<boolean>) {
      state.offlineMode = payload;
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

export const { setOfflineMode } = commonSlice.actions;
export default commonSlice.reducer;
