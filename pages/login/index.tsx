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



const StyledButton = styled(Button)(
  ({ theme }) => `
    background-color: #1a73e8;
    color: #fff;
    padding: ${theme.spacing(1)} ${theme.spacing(3)};
    border-radius: 8px;
    font-size: ${theme.typography.pxToRem(16)};
    font-weight: bold;
    text-transform: none;
    margin-top: ${theme.spacing(2)};
    box-shadow: 0 4px ${theme.palette.grey[700]};
    transition: all 0.2s ease-in-out;
    &:hover {
      background-color: #155db2;
    }
    &:active {
      box-shadow: none;
      transform: translateY(4px);
    }
`
);

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    try {
      console.log('Login Payload:', { email: username, password });
      const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
      { email: username, password }
      );
      const { access_token } = response.data;
      console.log('Access Token:', access_token);
      localStorage.setItem('token', access_token);
      router.push('/directory/tasks');
    } catch (error) {
      console.error('Login Error:', error.response || error.message);
      setErrorMessage(
        error.response?.data?.message || 'Login failed. Please try again.'
      );
    }
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: '#0A1929',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          padding: 2
        }}
      >
        <Container maxWidth="sm">
          <Box
            sx={{
              textAlign: 'center',
              backgroundColor: '#132F4C',
              borderRadius: 4,
              padding: 4,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
            }}
          >
            {/* Logo */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <img
                src="/static/images/logo/f2fin.png"
                alt="F2 Fintech Logo"
                style={{
                  height: '100px',
                  width: 'auto',
                  objectFit: 'contain'
                }}
              />
            </Box>
            <Typography
              variant="h5"
              component="h1"
              sx={{ color: '#FFFFFF', fontWeight: 'bold', mb: 2 }}
            >
              Welcome Back!
            </Typography>
            <Typography
              sx={{
                color: '#B0BEC5',
                fontSize: '1rem',
                marginBottom: '2rem'
              }}
            >
              Please login to your account.
            </Typography>
            {errorMessage && (
              <Typography
                sx={{ color: 'red', mb: 2, fontSize: '0.875rem' }}
              >
                {errorMessage}
              </Typography>
            )}
            <Box component="form" noValidate>
              <TextField
                fullWidth
                label="Username"
                variant="outlined"
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                InputProps={{
                  style: {
                    backgroundColor: '#1E293B',
                    color: '#FFFFFF',
                    borderRadius: '8px'
                  }
                }}
                InputLabelProps={{
                  style: { color: '#FFFFFF' }
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
                InputProps={{
                  style: {
                    backgroundColor: '#1E293B',
                    color: '#FFFFFF',
                    borderRadius: '8px'
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePassword}
                        edge="end"
                        style={{ color: '#FFFFFF' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                InputLabelProps={{
                  style: { color: '#FFFFFF' }
                }}
                required
              />
              <StyledButton fullWidth onClick={handleLogin}>
                Login
              </StyledButton>
            </Box>
<Typography sx={{ color: '#B0BEC5', mt: 2 }}>
  Don’t have an account?{' '}
  <Link href="/signup" passHref>
    <Typography component="a" sx={{ color: '#1a73e8', textDecoration: 'none', cursor: 'pointer' }}>
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
          backgroundColor: '#0A1929',
          padding: 2,
          color: '#FFFFFF',
          fontSize: '0.875rem'
        }}
      >
        © 2025 - F2 Fintech Pvt. Ltd.
      </Box>
    </>
  );
}

export default LoginPage;