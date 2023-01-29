import { css } from '@emotion/react';
import { alpha } from '@mui/material';
import { UploadingStatus } from '@interfaces/storage/uploading-info.interface';

export const uploadingFileComponent = (
  progress: number,
  status: UploadingStatus,
  statusColor?: string,
) => {
  const bgColor =
    !statusColor || status === 'in_progress'
      ? '#f8f9fa'
      : `${alpha(statusColor, 0.1)}`;

  const background =
    status === 'in_progress'
      ? `background: linear-gradient(
      to right,
      rgba(25, 118, 210, 0.25) ${progress}%,
      ${bgColor} ${progress}% 100%
    );`
      : '';

  return css`
    border: 1px solid ${!statusColor ? 'rgba(0, 0, 0, 0.2)' : statusColor};
    padding: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 16px;
    background-color: ${bgColor};
    position: relative;
    ${background}

    & > .MuiBox-root {
      z-index: 1;
    }

    &:last-child {
      margin-bottom: 0;
    }
  `;
};

export const filePreviewWrapper = css`
  width: 48px;
  height: 48px;
  background-color: rgba(0, 0, 0, 0.04);
  border-radius: 10px;
  margin-right: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const filePreviewImage = css`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  object-fit: cover;
`;

export const cancelButton = css`
  margin-left: auto;
  width: 48px;
  height: 48px;
  display: none;
`;
