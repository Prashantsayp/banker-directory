import React, { useState } from 'react';
import {
   TextField, Button, Grid, Typography, Alert, IconButton, Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import CustomSnackbar from '@/components/CustomSnackbar';

const BankerDirectoryForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [form, setForm] = useState({
    bankerName: '',
    associatedWith: '',
    locationCategories: [''],
    emailOfficial: '',
    emailPersonal: '',
    contact: '',
    lastCurrentDesignation: '',
    product: [''],
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  const [error, setError] = useState('');

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (index: number, value: string) => {
    const updated = [...form.locationCategories];
    updated[index] = value;
    setForm({ ...form, locationCategories: updated });
  };

  const addLocationCategory = () => {
    setForm(prev => ({
      ...prev,
      locationCategories: [...prev.locationCategories, ''],
    }));
  };

  const removeLocationCategory = (index: number) => {
    const updated = form.locationCategories.filter((_, i) => i !== index);
    setForm({ ...form, locationCategories: updated });
  };

  const handleProductChange = (index: number, value: string) => {
    const updated = [...form.product];
    updated[index] = value;
    setForm({ ...form, product: updated });
  };

  const addProduct = () => {
    setForm(prev => ({
      ...prev,
      product: [...prev.product, ''],
    }));
  };

  const removeProduct = (index: number) => {
    const updated = form.product.filter((_, i) => i !== index);
    setForm({ ...form, product: updated });
  };

  const handleSubmit = async () => {
    setError('');
    const payload = {
      ...form,
      emailOfficial: form.emailOfficial.trim() || undefined,
      emailPersonal: form.emailPersonal.trim() || undefined,
    };

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/banker-directory/create-directories`,
        payload
      );
      showSnackbar('Banker Directory created successfully!', 'success');
      setForm({
        bankerName: '',
        associatedWith: '',
        locationCategories: [''],
        emailOfficial: '',
        emailPersonal: '',
        contact: '',
        lastCurrentDesignation: '',
        product: [''],
      });
      onSuccess();
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Something went wrong';
      showSnackbar(Array.isArray(message) ? message.join(', ') : message, 'error');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 900, margin: '0 auto', backgroundColor:'#fff', borderRadius: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#222' }}>
        Create Banker Directory Entry
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Banker Name"
            name="bankerName"
            value={form.bankerName}
            onChange={handleChange}
            variant="outlined"
            sx={commonTextFieldStyles}
            inputProps={{ style: { color: '#333' } }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Associated With"
            name="associatedWith"
            value={form.associatedWith}
            onChange={handleChange}
            variant="outlined"
            sx={commonTextFieldStyles}
            inputProps={{ style: { color: '#333' } }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500, color: '#333' }}>
            Location Serve
          </Typography>
          {form.locationCategories.map((cat, idx) => (
            <Grid container spacing={2} key={idx} alignItems="center">
              <Grid item xs={10}>
                <TextField
                  fullWidth
                  label={`Location ${idx + 1}`}
                  value={cat}
                  onChange={e => handleLocationChange(idx, e.target.value)}
                  variant="outlined"
                  sx={commonTextFieldStyles}
                  inputProps={{ style: { color: '#333' } }}
                />
              </Grid>
              <Grid item xs={2}>
                {form.locationCategories.length > 1 && (
                  <IconButton onClick={() => removeLocationCategory(idx)} aria-label="delete">
                    <DeleteIcon color="error" />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          ))}
          <Button variant="outlined" onClick={addLocationCategory} sx={{ mt: 1 }}>
            + Add Location
          </Button>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Official Email"
            name="emailOfficial"
            value={form.emailOfficial}
            onChange={handleChange}
            variant="outlined"
            sx={commonTextFieldStyles}
            inputProps={{ style: { color: '#333' } }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Personal Email"
            name="emailPersonal"
            value={form.emailPersonal}
            onChange={handleChange}
            variant="outlined"
            sx={commonTextFieldStyles}
            inputProps={{ style: { color: '#333' } }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Contact"
            name="contact"
            value={form.contact}
            onChange={handleChange}
            variant="outlined"
            sx={commonTextFieldStyles}
            inputProps={{ style: { color: '#333' } }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Last/Current Designation"
            name="lastCurrentDesignation"
            value={form.lastCurrentDesignation}
            onChange={handleChange}
            variant="outlined"
            sx={commonTextFieldStyles}
            inputProps={{ style: { color: '#333' } }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500, color: '#333' }}>
            Product Categories
          </Typography>
          {form.product.map((item, idx) => (
            <Grid container spacing={2} key={idx} alignItems="center">
              <Grid item xs={10}>
                <TextField
                  fullWidth
                  label={`Product ${idx + 1}`}
                  value={item}
                  onChange={e => handleProductChange(idx, e.target.value)}
                  variant="outlined"
                  sx={commonTextFieldStyles}
                  inputProps={{ style: { color: '#333' } }}
                />
              </Grid>
              <Grid item xs={2}>
                {form.product.length > 1 && (
                  <IconButton onClick={() => removeProduct(idx)} aria-label="delete">
                    <DeleteIcon color="error" />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          ))}
          <Button variant="outlined" onClick={addProduct} sx={{ mt: 1 }}>
            + Add Product
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: 'primary.main',
              color: '#fff',
              '&:hover': { backgroundColor: '#1565c0' }
            }}
          >
            Submit
          </Button>
        </Grid>
      </Grid>

      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setSnackbarOpen(false)} l={undefined}      />
    </Paper>
  );
};

export default BankerDirectoryForm;
