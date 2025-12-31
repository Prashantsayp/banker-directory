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
  alpha,
  Chip
} from '@mui/material';
import { motion } from 'framer-motion';
import CoreFeatures from './Feature';
import Pricing from '../Pricing';
import FAQSection from '../FAQ';
import ContactSection from '../Contact';
import Footer from '../Footer';
import Navbar from '../Navbar';
import router from 'next/router';

// ================== STYLED ==================

const PageShell = styled(Box)(({  }) => ({
  minHeight: '100vh',
  background:
    'radial-gradient(circle at top left, #1d4ed8 0, transparent 45%), radial-gradient(circle at top right, #0ea5e9 0, transparent 50%), radial-gradient(circle at bottom, #020617 0, #020617 55%)',
  color: '#e5e7eb',
  display: 'flex',
  flexDirection: 'column'
}));

const HeroWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  paddingTop: theme.spacing(10),
  paddingBottom: theme.spacing(14),
  [theme.breakpoints.down('md')]: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(10)
  }
}));

const GlowOrb = styled(Box)(() => ({
  position: 'absolute',
  borderRadius: '999px',
  filter: 'blur(40px)',
  opacity: 0.8,
  pointerEvents: 'none',
  mixBlendMode: 'screen'
}));

const Heading = styled(Typography)(({ theme }) => ({
  fontSize: '3.2rem',
  lineHeight: 1.1,
  fontWeight: 800,
  letterSpacing: -0.7,
  color: '#f9fafb',
  [theme.breakpoints.down('md')]: {
    fontSize: '2.4rem',
    textAlign: 'center'
  }
}));

const HighlightSpan = styled('span')(() => ({
  background:
    'linear-gradient(90deg, rgba(56,189,248,1), rgba(129,140,248,1), rgba(236,72,153,1))',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent'
}));

const SubText = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2.5),
  color: alpha('#e5e7eb', 0.75),
  maxWidth: 540,
  fontSize: 16,
  [theme.breakpoints.down('md')]: {
    textAlign: 'center',
    marginInline: 'auto'
  }
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
  padding: `${theme.spacing(1.4)} ${theme.spacing(3.6)}`,
  borderRadius: 999,
  fontWeight: 700,
  textTransform: 'none',
  fontSize: 15,
  background:
    'linear-gradient(135deg, rgba(56,189,248,1), rgba(37,99,235,1))',
  color: '#0b1120',
  boxShadow:
    '0 18px 40px rgba(15,23,42,0.6), 0 0 0 1px rgba(248,250,252,0.08)',
  '&:hover': {
    background:
      'linear-gradient(135deg, rgba(37,99,235,1), rgba(56,189,248,1))',
    boxShadow:
      '0 20px 45px rgba(15,23,42,0.8), 0 0 0 1px rgba(248,250,252,0.18)'
  }
}));

const GhostButton = styled(Button)(({ theme }) => ({
  padding: `${theme.spacing(1.4)} ${theme.spacing(3.4)}`,
  borderRadius: 999,
  textTransform: 'none',
  fontWeight: 600,
  fontSize: 14,
  border: `1px solid ${alpha('#cbd5f5', 0.35)}`,
  background:
    'linear-gradient(135deg, rgba(15,23,42,0.85), rgba(15,23,42,0.96))',
  color: '#e5e7eb',
  '&:hover': {
    background: 'rgba(15,23,42,0.9)'
  }
}));

const SoftCard = styled(Box)(({ theme }) => ({
  borderRadius: 24,
  padding: theme.spacing(2),
  background:
    'linear-gradient(145deg, rgba(15,23,42,0.85), rgba(15,23,42,0.96))',
  border: `1px solid ${alpha('#60a5fa', 0.28)}`,
  boxShadow:
    '0 22px 60px rgba(15,23,42,0.9), 0 0 0 1px rgba(15,23,42,0.4)',
  backdropFilter: 'blur(18px)',
  position: 'relative',
  overflow: 'hidden'
}));

const StatPill = styled(Box)(() => ({
  borderRadius: 999,
  padding: '6px 12px',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: 1,
  border: '1px solid rgba(148,163,184,0.4)',
  background:
    'radial-gradient(circle at top, rgba(251,191,36,0.08), transparent 60%)'
}));

const SmallDot = styled('span')(() => ({
  width: 7,
  height: 7,
  borderRadius: '999px',
  background: 'radial-gradient(circle, #22c55e, #16a34a)'
}));

const StatNumber = styled(Typography)(() => ({
  fontSize: 22,
  fontWeight: 700,
  color: '#f9fafb'
}));

const StatLabel = styled(Typography)(() => ({
  fontSize: 12,
  color: '#9ca3af'
}));

