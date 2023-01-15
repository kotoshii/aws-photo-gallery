/** @jsxImportSource @emotion/react */
import React from 'react';
import { actionIconButton } from './styles';
import { IconButton } from '@mui/material';

interface ActionIconButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  className?: string;
}

function ActionIconButton({ icon, onClick, className }: ActionIconButtonProps) {
  return (
    <IconButton css={actionIconButton} onClick={onClick} className={className}>
      {icon}
    </IconButton>
  );
}

export default ActionIconButton;
