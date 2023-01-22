import { createSelector, createSlice } from '@reduxjs/toolkit';
import { RootState } from '@store';
import { fetchUserData, login } from '@store/slices/auth.slice';

export interface CommonState {
  globalLoading: boolean;
}

const initialState: CommonState = {
  globalLoading: true,
};

export const commonStateSelector = (state: RootState) => state.common;
export const globalLoadingSelector = createSelector(
  commonStateSelector,
  (state) => state.globalLoading,
);

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {},
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

export const {} = commonSlice.actions;
export default commonSlice.reducer;
