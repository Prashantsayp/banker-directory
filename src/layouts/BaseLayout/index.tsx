'use client';

import React, { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';

interface BaseLayoutProps {
  children: React.ReactNode;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Wait for React hydration and simulate slight delay
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 800); // loader duration

    return () => clearTimeout(timer);
  }, []);

  if (!showContent) {
    return (
      <Box
        sx={{
          height: '100vh',
          width: '100%',
          backgroundColor: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 9999
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        opacity: showContent ? 1 : 0,
        transition: 'opacity 0.4s ease'
      }}
    >
      {children}
    </Box>
  );
};

export default BaseLayout;
