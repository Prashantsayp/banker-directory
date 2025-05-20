import React, { useState } from 'react';
import {
  Box, TextField, Button, Grid, Typography, Alert, Snackbar, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

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

  const [error, setError] = useState('');
  const [successOpen, setSuccessOpen] = useState(false);

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
    emailOfficial: form.emailOfficial.trim() === '' ? undefined : form.emailOfficial.trim(),
    emailPersonal: form.emailPersonal.trim() === '' ? undefined : form.emailPersonal.trim(),
  };

  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/banker-directory/create-directories`,
      payload
    );
    setSuccessOpen(true);
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
    setError(Array.isArray(message) ? message.join(', ') : message);
  }
};



  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Create Banker Directory Entry
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={2}>
        {/* Banker Name */}
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Banker Name" name="bankerName" value={form.bankerName} onChange={handleChange} />
        </Grid>

        {/* Associated With */}
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Associated With" name="associatedWith" value={form.associatedWith} onChange={handleChange} />
        </Grid>

        {/* Location Categories */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>Location Serve</Typography>
          {form.locationCategories.map((cat, idx) => (
            <Grid container spacing={2} key={idx} alignItems="center">
              <Grid item xs={10}>
                <TextField fullWidth label={`Category ${idx + 1}`} value={cat} onChange={e => handleLocationChange(idx, e.target.value)} />
              </Grid>
              <Grid item xs={2}>
                {form.locationCategories.length > 1 && (
                  <IconButton onClick={() => removeLocationCategory(idx)}>
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

        {/* Official Email */}
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Official Email" name="emailOfficial" value={form.emailOfficial} onChange={handleChange} />
        </Grid>

        {/* Personal Email */}
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Personal Email" name="emailPersonal" value={form.emailPersonal} onChange={handleChange} />
        </Grid>

        {/* Contact */}
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Contact" name="contact" value={form.contact} onChange={handleChange} />
        </Grid>

        {/* Last/Current Designation */}
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Last/Current Designation" name="lastCurrentDesignation" value={form.lastCurrentDesignation} onChange={handleChange} />
        </Grid>

        {/* Product Categories */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>Product Categories</Typography>
          {form.product.map((item, idx) => (
            <Grid container spacing={2} key={idx} alignItems="center">
              <Grid item xs={10}>
                <TextField fullWidth label={`Product ${idx + 1}`} value={item} onChange={e => handleProductChange(idx, e.target.value)} />
              </Grid>
              <Grid item xs={2}>
                {form.product.length > 1 && (
                  <IconButton onClick={() => removeProduct(idx)}>
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

        {/* Submit */}
        <Grid item xs={12}>
          <Button variant="contained" onClick={handleSubmit}>Submit</Button>
        </Grid>
      </Grid>

      <Snackbar
        open={successOpen}
        autoHideDuration={3000}
        onClose={() => setSuccessOpen(false)}
        message="Banker Directory created successfully!"
      />
    </Box>
  );
};

export default BankerDirectoryForm;