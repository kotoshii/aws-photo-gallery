import { css } from '@emotion/react';

export const uploadingFileComponent = (progress: number) => css`
  border: 1px solid rgba(0, 0, 0, 0.2);
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;
  background-color: #f8f9fa;
  position: relative;

  & > .MuiBox-root {
    z-index: 1;
  }

  &:after {
    height: 100%;
    background-color: rgba(25, 118, 210, 0.25);
    width: ${progress}%;
    content: '\\A';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    border-radius: 15px;
  }
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

export const cancelButton = css`
  margin-left: auto;
  width: 48px;
  height: 48px;
  display: none;
`;
