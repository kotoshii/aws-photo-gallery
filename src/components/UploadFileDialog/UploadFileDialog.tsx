/** @jsxImportSource @emotion/react */
import React, { useContext, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { useAppDispatch } from '@store';
import {
  setUploadDialogOpen,
  uploadDialogOpenSelector,
  uploadFiles,
} from '@store/slices/files.slice';
import { useSelector } from 'react-redux';
import { dialogActions, dialogContent } from './styles';
import {
  ConfirmationModal,
  DragDropArea,
  PendingFileComponent,
} from '@components';
import { PendingFile } from '@interfaces/pending-file.interface';
import { nanoid } from 'nanoid';
import { PendingFilesContext } from '@contexts/pending-files.context';

function UploadFileDialog() {
  const dispatch = useAppDispatch();
  const open = useSelector(uploadDialogOpenSelector);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const { pendingFiles, setPendingFiles } = useContext(PendingFilesContext);

  const filesArr = Object.values(pendingFiles);

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

  const handleClose = (e: Event, reason?: string) => {
    if (reason === 'backdropClick') {
      return;
    }

    dispatch(setUploadDialogOpen(false));
  };

  const handleCancelClick = () => {
    if (filesArr.length) {
      setConfirmOpen(true);
    } else {
      dispatch(setUploadDialogOpen(false));
    }
  };

  const handleCancelUploadConfirm = () => {
    dispatch(setUploadDialogOpen(false));
    setPendingFiles({});
  };

  const handleRemoveFile = (fileId: string) => () => {
    setPendingFiles((prevFiles) => {
      const newFiles = { ...prevFiles };
      delete newFiles[fileId];
      return newFiles;
    });
  };

  const handleSaveFilename = (fileId: string) => (newFilename: string) => {
    setPendingFiles((prevFiles) => {
      const newFiles = { ...prevFiles };
      newFiles[fileId].filename = newFilename;
      return newFiles;
    });
  };

  const handleEditDescription = (fileId: string) => (description: string) => {
    setPendingFiles((prevFiles) => {
      const newFiles = { ...prevFiles };
      newFiles[fileId].description = description || null;
      return newFiles;
    });
  };

  const handleUploadClick = () => {
    dispatch(uploadFiles(filesArr));
    dispatch(setUploadDialogOpen(false));
  };

  return (
    <>
      <ConfirmationModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleCancelUploadConfirm}
        color="error"
      >
        <Typography variant="body1">
          Are you sure you want to cancel this uploading?
        </Typography>
      </ConfirmationModal>
      <Dialog
        onClose={handleClose}
        open={open}
        maxWidth="md"
        disableEscapeKeyDown
      >
        <DialogTitle>Upload file</DialogTitle>
        <DialogContent css={dialogContent}>
          <DragDropArea
            onDrop={handleDropFiles}
            decreaseHeight={filesArr.length >= 5}
          />
          {filesArr.map((file) => (
            <PendingFileComponent
              file={file}
              key={file._id}
              onRemove={handleRemoveFile(file._id)}
              onSaveFilename={handleSaveFilename(file._id)}
              onDescriptionChange={handleEditDescription(file._id)}
            />
          ))}
        </DialogContent>
        <DialogActions css={dialogActions}>
          <Button variant="text" onClick={handleCancelClick}>
            cancel
          </Button>
          <Button
            variant="contained"
            disableElevation
            onClick={handleUploadClick}
          >
            upload
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default UploadFileDialog;
