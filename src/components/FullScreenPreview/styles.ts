import { css } from '@emotion/react';

export const preview = css`
  .MuiPaper-root {
    display: flex;
    width: 98vw;
    height: 98vh;
    flex-direction: row;
    max-width: unset;
    max-height: unset;
    margin: 0;
  }
`;

export const fileInfoWrapper = css`
  width: 300px;
  height: 100%;
`;

export const image = (url: string) => css`
  width: calc(100% - 300px);
  background-image: url(${url});
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  background-color: #212121;
`;
