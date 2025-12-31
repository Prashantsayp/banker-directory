'use client';

import React, { useState } from 'react';
import {
  alpha,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Stack,
  Switch,
  Typography,
  styled
} from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

const COLORS = {
  ink: '#0f172a',
  slate: '#9ca3af',
  blue: '#6366f1',
  blueDark: '#4f46e5',
  darkBg: '#020617',
};

const Section = styled(Box)(({ theme }) => ({
  position: 'relative',
  paddingTop: theme.spacing(12),
  paddingBottom: theme.spacing(12),
  background:
    'radial-gradient(circle at top, #1e293b 0, #020617 45%, #020617 100%)',
  color: '#e5e7eb',
  overflow: 'hidden',
}));

const Glow = styled(Box)(() => ({
  position: 'absolute',
  borderRadius: '999px',
  filter: 'blur(38px)',
  opacity: 0.6,
}));

const Title = styled(Typography)(() => ({
  fontWeight: 900,
  fontSize: '2.6rem',
  textAlign: 'center',
  color: '#f9fafb',
  letterSpacing: -0.4,
}));

const Sub = styled(Typography)(() => ({
  textAlign: 'center',
  color: '#9ca3af',
  maxWidth: 720,
  margin: '10px auto 0',
  fontSize: 14.5,
}));

const ToggleWrap = styled(Stack)(({ theme }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  gap: 10,
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(4),
  '& .MuiSwitch-root': { padding: 6 },
  '& .MuiSwitch-track': {
    borderRadius: 999,
    background: alpha(COLORS.blue, 0.35),
  },
  '& .Mui-checked + .MuiSwitch-track': {
    background: alpha(COLORS.blue, 0.55),
  },
  '& .MuiSwitch-thumb': {
    background: '#fff',
    boxShadow: '0 2px 6px rgba(0,0,0,.35)',
  },
}));

const YearlyBadge = styled(Box)(() => ({
  padding: '2px 8px',
  borderRadius: 999,
  fontSize: 11,
  fontWeight: 600,
  background: 'rgba(22,163,74,0.18)',
  color: '#bbf7d0',
  border: '1px solid rgba(22,163,74,0.7)',
}));

const Card = styled(Box)(({ theme }) => ({
  borderRadius: 18,
  background:
    'linear-gradient(145deg, rgba(15,23,42,0.96), rgba(15,23,42,0.98))',
  border: `1px solid ${alpha('#e5e7eb', 0.07)}`,
  boxShadow: '0 20px 55px rgba(15,23,42,0.9)',
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden',
}));

const CardMuted = styled(Card)(() => ({
  background:
    'linear-gradient(145deg, rgba(15,23,42,0.9), rgba(15,23,42,0.96))',
  border: `1px solid ${alpha('#e5e7eb', 0.08)}`,
  boxShadow: '0 12px 32px rgba(15,23,42,0.7)',
}));

const PopularTag = styled(Box)(() => ({
  position: 'absolute',
  top: 14,
  right: 14,
  padding: '4px 10px',
  fontSize: 11,
  fontWeight: 800,
  color: '#f9fafb',
  background:
    'linear-gradient(120deg, rgba(99,102,241,1), rgba(56,189,248,1))',
  borderRadius: 999,
  boxShadow: '0 10px 24px rgba(15,23,42,0.8)',
}));

const CTA_Primary = styled(Button)(({ theme }) => ({
  borderRadius: 999,
  padding: `${theme.spacing(1.4)} ${theme.spacing(2)}`,
  fontWeight: 800,
  textTransform: 'none',
  background:
    'linear-gradient(135deg, rgba(99,102,241,1), rgba(56,189,248,1))',
  color: '#020617',
  '&:hover': {
    background:
      'linear-gradient(135deg, rgba(56,189,248,1), rgba(99,102,241,1))',
  },
}));

const CTA_Outline = styled(Button)(({ theme }) => ({
  borderRadius: 999,
  padding: `${theme.spacing(1.2)} ${theme.spacing(2)}`,
  fontWeight: 700,
  textTransform: 'none',
  borderColor: alpha('#e5e7eb', 0.4),
  color: '#e5e7eb',
}));

const Tick = ({ text }: { text: string }) => (
  <Stack direction="row" spacing={1.2} alignItems="flex-start">
    <CheckCircleRoundedIcon sx={{ fontSize: 20, color: '#22c55e', mt: '2px' }} />
    <Typography sx={{ color: '#e5e7eb', fontSize: 14 }}>{text}</Typography>
  </Stack>
);

type Plan = {
  key: 'free' | 'pro' | 'enterprise';
  name: string;
  blurb: string;
  priceMonthly: number;
  features: string[];
  mostPopular?: boolean;
  checkoutUrl?: string;
};

