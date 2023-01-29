export type UploadingStatus = 'waiting' | 'in_progress' | 'completed' | 'error';

export interface FileUploadingInfo {
  _id: string;
  status: UploadingStatus;
  loaded: number;
}

export interface UploadingInfo {
  files: Record<string, FileUploadingInfo>;
  totalSize: number;
}
