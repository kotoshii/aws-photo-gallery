/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  LinearProgress,
  Typography,
} from '@mui/material';
import { linearProgress, uploadingOverlay } from './styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { uploadingInfoSelector } from '@store/slices/files.slice';
import { useSelector } from 'react-redux';
import { UploadingStatus } from '@interfaces/storage/uploading-info.interface';

function UploadingOverlay() {
  const { files, totalSize } = useSelector(uploadingInfoSelector);
  const filesArr = Object.values(files);
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

  return (
    <Accordion css={uploadingOverlay} disableGutters elevation={0}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
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
      <AccordionDetails>Some textSome textSome textSome text</AccordionDetails>
    </Accordion>
  );
}

export default UploadingOverlay;
