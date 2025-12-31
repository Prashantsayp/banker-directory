// CustomSnackbar.tsx

import React from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

export interface CustomSnackbarProps {
  open: boolean;
  message: string;
  severity: AlertColor; // 'success' | 'error' | 'info' | 'warning'
  duration?: number;
  onClose: (event?: React.SyntheticEvent | Event, reason?: string) => void;
}

const CustomSnackbar: React.FC<CustomSnackbarProps> = ({
  open,
  message,
  severity,
  duration = 4000,
  onClose
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{ borderRadius: 2 }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
