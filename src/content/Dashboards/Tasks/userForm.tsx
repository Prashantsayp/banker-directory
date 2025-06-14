import {
  TextField,
  Button,
  MenuItem,
  Grid,
  Box,
  Typography
} from '@mui/material';
import { useState } from 'react';
import axios from 'axios';

const genderOptions = ['male', 'female', 'other'];
const roleOptions = ['admin', 'user'];

interface Props {
  onSuccess: () => void;
}

function UserForm({ onSuccess }: Props) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    gender: '',
    role: 'user'
  });

  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
    console.log('user created:', res.data);
    onSuccess();
  } catch (err: any) {
    setError(err.response?.data?.message || 'Failed to create user');
  } finally {
    setLoading(false);
  }
};


  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            fullWidth
            required
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
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            select
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            fullWidth
            required
          >
            {genderOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={6}>
          <TextField
            select
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            fullWidth
            required
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
            <Typography color="error">{error}</Typography>
          </Grid>
        )}

        <Grid item xs={12}>
          <Box textAlign="right">
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create User'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
}

export default UserForm;
