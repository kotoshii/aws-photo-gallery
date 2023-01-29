/** @jsxImportSource @emotion/react */
import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  LinearProgress,
  Typography,
} from '@mui/material';
import {
  accordionDetails,
  linearProgress,
  toggleOverlayButton,
  uploadingOverlay,
  uploadingOverlayHidden,
  uploadingOverlayWrapper,
} from './styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {
  deleteFileById,
  setUploadingOverlayOpen,
  uploadingInfoSelector,
  uploadingOverlayOpenSelector,
} from '@store/slices/files.slice';
import { useSelector } from 'react-redux';
import {
  ActiveUploadsMap,
  UploadingStatus,
} from '@interfaces/storage/uploading-info.interface';
import { ActionIconButton, UploadingFileComponent } from '@components';
import { PendingFilesContext } from '@contexts/pending-files.context';
import { useAppDispatch } from '@store';
import { Storage } from 'aws-amplify';

interface UploadingOverlayProps {
  uploads: ActiveUploadsMap;
  onCancelUpload: (fileId: string) => void;
}

function UploadingOverlay({ uploads, onCancelUpload }: UploadingOverlayProps) {
  const dispatch = useAppDispatch();

  const { files, totalSize } = useSelector(uploadingInfoSelector);
  const uploadingOverlayOpen = useSelector(uploadingOverlayOpenSelector);

  const { setPendingFiles, pendingFiles } = useContext(PendingFilesContext);
  const [expanded, setExpanded] = useState(false);

  const filesArr = Object.values(files);
  const ids = Object.keys(files);

  useEffect(() => {
    if (!filesArr.length) {
      setExpanded(false);
    }
  }, [filesArr]);

  const amounts = useMemo(() => {
    const res: Record<UploadingStatus, number> = {
      in_progress: 0,
      completed: 0,
      error: 0,
      waiting: 0,
    };

    filesArr.forEach(({ status }) => {
      res[status] += 1;
    });

    return res;
  }, [files]);

  const progress = useMemo(() => {
    const percentage =
      (filesArr.reduce((acc, { loaded }) => acc + loaded, 0) / totalSize) *
        100 || 0;

    return amounts.in_progress ? percentage : 0;
  }, [files]);

  const progressText = useMemo(() => {
    let text = `${amounts.waiting + amounts.in_progress} file(s) uploading`;

    if (amounts.completed) {
      text += `, ${amounts.completed} file(s) completed`;
    }

    if (amounts.error) {
      text += `, ${amounts.error} file(s) failed`;
    }

    return text;
  }, [files]);

  const handleCancelUpload = (fileId: string) => () => {
    const upload = uploads[fileId];
    if (upload) {
      Storage.cancel(upload);
      onCancelUpload(fileId);
    }
  };

  const handleDeleteFile = (fileId: string) => () => {
    dispatch(deleteFileById(fileId));
    setPendingFiles((prevFiles) => {
      const newFiles = { ...prevFiles };
      delete newFiles[fileId];
      return newFiles;
    });
  };

  const handleCloseOverlay = () => {
    dispatch(setUploadingOverlayOpen(!uploadingOverlayOpen));
    setExpanded(false);
  };

  const handleAccordingExpand = (
    e: React.SyntheticEvent,
    expanded: boolean,
  ) => {
    if (filesArr.length) {
      setExpanded(expanded);
    }
  };

  return (
    <Box
      css={[
        uploadingOverlayWrapper,
        !uploadingOverlayOpen ? uploadingOverlayHidden : null,
      ]}
    >
      <Accordion
        css={uploadingOverlay(expanded)}
        disableGutters
        elevation={0}
        expanded={expanded}
        onChange={handleAccordingExpand}
      >
        <AccordionSummary
          expandIcon={filesArr.length ? <ExpandMoreIcon /> : null}
        >
          <Box display="flex" width={1} flexDirection="column" mr={3}>
            <Typography variant="body1">{progressText}</Typography>
            <Box display="flex" alignItems="baseline">
              <LinearProgress
                css={linearProgress}
                variant="determinate"
                value={progress}
              />
              <Typography variant="body2" ml={3}>
                {progress.toFixed(1)} %
              </Typography>
            </Box>
          </Box>
        </AccordionSummary>
        <AccordionDetails css={accordionDetails}>
          {ids.map((id) => (
            <UploadingFileComponent
              key={id}
              fileInfo={files[id]}
              pendingFile={pendingFiles[id]}
              onCancel={handleCancelUpload(id)}
              onDelete={handleDeleteFile(id)}
            />
          ))}
        </AccordionDetails>
      </Accordion>
      <ActionIconButton
        borderless
        css={toggleOverlayButton}
        icon={
          uploadingOverlayOpen ? (
            <KeyboardArrowLeftIcon />
          ) : (
            <KeyboardArrowRightIcon />
          )
        }
        onClick={handleCloseOverlay}
      />
    </Box>
  );
}

export default UploadingOverlay;
