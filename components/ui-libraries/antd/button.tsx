'use client';

import React from 'react';
import { Button as AntButton } from 'antd';
import type { ButtonProps as AntButtonProps } from 'antd';

export interface AntdButtonProps extends AntButtonProps {
  children?: React.ReactNode;
}

export function Button({ children, ...props }: AntdButtonProps) {
  return <AntButton {...props}>{children}</AntButton>;
}

export default Button; 