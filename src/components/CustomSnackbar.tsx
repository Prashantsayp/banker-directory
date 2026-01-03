import React from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

export interface CustomSnackbarProps {
  open: boolean;
  message: string;
  severity: AlertColor;
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

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    // Prevent accidental dismiss on click-away
    if (reason === 'clickaway') return;
    onClose(event, reason);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        severity={severity}
        variant="filled"
        onClose={handleClose}
        sx={{ borderRadius: 2 }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
