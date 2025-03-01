'use client';

import React from 'react';
import { Button as MuiButton, ButtonProps } from '@mui/material';

export interface MuiButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export function Button({ children, ...props }: MuiButtonProps) {
  return <MuiButton {...props}>{children}</MuiButton>;
}

export default Button; 