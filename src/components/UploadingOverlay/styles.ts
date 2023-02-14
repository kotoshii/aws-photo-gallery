import { css } from '@emotion/react';

export const uploadingOverlayWrapper = css`
  position: absolute;
  bottom: 32px;
  left: 32px;
  display: flex;
  transition: left 0.25s;
  z-index: 10;
`;

export const uploadingOverlayHidden = css`
  left: -600px;
`;

export const uploadingOverlay = (expanded: boolean) => css`
  border-radius: ${expanded
    ? '16px 0 16px 16px !important'
    : '16px 0 0 16px !important'};
  width: 600px;
  background-color: #f8f9fa;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);

  max-height: calc(100% - 32px - 24px - 96px - 16px);
  z-index: 1;

  &:before {
    display: none;
  }
`;

export const linearProgress = css`
  border-radius: 4px;
  height: 8px;
  flex-grow: 1;
`;

export const accordionDetails = css`
  overflow-y: auto;
  max-height: calc(100vh - 64px - 96px - 16px - 68.02px);
`;

export const toggleOverlayButton = css`
  background-color: #f8f9fa;
  border-radius: 0 16px 16px 0;
  max-height: 68.02px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);

  &:hover {
    background-color: #eeeff0;
  }
`;
