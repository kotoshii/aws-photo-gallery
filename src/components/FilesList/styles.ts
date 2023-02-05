import { css } from '@emotion/react';

export const fileList = css`
  overflow-y: auto;
  position: absolute;
  width: calc(100% - 300px);
  max-height: 100%;
  padding-top: calc(96px + 32px + 24px);
  padding-right: 64px;
  padding-bottom: 32px;

  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;
