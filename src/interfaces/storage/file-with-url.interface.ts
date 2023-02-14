import { File as FileModel } from '@models';

export interface FileWithUrl {
  file: FileModel;
  url: string;
}

export interface FileWithOptionalUrl {
  file: FileModel;
  url?: string | null;
}
