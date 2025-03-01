'use client';

import React from 'react';
import MuiProvider from './mui-provider';
import AntdProvider from './antd-provider';
import { ThemeProvider } from 'next-themes';

export function UIProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <MuiProvider>
        <AntdProvider>
          {children}
        </AntdProvider>
      </MuiProvider>
    </ThemeProvider>
  );
}

export default UIProviders; 