import { css } from '@emotion/react';

export const card = css`
  width: 285px;
  height: 285px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  background-color: #f8f9fa;
  position: relative;
`;

export const imagePreview = css`
  width: 285px;
  height: 230px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.04);
`;

export const fileIcon = css`
  width: 48px;
  height: 48px;
`;

export const nonImagePreview = css`
  flex-direction: column;
  text-align: center;
`;

export const fileName = css`
  max-width: 100%;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  display: -webkit-box;
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const selected = css`
  outline: 4px solid #1976d2;
`;

export const offlineIcon = css`
  position: absolute;
  right: 12px;
  top: 12px;
  border-radius: 100%;
  background-color: white;
`;
