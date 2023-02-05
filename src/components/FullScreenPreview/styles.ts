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

  display: flex;
  justify-content: space-between;
`;

export const nextPrevButton = css`
  width: 150px;
  height: 100%;
  background-color: #000;
  opacity: 0.2;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  :hover {
    opacity: 0.6;
  }

  svg {
    width: 64px;
    height: 64px;
    color: rgba(255, 255, 255, 0.54);
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.7);
  }
`;
