/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react';
import { Box, IconButton, Paper, TextField, Typography } from '@mui/material';
import { PendingFile } from '@interfaces/pending-file.interface';
import {
  descriptionTextField,
  filePreviewImage,
  filePreviewWrapper,
  pendingFileComponent,
  removeButton,
} from './styles';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import { filesize } from 'filesize';
import { EditableTitle } from '@components';

interface PendingFileComponentProps {
  file: PendingFile;
  onRemove: () => void;
  onSaveFilename: (newValue: string) => void;
  onDescriptionChange: (newValue: string) => void;
}

function PendingFileComponent({
  file,
  onRemove,
  onSaveFilename,
  onDescriptionChange,
}: PendingFileComponentProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [editingDescription, setEditingDescription] = useState(false);

  const isImage = file._fileObj.type.includes('image');

  useEffect(() => {
    if (isImage) {
      const reader = new FileReader();

      reader.addEventListener('load', () => {
        setImageSrc(reader.result as string);
      });
      reader.readAsDataURL(file._fileObj);
    }
  }, []);

  const handleEditDescriptionClick = () => {
    setEditingDescription((prevState) => !prevState);
  };

  return (
    <Paper elevation={0} css={pendingFileComponent}>
      <Box width={1} display="flex">
        <Box css={filePreviewWrapper}>
          {isImage && imageSrc ? (
            <img css={filePreviewImage} src={imageSrc} alt={file.filename} />
          ) : (
            <InsertDriveFileOutlinedIcon color="disabled" />
          )}
        </Box>
        <Box display="flex" flexDirection="column">
          <Box display="flex">
            <EditableTitle
              onEditConfirm={onSaveFilename}
              value={file.filename}
              onEditDescriptionClick={handleEditDescriptionClick}
              openEditDescription={editingDescription}
            />
          </Box>
          <Typography variant="caption">
            {filesize(file.size) as string}
          </Typography>
        </Box>
        <IconButton css={removeButton} onClick={onRemove}>
          <CancelIcon />
        </IconButton>
      </Box>
      {editingDescription && (
        <TextField
          multiline
          placeholder="Description..."
          fullWidth
          rows={2}
          css={descriptionTextField}
          value={file.description || ''}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
      )}
    </Paper>
  );
}

export default PendingFileComponent;
