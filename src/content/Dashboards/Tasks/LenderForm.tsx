import React, { useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  Typography,
  Alert,
  Snackbar,
  Paper
} from '@mui/material';
import axios from 'axios';

const initialForm = {
  lenderName: '',
  state: '',
  city: '',
  managerName: '',
  bankerName: '',
  email: '',
  rmName: '',
  rmContact: '',
  asmName: '',
  asmContact: '',
  rsmName: '',
  rsmContact: '',
  zsmName: ''
};

const commonTextFieldStyles = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#ccc',
      borderRadius: 2
    },
    '&:hover fieldset': {
      borderColor: '#aaa'
    },
    '&.Mui-focused fieldset': {
      borderColor: '#1976d2',
      boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.1)'
    }
  },
  '& .MuiInputLabel-root': {
    color: '#666'
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#1976d2'
  }
};

const LenderForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [successOpen, setSuccessOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.lenderName.trim()) {
      setError('Lender Name is required.');
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/lenders/create-lender`,
        form
      );

      console.log('Lender created:', res.data);

      setSuccessOpen(true);
      setForm(initialForm);
      setError('');
      onSuccess();
    } catch (err: any) {
      console.error('Submit error:', err.response?.data || err.message);
      const message = err?.response?.data?.message || 'Something went wrong';
      setError(Array.isArray(message) ? message.join(', ') : message);
    }
  };

  return (
   
      <Paper
        elevation={3}
        sx={{ p: 4, maxWidth: 900, margin: '0 auto', backgroundColor: '#fff', borderRadius: 3 }}
      >
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#222' }}>
          Add New Lender
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Grid container spacing={2}>
          {[
            { name: 'lenderName', label: 'Lender Name' },
            { name: 'state', label: 'State' },
            { name: 'city', label: 'City' },
            { name: 'managerName', label: 'Manager Name' },
            { name: 'bankerName', label: 'Banker Name' },
            { name: 'email', label: 'Email' },
            { name: 'rmName', label: 'RM Name' },
            { name: 'rmContact', label: 'RM Contact No' },
            { name: 'asmName', label: 'ASM Name' },
            { name: 'asmContact', label: 'ASM Contact No' },
            { name: 'rsmName', label: 'RSM Name' },
            { name: 'rsmContact', label: 'RSM Contact No' },
            { name: 'zsmName', label: 'ZSM Name' }
          ].map((field) => (
            <Grid item xs={12} sm={6} key={field.name}>
              <TextField
                fullWidth
                label={field.label}
                name={field.name}
                value={form[field.name as keyof typeof form]}
                onChange={handleChange}
                variant="outlined"
                sx={commonTextFieldStyles}
                inputProps={{ style: { color: '#333' } }}
              />
            </Grid>
          ))}

          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              fullWidth
              sx={{
                mt: 1,
                backgroundColor: 'primary.main',
                color: '#fff',
                '&:hover': { backgroundColor: '#1565c0' }
              }}
            >
              Submit
            </Button>
          </Grid>
        </Grid>

        <Snackbar
          open={successOpen}
          autoHideDuration={3000}
          onClose={() => setSuccessOpen(false)}
          message="Lender added successfully!"
        />
      </Paper>
   
  );
};

export default LenderForm;