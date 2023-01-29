import { StoragePutOutput } from '@aws-amplify/storage/src/types';

export type UploadingStatus = 'waiting' | 'in_progress' | 'completed' | 'error';

export interface FileUploadingInfo {
  _id: string;
  size: number;
  status: UploadingStatus;
  loaded: number;
}

export interface UploadingInfo {
  files: Record<string, FileUploadingInfo>;
  totalSize: number;
}

export type ActiveUploadsMap = Record<
  string,
  Promise<StoragePutOutput<Record<string, string>>>
>;
