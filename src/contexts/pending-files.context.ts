import React, { createContext } from 'react';
import { PendingFile } from '@interfaces/pending-file.interface';

interface PendingFilesContextValue {
  pendingFiles: Record<string, PendingFile>;
  setPendingFiles: React.Dispatch<
    React.SetStateAction<Record<string, PendingFile>>
  >;
}

export const PendingFilesContext = createContext(
  {} as PendingFilesContextValue,
);
