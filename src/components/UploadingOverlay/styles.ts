import { css } from '@emotion/react';

export const uploadingOverlay = css`
  position: absolute;
  bottom: 32px;
  left: 32px;
  border-radius: 16px;
  width: 600px;
  background-color: #f8f9fa;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);

  &:before {
    display: none;
  }
`;

export const linearProgress = css`
  border-radius: 4px;
  height: 8px;
  flex-grow: 1;
`;
