/** @jsxImportSource @emotion/react */
import React from 'react';
import { Paper } from '@mui/material';
import { navbarEmpty } from './styles';

interface NavbarEmptyProps {
  children?: React.ReactNode;
}

function NavbarEmpty({ children }: NavbarEmptyProps) {
  return (
    <Paper css={navbarEmpty} elevation={0}>
      {children}
    </Paper>
  );
}

export default NavbarEmpty;
