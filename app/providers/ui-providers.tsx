'use client';

import React from 'react';
import { ThemeProvider } from 'next-themes';
import MuiProvider from './mui-provider';
import AntdProvider from './antd-provider';

// Main UI providers wrapper component
const UIProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem
      themes={['light', 'dark']}
    >
      <MuiProvider>
        <AntdProvider>
          {children}
        </AntdProvider>
      </MuiProvider>
    </ThemeProvider>
  );
};

export default UIProviders; 