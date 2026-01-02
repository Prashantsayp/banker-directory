import React, { useState, KeyboardEvent } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  styled,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { Visibility, VisibilityOff, EmailOutlined, LockOutlined } from '@mui/icons-material';
import axios from 'axios';
import Link from 'next/link';
import CustomSnackbar from '@/components/CustomSnackbar';
import { SnackbarCloseReason } from '@mui/material';


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
      { email: email.trim().toLowerCase(), password }
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

  // const handleGoogle = () => {
  //   signIn('google', { callbackUrl: '/directory/tasks' });
  // };

  return (
    <Box
      sx={{
        background: 'radial-gradient(circle at 10% 10%, rgba(99,102,241,0.08), transparent 10%), radial-gradient(circle at 90% 90%, rgba(6,182,212,0.04), transparent 12%), linear-gradient(to bottom right, #f0f4ff, #ffffff)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            backgroundColor: '#ffffff',
            borderRadius: 4,
            p: { xs: 3, sm: 4 },
            boxShadow: '0 20px 60px rgba(15,23,42,0.08)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            '&:before': {
              content: '""',
              position: 'absolute',
              top: -90,
              right: -90,
              width: 220,
              height: 220,
              background: 'linear-gradient(135deg,#4F46E5 0%, #06B6D4 100%)',
              opacity: 0.06,
              transform: 'rotate(25deg)'
            }
          }}
        >
          {/* Header */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: 'center', mb: 1.5 }}>
              <Box sx={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#6366F1 0%,#06B6D4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 24px rgba(99,102,241,0.12)' }}>
                <img src="/static/images/logo/f2.png" alt="logo" style={{ height: 32 }} />
              </Box>
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="h6" sx={{ color: '#0f172a' }} fontWeight={800} gutterBottom>
                  Welcome back
                </Typography>
                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                  Sign in to access the banker directory
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Email */}
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="dense"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleEnter}
            sx={{
              '& .MuiInputBase-root': {
                backgroundColor: '#f9fafb',
                color: '#0f172a',
                borderRadius: 8,
                border: '1px solid #e6eef8'
              },
              '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                borderColor: '#6366F1',
                boxShadow: '0 10px 30px rgba(99,102,241,0.06)'
              },
              '& .MuiInputLabel-root': { color: '#6b7280' }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlined sx={{ color: '#94a3b8' }} />
                </InputAdornment>
              )
            }}
            required
          />

          {/* Password */}
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            margin="dense"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleEnter}
            sx={{
              '& .MuiInputBase-root': {
                backgroundColor: '#f9fafb',
                color: '#0f172a',
                borderRadius: 8,
                border: '1px solid #e6eef8'
              },
              '& .MuiOutlinedInput-root.Mui-focused fieldset': {
                borderColor: '#6366F1',
                boxShadow: '0 10px 30px rgba(99,102,241,0.06)'
              },
              '& .MuiInputLabel-root': { color: '#6b7280' }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined sx={{ color: '#94a3b8' }} />
                </InputAdornment>
              ),
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

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
            <FormControlLabel control={<Checkbox size="small" />} label={<Typography sx={{ fontSize: 13, color: '#6b7280' }}>Remember me</Typography>} />
            <Link href="/forgot-password" passHref>
              <Typography component="a" sx={{ color: '#3b82f6', fontSize: 13, textDecoration: 'none' }}>
                Forgot password?
              </Typography>
            </Link>
          </Box>

          {/* Password Login */}
          <StyledButton fullWidth onClick={handleLogin} sx={{ mt: 2, py: 1.2, borderRadius: 3 }}>
            Login
          </StyledButton>

          {/* Divider */}
          {/* <Typography sx={{ my: 1.25, color: '#9ca3af', fontSize: 13 }}>or</Typography> */}

          {/* Continue with Google */}
            {/* Continue with Google */}
          {/* <Button
            onClick={handleGoogle}
            fullWidth
            variant="outlined"
            startIcon={<Box sx={{ width: 34, height: 34, borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#fff' }}><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="#EA4335" d="M12 10.2v3.6h5.1c-.2 1.2-.9 2.2-1.9 2.8l3 2.3c1.8-1.6 2.8-4 2.8-6.9 0-.7-.1-1.4-.2-2H12z"/><path fill="#34A853" d="M5.3 14.3l-2.6 2c1.5 3 4.5 4.9 8.3 4.9 2.5 0 4.7-.8 6.3-2.2l-3-2.3c-.9.6-2 .9-3.3.9-2.5 0-4.6-1.7-5.4-4z"/><path fill="#FBBC05" d="M3 7.7 5.6 9.7C6.4 7.6 8.5 6 11 6c1.2 0 2.4.4 3.3 1.1l2.5-2.5C15.1 3.1 13.1 2.3 11 2.3 7.2 2.3 4.3 4.2 3 7.7z"/><path fill="#4285F4" d="M21.1 12c0-.6-.1-1.2-.2-1.8H12v3.6h5.1c-.2 1.2-.9 2.2-1.9 2.8h0l3 2.3c1.8-1.6 2.9-4 2.9-6.9z"/></svg></Box>}
            sx={{
              textTransform: 'none',
              borderColor: '#e5e7eb',
              backgroundColor: '#fff',
              color: '#374151',
              borderRadius: 3,
              py: 1,
              '&:hover': { backgroundColor: '#f9fafb', borderColor: '#d1d5db' }
            }}
          >
            Continue with Google
          </Button> */}
          {/* Sign up link */}
          {/* <Typography sx={{ mt: 3, color: '#6b7280' }}>
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
          </Typography> */}
        </Box>
      </Container>

        <CustomSnackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarSeverity}
        
      />
    </Box>
  );
}

export default LoginPage;
