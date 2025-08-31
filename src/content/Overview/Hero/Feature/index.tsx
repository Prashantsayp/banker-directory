'use client';

import React from 'react';
import {
  alpha,
  Box,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
  styled
} from '@mui/material';
import {
  BarChart as BarChartIcon,
  Layers as LayersIcon,
  IntegrationInstructions as IntegrationIcon,
  VerifiedUser as VerifiedIcon,
  Storage as StorageIcon,
  Loop as LoopIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

/* ===== Solid-style palette (match screenshot) ===== */
const COLORS = {
  ink: '#0f172a',          // headings
  slate: '#475569',        // body
  blue: '#2563eb',         // primary blue
  blueDark: '#1d4ed8',     // deeper blue
  bg: 'linear-gradient(180deg,#ffffff 0%,#f8fbff 100%)'
};

const Section = styled(Box)(({ theme }) => ({
  background: COLORS.bg,
  paddingTop: theme.spacing(10),
  paddingBottom: theme.spacing(12)
}));

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  fontSize: '2.2rem',
  textAlign: 'center',
  color: COLORS.ink,
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(1)
}));

const Sub = styled(Typography)(({}) => ({
  textAlign: 'center',
  color: '#64748b',
  maxWidth: 760,
  margin: '0 auto'
}));

const Card = styled(Paper)(({ theme }) => ({
  position: 'relative',
  borderRadius: 16,
  padding: theme.spacing(4),
  background: '#ffffff',
  boxShadow:
    '0 14px 36px rgba(2,6,23,.06), 0 2px 0 rgba(2,6,23,.04)',
  border: `1px solid ${alpha('#0f172a', 0.06)}`,
  transition: 'transform .25s ease, box-shadow .25s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 18px 44px rgba(2,6,23,.08)'
  },
  // faint radial glow like Solid
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: -2,
    zIndex: 0,
    borderRadius: 18,
    background: `radial-gradient(120px 120px at 40px 40px, ${alpha(
      COLORS.blue,
      0.08
    )}, transparent)`
  }
}));

const IconWrap = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  width: 56,
  height: 56,
  borderRadius: 12,
  display: 'grid',
  placeItems: 'center',
  background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.blueDark})`,
  color: '#fff',
  marginBottom: theme.spacing(2),
  boxShadow: `0 8px 20px ${alpha(COLORS.blue, 0.35)}`
}));

const items = [
  {
    icon: <VerifiedIcon />,
    title: 'Verified Contacts',
    desc:
      'Every lender, banker & sales partner is KYC-verified with up-to-date details for instant trust.'
  },
  {
    icon: <LayersIcon />,
    title: 'Smart Categorization',
    desc:
      'Search & filter by product (Home Loan, Business Loan, PL, Auto), city, ticket size & more.'
  },
  {
    icon: <LoopIcon />,
    title: 'Always Updated',
    desc:
      'Our team continuously adds new contacts, verifies existing ones & removes inactive profiles.'
  },
 
  {
    icon: <IntegrationIcon />,
    title: 'One-Tap Connect',
    desc:
      'Call, WhatsApp or email directly from the directory. Reach decision-makers in seconds.'
  },
  {
    icon: <StorageIcon />,
    title: 'Pan-India Coverage',
    desc:
      'Bankers, NBFCs, DSAs & channel partners listed across major cities and growing daily.'
  },
  
   {
    icon: <BarChartIcon />,
    title: 'Commission Transparency',
    desc:
      'Know the expected payout & commission details upfront — no hidden surprises.'
  },
];


const CoreFeatures: React.FC = () => {
  return (
    <Section id="features">
      <Container>
        <Stack alignItems="center" spacing={1.5} sx={{ mb: 4 }}>
        <Chip
  label="DIRECTORY FEATURES"
  size="small"
  sx={{
    fontWeight: 700,
    letterSpacing: 0.6,
    color: COLORS.blue,
    backgroundColor: alpha(COLORS.blue, 0.08),
    border: `1px solid ${alpha(COLORS.blue, 0.2)}`,
    borderRadius: 999
  }}
/>

<Title>Why Choose Our Directory?</Title>

<Sub>
  A powerful lender & banker directory built to simplify your search.  
  Verified listings, transparent commissions, and instant connect — all in one place.
</Sub>

        </Stack>

        <Grid container spacing={4}>
          {items.map((it, i) => (
            <Grid key={it.title} item xs={12} sm={6} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Card>
                  <IconWrap>{it.icon}</IconWrap>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: COLORS.ink, mb: 1 }}
                  >
                    {it.title}
                  </Typography>
                  <Typography sx={{ color: COLORS.slate }}>{it.desc}</Typography>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Section>
  );
};

export default CoreFeatures;
