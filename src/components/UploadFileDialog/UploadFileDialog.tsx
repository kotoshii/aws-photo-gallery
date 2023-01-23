/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { useAppDispatch } from '@store';
import {
  setUploadDialogOpen,
  uploadDialogOpenSelector,
} from '@store/slices/files.slice';
import { useSelector } from 'react-redux';
import { dialogActions, dialogContent } from './styles';
import { DragDropArea } from '@components';
import { PendingFile } from '@interfaces/pending-file.interface';
import { nanoid } from 'nanoid';

function UploadFileDialog() {
  const dispatch = useAppDispatch();
  const open = useSelector(uploadDialogOpenSelector);

  const [pendingFiles, setPendingFiles] = useState<Record<string, PendingFile>>(
    {},
  );

  const handleDropFiles = (acceptedFiles: File[]) => {
    setPendingFiles((prevFiles) =>
      acceptedFiles.reduce<Record<string, PendingFile>>((acc, file) => {
        const _id = nanoid();
        const { name, size } = file;
        return {
          ...acc,
          [_id]: {
            _id,
            filename: name,
            size,
            description: null,
            _fileObj: file,
          },
        };
      }, prevFiles),
    );
  };

  const handleClose = () => {
    dispatch(setUploadDialogOpen(false));
  };

  return (
    <Dialog onClose={handleClose} open={open} maxWidth="md">
      <DialogTitle>Upload file</DialogTitle>
      <DialogContent css={dialogContent}>
        <DragDropArea onDrop={handleDropFiles} />
      </DialogContent>
      <DialogActions css={dialogActions}>
        <Button variant="text">cancel</Button>
        <Button variant="contained" disableElevation>
          upload
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UploadFileDialog;
