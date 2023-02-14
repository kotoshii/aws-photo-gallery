import { css } from '@emotion/react';

export const popover = css`
  .MuiPaper-root {
    padding: 16px;
    position: absolute;
    top: calc(24px + 96px + 8px) !important;
    left: 256px !important;
    width: 500px;
  }
`;

export const applyButton = css`
  float: right;
  margin-top: 16px;
`;
