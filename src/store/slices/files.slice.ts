import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@store';
import { FileObj } from '@interfaces/file.interface';
import { FileFilters } from '@interfaces/storage/file-filters.interface';
import { FIFTY_MB } from '@constants/file-sizes';

export interface FilesState {
  showFavorites: boolean;
  showOffline: boolean;
  data: FileObj[];
  filters: FileFilters;
}

const initialState: FilesState = {
  showFavorites: false,
  showOffline: false,
  filters: {
    dateFrom: null,
    dateTo: null,
    sizeFrom: 0,
    sizeTo: FIFTY_MB,
  },
  data: [],
};

export const filesStateSelector = (state: RootState) => state.files;
export const filtersSelector = createSelector(
  filesStateSelector,
  (state) => state.filters,
);
export const showFavoritesSelector = createSelector(
  filesStateSelector,
  (state) => state.showFavorites,
);
export const showOfflineSelector = createSelector(
  filesStateSelector,
  (state) => state.showOffline,
);

const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    setFilesFilters(state, { payload }: PayloadAction<Partial<FileFilters>>) {
      state.filters = { ...state.filters, ...payload };
    },
    toggleShowFavorites(state) {
      state.showFavorites = !state.showFavorites;
    },
    toggleShowOffline(state) {
      state.showOffline = !state.showOffline;
    },
  },
});

export const { setFilesFilters, toggleShowFavorites, toggleShowOffline } =
  filesSlice.actions;
export default filesSlice.reducer;
