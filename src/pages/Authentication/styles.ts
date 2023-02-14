import { css } from '@emotion/react';

export const authPage = css`
  height: 100%;
  background: no-repeat url('/auth-bg.png');
  background-size: cover;

  display: flex;
  align-items: center;
  justify-content: center;
`;

export const authFormCard = css`
  box-shadow: 0 4px 64px rgba(0, 0, 0, 0.3);
`;

export const offlineButton = css`
  position: absolute;
  top: 16px;
  left: 16px;
  height: 46px;
  border-radius: 12px;
`;

export const offlineAlert = css`
  margin-bottom: 16px;
`;
