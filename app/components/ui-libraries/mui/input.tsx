'use client';

import React from 'react';
import { TextField } from '@mui/material';

export interface MuiInputProps {
  placeholder?: string;
  variant?: 'outlined' | 'filled' | 'standard';
  size?: 'small' | 'medium';
  style?: React.CSSProperties;
  disabled?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  fullWidth?: boolean;
}

export function Input(props: MuiInputProps) {
  return <TextField variant="outlined" fullWidth {...props} />;
}

export default Input; 