'use client';

import React from 'react';
import { Card as AntCard, CardProps } from 'antd';

export interface AntdCardProps extends CardProps {
  children: React.ReactNode;
}

export function Card({ children, ...props }: AntdCardProps) {
  return (
    <AntCard {...props}>
      {children}
    </AntCard>
  );
}

export default Card; 