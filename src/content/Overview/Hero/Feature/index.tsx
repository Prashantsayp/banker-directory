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

const COLORS = {
  ink: '#0f172a',
  slate: '#4b5563',
  blue: '#2563eb',
  bg: '#f9fafb'
};

const Section = styled(Box)(({ theme }) => ({
  background: COLORS.bg,
  paddingTop: theme.spacing(10),
  paddingBottom: theme.spacing(12),
  borderTop: `1px solid ${alpha('#000', 0.05)}`
}));

/* 🔹 OLD TEXT RESTORED */
const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  fontSize: '2.2rem',
  textAlign: 'center',
  color: COLORS.ink,
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(1)
}));

const Sub = styled(Typography)(() => ({
  textAlign: 'center',
  color: '#64748b',
  maxWidth: 760,
  margin: '0 auto'
}));

/* 🔹 CARD STYLE (keep this same) */
const Card = styled(Paper)(({ theme }) => ({
  position: 'relative',
  borderRadius: 18,
  padding: theme.spacing(2.5),
  backgroundColor: '#ffffff',
  border: `1px solid ${alpha('#000', 0.06)}`,
  boxShadow: '0 14px 40px rgba(15,23,42,0.04)',
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(2),
  overflow: 'hidden',
  transition: 'transform .18s ease, box-shadow .18s ease, border-color .18s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 18px 50px rgba(15,23,42,0.09)',
    borderColor: alpha(COLORS.blue, 0.4)
  }
}));

const SideStrip = styled(Box)(() => ({
  width: 4,
  borderRadius: 999,
  background: `linear-gradient(180deg, #2563eb, #22c55e)`
}));

const IconWrap = styled(Box)(() => ({
  width: 40,
  height: 40,
  borderRadius: 12,
  display: 'grid',
  placeItems: 'center',
  backgroundColor: '#eff6ff',
  color: COLORS.blue,
  flexShrink: 0,
  fontSize: 22
}));

const TitleText = styled(Typography)(() => ({
  fontWeight: 700,
  fontSize: 16,
  color: COLORS.ink,
  marginBottom: 4
}));

const Description = styled(Typography)(() => ({
  fontSize: 14,
  color: COLORS.slate
}));

/* 🔹 Same feature list */
const items = [
  {
    icon: <VerifiedIcon fontSize="small" />,
    title: 'Verified Contacts',
    desc:
      'Every lender, banker & sales partner is KYC-verified with up-to-date details for instant trust.'
  },
  {
    icon: <LayersIcon fontSize="small" />,
    title: 'Smart Categorization',
    desc:
      'Search & filter by product (Home Loan, Business Loan, PL, Auto), city, ticket size & more.'
  },
  {
    icon: <LoopIcon fontSize="small" />,
    title: 'Always Updated',
    desc:
      'Our team continuously adds new contacts, verifies existing ones & removes inactive profiles.'
  },
  {
    icon: <IntegrationIcon fontSize="small" />,
    title: 'One-Tap Connect',
    desc:
      'Call, WhatsApp or email directly from the directory — reach real decision-makers in seconds.'
  },
  {
    icon: <StorageIcon fontSize="small" />,
    title: 'Pan-India Coverage',
    desc:
      'Bankers, NBFCs, DSAs & channel partners listed across major cities and growing daily.'
  },
  {
    icon: <BarChartIcon fontSize="small" />,
    title: 'Commission Transparency',
    desc:
      'Know the expected payout & commission details upfront — no hidden surprises.'
  }
];

const CoreFeatures: React.FC = () => {
  return (
    <Section id="features">
      <Container>

        {/* 🔹 OLD HEADER TEXT BACK */}
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
            A powerful lender & banker directory built to simplify your search —  
            verified listings, transparent commissions & instant connect in one place.
          </Sub>
        </Stack>

        {/* 🔹 SAME CARD GRID */}
        <Grid container spacing={3}>
          {items.map((it, i) => (
            <Grid key={it.title} item xs={12} sm={6} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Card>
                  <SideStrip />
                  <Stack spacing={1} sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                      <IconWrap>{it.icon}</IconWrap>
                      <Box>
                        <TitleText>{it.title}</TitleText>
                        <Description>{it.desc}</Description>
                      </Box>
                    </Box>
                  </Stack>
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
