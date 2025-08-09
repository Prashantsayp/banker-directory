import React, { useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  Typography,
  Alert,
  Paper,
  Box,
  useTheme,
  useMediaQuery,
  InputAdornment,
  Autocomplete,
  Chip,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import axios from 'axios';
import CustomSnackbar from '../../src/components/CustomSnackbar';

const BankerDirectoryPublicForm = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [form, setForm] = useState({
    bankerName: '',
    associatedWith: '',
    locationCategories: [],
    emailOfficial: '',
    emailPersonal: '',
    contact: '',
    lastCurrentDesignation: '',
    product: [],
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  const [error, setError] = useState('');

  const locationOptions = [
    'Delhi', 'Mumbai', 'Bangalore', 'Pune', 'Hyderabad',
    'Chandigarh', 'Chennai', 'Lucknow', 'Ahmedabad', 'Kolkata',
  ];

  const productOptions = [
    'Home Loan', 'Business Loan', 'Personal Loan', 'Credit Card',
    'Loan Against Property', 'Car Loan'
  ];

  const brandPrimary = '#2f2c6f';
  const brandAccent = '#1976d2';

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const commonTextFieldStyles = {
    '& .MuiOutlinedInput-root': {
      color: brandPrimary,
      '& fieldset': { borderColor: '#bbdefb' },
      '&:hover fieldset': { borderColor: '#64b5f6' },
      '&.Mui-focused fieldset': {
        borderColor: brandAccent,
        boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.1)',
      },
    },
    '& .MuiInputLabel-root': { color: '#1565c0' },
    '& .MuiInputLabel-root.Mui-focused': { color: brandAccent },
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setError('');
    const payload = {
      ...form,
      emailOfficial: form.emailOfficial.trim() || undefined,
      emailPersonal: form.emailPersonal.trim() || undefined,
    };

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/banker-directory/request-directory`, payload);
      showSnackbar('Your submission was received and is pending admin approval.', 'success');
      setForm({
        bankerName: '',
        associatedWith: '',
        locationCategories: [],
        emailOfficial: '',
        emailPersonal: '',
        contact: '',
        lastCurrentDesignation: '',
        product: [],
      });
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Something went wrong';
      showSnackbar(Array.isArray(message) ? message.join(', ') : message, 'error');
    }
  };

  return (
    <Box
      sx={{
        py: 6,
        px: 2,
        minHeight: '100vh',
        background: `linear-gradient(to right, #e3f2fd, #e3f2fd)`,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          px: isMobile ? 3 : 6,
          py: isMobile ? 4 : 6,
          maxWidth: '1000px',
          mx: 'auto',
          borderRadius: 4,
          background: '#ffffff',
          boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: brandAccent,
            textAlign: 'center',
            mb: 1,
          }}
        >
         Banker Directory Entry
        </Typography>

        <Typography
          variant="body1"
          sx={{ mb: 4, color: '#555', textAlign: 'center' }}
        >
          Fill the form to share details. Our team will verify and publish soon.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Banker Name"
              name="bankerName"
              value={form.bankerName}
              onChange={handleChange}
              variant="outlined"
              sx={commonTextFieldStyles}
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
            />
          </Grid>

          <Grid item xs={12}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, color: brandPrimary, mb: 1 }}
            >
              Locations Served
            </Typography>
          <Autocomplete
  multiple
  freeSolo
  options={locationOptions}
  value={form.locationCategories}
  onChange={(_event, newValue) =>
    
    setForm((prev) => ({ ...prev, locationCategories: newValue }))
  }
  renderTags={(value, getTagProps) =>
    value.map((option, index) => (
      <Chip
        key={option}
        variant="outlined"
        label={option}
        {...getTagProps({ index })}
        sx={{
          backgroundColor: '#f6f8fc',
          borderColor: '#1976d2',
          color: '#2f2c6f',
        }}
      />
    ))
  }
  renderInput={(params) => (
    <TextField
      {...params}
      variant="outlined"
      label="Add Locations"
      placeholder="Type and press enter"
      sx={commonTextFieldStyles}
    />
  )}
  PaperComponent={(props) => (
    <Paper
      {...props}
      sx={{
        backgroundColor: '#ffffff',
        color: '#2f2c6f',
        borderRadius: 2,
        boxShadow: '0px 6px 12px rgba(0,0,0,0.1)',
      }}
    />
  )}

/>

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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: brandAccent }} />
                  </InputAdornment>
                ),
              }}
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: brandAccent }} />
                  </InputAdornment>
                ),
              }}
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon sx={{ color: brandAccent }} />
                  </InputAdornment>
                ),
              }}
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <WorkOutlineIcon sx={{ color: brandAccent }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, color: brandPrimary, mb: 1 }}
            >
              Product Categories
            </Typography>
          <Autocomplete
  multiple
  freeSolo
  options={productOptions}
  value={form.product}
  onChange={(_event, newValue) =>
    setForm((prev) => ({ ...prev, product: newValue }))
  }
  renderTags={(value, getTagProps) =>
    value.map((option, index) => (
      <Chip
        key={option}
        variant="outlined"
        label={option}
        {...getTagProps({ index })}
        sx={{
          backgroundColor: '#f6f8fc',
          borderColor: '#1976d2',
          color: '#2f2c6f',
        }}
      />
    ))
  }
  renderInput={(params) => (
    <TextField
      {...params}
      variant="outlined"
      label="Add Products"
      placeholder="Type and press enter"
      sx={commonTextFieldStyles}
    />
  )}
  PaperComponent={(props) => (
    <Paper
      {...props}
      sx={{
        backgroundColor: '#ffffff',   // dropdown background
        color: '#2f2c6f',              // dropdown text
        borderRadius: 2,
        boxShadow: '0px 6px 12px rgba(0,0,0,0.1)',
      }}
    />
  )}
/>

          </Grid>
        </Grid>

        <Button
          variant="contained"
          onClick={handleSubmit}
          fullWidth
          sx={{
            mt: 5,
            fontWeight: 600,
            py: 1.3,
            fontSize: '1rem',
            backgroundColor: brandAccent,
            '&:hover': { backgroundColor: '#115293' },
            borderRadius: 2,
            boxShadow: '0px 6px 12px rgba(25, 118, 210, 0.2)',
          }}
        >
          Submit for Review
        </Button>

        <CustomSnackbar
          open={snackbarOpen}
          message={snackbarMessage}
          severity={snackbarSeverity}
          onClose={() => setSnackbarOpen(false)} l={undefined}        />
      </Paper>
    </Box>
  );
};

export default BankerDirectoryPublicForm;
