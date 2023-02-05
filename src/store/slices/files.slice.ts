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
import {
  FileWithOptionalUrl,
  FileWithUrl,
} from '@interfaces/storage/file-with-url.interface';

export interface FilesState {
  showFavorites: boolean;
  showOffline: boolean;
  data: Record<string, FileModel>;
  filters: FileFilters;
  uploadDialogOpen: boolean;
  uploadOverlayOpen: boolean;
  uploadingInfo: UploadingInfo;
  loading: boolean;
  _resetSearchBarHook: number;
  selectedFile: FileWithUrl | null;
  fullscreenFile: FileWithOptionalUrl | null;
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
  uploadDialogOpen: false,
  uploadOverlayOpen: false,
  uploadingInfo: {
    files: {},
    totalSize: 0,
  },
  loading: false,
  _resetSearchBarHook: 0,
  selectedFile: null,
  fullscreenFile: null,
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
export const uploadDialogOpenSelector = createSelector(
  filesStateSelector,
  (state) => state.uploadDialogOpen,
);
export const uploadingInfoSelector = createSelector(
  filesStateSelector,
  (state) => state.uploadingInfo,
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
export const fileDataSelector = createSelector(
  [filesDataSelector, (state, fileId: string) => fileId],
  (data, fileId) => data[fileId],
);
export const selectedFileSelector = createSelector(
  filesStateSelector,
  (state) => state.selectedFile,
);
export const fullscreenFileSelector = createSelector(
  filesStateSelector,
  (state) => state.fullscreenFile,
);

export const updateUserAvatar = createAsyncThunk(
  'files/updateUserAvatar',
  async (file: File) => {
    const { key } = await Storage.put('avatar/avatar.jpg', file);
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
        showFavorites,
      },
    } = getState() as RootState;

    const files = await DataStore.query(FileModel, (c) =>
      c.and((c) => [
        c.filename.contains(search),
        c.or((c) => [
          c.and((c) => [c.createdAt.ge(dateFrom), c.createdAt.le(dateTo)]),
          c.and((c) => [c.size.ge(sizeFrom), c.size.le(sizeTo)]),
        ]),
        c.or((c) => [c.isFavorite.eq(true), c.isFavorite.eq(showFavorites)]),
      ]),
    );

    return files.reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {});
  },
);

export const getUrlByKey = createAsyncThunk<
  string,
  { key: string; filename?: string }
>('files/getUrlByKey', async ({ key, filename }) => {
  return await Storage.get(key, {
    contentDisposition: filename
      ? `attachment; filename=${encodeURIComponent(filename)}`
      : undefined,
  });
});

export const toggleIsFavorite = createAsyncThunk<
  void,
  { id: string; isFavorite: boolean }
>('files/toggleIsFavorite', async ({ id, isFavorite }) => {
  const original = await DataStore.query(FileModel, id);
  if (original) {
    await DataStore.save(
      FileModel.copyOf(original, (updated) => {
        updated.isFavorite = isFavorite;
      }),
    );
  }
});

export const deleteFile = createAsyncThunk<void, { id: string; s3key: string }>(
  'files/deleteFile',
  async ({ id, s3key }) => {
    await Storage.remove(s3key);
    await DataStore.delete(FileModel, id);
  },
);

export const renameFile = createAsyncThunk<void, { id: string; name: string }>(
  'files/renameFile',
  async ({ id, name }) => {
    const original = await DataStore.query(FileModel, id);
    if (original) {
      await DataStore.save(
        FileModel.copyOf(original, (updated) => {
          updated.filename = name;
        }),
      );
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
    resetFilesFilters(state) {
      state.filters = initialState.filters;
    },
    toggleShowFavorites(state) {
      state.showFavorites = !state.showFavorites;
    },
    toggleShowOffline(state) {
      state.showOffline = !state.showOffline;
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
    deleteUploadingFileById(state, { payload }: PayloadAction<string>) {
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
    deleteFileData(state, { payload }: PayloadAction<string>) {
      const newFileData = { ...state.data };
      delete newFileData[payload];
      state.data = newFileData;
    },
    selectFile(state, { payload }: PayloadAction<FileWithUrl | null>) {
      state.selectedFile = payload;
    },
    setFullscreenFile(
      state,
      { payload }: PayloadAction<FileWithOptionalUrl | null>,
    ) {
      state.fullscreenFile = payload;
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
  setUploadDialogOpen,
  setUploadingOverlayOpen,
  deleteUploadingFileById,
  setFileData,
  resetFilesFilters,
  resetSearchBar,
  deleteFileData,
  selectFile,
  setFullscreenFile,
} = filesSlice.actions;
export default filesSlice.reducer;
