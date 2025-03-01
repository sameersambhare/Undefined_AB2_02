import React from 'react';
import { FormLabel } from '@mui/material';

interface LabelProps {
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const Label: React.FC<LabelProps> = ({ style, children }) => {
  return (
    <FormLabel style={style}>
      {children}
    </FormLabel>
  );
}; 