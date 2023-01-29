/** @jsxImportSource @emotion/react */
import React, { useContext, useMemo, useState } from 'react';
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
  setUploadingOverlayOpen,
  uploadingInfoSelector,
  uploadingOverlayOpenSelector,
} from '@store/slices/files.slice';
import { useSelector } from 'react-redux';
import { UploadingStatus } from '@interfaces/storage/uploading-info.interface';
import { ActionIconButton, UploadingFileComponent } from '@components';
import { PendingFilesContext } from '@contexts/pending-files.context';
import { useAppDispatch } from '@store';

function UploadingOverlay() {
  const dispatch = useAppDispatch();

  const { files, totalSize } = useSelector(uploadingInfoSelector);
  const uploadingOverlayOpen = useSelector(uploadingOverlayOpenSelector);

  const { pendingFiles } = useContext(PendingFilesContext);
  const [expanded, setExpanded] = useState(false);

  const filesArr = Object.values(files);
  const ids = Object.keys(files);

  const progress =
    (filesArr.reduce((acc, { loaded }) => acc + loaded, 0) / totalSize) * 100 ||
    0;

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

  const handleCancelUpload = () => {};

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
              onCancel={handleCancelUpload}
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
