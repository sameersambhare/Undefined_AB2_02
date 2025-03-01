'use client';

import React, { useState, useEffect } from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { useTheme } from 'next-themes';

// Ant Design Provider with client-side only rendering
const AntdProvider = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();
  // Track if component is mounted (client-side)
  const [isMounted, setIsMounted] = useState(false);
  
  // Set mounted state after component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isDarkMode = isMounted && resolvedTheme === 'dark';

  // Render content only after mounting to prevent hydration issues
  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: '#1890ff',
        },
      }}
    >
      {isMounted ? children : <div style={{ visibility: 'hidden' }}>{children}</div>}
    </ConfigProvider>
  );
};

export default AntdProvider; 