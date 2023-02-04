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
import { FIFTY_MB, PAGE_LIMIT } from '@constants/common';
import { DataStore, Storage } from 'aws-amplify';
import { File as FileModel } from '@models';
import { PendingFile } from '@interfaces/pending-file.interface';
import { nanoid } from 'nanoid';
import {
  ActiveUploadsMap,
  FileUploadingInfo,
  UploadingInfo,
  UploadingStatus,
} from '@interfaces/storage/uploading-info.interface';

export interface FilesState {
  showFavorites: boolean;
  showOffline: boolean;
  data: Record<string, FileModel>;
  filters: FileFilters;
  page: number;
  uploadDialogOpen: boolean;
  uploadOverlayOpen: boolean;
  uploadingInfo: UploadingInfo;
  loading: boolean;
  _resetSearchBarHook: number;
}

const initialState: FilesState = {
  showFavorites: false,
  showOffline: false,
  filters: {
    dateFrom: null,
    dateTo: null,
    sizeFrom: 0,
    sizeTo: FIFTY_MB,
    search: '',
  },
  data: {},
  page: 1,
  uploadDialogOpen: false,
  uploadOverlayOpen: false,
  uploadingInfo: {
    files: {},
    totalSize: 0,
  },
  loading: false,
  _resetSearchBarHook: 0,
};

function uploadFileToS3(
  file: PendingFile,
  dispatch: ThunkDispatch<any, any, AnyAction>,
  onCompleteOrError: (fileId: string) => void,
) {
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
  return Storage.put(filename, file._fileObj, {
    resumable: true,
    progressCallback: ({ loaded }) => {
      dispatch(
        filesSlice.actions.setUploadingProgress({ fileId: file._id, loaded }),
      );
    },
    completeCallback: async ({ key }) => {
      try {
        await DataStore.save<FileModel>(
          new FileModel({
            filename: file.filename,
            s3key: key as string,
            description: file.description,
            isFavorite: false,
            size: file._fileObj.size,
          }),
        );
        dispatch(
          filesSlice.actions.setUploadingStatus({
            fileId: file._id,
            status: 'completed',
          }),
        );
        onCompleteOrError(file._id);
      } catch (e) {
        dispatch(
          filesSlice.actions.setUploadingStatus({
            fileId: file._id,
            status: 'error',
          }),
        );
        await Storage.remove(key as string);
        onCompleteOrError(file._id);
      }
    },
    errorCallback: () => {
      dispatch(
        filesSlice.actions.setUploadingStatus({
          fileId: file._id,
          status: 'error',
        }),
      );
      onCompleteOrError(file._id);
    },
  });
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
export const uploadingOverlayOpenSelector = createSelector(
  filesStateSelector,
  (state) => state.uploadOverlayOpen,
);
export const resetSearchBarHookSelector = createSelector(
  filesStateSelector,
  (state) => state._resetSearchBarHook,
);
export const filesDataSelector = createSelector(
  filesStateSelector,
  (state) => state.data,
);

export const updateUserAvatar = createAsyncThunk(
  'files/updateUserAvatar',
  async (file: File) => {
    const { key } = await Storage.put('avatar.jpg', file);
    return await Storage.get(key);
  },
);

export const uploadFiles = createAsyncThunk<
  ActiveUploadsMap,
  { files: PendingFile[]; onCompleteOrError: (fileId: string) => void }
>('files/uploadFiles', async ({ files, onCompleteOrError }, { dispatch }) => {
  const totalSize = files.reduce((total, { size }) => total + size, 0);
  const filesInfo = files.reduce<Record<string, FileUploadingInfo>>(
    (acc, { _id, size }) => ({
      ...acc,
      [_id]: {
        _id,
        size,
        status: 'waiting',
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
  dispatch(filesSlice.actions.setUploadingOverlayOpen(true));

  return files.reduce(
    (acc, file) => ({
      ...acc,
      [file._id]: uploadFileToS3(file, dispatch, onCompleteOrError),
    }),
    {},
  );
});

export const fetchFiles = createAsyncThunk<Record<string, FileModel>>(
  'files/fetchFiles',
  async (_, { getState }) => {
    const {
      files: {
        filters: { dateFrom, dateTo, sizeFrom, sizeTo, search },
        page,
        showFavorites,
      },
    } = getState() as RootState;

    const files = await DataStore.query(
      FileModel,
      (c) =>
        c.and((c) => [
          c.filename.contains(search),
          c.or((c) => [
            c.and((c) => [c.createdAt.ge(dateFrom), c.createdAt.le(dateTo)]),
            c.and((c) => [c.size.ge(sizeFrom), c.size.le(sizeTo)]),
          ]),
          c.or((c) => [c.isFavorite.eq(true), c.isFavorite.eq(showFavorites)]),
        ]),
      {
        page: page - 1,
        limit: PAGE_LIMIT,
      },
    );

    return files.reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {});
  },
);

export const getUrlByKey = createAsyncThunk(
  'files/getUrlByKey',
  async (key: string) => {
    return await Storage.get(key);
  },
);

export const toggleIsFavorite = createAsyncThunk<
  void,
  { id: string; isFavorite: boolean }
>('files/addToFavorites', async ({ id, isFavorite }) => {
  const original = await DataStore.query(FileModel, id);
  if (original) {
    await DataStore.save(
      FileModel.copyOf(original, (updated) => {
        updated.isFavorite = isFavorite;
      }),
    );
  }
});

const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    setFilesFilters(state, { payload }: PayloadAction<Partial<FileFilters>>) {
      state.filters = { ...state.filters, ...payload };
    },
    resetFilesFilters(state) {
      state.filters = initialState.filters;
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
    setUploadingOverlayOpen(state, { payload }: PayloadAction<boolean>) {
      state.uploadOverlayOpen = payload;
    },
    deleteFileById(state, { payload }: PayloadAction<string>) {
      const newFiles = { ...state.uploadingInfo.files };
      state.uploadingInfo.totalSize =
        state.uploadingInfo.totalSize - newFiles[payload].size;
      delete newFiles[payload];
      state.uploadingInfo.files = newFiles;
    },
    setFileData(state, { payload }: PayloadAction<FileModel>) {
      state.data[payload.id] = payload;
    },
    resetSearchBar(state) {
      state._resetSearchBarHook = state._resetSearchBarHook + 1;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFiles.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchFiles.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.data = payload;
    });
    builder.addCase(fetchFiles.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const {
  setFilesFilters,
  toggleShowFavorites,
  toggleShowOffline,
  setPage,
  setUploadDialogOpen,
  setUploadingOverlayOpen,
  deleteFileById,
  setFileData,
  resetFilesFilters,
  resetSearchBar,
} = filesSlice.actions;
export default filesSlice.reducer;
