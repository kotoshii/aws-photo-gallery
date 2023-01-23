import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  cancelButtonText?: string;
  confirmButtonText?: string;
  color?:
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning';
  onConfirm: () => void;
  onCancel?: () => void;
}

function ConfirmationModal({
  onClose,
  open,
  children,
  cancelButtonText = 'cancel',
  confirmButtonText = 'confirm',
  color = 'primary',
  onCancel,
  onConfirm,
}: ConfirmationModalProps) {
  const handleCancelClick = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  const handleConfirmClick = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>Confirm action</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button variant="text" color="inherit" onClick={handleCancelClick}>
          {cancelButtonText}
        </Button>
        <Button
          variant="contained"
          color={color}
          onClick={handleConfirmClick}
          disableElevation
        >
          {confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmationModal;
