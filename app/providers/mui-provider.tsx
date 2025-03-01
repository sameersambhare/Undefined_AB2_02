'use client';

import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useTheme } from 'next-themes';

// MUI Provider with client-side only rendering
const MuiProvider = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  
  // Set mounted state after component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const theme = createTheme({
    palette: {
      mode: isMounted && resolvedTheme === 'dark' ? 'dark' : 'light',
      primary: {
        main: isMounted && resolvedTheme === 'dark' ? '#f97316' : '#1976d2', // orange-500 in dark mode
      },
      secondary: {
        main: isMounted && resolvedTheme === 'dark' ? '#fb923c' : '#dc004e', // orange-400 in dark mode
      },
      background: {
        default: isMounted && resolvedTheme === 'dark' ? '#121212' : '#ffffff',
        paper: isMounted && resolvedTheme === 'dark' ? '#1e1e1e' : '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
  });

  // Render content only after mounting to prevent hydration issues
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {isMounted ? children : <div style={{ visibility: 'hidden' }}>{children}</div>}
    </ThemeProvider>
  );
};

export default MuiProvider; 