const RightTag = styled(Box)(() => ({
  display: 'inline-flex',
  alignItems: 'center',
  borderRadius: 999,
  padding: '4px 10px',
  fontSize: 11,
  gap: 6,
  background: 'rgba(15,23,42,0.9)',
  border: '1px solid rgba(148,163,184,0.4)'
}));

// ================== MAIN COMPONENT ==================

const HeroBanner = () => {
  return (
    <>
      <Navbar />
      <PageShell>
        <HeroWrapper id="home">
          {/* Glows */}
          <GlowOrb
            sx={{
              top: -80,
              left: '5%',
              width: 260,
              height: 260,
              background:
                'radial-gradient(circle, rgba(56,189,248,0.55), transparent 60%)'
            }}
          />
          <GlowOrb
            sx={{
              top: 40,
              right: '8%',
              width: 320,
              height: 320,
              background:
                'radial-gradient(circle, rgba(129,140,248,0.5), transparent 60%)'
            }}
          />
          <GlowOrb
            sx={{
              bottom: -120,
              left: '18%',
              width: 320,
              height: 320,
              background:
                'radial-gradient(circle, rgba(251,191,36,0.4), transparent 65%)'
            }}
          />

          <Container maxWidth="lg">
            <Grid
              container
              spacing={6}
              alignItems="center"
            >
              {/* LEFT SECTION */}
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                >
                  <StatPill>
                    <SmallDot />
                    <span>Built for Loan Brokers, CAs & Fintech Teams</span>
                  </StatPill>

                  <Heading sx={{ mt: 3 }}>
                    One <HighlightSpan>Lending Network</HighlightSpan>
                    <br />
                    For Every Banker You Need.
                  </Heading>

                  <SubText>
                    F2 Banker Directory brings together verified lenders, product
                    teams & sales champions across Banks, NBFCs & DSAs — so you
                    never waste time hunting for the{" "}
                    <b>“right contact for the right case”</b> again.
                  </SubText>

                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    sx={{
                      mt: 4,
                      justifyContent: { xs: 'center', md: 'flex-start' }
                    }}
                  >
                 <PrimaryButton
  onClick={(e) => {
    e.preventDefault();
    router.push('/directory/preview');
  }}
>
  🚀 Explore Directory
</PrimaryButton>


                    <GhostButton href="/onlineform/form-online">
                      List Your Profile
                    </GhostButton>
                  </Stack>

                  {/* stats */}
                  <Stack
                    direction="row"
                    spacing={4}
                    sx={{ mt: 4 }}
                  >
                    <Box>
                      <StatNumber>25K+</StatNumber>
                      <StatLabel>Verified Contacts</StatLabel>
                    </Box>
                    <Box>
                      <StatNumber>120+</StatNumber>
                      <StatLabel>Banks & NBFCs</StatLabel>
                    </Box>
                    <Box>
                      <StatNumber>30+</StatNumber>
                      <StatLabel>Cities & Micro-markets</StatLabel>
                    </Box>
                  </Stack>
                </motion.div>
              </Grid>

              {/* RIGHT SECTION */}
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                >
                  <SoftCard>
                    {/* top row */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 1.5
                      }}
                    >
                      <RightTag>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '999px',
                            background:
                              'radial-gradient(circle, #22c55e, #15803d)'
                          }}
                        />
                        Live banker activity
                      </RightTag>

                      <Chip
                        size="small"
                        label="Directory Snapshot"
                        sx={{
                          borderRadius: 999,
                          fontSize: 11,
                          height: 24,
                          color: '#e5e7eb',
                          borderColor: alpha('#9ca3af', 0.5),
                          background: 'rgba(15,23,42,0.9)'
                        }}
                        variant="outlined"
                      />
                    </Box>

                    {/* middle cards */}
                    <Grid container spacing={1.5}>
                      {/* Search mock */}
                      <Grid item xs={12}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.2,
                            borderRadius: 999,
                            px: 1.4,
                            py: 0.8,
                            background:
                              'linear-gradient(120deg, rgba(15,23,42,0.9), rgba(15,23,42,0.97))',
                            border: `1px solid ${alpha('#60a5fa', 0.5)}`
                          }}
                        >
                          <Box
                            sx={{
                              width: 26,
                              height: 26,
                              borderRadius: 999,
                              display: 'grid',
                              placeItems: 'center',
                              background:
                                'radial-gradient(circle, rgba(59,130,246,0.15), transparent 65%)',
                              fontSize: 14
                            }}
                          >
                            🔍
                          </Box>
                          <Typography
                            sx={{
                              fontSize: 13,
                              color: '#9ca3af',
                              flex: 1
                            }}
                          >
                            Search: &quot;LAP banker · Delhi · Ticket 1Cr–5Cr&quot;
                          </Typography>
                          <Box
                            sx={{
                              px: 1,
                              py: 0.4,
                              borderRadius: 999,
                              border: `1px solid ${alpha('#4b5563', 0.7)}`,
                              fontSize: 11,
                              color: '#9ca3af'
                            }}
                          >
                            Enter ↵
                          </Box>
                        </Box>
                      </Grid>

                      {/* banker cards */}
                      <Grid item xs={12} sm={6}>
                        <Box
                          sx={{
                            borderRadius: 16,
                            p: 1.4,
                            background:
                              'radial-gradient(circle at top left, rgba(56,189,248,0.18), rgba(15,23,42,0.96))',
                            border: `1px solid ${alpha('#38bdf8', 0.4)}`,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 0.3
                          }}
                        >
                          <Typography
                            sx={{ fontSize: 13, color: '#e5e7eb', fontWeight: 600 }}
                          >
                            Senior LAP RM · HDFC Bank
                          </Typography>
                          <Typography
                            sx={{ fontSize: 11, color: '#9ca3af' }}
                          >
                            Delhi NCR · Ticket 50L–5Cr
                          </Typography>
                          <Stack
                            direction="row"
                            spacing={1}
                            sx={{ mt: 1 }}
                          >
                            <Chip
                              size="small"
                              label="Fast TAT"
                              sx={{
                                height: 22,
                                borderRadius: 999,
                                fontSize: 10,
                                background: 'rgba(22,163,74,0.15)',
                                color: '#bbf7d0'
                              }}
                            />
                            <Chip
                              size="small"
                              label="Builder Tie-ups"
                              sx={{
                                height: 22,
                                borderRadius: 999,
                                fontSize: 10,
                                background: 'rgba(59,130,246,0.12)',
                                color: '#bfdbfe'
                              }}
                            />
                          </Stack>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box
                          sx={{
                            borderRadius: 16,
                            p: 1.4,
                            background:
                              'radial-gradient(circle at top right, rgba(168,85,247,0.18), rgba(15,23,42,0.96))',
                            border: `1px solid ${alpha('#a855f7', 0.4)}`,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 0.3
                          }}
                        >
                          <Typography
                            sx={{ fontSize: 13, color: '#e5e7eb', fontWeight: 600 }}
                          >
                            Business Loan · NBFC Cluster Head
                          </Typography>
                          <Typography
                            sx={{ fontSize: 11, color: '#9ca3af' }}
                          >
                            Pan India sourcing · OD & Dropline
                          </Typography>
                          <Stack
                            direction="row"
                            spacing={1}
                            sx={{ mt: 1 }}
                          >
                            <Chip
                              size="small"
                              label="Doctor Finance"
                              sx={{
                                height: 22,
                                borderRadius: 999,
                                fontSize: 10,
                                background: 'rgba(251,191,36,0.14)',
                                color: '#fef9c3'
                              }}
                            />
                            <Chip
                              size="small"
                              label="Scorecard"
                              sx={{
                                height: 22,
                                borderRadius: 999,
                                fontSize: 10,
                                background: 'rgba(148,163,184,0.2)',
                                color: '#e5e7eb'
                              }}
                            />
                          </Stack>
                        </Box>
                      </Grid>

                      {/* bottom mini row */}
                      <Grid item xs={12}>
                        <Box
                          sx={{
                            mt: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 1
                          }}
                        >
                          <Box sx={{ display: 'flex', gap: 6 }}>
                            <Box>
                              <Typography
                                sx={{
                                  fontSize: 11,
                                  color: '#9ca3af',
                                  mb: 0.3
                                }}
                              >
                                Today
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: 13,
                                  fontWeight: 600,
                                  color: '#e5e7eb'
                                }}
                              >
                                182 new updates
                              </Typography>
                            </Box>
                            <Box>
                              <Typography
                                sx={{
                                  fontSize: 11,
                                  color: '#9ca3af',
                                  mb: 0.3
                                }}
                              >
                                Filtered for you
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: 13,
                                  fontWeight: 600,
                                  color: '#e5e7eb'
                                }}
                              >
                                34 perfect matches
                              </Typography>
                            </Box>
                          </Box>

                          <Button
                            size="small"
                            sx={{
                              borderRadius: 999,
                              px: 1.8,
                              py: 0.4,
                              textTransform: 'none',
                              fontSize: 11,
                              background:
                                'linear-gradient(120deg, rgba(37,99,235,0.9), rgba(56,189,248,0.9))',
                              color: '#020617',
                              '&:hover': {
                                background:
                                  'linear-gradient(120deg, rgba(56,189,248,1), rgba(37,99,235,1))'
                              }
                            }}
                          >
                            View matches
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </SoftCard>
                </motion.div>
              </Grid>
            </Grid>
          </Container>
        </HeroWrapper>

        {/* Rest of the page */}
        <CoreFeatures />
        <Pricing />
        <FAQSection />
        <ContactSection />
        <Footer />
      </PageShell>
    </>
  );
};

export default HeroBanner;
