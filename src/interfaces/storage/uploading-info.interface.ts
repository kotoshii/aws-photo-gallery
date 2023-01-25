export type UploadingStatus = 'waiting' | 'in_progress' | 'completed' | 'error';

export interface FileUploadingInfo {
  status: UploadingStatus;
  size: number;
  filename: string;
  loaded: number;
}

export interface UploadingInfo {
  files: Record<string, FileUploadingInfo>;
  totalSize: number;
}
