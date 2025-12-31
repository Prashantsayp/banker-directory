'use client';

import React, { useState } from 'react';
import {
  alpha,
  Alert,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  styled
} from '@mui/material';
import axios from 'axios';

const Section = styled(Box)(({ theme }) => ({
  position: 'relative',
  backgroundColor: '#ffffff',
  paddingTop: theme.spacing(12),
  paddingBottom: theme.spacing(14)
}));

const Title = styled(Typography)({
  textAlign: 'center',
  fontWeight: 900,
  fontSize: '2.4rem',
  color: '#0f172a'
});

const Sub = styled(Typography)({
  textAlign: 'center',
  color: '#64748b',
  maxWidth: 820,
  margin: '10px auto 28px'
});

const Card = styled(Paper)(({ theme }) => ({
  margin: '0 auto',
  maxWidth: 860,
  borderRadius: 16,
  padding: theme.spacing(5),
  backgroundColor: '#f9fafb',
  boxShadow: '0 8px 30px rgba(0,0,0,0.04)'
}));

const Input = styled(TextField)(() => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 10,
    background: '#fff',
    '& fieldset': {
      borderColor: alpha('#0f172a', 0.15)
    },
    '&:hover fieldset': {
      borderColor: alpha('#2563eb', 0.4)
    },
    '&.Mui-focused fieldset': {
      borderColor: '#2563eb',
      borderWidth: 1.5
    }
  }
}));

const SubmitBtn = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  borderRadius: 10,
  padding: `${theme.spacing(1.6)} ${theme.spacing(4)}`,
  fontWeight: 700,
  textTransform: 'none',
  background: 'linear-gradient(90deg,#6366f1,#4f46e5)',
  color: '#fff',
  '&:hover': {
    background: 'linear-gradient(90deg,#4f46e5,#6366f1)'
  }
}));

type FormState = {
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialForm: FormState = {
  name: '',
  company: '',
  email: '',
  phone: '',
  message: ''
};

const ContactSection: React.FC = () => {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Enter a valid email';
    }

    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (form.phone.replace(/\D/g, '').length < 8) {
      newErrors.phone = 'Enter a valid phone number';
    }

    if (!form.message.trim() || form.message.trim().length < 10) {
      newErrors.message = 'Please add a short description (min 10 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setSuccessMsg('');
    setErrorMsg('');

    if (!validate()) return;

    try {
      setLoading(true);

      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/contact/create-contact`,
        {
          name: form.name,
          company: form.company || undefined,
          email: form.email,
          phone: form.phone,
          message: form.message,
          source: 'landing_contact_section'
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      setSuccessMsg('Thank you! We have received your details.');
      setForm(initialForm);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err?.response?.data?.message ||
          'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section id="contact">
      <Container>
        <Title>Let's Stay Connected</Title>
        <Sub>
          List your profile, request bulk access, or integrate our API. Share a
          few details below — we usually reply within 24 hours.
        </Sub>

        <Card>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Input
                fullWidth
                label="Enter your name"
                value={form.name}
                onChange={handleChange('name')}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Input
                fullWidth
                label="Company (optional)"
                value={form.company}
                onChange={handleChange('company')}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Input
                fullWidth
                label="Enter your email"
                value={form.email}
                onChange={handleChange('email')}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Input
                fullWidth
                label="Enter your phone number"
                value={form.phone}
                onChange={handleChange('phone')}
                error={!!errors.phone}
                helperText={errors.phone}
              />
            </Grid>

            <Grid item xs={12}>
              <Input
                fullWidth
                label="Tell us about yourself"
                multiline
                minRows={4}
                value={form.message}
                onChange={handleChange('message')}
                error={!!errors.message}
                helperText={errors.message}
              />
            </Grid>
          </Grid>

          <Typography
            sx={{
              fontSize: 13,
              textAlign: 'center',
              mt: 3,
              color: '#64748b'
            }}
          >
            By clicking contact us button, you agree to our terms and policy.
          </Typography>

          {/* messages */}
          <Box mt={2}>
     {successMsg && (
  <Alert
    severity="success"
    icon={false}
    sx={{
      mb: 1,
      background: 'transparent',
      boxShadow: 'none',
      padding: 0,
      fontWeight: 600,
      color: '#16a34a', // green text only
    }}
  >
    {successMsg}
  </Alert>
)}

            {errorMsg && (
              <Alert severity="error" sx={{ mb: 1 }}>
                {errorMsg}
              </Alert>
            )}
          </Box>

          <Box display="flex" justifyContent="center">
            <SubmitBtn onClick={handleSubmit} disabled={loading}>
              {loading ? 'Sending…' : 'Contact Us'}
            </SubmitBtn>
          </Box>
        </Card>
      </Container>
    </Section>
  );
};

export default ContactSection;
