import { css } from '@emotion/react';

export const pendingFileComponent = css`
  border: 1px solid rgba(0, 0, 0, 0.2);
  padding: 8px;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

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
