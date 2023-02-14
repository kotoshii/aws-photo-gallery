/** @jsxImportSource @emotion/react */
import React from 'react';
import {
  actionButtonActive,
  actionButtonBorderless,
  actionIconButton,
} from './styles';
import { IconButton } from '@mui/material';

interface ActionIconButtonProps {
  icon: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
  className?: string;
  active?: boolean;
  disabled?: boolean;
  borderless?: boolean;
}

function ActionIconButton({
  icon,
  onClick,
  className,
  active,
  disabled,
  borderless,
}: ActionIconButtonProps) {
  return (
    <IconButton
      disabled={disabled}
      css={[
        actionIconButton,
        active ? actionButtonActive : null,
        borderless ? actionButtonBorderless : null,
      ]}
      onClick={onClick}
      className={className}
    >
      {icon}
    </IconButton>
  );
}

export default ActionIconButton;
