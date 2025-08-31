'use client';

import React from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
  styled,
  alpha
} from '@mui/material';
import { motion } from 'framer-motion';
import CoreFeatures from './Feature';
import Pricing from '../Pricing';
import FAQSection from '../FAQ';
import ContactSection from '../Contact';
import Footer from '../Footer';
import Navbar from '../Navbar';

// ===== Styled =====
const Wrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  background: 'linear-gradient(135deg, #f8fbff 0%, #f2f7ff 100%)',
  paddingTop: theme.spacing(10),
  paddingBottom: theme.spacing(12),
  [theme.breakpoints.down('md')]: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(10)
  }
}));

const H3 = styled(Typography)(({ theme }) => ({
  fontSize: '3.6rem',
  lineHeight: 1.1,
  fontWeight: 800,
  letterSpacing: -0.5,
  color: '#0f172a',
  marginTop: theme.spacing(2),
  [theme.breakpoints.down('md')]: {
    fontSize: '2.6rem',
    textAlign: 'center'
  }
}));

const Sub = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(3),
  color: '#475569',
  maxWidth: 520,
  fontSize: 18,
  [theme.breakpoints.down('md')]: {
    textAlign: 'center',
    marginInline: 'auto'
  }
}));

const PrimaryBtn = styled(Button)(({ theme }) => ({
  padding: `${theme.spacing(1.6)} ${theme.spacing(4.2)}`,
  borderRadius: 999,
  fontWeight: 700,
  textTransform: 'none',
  background: 'linear-gradient(90deg,#3b82f6,#06b6d4)',
  color: '#fff',
  boxShadow: '0 10px 24px rgba(59,130,246,.25)',
  '&:hover': {
    background: 'linear-gradient(90deg,#06b6d4,#3b82f6)'
  }
}));

const GhostBtn = styled(Button)(({ theme }) => ({
  padding: `${theme.spacing(1.6)} ${theme.spacing(4)}`,
  borderRadius: 999,
  textTransform: 'none',
  fontWeight: 700,
  color: theme.palette.grey[900],
  border: `1.8px solid ${alpha('#0f172a', 0.12)}`,
  background: '#fff',
  '&:hover': {
    background: alpha('#0f172a', 0.04)
  }
}));

// ===== Right Illustration (browser mock) =====
const BrowserCard = styled(Box)(() => ({
  width: '100%',
  borderRadius: 18,
  background: '#ffffff',
  boxShadow: '0 12px 35px rgba(2,6,23,.08), 0 3px 10px rgba(2,6,23,.06)',
  overflow: 'hidden',
  border: `1px solid ${alpha('#0f172a', 0.06)}`
}));

const Dot = ({ color }: { color: string }) => (
  <Box
    sx={{
      width: 10,
      height: 10,
      borderRadius: '50%',
      backgroundColor: color
    }}
  />
);

const Tile = styled(Box)(() => ({
  borderRadius: 12,
  background: '#f5f7fb',
  border: `1px solid ${alpha('#0f172a', 0.06)}`
}));

const IconBadge = styled(Box)(() => ({
  width: 34,
  height: 34,
  borderRadius: 10,
  display: 'grid',
  placeItems: 'center',
  fontSize: 18,
  background: 'linear-gradient(135deg,#e0e7ff,#cffafe)',
  color: '#0f172a',
  flexShrink: 0
}));

const TinyBar = styled(Box)(() => ({
  height: 8,
  borderRadius: 6,
  background: alpha('#0f172a', 0.12)
}));

const IconPill = styled(Box)(() => ({
  display: 'grid',
  placeItems: 'center',
  width: 34,
  height: 28,
  borderRadius: 999,
  border: `1px solid ${alpha('#0f172a', 0.08)}`,
  background: '#fff',
  fontSize: 16
}));

const ListRow = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '10px 12px',
  borderRadius: 10,
  background: '#0b1220',
  color: '#e5e7eb'
}));

// ✅ Motion-wrapped styled component
const MotionListRow = motion(ListRow);

const LineStub = styled(Box)(() => ({
  height: 10,
  borderRadius: 8,
  background: alpha('#e5e7eb', 0.35),
  flex: 1
}));

