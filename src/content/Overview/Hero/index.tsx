'use client';

import React from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  styled
} from '@mui/material';
import { motion } from 'framer-motion';

// --- Styled Components ---

const TypographyH1 = styled(Typography)(({ theme }) => ({
  fontSize: '3.8rem',
  fontWeight: 800,
  lineHeight: 1.2,
  color: '#0f172a',
  [theme.breakpoints.down('md')]: {
    fontSize: '2.5rem',
    textAlign: 'center'
  }
}));

const TypographyH2 = styled(Typography)(({ theme }) => ({
  fontSize: '1.3rem',
  color: '#475569',
  maxWidth: '38rem',
  fontWeight: 400,
  [theme.breakpoints.down('md')]: {
    textAlign: 'center',
    margin: '0 auto'
  }
}));

const GlowButton = styled(Button)(({ theme }) => ({
  padding: `${theme.spacing(1.4)} ${theme.spacing(5)}`,
  borderRadius: 50,
  fontWeight: 600,
  fontSize: '1rem',
  textTransform: 'none',
  background: 'linear-gradient(to right, #3b82f6, #06b6d4)',
  color: '#fff',
  transition: 'all 0.4s ease',
  boxShadow: '0 8px 20px rgba(59,130,246,0.25)',
  '&:hover': {
    background: 'linear-gradient(to right, #06b6d4, #3b82f6)',
    boxShadow: '0 8px 25px rgba(6,182,212,0.3)'
  }
}));

const OutlineButton = styled(Button)(({ theme }) => ({
  padding: `${theme.spacing(1.4)} ${theme.spacing(5)}`,
  borderRadius: 50,
  fontWeight: 600,
  fontSize: '1rem',
  textTransform: 'none',
  color: theme.palette.success.main,
  border: `2px solid ${theme.palette.success.main}`,
  backgroundColor: '#fff',
  '&:hover': {
    backgroundColor: theme.palette.success.light,
    color: '#fff',
    borderColor: theme.palette.success.dark
  }
}));

const FloatingCircle = styled(motion.div)(({ theme }) => ({
  width: 32,
  height: 32,
  borderRadius: '50%',
  border: `4px solid ${theme.palette.primary.light}`,
  borderTop: `4px solid ${theme.palette.primary.dark}`,
  marginBottom: theme.spacing(1)
}));

// --- Component ---

const HeroBanner = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)',
        py: { xs: 6, md: 8 },
        minHeight: '100vh'
      }}
    >
      {/* Floating Background Circle */}
      <motion.div
        style={{
          position: 'absolute',
          top: '15%',
          left: '8%',
          width: 80,
          height: 80,
          borderRadius: '50%',
          backgroundColor: '#dbeafe',
          zIndex: 0
        }}
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <Container sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={6} alignItems="center">
          {/* Left Content */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <FloatingCircle
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
              />

              <TypographyH1>
                Your Gateway to India’s Banking Network
              </TypographyH1>
              <TypographyH2 sx={{ mt: 3 }}>
                Discover a powerful, verified directory of professionals including bankers, NBFC partners, and financial experts.
              </TypographyH2>

              <Box
                display="flex"
                flexWrap="wrap"
                gap={2}
                mt={5}
                justifyContent={{ xs: 'center', md: 'flex-start' }}
              >
                <GlowButton href="/login">Login</GlowButton>
                <OutlineButton href="/onlineform/form-online">
                  Public Directory Form
                </OutlineButton>
              </Box>
            </motion.div>
          </Grid>

          {/* Right Image */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2 }}
            >
              <Box
                sx={{
                  width: '100%',
                  height: { xs: 300, md: 450 },
                  borderRadius: 6,
                  overflow: 'hidden',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.12)'
                }}
              >
                <img
                  src="https://directorist.com/blog/wp-content/uploads/sites/6/2022/03/How-to-Create-a-Directory-Website-in-WordPress-970x588.jpg"
                  alt="Banking Directory"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroBanner;
