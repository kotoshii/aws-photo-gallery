/** @jsxImportSource @emotion/react */
import React, { ChangeEvent, useState } from 'react';
import { Box, IconButton, TextField, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import {
  editActionButton,
  editButton,
  editingFieldWrapper,
  editingTextField,
} from './styles';
import { ActionIconButton } from '@components';

interface EditableTypographyProps {
  onEditConfirm: (newValue: string) => void;
  value: string;
}

function EditableTitle({ value, onEditConfirm }: EditableTypographyProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(value);

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleConfirmEditing = () => {
    setIsEditing(false);
    onEditConfirm(title);
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    setTitle(value);
  };

  return isEditing ? (
    <Box css={editingFieldWrapper}>
      <TextField
        value={title}
        onChange={handleTitleChange}
        error={!title}
        variant="standard"
        css={editingTextField}
        fullWidth
      />
      <ActionIconButton
        icon={<CheckIcon fontSize="small" />}
        onClick={handleConfirmEditing}
        css={editActionButton}
        disabled={!title}
      />
      <ActionIconButton
        icon={<CloseIcon fontSize="small" />}
        onClick={handleCancelEditing}
        css={editActionButton}
      />
    </Box>
  ) : (
    <Typography variant="subtitle2">
      {value}
      <IconButton
        css={editButton}
        onClick={() => setIsEditing(true)}
        size="small"
      >
        <EditIcon fontSize="small" />
      </IconButton>
    </Typography>
  );
}

export default EditableTitle;
