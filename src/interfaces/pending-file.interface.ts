export interface PendingFile {
  _id: string;
  _fileObj: File;
  filename: string;
  size: number;
  description: string | null;
}
