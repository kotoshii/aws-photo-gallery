import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useAppDispatch } from '@store';
import { fileDataSelector, renameFile } from '@store/slices/files.slice';
import { useSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';
import { useSelector } from 'react-redux';

interface RenameDialogProps {
  open: boolean;
  onClose: () => void;
  fileId: string | null;
}

function RenameDialog({ fileId, open, onClose }: RenameDialogProps) {
  const file = useSelector((state) =>
    fileDataSelector(state, fileId as string),
  );
  const { id, filename } = file || {};

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(filename);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (filename) {
      setName(filename);
    }
  }, [filename]);

  const handleRenameClick = async () => {
    setLoading(true);
    try {
      await dispatch(renameFile({ id, name })).unwrap();
      onClose();
    } catch (e) {
      enqueueSnackbar('Could not rename the file.', {
        autoHideDuration: 5000,
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Rename file</DialogTitle>
      <DialogContent>
        <TextField
          label="New file name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={!name}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button variant="text" color="inherit" onClick={onClose}>
          cancel
        </Button>
        <LoadingButton
          loading={loading}
          variant="contained"
          color="primary"
          onClick={handleRenameClick}
          disableElevation
          disabled={!name}
        >
          rename
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default RenameDialog;
