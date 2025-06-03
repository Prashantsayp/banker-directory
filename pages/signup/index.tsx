import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  styled,
  MenuItem
} from '@mui/material';
import { useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';

// Styled Button
const StyledButton = styled(Button)(({ theme }) => `
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
`);

function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'USER' // default role
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTogglePassword = () => setShowPassword(!showPassword);

  const handleSignup = async () => {
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup`,
        {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: formData.role
        }
      );
      console.log('Signup success:', response.data);
      router.push('/login'); 
    } catch (error) {
      console.error('Signup error:', error.response || error.message);
      setErrorMessage(
        error.response?.data?.message || 'Signup failed. Try again.'
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
              padding: 3,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 0.1 }}>
              <img
                src="/static/images/logo/f2fin.png"
                alt="F2 Fintech Logo"
                style={{ height: '100px', width: 'auto', objectFit: 'contain' }}
              />
            </Box>
            <Typography variant="h5" sx={{ color: '#FFFFFF', fontWeight: 'bold', mb: 2 }}>
              Create an Account
            </Typography>
            {errorMessage && (
              <Typography sx={{ color: 'red', mb: 2, fontSize: '0.875rem' }}>
                {errorMessage}
              </Typography>
            )}
            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              variant="outlined"
              margin="normal"
              value={formData.fullName}
              onChange={handleChange}
              InputProps={{
                style: { backgroundColor: '#1E293B', color: '#FFFFFF', borderRadius: '8px' }
              }}
              InputLabelProps={{ style: { color: '#FFFFFF' } }}
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
              InputProps={{
                style: { backgroundColor: '#1E293B', color: '#FFFFFF', borderRadius: '8px' }
              }}
              InputLabelProps={{ style: { color: '#FFFFFF' } }}
              required
            />
            <TextField
              fullWidth
              label="Role"
              name="role"
              select
              variant="outlined"
              margin="normal"
              value={formData.role}
              onChange={handleChange}
              InputProps={{
                style: { backgroundColor: '#1E293B', color: '#FFFFFF', borderRadius: '8px' }
              }}
              InputLabelProps={{ style: { color: '#FFFFFF' } }}
              required
            >
            {/* add here all users according to requiremnt like channel partnet etc */}

            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
        
            </TextField>
            <TextField
              fullWidth
              label="Password"
              name="password"
              variant="outlined"
              margin="normal"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                style: { backgroundColor: '#1E293B', color: '#FFFFFF', borderRadius: '8px' },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} edge="end" style={{ color: '#FFFFFF' }}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              InputLabelProps={{ style: { color: '#FFFFFF' } }}
              required
            />
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              variant="outlined"
              margin="normal"
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              InputProps={{
                style: { backgroundColor: '#1E293B', color: '#FFFFFF', borderRadius: '8px' }
              }}
              InputLabelProps={{ style: { color: '#FFFFFF' } }}
              required
            />
            <StyledButton fullWidth onClick={handleSignup}>
              Sign Up
            </StyledButton>

            <Typography sx={{ color: '#B0BEC5', mt: 2 }}>
              Already have an account?{' '}
              <Link href="/login" passHref>
                <Typography component="a" sx={{ color: '#1a73e8', textDecoration: 'none', cursor: 'pointer' }}>
                  Login
                </Typography>
              </Link>
            </Typography>
          </Box>
        </Container>
      </Box>
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

export default SignupPage;
