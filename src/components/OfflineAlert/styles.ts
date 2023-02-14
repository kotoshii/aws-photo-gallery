import { css } from '@emotion/react';

export const offlineAlert = css`
  z-index: 999;
  position: sticky;
`;

export const offlineAlertWithNavbar = css`
  position: absolute;
  width: calc(100% - 64px);
  top: calc(24px + 96px);
  border-radius: 0 0 16px 16px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-top: none;
`;