// 👇 yaha prices + alag-alag links
const PLANS: Plan[] = [
  {
    key: 'free',
    name: 'Free',
    blurb: 'Perfect for individuals exploring the directory.',
    priceMonthly: 0,
    features: [
      'Browse up to 50 contacts / month',
      'Basic filters (City, Product)',
      'View profile details',
      'Email-only support',
    ],
    // yaha apna Free plan ka URL daalna
    checkoutUrl: 'https://your-free-plan-link.com',
  },
  {
    key: 'pro',
    name: 'Pro',
    blurb: 'Best for DSAs & agents who close deals regularly.',
    priceMonthly: 639,
    features: [
      'Unlimited contact access',
      'Advanced filters (Ticket Size, Commission Range)',
      'One-tap WhatsApp/Call connect',
      'Priority support & updates',
    ],
    mostPopular: true,
    // Pro plan ka payment / checkout URL
    checkoutUrl: 'https://u.payu.in/PAYUMN/GIJREME5GC80',
  },
  {
    key: 'enterprise',
    name: 'Premium',
    blurb: 'Best package for larger teams & organisations.',
    priceMonthly: 969,
    features: [
      'Team seats (up to 10 users)',
      'Custom API access',
      'Dedicated account manager',
      'Commission analytics & reporting',
    ],
    // Enterprise ka alag URL
    checkoutUrl: 'https://u.payu.in/PAYUMN/hJb7r5YZrPeW',
  },
];

const Pricing: React.FC = () => {
  const [yearly, setYearly] = useState(false);
  // Yearly = 10x monthly (2 months free)
  const price = (m: number) => (yearly ? m * 10 : m);
  const suffix = yearly ? '/year' : '/month';

  const handlePlanClick = (url?: string) => {
    if (!url) return;
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
  };

  return (
    <Section id="pricing">
      {/* background glows */}
      <Glow
        sx={{
          top: -80,
          left: '12%',
          width: 260,
          height: 260,
          background:
            'radial-gradient(circle, rgba(56,189,248,0.42), transparent 60%)',
        }}
      />
      <Glow
        sx={{
          top: 40,
          right: '8%',
          width: 300,
          height: 300,
          background:
            'radial-gradient(circle, rgba(129,140,248,0.5), transparent 65%)',
        }}
      />
      <Glow
        sx={{
          bottom: -120,
          left: '25%',
          width: 320,
          height: 320,
          background:
            'radial-gradient(circle, rgba(251,191,36,0.35), transparent 70%)',
        }}
      />

      <Container maxWidth="lg">
        {/* Header */}
        <Title>Choose Your Plan</Title>
        <Sub>
          Simple, transparent pricing for every type of partner. Start free,
          upgrade whenever your deal flow grows.
        </Sub>

        <ToggleWrap direction="row">
          <Typography
            sx={{
              color: yearly ? '#9ca3af' : '#f9fafb',
              fontWeight: yearly ? 500 : 700,
              fontSize: 13,
            }}
          >
            Monthly
          </Typography>
          <Switch
            checked={yearly}
            onChange={(e) => setYearly(e.target.checked)}
          />
          <Typography
            sx={{
              color: yearly ? '#f9fafb' : '#9ca3af',
              fontWeight: yearly ? 700 : 500,
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              gap: 0.8,
            }}
          >
            Yearly{' '}
            <YearlyBadge>{yearly ? '2 months free' : 'Save 20%'}</YearlyBadge>
          </Typography>
        </ToggleWrap>

        {/* Cards */}
        <Grid
          container
          spacing={3}
          justifyContent="center"
          sx={{ mt: 2 }}
        >
          {PLANS.map((p) => {
            const isPopular = p.mostPopular;
            const Wrapper = isPopular ? Card : CardMuted;

            return (
              <Grid key={p.key} item xs={12} md={4}>
                <Wrapper
                  sx={{
                    transform: isPopular ? 'scale(1.02)' : 'scale(1)',
                    borderColor: isPopular
                      ? alpha(COLORS.blue, 0.6)
                      : undefined,
                  }}
                >
                  {isPopular && <PopularTag>Most popular</PopularTag>}

                  {/* header */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="baseline"
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 800, color: '#f9fafb' }}
                    >
                      {p.name}
                    </Typography>
                  </Stack>

                  <Typography
                    sx={{
                      color: '#cbd5f5',
                      mt: 1,
                      fontSize: 13.5,
                    }}
                  >
                    {p.blurb}
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="baseline"
                    sx={{ mt: 3 }}
                  >
                    <Typography
                      sx={{ fontSize: 18, color: '#e5e7eb', mt: 0.4 }}
                    >
                      ₹
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 900,
                        fontSize: 40,
                        color: '#f9fafb',
                        lineHeight: 1.1,
                      }}
                    >
                      {price(p.priceMonthly)}
                    </Typography>
                    <Typography sx={{ color: '#9ca3af', fontSize: 13 }}>
                      {suffix}
                    </Typography>
                  </Stack>

                  <Typography
                    sx={{
                      color: '#6b7280',
                      fontSize: 12,
                      mt: 0.5,
                    }}
                  >
                    {yearly
                      ? 'Billed annually · 2 months free'
                      : 'Billed monthly · cancel anytime'}
                  </Typography>

                  <Divider
                    sx={{
                      my: 3,
                      borderColor: alpha('#e5e7eb', 0.08),
                    }}
                  />

                  <Stack spacing={1.4}>
                    {p.features.map((f) => (
                      <Tick key={f} text={f} />
                    ))}
                  </Stack>

                  <Box sx={{ mt: 'auto' }}>
                    <Box sx={{ height: 18 }} />
                    {isPopular ? (
                      <CTA_Primary
                        fullWidth
                        onClick={() => handlePlanClick(p.checkoutUrl)}
                      >
                        Get started with Pro
                      </CTA_Primary>
                    ) : (
                      <CTA_Outline
                        fullWidth
                        onClick={() => handlePlanClick(p.checkoutUrl)}
                      >
                        Choose {p.name}
                      </CTA_Outline>
                    )}
                  </Box>
                </Wrapper>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Section>
  );
};

export default Pricing;
