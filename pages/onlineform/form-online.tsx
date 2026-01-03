'use client';

import React, { useState, KeyboardEvent } from 'react';
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
  Chip
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import axios from 'axios';
import CustomSnackbar from '../../src/components/CustomSnackbar';
import Navbar from '@/content/Overview/Navbar/navbar1';
import MinimalFooter from '@/content/Overview/Footer/footer';

const BankerDirectoryPublicForm = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [form, setForm] = useState({
    bankerName: '',
    associatedWith: '',
    state: [] as string[],
    city: [] as string[],
    emailOfficial: '',
    emailPersonal: '',
    contact: '',
    lastCurrentDesignation: '',
    product: [] as string[]
  });

  // Inputs for mobile Add buttons
  const [stateInput, setStateInput] = useState('');
  const [cityInput, setCityInput] = useState('');
  const [productInput, setProductInput] = useState('');

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    'success' | 'error' | 'info' | 'warning'
  >('success');

  const [error, setError] = useState('');

  const stateOptions = [
    // 🇮🇳 States
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',

    // 🟣 Union Territories
    'Andaman and Nicobar Islands',
    'Chandigarh',
    'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi',
    'Jammu and Kashmir',
    'Ladakh',
    'Lakshadweep',
    'Puducherry'
  ];

  const cityOptions = [
    'Delhi',
    'Mumbai',
    'Bangalore',
    'Pune',
    'Noida',
    'Gurugram',
    'Chandigarh',
    'Lucknow',
    'Ahmedabad'
  ];

  const productOptions = [
    'Home Loan',
    'Business Loan',
    'Personal Loan',
    'Credit Card',
    'Loan Against Property',
    'Car Loan'
  ];

  const brandPrimary = '#2f2c6f';
  const brandAccent = '#1976d2';

  const showSnackbar = (
    message: string,
    severity: 'success' | 'error' | 'info' | 'warning' = 'success'
  ) => {
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
        boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.1)'
      }
    },
    '& .MuiInputLabel-root': { color: '#1565c0' },
    '& .MuiInputLabel-root.Mui-focused': { color: brandAccent }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // -------- Desktop: Enter / Tab / , se add karna --------
  const shouldAdd = (e: KeyboardEvent<HTMLInputElement>) =>
    e.key === 'Enter' || e.key === 'Tab' || e.key === ',' || e.key === 'Unidentified';

  // yeh teen sirf desktop Autocomplete ke liye use honge
  const handleStateKeyDown = (e: KeyboardEvent<HTMLInputElement>, value: string[]) => {
    if (!shouldAdd(e)) return;
    const input = (e.target as HTMLInputElement).value.trim();
    if (!input) return;
    e.preventDefault();
    setForm(prev =>
      prev.state.includes(input) ? prev : { ...prev, state: [...value, input] }
    );
  };

  const handleCityKeyDown = (e: KeyboardEvent<HTMLInputElement>, value: string[]) => {
    if (!shouldAdd(e)) return;
    const input = (e.target as HTMLInputElement).value.trim();
    if (!input) return;
    e.preventDefault();
    setForm(prev =>
      prev.city.includes(input) ? prev : { ...prev, city: [...value, input] }
    );
  };

  const handleProductKeyDown = (e: KeyboardEvent<HTMLInputElement>, value: string[]) => {
    if (!shouldAdd(e)) return;
    const input = (e.target as HTMLInputElement).value.trim();
    if (!input) return;
    e.preventDefault();
    setForm(prev =>
      prev.product.includes(input)
        ? prev
        : { ...prev, product: [...value, input] }
    );
  };

  // -------- Mobile: Add button handlers --------
  const addStateMobile = () => {
    const val = stateInput.trim();
    if (!val) return;
    setForm(prev =>
      prev.state.includes(val) ? prev : { ...prev, state: [...prev.state, val] }
    );
    setStateInput('');
  };

  const addCityMobile = () => {
    const val = cityInput.trim();
    if (!val) return;
    setForm(prev =>
      prev.city.includes(val) ? prev : { ...prev, city: [...prev.city, val] }
    );
    setCityInput('');
  };

  const addProductMobile = () => {
    const val = productInput.trim();
    if (!val) return;
    setForm(prev =>
      prev.product.includes(val)
        ? prev
        : { ...prev, product: [...prev.product, val] }
    );
    setProductInput('');
  };

  // -------- Basic Validation --------
  const isFormValid = () => {
    const errors: string[] = [];

    if (!form.bankerName.trim()) {
      errors.push('Banker name is required');
    }
    if (!form.associatedWith.trim()) {
      errors.push('Associated With is required');
    }
    if (!form.contact.trim()) {
      errors.push('Contact number is required');
    }
    if (form.state.length === 0 && form.city.length === 0) {
      errors.push('Add at least one State or City');
    }
    if (form.product.length === 0) {
      errors.push('Add at least one Product category');
    }
    // 👉 Agar designation bhi required chahiye to uncomment karna:
    // if (!form.lastCurrentDesignation.trim()) {
    //   errors.push('Last / Current Designation is required');
    // }

    if (errors.length > 0) {
      setError(errors.join(' | '));
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!isFormValid()) return;

    const payload = {
      ...form,
      state: form.state.length ? form.state.join(', ') : undefined,
      city: form.city.length ? form.city.join(', ') : undefined,
      emailOfficial: form.emailOfficial.trim() || undefined,
      emailPersonal: form.emailPersonal.trim() || undefined,
      lastCurrentDesignation:
        form.lastCurrentDesignation.trim() || undefined
    };

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/banker-directory/request-directory`,
        payload
      );
      showSnackbar(
        'Your submission was received and is pending admin approval.',
        'success'
      );
      setForm({
        bankerName: '',
        associatedWith: '',
        state: [],
        city: [],
        emailOfficial: '',
        emailPersonal: '',
        contact: '',
        lastCurrentDesignation: '',
        product: []
      });
      setStateInput('');
      setCityInput('');
      setProductInput('');
    } catch (err: any) {
      const message =
        err?.response?.data?.message || 'Something went wrong, please try again.';
      showSnackbar(
        Array.isArray(message) ? message.join(', ') : message,
        'error'
      );
    }
  };

  const isSubmitDisabled =
    !form.bankerName.trim() ||
    !form.associatedWith.trim() ||
    !form.contact.trim();

  return (
    <>
      <Navbar />

      <Box
        sx={{
          py: 6,
          px: 2,
          minHeight: '100vh',
          background: 'linear-gradient(to right, #e3f2fd, #e3f2fd)',
          display: 'flex',
          flexDirection: 'column'
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
            boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.05)'
          }}
        >
          <Typography
            variant={isMobile ? 'h4' : 'h3'}
            gutterBottom
            sx={{
              fontWeight: 700,
              color: brandAccent,
              textAlign: 'center',
              mb: 1
            }}
          >
            Banker Directory Entry
          </Typography>

          <Typography
            variant="body1"
            sx={{ mb: 4, color: '#555', textAlign: 'center' }}
          >
            Fill the form to share your details. Our team will verify and
            publish soon.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Banker Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Banker Name"
                name="bankerName"
                value={form.bankerName}
                onChange={handleChange}
                variant="outlined"
                sx={commonTextFieldStyles}
              />
            </Grid>

            {/* Associated With */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Associated With (Bank / NBFC / DSA / Firm)"
                name="associatedWith"
                value={form.associatedWith}
                onChange={handleChange}
                variant="outlined"
                sx={commonTextFieldStyles}
              />
            </Grid>

            {/* States Covered */}
            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, color: brandPrimary, mb: 1 }}
              >
                States Covered
              </Typography>

              {isMobile ? (
                <>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      label="Enter State"
                      value={stateInput}
                      onChange={e => setStateInput(e.target.value)}
                      sx={commonTextFieldStyles}
                    />
                    <Button
                      variant="contained"
                      onClick={addStateMobile}
                      sx={{ whiteSpace: 'nowrap', borderRadius: 2 }}
                    >
                      Add
                    </Button>
                  </Box>

                  <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {form.state.map(s => (
                      <Chip
                        key={s}
                        label={s}
                        onDelete={() =>
                          setForm(prev => ({
                            ...prev,
                            state: prev.state.filter(x => x !== s)
                          }))
                        }
                        variant="outlined"
                        sx={{
                          backgroundColor: '#f6f8fc',
                          borderColor: '#1976d2',
                          color: '#2f2c6f'
                        }}
                      />
                    ))}
                  </Box>
                </>
              ) : (
                <Autocomplete
                  multiple
                  freeSolo
                  options={stateOptions}
                  value={form.state}
                  onChange={(_e, newValue) =>
                    setForm(prev => ({ ...prev, state: newValue as string[] }))
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
                          color: '#2f2c6f'
                        }}
                      />
                    ))
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Add States"
                      placeholder="Type & press Enter"
                      sx={commonTextFieldStyles}
                      onKeyDown={e => handleStateKeyDown(e, form.state)}
                    />
                  )}
                  PaperComponent={props => (
                    <Paper
                      {...props}
                      sx={{
                        backgroundColor: '#ffffff',
                        color: '#2f2c6f',
                        borderRadius: 2,
                        boxShadow: '0px 6px 12px rgba(0,0,0,0.1)'
                      }}
                    />
                  )}
                />
              )}
            </Grid>

            {/* Cities Covered */}
            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, color: brandPrimary, mb: 1 }}
              >
                Cities Covered
              </Typography>

              {isMobile ? (
                <>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      label="Enter City"
                      value={cityInput}
                      onChange={e => setCityInput(e.target.value)}
                      sx={commonTextFieldStyles}
                    />
                    <Button
                      variant="contained"
                      onClick={addCityMobile}
                      sx={{ whiteSpace: 'nowrap', borderRadius: 2 }}
                    >
                      Add
                    </Button>
                  </Box>

                  <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {form.city.map(c => (
                      <Chip
                        key={c}
                        label={c}
                        onDelete={() =>
                          setForm(prev => ({
                            ...prev,
                            city: prev.city.filter(x => x !== c)
                          }))
                        }
                        variant="outlined"
                        sx={{
                          backgroundColor: '#f6f8fc',
                          borderColor: '#1976d2',
                          color: '#2f2c6f'
                        }}
                      />
                    ))}
                  </Box>
                </>
              ) : (
                <Autocomplete
                  multiple
                  freeSolo
                  options={cityOptions}
                  value={form.city}
                  onChange={(_e, newValue) =>
                    setForm(prev => ({ ...prev, city: newValue as string[] }))
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
                          color: '#2f2c6f'
                        }}
                      />
                    ))
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Add Cities"
                      placeholder="Type & press Enter"
                      sx={commonTextFieldStyles}
                      onKeyDown={e => handleCityKeyDown(e, form.city)}
                    />
                  )}
                  PaperComponent={props => (
                    <Paper
                      {...props}
                      sx={{
                        backgroundColor: '#ffffff',
                        color: '#2f2c6f',
                        borderRadius: 2,
                        boxShadow: '0px 6px 12px rgba(0,0,0,0.1)'
                      }}
                    />
                  )}
                />
              )}
            </Grid>

            {/* Official Email */}
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
                  )
                }}
              />
            </Grid>

            {/* Personal Email */}
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
                  )
                }}
              />
            </Grid>

            {/* Contact */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
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
                  )
                }}
              />
            </Grid>

            {/* Last / Current Designation */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last / Current Designation"
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
                  )
                }}
              />
            </Grid>

            {/* Product Categories */}
            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, color: brandPrimary, mb: 1 }}
              >
                Product Categories
              </Typography>

              {isMobile ? (
                <>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      label="Enter Product"
                      value={productInput}
                      onChange={e => setProductInput(e.target.value)}
                      sx={commonTextFieldStyles}
                    />
                    <Button
                      variant="contained"
                      onClick={addProductMobile}
                      sx={{ whiteSpace: 'nowrap', borderRadius: 2 }}
                    >
                      Add
                    </Button>
                  </Box>

                  <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {form.product.map(p => (
                      <Chip
                        key={p}
                        label={p}
                        onDelete={() =>
                          setForm(prev => ({
                            ...prev,
                            product: prev.product.filter(x => x !== p)
                          }))
                        }
                        variant="outlined"
                        sx={{
                          backgroundColor: '#f6f8fc',
                          borderColor: '#1976d2',
                          color: '#2f2c6f'
                        }}
                      />
                    ))}
                  </Box>
                </>
              ) : (
                <Autocomplete
                  multiple
                  freeSolo
                  options={productOptions}
                  value={form.product}
                  onChange={(_e, newValue) =>
                    setForm(prev => ({
                      ...prev,
                      product: newValue as string[]
                    }))
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
                          color: '#2f2c6f'
                        }}
                      />
                    ))
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Add Products"
                      placeholder="Type & press Enter"
                      sx={commonTextFieldStyles}
                      onKeyDown={e => handleProductKeyDown(e, form.product)}
                    />
                  )}
                  PaperComponent={props => (
                    <Paper
                      {...props}
                      sx={{
                        backgroundColor: '#ffffff',
                        color: '#2f2c6f',
                        borderRadius: 2,
                        boxShadow: '0px 6px 12px rgba(0,0,0,0.1)'
                      }}
                    />
                  )}
                />
              )}
            </Grid>
          </Grid>

          {/* Submit */}
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            fullWidth
            sx={{
              mt: 5,
              fontWeight: 600,
              py: 1.3,
              fontSize: '1rem',
              backgroundColor: brandAccent,
              '&:hover': { backgroundColor: '#115293' },
              borderRadius: 2,
              boxShadow: '0px 6px 12px rgba(25, 118, 210, 0.2)'
            }}
          >
            Submit for Review
          </Button>

          <CustomSnackbar
            open={snackbarOpen}
            message={snackbarMessage}
            severity={snackbarSeverity}
            onClose={() => setSnackbarOpen(false)}
          />
        </Paper>
      </Box>

      <MinimalFooter />
    </>
  );
};

export default BankerDirectoryPublicForm;
