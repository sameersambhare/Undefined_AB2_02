import React from 'react';
import { Typography } from 'antd';

interface LabelProps {
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const Label: React.FC<LabelProps> = ({ style, children }) => {
  return (
    <Typography.Text style={style}>
      {children}
    </Typography.Text>
  );
}; 