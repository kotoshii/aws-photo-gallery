import { css } from '@emotion/react';

export const sidebar = css`
  width: 300px;
  height: calc(100% - 24px - 96px - 32px);
  margin-left: auto;
  margin-top: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
  border: 1px solid rgba(0, 0, 0, 0.2);
`;

export const filePreview = css`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 200px;
  background-color: rgba(0, 0, 0, 0.04);
  border-radius: 16px;
  margin-bottom: 16px;
`;

export const filePreviewImage = (src?: string) =>
  src
    ? css`
        background-image: url(${src});
        background-size: cover;
        background-position: center;
      `
    : null;

export const fileIcon = css`
  width: 48px;
  height: 48px;
`;
