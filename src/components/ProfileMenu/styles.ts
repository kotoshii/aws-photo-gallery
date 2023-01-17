import { css } from '@emotion/react';

export const profileMenuAvatar = css`
  width: 140px;
  height: 140px;
  margin-top: 32px;
`;

export const profileMenu = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 315px;
  padding: 16px;
`;

export const divider = css`
  margin-top: 24px;
  margin-bottom: 16px;
  width: 100%;
`;

export const menuList = css`
  width: 100%;

  & .MuiMenuItem-root {
    height: 40px;
  }
`;