// ===== Component =====
const HeroBanner = () => {
  const leftIcons = ['🏦', '🏢', '💼', '💳', '📈', '🤝'];

  return (
    <>
      <Navbar />
      <Wrapper id="home">
        {/* soft floating glows */}
        <motion.div
          style={{
            position: 'absolute',
            top: -60,
            left: -60,
            width: 220,
            height: 220,
            borderRadius: '50%',
            background: 'radial-gradient(closest-side,#dbeafe,transparent)'
          }}
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          style={{
            position: 'absolute',
            bottom: -70,
            right: -70,
            width: 260,
            height: 260,
            borderRadius: '50%',
            background: 'radial-gradient(closest-side,#cffafe,transparent)'
          }}
          animate={{ y: [0, 18, 0] }}
          transition={{ duration: 9, repeat: Infinity }}
        />

        <Container>
          <Grid container spacing={8} alignItems="center">
            {/* LEFT */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <H3 variant="h3">
                  India’s Most Trusted&nbsp;
                  <Box component="span" sx={{ color: '#3b82f6' }}>
                    Lender, Banker & Sales Directory
                  </Box>
                </H3>

                <Sub>
                  Discover verified contacts across Banks, NBFCs & DSAs. <br />
                  Search by city, product, banker name - close deals faster with
                  zero time wasted.
                </Sub>

                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  sx={{ mt: 1, justifyContent: { xs: 'center', md: 'flex-start' } }}
                >
                  <PrimaryBtn
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.querySelector('#directory');
                      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                  >
                    Explore Directory
                  </PrimaryBtn>

                  <GhostBtn href="/onlineform/form-online">
                    List Your Profile
                  </GhostBtn>
                </Stack>
              </motion.div>
            </Grid>

            {/* RIGHT */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, delay: 0.1 }}
              >
                <BrowserCard>
                  {/* top bar */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 2,
                      py: 1.2,
                      background: '#f8fafc',
                      borderBottom: `1px solid ${alpha('#0f172a', 0.06)}`
                    }}
                  >
                    <Dot color="#ef4444" />
                    <Dot color="#f59e0b" />
                    <Dot color="#22c55e" />
                  </Box>

                  <Grid container spacing={2} sx={{ p: 2 }}>
                    {/* left: animated category rows (no text) */}
                    <Grid item xs={12} md={5}>
                      <Stack
                        spacing={1.2}
                        sx={{ background: '#0b1220', p: 1.2, borderRadius: 2 }}
                      >
                        {leftIcons.map((ic, i) => (
                          <MotionListRow
                            key={i}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.35, delay: i * 0.08 }}
                          >
                            <motion.div
                              animate={{ rotate: [0, 6, -6, 0] }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                delay: i * 0.2
                              }}
                            >
                              <IconBadge>{ic}</IconBadge>
                            </motion.div>
                            <LineStub />
                          </MotionListRow>
                        ))}
                      </Stack>
                    </Grid>

                    {/* right: pure icon tiles + pills (no labels) */}
                    <Grid item xs={12} md={7}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Tile
                            sx={{ height: 120, display: 'grid', placeItems: 'center' }}
                          >
                            <motion.div
                              animate={{ y: [0, -6, 0] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <Typography sx={{ fontSize: 34 }}>🏦</Typography>
                            </motion.div>
                            <Box sx={{ mt: 1, width: '70%' }}>
                              <TinyBar sx={{ mb: 0.6 }} />
                              <TinyBar sx={{ width: '60%' }} />
                            </Box>
                          </Tile>
                        </Grid>
                        <Grid item xs={6}>
                          <Tile
                            sx={{ height: 120, display: 'grid', placeItems: 'center' }}
                          >
                            <motion.div
                              animate={{ y: [0, -6, 0] }}
                              transition={{ duration: 2.2, repeat: Infinity }}
                            >
                              <Typography sx={{ fontSize: 34 }}>🏢</Typography>
                            </motion.div>
                            <Box sx={{ mt: 1, width: '70%' }}>
                              <TinyBar sx={{ mb: 0.6 }} />
                              <TinyBar sx={{ width: '60%' }} />
                            </Box>
                          </Tile>
                        </Grid>

                        <Grid item xs={12}>
                          <Tile sx={{ p: 2 }}>
                            {/* icon-only pills */}
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                              {['🏦', '🏢', '💼', '💳', '📈', '🤝'].map(
                                (icon, idx) => (
                                  <motion.div
                                    key={idx}
                                    animate={{ y: [0, -4, 0] }}
                                    transition={{
                                      duration: 1.6,
                                      repeat: Infinity,
                                      delay: idx * 0.1
                                    }}
                                  >
                                    <IconPill>{icon}</IconPill>
                                  </motion.div>
                                )
                              )}
                            </Stack>

                            {/* decorative bars only */}
                            <Box sx={{ mt: 2 }}>
                              <Box
                                sx={{
                                  height: 10,
                                  borderRadius: 6,
                                  background: alpha('#0f172a', 0.08),
                                  mb: 1.2
                                }}
                              />
                              <Box
                                sx={{
                                  height: 10,
                                  width: '70%',
                                  borderRadius: 6,
                                  background: alpha('#0f172a', 0.08)
                                }}
                              />
                            </Box>
                          </Tile>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </BrowserCard>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Wrapper>

      <CoreFeatures />
      <Pricing />
      <FAQSection />
      <ContactSection />
      <Footer />
    </>
  );
};

export default HeroBanner;
