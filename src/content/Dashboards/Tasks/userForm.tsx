import {
  TextField,
  Button,
  MenuItem,
  Grid,
  Typography,
  Paper,
} from '@mui/material';
import { useState } from 'react';
import axios from 'axios';

const genderOptions = ['male', 'female', 'other'];
const roleOptions = ['admin', 'user'];

interface Props {
  onSuccess: () => void;
}

const textFieldStyles = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#fff',
    borderRadius: '12px',
    color: '#333', // 🟣 Fixes typed text color
    '& input': {
      color: '#333', // 🟣 Ensures input text is dark
    },
    '& fieldset': {
      borderColor: '#c084fc',
    },
    '&:hover fieldset': {
      borderColor: '#a855f7',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#9333ea',
      boxShadow: '0 0 0 2px rgba(147, 51, 234, 0.2)',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#a855f7',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#9333ea',
  },
  '& .MuiSelect-select': {
    color: '#333', // 🟣 Fixes dropdown selected value
  }
};


function UserForm({ onSuccess }: Props) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    gender: '',
    role: 'user',
  });

  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/create-users`,
        formData
      );
      console.log('User created:', res.data);
      onSuccess();
      setFormData({
        fullName: '',
        email: '',
        password: '',
        gender: '',
        role: 'user',
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={4}
      sx={{
        p: 4,
        borderRadius: 4,
        maxWidth: 520,
        mx: 'auto',
        mt: 4,
        backgroundColor: '#f9f5ff',
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          color: '#9333ea',
          fontWeight: 600,
          mb: 2,
          textAlign: 'center',
        }}
      >
        Create New User
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              sx={textFieldStyles}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              sx={textFieldStyles}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              required
              helperText="Minimum 6 characters"
              variant="outlined"
              sx={textFieldStyles}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              sx={textFieldStyles}
            >
              {genderOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              sx={textFieldStyles}
            >
              {roleOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {error && (
            <Grid item xs={12}>
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            </Grid>
          )}

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                mt: 2,
                backgroundColor: '#9333ea',
                color: '#fff',
                borderRadius: '12px',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': { backgroundColor: '#7e22ce' },
              }}
            >
              {loading ? 'Creating...' : 'Create User'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}

export default UserForm;
