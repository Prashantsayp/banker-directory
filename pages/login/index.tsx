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

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleTogglePassword = () => setShowPassword(!showPassword);

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
        { email: username, password }
      );
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      router.push('/directory/tasks');
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 'Login failed. Please try again.'
      );
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
            {/* Logo */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <img
                src="/static/images/logo/f2.png"
                alt="F2 Fintech Logo"
                style={{ height: '90px', width: 'auto' }}
              />
            </Box>

            {/* Heading */}
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Welcome Back!
            </Typography>
            <Typography sx={{ color: '#475569', fontSize: '1rem', mb: 3 }}>
              Please login to your account.
            </Typography>

            {/* Error Message */}
            {errorMessage && (
              <Typography sx={{ color: 'red', mb: 2, fontSize: '0.875rem' }}>
                {errorMessage}
              </Typography>
            )}

            {/* Form */}
            <Box component="form" noValidate>
              <TextField
                fullWidth
                label="Username"
                variant="outlined"
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                variant="outlined"
                margin="normal"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

              <StyledButton fullWidth onClick={handleLogin}>
                Login
              </StyledButton>
            </Box>

            {/* Sign up link */}
            <Typography sx={{ color: '#475569', mt: 2 }}>
              Don’t have an account?{' '}
              <Link href="/signup" passHref>
                <Typography
                  component="a"
                  sx={{
                    color: '#1a73e8',
                    textDecoration: 'none',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  Sign up
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
          padding: 2,
          color: '#475569',
          fontSize: '0.875rem'
        }}
      >
        © 2025 - F2 Fintech Pvt. Ltd.
      </Box>
    </>
  );
}

export default LoginPage;
