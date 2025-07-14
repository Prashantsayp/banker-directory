import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoaderProps {
  message?: string;
  fullScreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ message = 'Loading...', fullScreen = false }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      height={fullScreen ? '100vh' : '100%'}
      width="100%"
    >
      <CircularProgress color="primary" />
      {message && (
        <Typography mt={2} variant="body1">
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default Loader;
