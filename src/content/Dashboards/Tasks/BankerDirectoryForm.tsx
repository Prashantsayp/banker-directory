'use client';

import React, { useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  Divider,
  Alert,
  Snackbar,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import axios from 'axios';

interface DirectoryFormProps {
  onSuccess: () => void;
}

const DirectoryForm: React.FC<DirectoryFormProps> = ({ onSuccess }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [form, setForm] = useState({
    bankerName: '',
    associatedWith: '',
    state: '',
    cityInput: '',            // user types city text yaha
    cityList: [] as string[], // chips / multi city
    emailOfficial: '',
    emailPersonal: '',
    contact: '',
    productInput: '',
    productList: [] as string[],
    lastCurrentDesignation: ''
  });

  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  /* ---------- Basic Handlers ---------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Helper: string ko list me convert
  const parseCommaList = (value: string) =>
    value
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);

  /* ---------- CITY: manual multi city (chips) ---------- */
  const addCityFromInput = () => {
    if (!form.cityInput.trim()) return;

    const parts = parseCommaList(form.cityInput);
    if (!parts.length) return;

    setForm((prev) => ({
      ...prev,
      cityList: Array.from(new Set([...prev.cityList, ...parts])),
      cityInput: ''
    }));
  };

  // Desktop blur use karega
  const handleCityBlur = () => {
    addCityFromInput();
  };

  const handleRemoveCity = (label: string) => {
    setForm((prev) => ({
      ...prev,
      cityList: prev.cityList.filter((c) => c !== label)
    }));
  };

  /* ---------- PRODUCTS: manual multi product (chips) ---------- */
  const addProductFromInput = () => {
    if (!form.productInput.trim()) return;

    const parts = parseCommaList(form.productInput);
    if (!parts.length) return;

    setForm((prev) => ({
      ...prev,
      productList: Array.from(new Set([...prev.productList, ...parts])),
      productInput: ''
    }));
  };

  const handleProductBlur = () => {
    addProductFromInput();
  };

  const handleRemoveProduct = (label: string) => {
    setForm((prev) => ({
      ...prev,
      productList: prev.productList.filter((p) => p !== label)
    }));
  };

  /* ---------- Validation ---------- */
  const validate = () => {
    if (!form.bankerName.trim()) return 'Banker Name is required.';
    if (!form.associatedWith.trim()) return 'Associated With is required.';
    if (!form.state.trim()) return 'State is required.';

    const finalCityList =
      form.cityList.length > 0
        ? form.cityList
        : parseCommaList(form.cityInput);

    if (!finalCityList.length) return 'At least one City is required.';
    if (!form.emailOfficial.trim()) return 'Official Email is required.';

    return '';
  };

  /* ---------- Submit ---------- */
  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');

    const finalCityList =
      form.cityList.length > 0 ? form.cityList : parseCommaList(form.cityInput);

    const finalProductList =
      form.productList.length > 0
        ? form.productList
        : parseCommaList(form.productInput);

    const payload: any = {
      bankerName: form.bankerName.trim(),
      associatedWith: form.associatedWith.trim(),
      state: form.state.trim(),               // ✅ string
      city: finalCityList.join(', '),         // ✅ single string
      emailOfficial: form.emailOfficial.trim(),
      emailPersonal: form.emailPersonal.trim() || undefined,
      contact: form.contact.trim(),
      product: finalProductList
      // lastCurrentDesignation: form.lastCurrentDesignation.trim() || undefined
      // 👉 DTO me add kar doge to upar line uncomment kar sakte ho
    };

    try {
      setLoading(true);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/banker-directory/create-directories`,
        payload
      );

      console.log('Banker directory created:', res.data);

      // 👉 Pehle snackbar dikhao
      setSuccessOpen(true);

      // form reset
      setForm({
        bankerName: '',
        associatedWith: '',
        state: '',
        cityInput: '',
        cityList: [],
        emailOfficial: '',
        emailPersonal: '',
        contact: '',
        productInput: '',
        productList: [],
        lastCurrentDesignation: ''
      });
    } catch (err: any) {
      console.error('Create banker directory failed:', err);
      const message =
        err?.response?.data?.message ||
        'Something went wrong while creating banker.';
      setError(Array.isArray(message) ? message.join(', ') : message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- UI Styles ---------- */
  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#E5E7EB',
        borderRadius: 10
      },
      '&:hover fieldset': {
        borderColor: '#CBD5E1'
      },
      '&.Mui-focused fieldset': {
        borderColor: '#2563EB',
        boxShadow: '0 0 0 2px rgba(37,99,235,0.15)'
      }
    },
    '& .MuiInputLabel-root': {
      color: '#6B7280'
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#2563EB'
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        maxWidth: 900,
        margin: '0 auto',
        background: 'linear-gradient(145deg, #ffffff 0%, #f9fafb 100%)',
        borderRadius: 4,
        border: '1px solid #E5E7EB'
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Box>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: 700, color: '#111827' }}
          >
            Add Banker Entry
          </Typography>
          <Typography variant="body2" sx={{ color: '#6B7280' }}>
            This will create a new record in <b>Banker Directory</b>.
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2.5}>
        {/* Banker Name */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Banker Name"
            name="bankerName"
            value={form.bankerName}
            onChange={handleChange}
            sx={textFieldStyles}
          />
        </Grid>

        {/* Associated With */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Associated With (Bank / NBFC / Channel)"
            name="associatedWith"
            value={form.associatedWith}
            onChange={handleChange}
            sx={textFieldStyles}
          />
        </Grid>

        {/* State */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="State"
            name="state"
            value={form.state}
            onChange={handleChange}
            sx={textFieldStyles}
          />
        </Grid>

        {/* Cities */}
        <Grid item xs={12} sm={6}>
          {isMobile ? (
            <>
              <Box display="flex" gap={1}>
                <TextField
                  fullWidth
                  label="City / Cities"
                  name="cityInput"
                  placeholder="e.g. Delhi, Noida"
                  value={form.cityInput}
                  onChange={handleChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCityFromInput();
                    }
                  }}
                  sx={textFieldStyles}
                />
                <Button
                  variant="contained"
                  onClick={addCityFromInput}
                  sx={{ borderRadius: 999, whiteSpace: 'nowrap' }}
                >
                  Add
                </Button>
              </Box>
            </>
          ) : (
            <TextField
              fullWidth
              label="City / Cities"
              name="cityInput"
              placeholder="Type city and press Enter or comma (e.g. Delhi, Noida)"
              value={form.cityInput}
              onChange={handleChange}
              onBlur={handleCityBlur}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleCityBlur();
                }
              }}
              sx={textFieldStyles}
            />
          )}

          <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
            {form.cityList.map((c) => (
              <Chip
                key={c}
                label={c}
                onDelete={() => handleRemoveCity(c)}
                size="small"
                sx={{
                  bgcolor: '#EFF6FF',
                  color: '#1D4ED8',
                  borderColor: '#BFDBFE'
                }}
                variant="outlined"
              />
            ))}
          </Box>
          <Typography
            variant="caption"
            sx={{ color: '#9CA3AF', display: 'block', mt: 0.5 }}
          >
            You can add multiple cities.
          </Typography>
        </Grid>

        {/* Official Email */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Official Email"
            name="emailOfficial"
            value={form.emailOfficial}
            onChange={handleChange}
            sx={textFieldStyles}
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
            sx={textFieldStyles}
          />
        </Grid>

        {/* Contact */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Contact Number"
            name="contact"
            value={form.contact}
            onChange={handleChange}
            sx={textFieldStyles}
          />
        </Grid>

        {/* Designation */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Last / Current Designation (optional)"
            name="lastCurrentDesignation"
            value={form.lastCurrentDesignation}
            onChange={handleChange}
            sx={textFieldStyles}
          />
        </Grid>

        {/* Products */}
        <Grid item xs={12}>
          <Typography
            variant="subtitle2"
            sx={{ mb: 0.5, color: '#374151', fontWeight: 600 }}
          >
            Products Handled
          </Typography>

          {isMobile ? (
            <Box display="flex" gap={1}>
              <TextField
                fullWidth
                placeholder="e.g. Home Loan, LAP, OD"
                name="productInput"
                value={form.productInput}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addProductFromInput();
                  }
                }}
                sx={textFieldStyles}
              />
              <Button
                variant="contained"
                onClick={addProductFromInput}
                sx={{ borderRadius: 999, whiteSpace: 'nowrap' }}
              >
                Add
              </Button>
            </Box>
          ) : (
            <TextField
              fullWidth
              placeholder="Type product and press Enter or comma (e.g. Home Loan, LAP, OD)..."
              name="productInput"
              value={form.productInput}
              onChange={handleChange}
              onBlur={handleProductBlur}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleProductBlur();
                }
              }}
              sx={textFieldStyles}
            />
          )}

          <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
            {form.productList.map((p) => (
              <Chip
                key={p}
                label={p}
                onDelete={() => handleRemoveProduct(p)}
                size="small"
                sx={{
                  bgcolor: '#ECFDF5',
                  color: '#047857',
                  borderColor: '#A7F3D0'
                }}
                variant="outlined"
              />
            ))}
          </Box>
        </Grid>

        {/* Submit */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end" mt={1}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                minWidth: 160,
                borderRadius: 999,
                textTransform: 'none',
                fontWeight: 700,
                background:
                  'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                '&:hover': {
                  background:
                    'linear-gradient(135deg, #16A34A 0%, #15803D 100%)'
                }
              }}
            >
              {loading ? 'Saving…' : 'Save Banker'}
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* ✅ Snackbar & onSuccess yahi pe */}
      <Snackbar
        open={successOpen}
        autoHideDuration={3000}
        onClose={(_, reason) => {
          if (reason === 'clickaway') return;
          setSuccessOpen(false);
          onSuccess();
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => {
            setSuccessOpen(false);
            onSuccess();
          }}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Banker added to directory!
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default DirectoryForm;
