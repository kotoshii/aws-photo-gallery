import {
  AnyAction,
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
  ThunkDispatch,
} from '@reduxjs/toolkit';
import { RootState } from '@store';
import { FileFilters } from '@interfaces/storage/file-filters.interface';
import { FIFTY_MB } from '@constants/common';
import { Storage } from 'aws-amplify';
import { File as FileModel } from '@models';
import { PendingFile } from '@interfaces/pending-file.interface';
import { nanoid } from 'nanoid';
import {
  FileUploadingInfo,
  UploadingInfo,
  UploadingStatus,
} from '@interfaces/storage/uploading-info.interface';

export interface FilesState {
  showFavorites: boolean;
  showOffline: boolean;
  data: FileModel[];
  filters: FileFilters;
  page: number;
  uploadDialogOpen: boolean;
  uploadingInfo: UploadingInfo;
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
  page: 1,
  uploadDialogOpen: false,
  uploadingInfo: {
    files: {},
    totalSize: 0,
  },
};

async function uploadFileToS3(
  file: PendingFile,
  dispatch: ThunkDispatch<any, any, AnyAction>,
) {
  try {
    const ext = file._fileObj.name.split('.').pop();
    const filename = `${nanoid()}-${file.filename || nanoid()}${
      ext && file.filename.endsWith(ext) ? '' : `.${ext}`
    }`;
    dispatch(
      filesSlice.actions.setUploadingStatus({
        fileId: file._id,
        status: 'in_progress',
      }),
    );
    await Storage.put(filename, file._fileObj, {
      progressCallback: ({ loaded }) => {
        dispatch(
          filesSlice.actions.setUploadingProgress({ fileId: file._id, loaded }),
        );
      },
    });
    dispatch(
      filesSlice.actions.setUploadingStatus({
        fileId: file._id,
        status: 'completed',
      }),
    );
  } catch (e) {
    console.log(e);
    dispatch(
      filesSlice.actions.setUploadingStatus({
        fileId: file._id,
        status: 'error',
      }),
    );
  }
}

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
export const pageSelector = createSelector(
  filesStateSelector,
  (state) => state.page,
);
export const uploadDialogOpenSelector = createSelector(
  filesStateSelector,
  (state) => state.uploadDialogOpen,
);
export const uploadingInfoSelector = createSelector(
  filesStateSelector,
  (state) => state.uploadingInfo,
);
export const isUploadingSelector = createSelector(filesStateSelector, (state) =>
  Object.values(state.uploadingInfo.files).some(
    ({ status }) => status === 'waiting' || status === 'in_progress',
  ),
);

export const updateUserAvatar = createAsyncThunk(
  'files/updateUserAvatar',
  async (file: File) => {
    const { key } = await Storage.put('avatar.jpg', file);
    return await Storage.get(key);
  },
);

export const uploadFiles = createAsyncThunk(
  'files/uploadFiles',
  async (files: PendingFile[], { dispatch }) => {
    const totalSize = files.reduce((total, { size }) => total + size, 0);
    const filesInfo = files.reduce<Record<string, FileUploadingInfo>>(
      (acc, { _id, filename, size }) => ({
        ...acc,
        [_id]: {
          status: 'waiting',
          filename,
          size,
          loaded: 0,
        } as FileUploadingInfo,
      }),
      {},
    );

    const uploadingInfo: UploadingInfo = {
      files: filesInfo,
      totalSize,
    };

    dispatch(filesSlice.actions.setUploadingInfo(uploadingInfo));

    for (const file of files) {
      // void uploadFileToS3(file, dispatch);
    }
  },
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
    setPage(state, { payload }: PayloadAction<number>) {
      state.page = payload;
    },
    setUploadDialogOpen(state, { payload }: PayloadAction<boolean>) {
      state.uploadDialogOpen = payload;
    },
    setUploadingInfo(state, { payload }: PayloadAction<UploadingInfo>) {
      state.uploadingInfo.files = {
        ...state.uploadingInfo.files,
        ...payload.files,
      };
      state.uploadingInfo.totalSize =
        state.uploadingInfo.totalSize + payload.totalSize;
    },
    setUploadingProgress(
      state,
      {
        payload: { fileId, loaded },
      }: PayloadAction<{ fileId: string; loaded: number }>,
    ) {
      state.uploadingInfo.files[fileId].loaded = loaded;
    },
    setUploadingStatus(
      state,
      {
        payload: { fileId, status },
      }: PayloadAction<{ fileId: string; status: UploadingStatus }>,
    ) {
      state.uploadingInfo.files[fileId].status = status;
    },
  },
});

export const {
  setFilesFilters,
  toggleShowFavorites,
  toggleShowOffline,
  setPage,
  setUploadDialogOpen,
} = filesSlice.actions;
export default filesSlice.reducer;
