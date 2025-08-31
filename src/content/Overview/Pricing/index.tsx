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
  slate: '#64748b',
  blue: '#6366f1',      // slight violet-blue like screenshot
  blueDark: '#4f46e5',
  dark: '#0b1220'
};

const Section = styled(Box)(({ theme }) => ({
  position: 'relative',
  paddingTop: theme.spacing(12),
  paddingBottom: theme.spacing(12),
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  backgroundColor: '#ffffff' // fallback
}));

const Title = styled(Typography)(({ }) => ({
  fontWeight: 900,
  fontSize: '3rem',
  textAlign: 'center',
  color: COLORS.ink,
  letterSpacing: -0.5
}));

const Sub = styled(Typography)(({  }) => ({
  textAlign: 'center',
  color: COLORS.slate,
  maxWidth: 820,
  margin: '8px auto 16px'
}));

/** Toggle like screenshot: labels on both sides, pill track, white thumb */
const ToggleWrap = styled(Stack)(({ theme }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  gap: 14,
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(3),
  '& .MuiSwitch-root': { padding: 8 },
  '& .MuiSwitch-track': {
    borderRadius: 999,
    background: alpha(COLORS.blue, 0.3)
  },
  '& .Mui-checked + .MuiSwitch-track': {
    background: alpha(COLORS.blue, 0.5)
  },
  '& .MuiSwitch-thumb': {
    background: '#fff',
    boxShadow: '0 2px 6px rgba(0,0,0,.25)'
  }
}));

const Card = styled(Box)(({ theme }) => ({
  borderRadius: 14,
  background: '#fff',
  border: `1px solid ${alpha('#0f172a', 0.08)}`,
  boxShadow: '0 10px 28px rgba(2,6,23,.06)',
  padding: theme.spacing(4),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative'
}));

const PopularTag = styled(Box)(({ }) => ({
  position: 'absolute',
  top: 12,
  right: 12,
  padding: '4px 10px',
  fontSize: 12,
  fontWeight: 800,
  color: COLORS.blueDark,
  background: alpha(COLORS.blue, 0.12),
  border: `1px solid ${alpha(COLORS.blue, 0.3)}`,
  borderRadius: 999
}));

const CTA_Blue = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  padding: `${theme.spacing(1.4)} ${theme.spacing(2)}`,
  fontWeight: 800,
  textTransform: 'none',
  background: `linear-gradient(90deg, ${COLORS.blue}, ${COLORS.blueDark})`,
  color: '#fff',
  '&:hover': { background: `linear-gradient(90deg, ${COLORS.blueDark}, ${COLORS.blue})` }
}));

const CTA_Dark = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  padding: `${theme.spacing(1.4)} ${theme.spacing(2)}`,
  fontWeight: 800,
  textTransform: 'none',
  background: COLORS.dark,
  color: '#fff',
  '&:hover': { background: alpha(COLORS.dark, 0.92) }
}));

const Tick = ({ text }: { text: string }) => (
  <Stack direction="row" spacing={1.2} alignItems="center">
    <CheckCircleRoundedIcon sx={{ fontSize: 20, color: '#22c55e' }} />
    <Typography sx={{ color: '#111827' }}>{text}</Typography>
  </Stack>
);

type Plan = {
  key: 'free' | 'pro' | 'enterprise';
  name: string;
  blurb: string;
  priceMonthly: number;
  features: string[];
  mostPopular?: boolean;
  darkCta?: boolean;
};

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
      'Email-only support'
    ],
    darkCta: true
  },
  {
    key: 'pro',
    name: 'Pro',
    blurb: 'Best for DSAs & agents who close deals regularly.',
    priceMonthly: 799, // ₹/month
    features: [
      'Unlimited contact access',
      'Advanced filters (Ticket Size, Commission Range)',
      'One-tap WhatsApp/Call connect',
      'Priority support & updates'
    ],
    mostPopular: true
  },
  {
    key: 'enterprise',
    name: 'Enterprise',
    blurb: 'Best Package for large teams.',
    priceMonthly: 2499, // ₹/month
    features: [
      'Team seats (up to 10 users)',
      'Custom API access',
      'Dedicated account manager',
      'Commission analytics & reporting'
    ],
    darkCta: true
  }
];

const Pricing: React.FC = () => {
  const [yearly, setYearly] = useState(false);
  // Yearly = 10x monthly (2 months free)
  const price = (m: number) => (yearly ? m * 10 : m);
  const suffix = yearly ? '/ year' : '/ month';

  return (
    <Section id="pricing">
      <Container>
        <Title>Choose Your Plan</Title>
        <Sub>
          Simple, transparent pricing for every type of partner. Start free, upgrade anytime.
          {` `}<strong>{yearly ? 'Yearly billing: 2 months free 🎉' : 'Switch to yearly for 2 months free'}</strong>
        </Sub>

        <ToggleWrap direction="row">
          <Typography sx={{ color: COLORS.ink, fontWeight: 600 }}>Monthly</Typography>
          <Switch checked={yearly} onChange={(e) => setYearly(e.target.checked)} />
          <Typography sx={{ color: COLORS.ink, fontWeight: 600 }}>Yearly</Typography>
        </ToggleWrap>

        <Grid container spacing={4} justifyContent="center" sx={{ mt: 2 }}>
          {PLANS.map((p) => (
            <Grid key={p.key} item xs={12} md={4}>
              <Card>
                {p.mostPopular && <PopularTag>Most popular</PopularTag>}

                {/* header */}
                <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                  <Typography variant="h6" sx={{ fontWeight: 800, color: COLORS.ink }}>
                    {p.name}
                  </Typography>
                </Stack>

                <Typography sx={{ color: COLORS.slate, mt: 1 }}>{p.blurb}</Typography>

                <Stack direction="row" spacing={1} alignItems="baseline" sx={{ mt: 3 }}>
                  <Typography sx={{ fontSize: 18, color: COLORS.ink }}>₹</Typography>
                  <Typography sx={{ fontWeight: 900, fontSize: 44, color: COLORS.ink }}>
                    {price(p.priceMonthly)}
                  </Typography>
                  <Typography sx={{ color: COLORS.slate }}>{suffix}</Typography>
                </Stack>

                <Divider sx={{ my: 3, borderColor: alpha('#0f172a', 0.08) }} />

                <Stack spacing={1.6}>
                  {p.features.map((f) => (
                    <Tick key={f} text={f} />
                  ))}
                </Stack>

                <Box sx={{ mt: 'auto' }}>
                  <Box sx={{ height: 16 }} />
                  {p.mostPopular ? (
                    <CTA_Blue fullWidth>Choose Plan</CTA_Blue>
                  ) : p.darkCta ? (
                    <CTA_Dark fullWidth>Choose Plan</CTA_Dark>
                  ) : (
                    <Button fullWidth variant="outlined" sx={{ borderRadius: 8, fontWeight: 800 }}>
                      Choose Plan
                    </Button>
                  )}
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Section>
  );
};

export default Pricing;
