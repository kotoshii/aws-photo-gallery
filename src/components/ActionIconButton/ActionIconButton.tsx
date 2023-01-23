/** @jsxImportSource @emotion/react */
import React from 'react';
import { actionButtonActive, actionIconButton } from './styles';
import { IconButton } from '@mui/material';

interface ActionIconButtonProps {
  icon: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
  className?: string;
  active?: boolean;
  disabled?: boolean;
}

function ActionIconButton({
  icon,
  onClick,
  className,
  active,
  disabled,
}: ActionIconButtonProps) {
  return (
    <IconButton
      disabled={disabled}
      css={[actionIconButton, active ? actionButtonActive : null]}
      onClick={onClick}
      className={className}
    >
      {icon}
    </IconButton>
  );
}

export default ActionIconButton;
