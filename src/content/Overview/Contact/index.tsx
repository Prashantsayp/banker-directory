'use client';

import React from 'react';
import {
  alpha,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  styled
} from '@mui/material';

const Section = styled(Box)(({ theme }) => ({
  position: 'relative',
  backgroundColor: '#ffffff',
  paddingTop: theme.spacing(12),
  paddingBottom: theme.spacing(14),
}));

const Title = styled(Typography)({
  textAlign: 'center',
  fontWeight: 900,
  fontSize: '2.4rem',
  color: '#0f172a',
});

const Sub = styled(Typography)({
  textAlign: 'center',
  color: '#64748b',
  maxWidth: 820,
  margin: '10px auto 28px',
});

const Card = styled(Paper)(({ theme }) => ({
  margin: '0 auto',
  maxWidth: 860,
  borderRadius: 16,
  padding: theme.spacing(5),
  backgroundColor: '#f9fafb',
  boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
}));

const Input = styled(TextField)(({ }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 10,
    background: '#fff',
    '& fieldset': {
      borderColor: alpha('#0f172a', 0.15),
    },
    '&:hover fieldset': {
      borderColor: alpha('#2563eb', 0.4),
    },
    '&.Mui-focused fieldset': {
      borderColor: '#2563eb',
      borderWidth: 1.5,
    },
  },
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
    background: 'linear-gradient(90deg,#4f46e5,#6366f1)',
  },
}));

const ContactSection: React.FC = () => {
  return (
    <Section id="contact"> 
      <Container>
        <Title>Let's Stay Connected</Title>
        <Sub>
List your profile, request bulk access, or integrate our API. Share a few details below— we usually reply within 24 hours.
        </Sub>

        <Card>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Input fullWidth label="Enter your name" />
            </Grid>
            <Grid item xs={12} md={6}>
              <Input fullWidth label="Company (optional)" />
            </Grid>
            <Grid item xs={12} md={6}>
              <Input fullWidth label="Enter your email" />
            </Grid>
            <Grid item xs={12} md={6}>
              <Input fullWidth label="Enter your phone number" />
            </Grid>
            <Grid item xs={12}>
              <Input
                fullWidth
                label="Tell us about yourself"
                multiline
                minRows={4}
              />
            </Grid>
          </Grid>

          <Typography
            sx={{
              fontSize: 13,
              textAlign: 'center',
              mt: 3,
              color: '#64748b',
            }}
          >
            By clicking contact us button, you agree our terms and policy.
          </Typography>

          <Box display="flex" justifyContent="center">
            <SubmitBtn>Contact Us</SubmitBtn>
          </Box>
        </Card>
      </Container>
    </Section>
  );
};

export default ContactSection;
