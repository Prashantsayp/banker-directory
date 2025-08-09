import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  styled,
 
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
  borderRadius: 50,
  fontWeight: 600,
  fontSize: '1rem',
  textTransform: 'none',
  backgroundColor: '#4f46e5',
  color: '#fff',
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#4338ca',
    boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.15)'
  }
}));

function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });

  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const handleSnackbarClose = (_: unknown, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTogglePassword = () => setShowPassword(!showPassword);

  const handleSignup = async () => {
    if (formData.password !== formData.confirmPassword) {
      setSnackbarMessage('Passwords do not match.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup`, {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });

      setSnackbarMessage('Signup successful! Redirecting...');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      setTimeout(() => {
        router.push('/login');
      }, 1200);
    } catch (error: any) {
      setSnackbarMessage(error.response?.data?.message || 'Signup failed. Try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <Box
        sx={{
          background: 'linear-gradient(to right, #a8cff8 0%, #cde7f9 30%, #f9fcff 100%)',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 2
        }}
      >
        <Container maxWidth="sm">
          <Box
            sx={{
              textAlign: 'center',
              backgroundColor: '#ffffff',
              borderRadius: 4,
              padding: 4,
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
              color: '#0f172a'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <img
                src="/static/images/logo/f2.png"
                alt="F2 Fintech Logo"
                style={{ height: '90px', width: 'auto' }}
              />
            </Box>

            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Create an Account
            </Typography>

            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              variant="outlined"
              margin="normal"
              value={formData.fullName}
              onChange={handleChange}
              sx={{
                '& .MuiInputBase-root': {
                  backgroundColor: '#f1f5f9',
                  color: '#0f172a',
                  borderRadius: '12px'
                },
                '& .MuiInputLabel-root': {
                  color: '#475569'
                }
              }}
              required
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              variant="outlined"
              margin="normal"
              value={formData.email}
              onChange={handleChange}
              sx={{
                '& .MuiInputBase-root': {
                  backgroundColor: '#f1f5f9',
                  color: '#0f172a',
                  borderRadius: '12px'
                },
                '& .MuiInputLabel-root': {
                  color: '#475569'
                }
              }}
              required
            />

          

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              margin="normal"
              value={formData.password}
              onChange={handleChange}
              sx={{
                '& .MuiInputBase-root': {
                  backgroundColor: '#f1f5f9',
                  color: '#0f172a',
                  borderRadius: '12px'
                },
                '& .MuiInputLabel-root': {
                  color: '#475569'
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

            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              margin="normal"
              value={formData.confirmPassword}
              onChange={handleChange}
              sx={{
                '& .MuiInputBase-root': {
                  backgroundColor: '#f1f5f9',
                  color: '#0f172a',
                  borderRadius: '12px'
                },
                '& .MuiInputLabel-root': {
                  color: '#475569'
                }
              }}
              required
            />

            <StyledButton fullWidth onClick={handleSignup}>
              Sign Up
            </StyledButton>

            <Typography sx={{ color: '#475569', mt: 2 }}>
              Already have an account?{' '}
              <Link href="/login" passHref>
                <Typography
                  component="a"
                  sx={{
                    color: '#1a73e8',
                    textDecoration: 'none',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  Login
                </Typography>
              </Link>
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          width: '100%',
          textAlign: 'center',
          backgroundColor: '#f1f5f9',
          padding: 1,
          color: '#475569',
          fontSize: '0.875rem'
        }}
      >
        © 2025 - F2 Fintech Pvt. Ltd.
      </Box>

      {/* Snackbar */}
      <CustomSnackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarSeverity} l={undefined}      />
    </>
  );
}

export default SignupPage;
