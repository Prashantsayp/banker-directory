import React, { useState, KeyboardEvent } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  styled
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import Link from 'next/link';
import CustomSnackbar from '@/components/CustomSnackbar';
import { SnackbarCloseReason } from '@mui/material';
import { signIn } from 'next-auth/react';

// ---------- UI ----------
const StyledButton = styled(Button)(({ theme }) => ({
  padding: `${theme.spacing(1.5)} ${theme.spacing(4)}`,
  borderRadius: 8,
  fontWeight: 600,
  fontSize: '1rem',
  textTransform: 'none',
  background: 'linear-gradient(to right, #3b82f6, #6366f1)',
  color: '#fff',
  boxShadow: '0px 8px 16px rgba(99, 102, 241, 0.2)',
  '&:hover': {
    background: 'linear-gradient(to right, #2563eb, #4f46e5)',
    boxShadow: '0px 12px 20px rgba(79, 70, 229, 0.25)'
  }
}));

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>(
    'success'
  );

  const handleTogglePassword = () => setShowPassword((p) => !p);

  const handleSnackbarClose = (_: unknown, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setSnackbarMessage('Email and password are required.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
        { email: email.trim().toLowerCase(), password },
        { withCredentials: true }
      );

      const { access_token, redirectTo } = res.data || {};

      if (access_token) {
        localStorage.setItem('token', access_token);
      }

      if (redirectTo) {
        window.location.href = redirectTo;
        return;
      }

      window.location.href = '/';
    } catch (error: any) {
      setSnackbarMessage(
        error?.response?.data?.message || 'Login failed. Please try again.'
      );
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleEnter = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleLogin();
    }
  };

  const handleGoogle = () => {
    signIn('google', { callbackUrl: '/directory/tasks' });
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(to bottom right, #f0f4ff, #ffffff)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            backgroundColor: '#ffffff',
            borderRadius: 4,
            p: 5,
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
            textAlign: 'center'
          }}
        >
          {/* Logo */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <img
              src="/static/images/logo/f2.png"
              alt="F2 Fintech Logo"
              style={{ height: 70, objectFit: 'contain' }}
            />
          </Box>

          <Typography
            variant="h5"
            sx={{ color: '#2f2c6f' }}
            fontWeight={700}
            gutterBottom
          >
            Sign In to Your Account
          </Typography>

          {/* Email */}
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleEnter}
            sx={{
              '& .MuiInputBase-root': {
                backgroundColor: '#f9fafb',
                color: '#2f2c6f',
                borderRadius: 4,
                border: '1px solid #e2e8f0'
              },
              '& .MuiInputLabel-root': { color: '#6b7280' }
            }}
            required
          />

          {/* Password */}
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            margin="normal"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleEnter}
            sx={{
              '& .MuiInputBase-root': {
                backgroundColor: '#f9fafb',
                color: '#2f2c6f',
                borderRadius: 4,
                border: '1px solid #e2e8f0'
              },
              '& .MuiInputLabel-root': { color: '#6b7280' }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            required
          />

          {/* Password Login */}
          <StyledButton fullWidth onClick={handleLogin} sx={{ mt: 3 }}>
            Login
          </StyledButton>

          {/* Divider */}
          <Typography sx={{ my: 2, color: '#9ca3af', fontSize: 13 }}>
            or
          </Typography>

          {/* Continue with Google */}
          <Button
            onClick={handleGoogle}
            fullWidth
            variant="outlined"
            startIcon={
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="#EA4335"
                  d="M12 10.2v3.6h5.1c-.2 1.2-.9 2.2-1.9 2.8l3 2.3c1.8-1.6 2.8-4 2.8-6.9 0-.7-.1-1.4-.2-2H12z"
                />
                <path
                  fill="#34A853"
                  d="M5.3 14.3l-2.6 2c1.5 3 4.5 4.9 8.3 4.9 2.5 0 4.7-.8 6.3-2.2l-3-2.3c-.9.6-2 .9-3.3.9-2.5 0-4.6-1.7-5.4-4z"
                />
                <path
                  fill="#FBBC05"
                  d="M3 7.7 5.6 9.7C6.4 7.6 8.5 6 11 6c1.2 0 2.4.4 3.3 1.1l2.5-2.5C15.1 3.1 13.1 2.3 11 2.3 7.2 2.3 4.3 4.2 3 7.7z"
                />
                <path
                  fill="#4285F4"
                  d="M21.1 12c0-.6-.1-1.2-.2-1.8H12v3.6h5.1c-.2 1.2-.9 2.2-1.9 2.8h0l3 2.3c1.8-1.6 2.9-4 2.9-6.9z"
                />
              </svg>
            }
            sx={{
              textTransform: 'none',
              borderColor: '#e5e7eb',
              backgroundColor: '#fff',
              color: '#374151',
              borderRadius: 2,
              py: 1.2,
              '&:hover': { backgroundColor: '#f9fafb', borderColor: '#d1d5db' }
            }}
          >
            Continue with Google
          </Button>

          {/* Sign up link */}
          <Typography sx={{ mt: 3, color: '#6b7280' }}>
            Don’t have an account?{' '}
            <Link href="/signup" passHref>
              <Typography
                component="a"
                sx={{
                  color: '#3b82f6',
                  fontWeight: 500,
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                Sign up
              </Typography>
            </Link>
          </Typography>
        </Box>
      </Container>

      <CustomSnackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarSeverity}
        l={undefined}
      />
    </Box>
  );
}

export default LoginPage;
