'use client';

import React from 'react';
import { Input as AntInput } from 'antd';
import type { InputProps as AntInputProps } from 'antd';

export interface AntdInputProps extends AntInputProps {
  // Add any additional props here
}

export function Input(props: AntdInputProps) {
  return <AntInput {...props} />;
}

export default Input; 