'use client';

import React from 'react';
import { Card as MuiCard, CardProps, CardContent } from '@mui/material';

export interface MuiCardWrapperProps extends CardProps {
  children: React.ReactNode;
}

export function Card({ children, ...props }: MuiCardWrapperProps) {
  return (
    <MuiCard {...props}>
      <CardContent>
        {children}
      </CardContent>
    </MuiCard>
  );
}

export default Card; 