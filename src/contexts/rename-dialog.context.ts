import React, { createContext } from 'react';

interface RenameDialogContextValue {
  setRenameFileId: React.Dispatch<React.SetStateAction<string | null>>;
  setDeleteFileInfo: React.Dispatch<
    React.SetStateAction<{
      id: string;
      s3key: string;
    }>
  >;
}

export const RenameDialogContext = createContext(
  {} as RenameDialogContextValue,
);
