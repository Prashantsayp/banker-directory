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
import { useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import CustomSnackbar from '@/components/CustomSnackbar';
import { SnackbarCloseReason } from '@mui/material';

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
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const router = useRouter();

  const handleTogglePassword = () => setShowPassword(!showPassword);
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
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
        { email, password }
      );
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      setSnackbarMessage('Login successful!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setTimeout(() => {
        router.push('/directory/tasks');
      }, 1200);
    } catch (error: any) {
      setSnackbarMessage(
        error.response?.data?.message || 'Login failed. Please try again.'
      );
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(to bottom right, #f0f4ff, #ffffff)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            backgroundColor: '#ffffff',
            borderRadius: 4,
            padding: 5,
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
            textAlign: 'center'
          }}
        >
          {/* Logo Section */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <img
              src="/static/images/logo/f2.png"
              alt="F2 Fintech Logo"
              style={{ height: 70, objectFit: 'contain' }}
            />
          </Box>

           <Typography variant="h5" sx={{ color: "#2f2c6f" }} fontWeight={700} gutterBottom>
            Sign In to Your Account
          </Typography> 

          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              '& .MuiInputBase-root': {
                backgroundColor: '#f9fafb',
                color: '#2f2c6f',
                borderRadius: 4,
                border: '1px solid #e2e8f0'
              },
              '& .MuiInputLabel-root': {
                color: '#6b7280'
              }
            }}
            required
          />

          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            margin="normal"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              '& .MuiInputBase-root': {
                backgroundColor: '#f9fafb',
                color: '#2f2c6f',
                borderRadius: 4,
                border: '1px solid #e2e8f0'
              },
              '& .MuiInputLabel-root': {
                color: '#6b7280'
              }
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

          <StyledButton fullWidth onClick={handleLogin} sx={{ mt: 3 }}>
            Login
          </StyledButton>

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
      />
    </Box>
  );
}

export default LoginPage;
