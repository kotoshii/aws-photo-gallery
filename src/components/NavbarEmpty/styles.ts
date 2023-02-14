import { css } from '@emotion/react';

export const navbarEmpty = css`
  background-color: #f8f9fa;
  border: 1px solid rgba(0, 0, 0, 0.2);
  width: calc(100% - 64px);
  height: 96px;
  position: absolute;
  top: 24px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  z-index: 999;
`;

export const withAlert = css`
  border-radius: 16px 16px 0 0;
  border-bottom: none;
`;
