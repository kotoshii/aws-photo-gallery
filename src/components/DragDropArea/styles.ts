import { css } from '@emotion/react';

export const uploadAreaWrapper = css`
  height: 170px;
  border-radius: 16px;
  border: #1976d2 dashed 2px;
  background-color: rgba(25, 118, 210, 0.05);
  margin: 48px 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const uploadAreaWrapperActive = css`
  background-color: rgba(25, 118, 210, 0.2);
`;

export const uploadArea = css`
  color: rgba(25, 118, 210, 0.54);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
  width: 100%;
  height: 100%;
`;

export const inputElement = css`
  width: 100%;
  height: 100%;
  display: none;
`;
