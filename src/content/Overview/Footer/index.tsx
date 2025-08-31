'use client';

import React from 'react';
import {
  Box,
  Container,
  Grid,
  Link as MuiLink,
  Stack,
  Typography,
  IconButton,
  styled,
  alpha
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';  import LinkedInIcon from '@mui/icons-material/LinkedIn';
import BrushIcon from '@mui/icons-material/Brush'; // Behance-ish glyph

/* palette */
const COLORS = {
  ink: '#0f172a',
  slate: '#64748b',
  purple: '#6366f1' // bar color
};

/* top light area */
const Top = styled(Box)(({ theme }) => ({
  backgroundColor: '#f7f9fc',
  paddingTop: theme.spacing(12),
  paddingBottom: theme.spacing(6)
}));

/* brand logo mark */
const LogoMark = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
  
    
    {/* ✅ Replace text with logo image */}
    <Box
      component="img"
      src="/static/images/logo/f2.png"   // apna logo ka path
      alt="F2 Directory Logo"
      sx={{ height: 68, width: 'auto', display: 'block' }}
    />
  </Box>
);


/* column heading + links */
const ColTitle = styled(Typography)({
  fontWeight: 700,
  color: COLORS.ink,
  marginBottom: 14
});
const FootLink = ({ children, href = '#' }: { children: React.ReactNode; href?: string }) => (
  <MuiLink
    href={href}
    underline="none"
    sx={{
      color: COLORS.slate,
      display: 'block',
      py: 0.6,
      '&:hover': { color: COLORS.ink }
    }}
  >
    {children}
  </MuiLink>
);

/* bottom bar */
const BottomBar = styled(Box)(({ theme }) => ({
  backgroundColor: COLORS.purple,
  color: alpha('#fff', 0.95),
  padding: theme.spacing(2),
  borderTopLeftRadius: 10,
  borderTopRightRadius: 10
}));

const Footer: React.FC = () => {
  return (
    <Box component="footer">
      {/* Top area */}
      <Top>
        <Container>
          <Grid container spacing={6}>
            {/* Brand / blurb */}
            <Grid item xs={12} md={4}>
              <Stack spacing={2}>
                <LogoMark />
                <Typography sx={{ color: COLORS.slate, maxWidth: 360 }}>
                  Verified Lenders, Bankers & Sales Partners at one place.  
                  Connect instantly, save time, and grow your business faster.
                </Typography>
              </Stack>
            </Grid>

            {/* Columns */}
            <Grid item xs={6} md={2.5}>
              <ColTitle>Explore</ColTitle>
              <FootLink href="/directory">Directory</FootLink>
              <FootLink href="/pricing">Pricing</FootLink>
              <FootLink href="/onboard">List Your Profile</FootLink>
              <FootLink href="/faq">FAQ</FootLink>
            </Grid>

            <Grid item xs={6} md={2.5}>
              <ColTitle>Company</ColTitle>
              <FootLink href="/about">About Us</FootLink>
              <FootLink href="/team">Leadership</FootLink>
              <FootLink href="/careers">Careers</FootLink>
              <FootLink href="/contact">Contact</FootLink>
            </Grid>

            <Grid item xs={6} md={2.5}>
              <ColTitle>Legal</ColTitle>
              <FootLink href="/terms">Terms & Conditions</FootLink>
              <FootLink href="/privacy">Privacy Policy</FootLink>
              <FootLink href="/refund">Refund Policy</FootLink>
              <FootLink href="/compliance">Compliance</FootLink>
            </Grid>
          </Grid>
        </Container>
      </Top>

      {/* Bottom bar */}
      <BottomBar>
        <Container>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            alignItems={{ xs: 'flex-start', md: 'center' }}
            justifyContent="space-between"
            spacing={2}
          >
            <Typography sx={{ fontWeight: 600 }}>
              © 2025 F2 Directory. All rights reserved.
            </Typography>

            {/* socials */}
            <Stack direction="row" spacing={1.5} alignItems="center">
              <IconButton size="small" sx={{ color: '#fff' }}>
                <FacebookIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: '#fff' }}>
                <TwitterIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: '#fff' }}>
                <LinkedInIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: '#fff' }}>
                <BrushIcon fontSize="small" />
              </IconButton>
            </Stack>

            {/* policy links */}
            <Stack direction="row" spacing={3}>
              <MuiLink href="/privacy" underline="none" sx={{ color: '#fff' }}>
                Privacy Policy
              </MuiLink>
              <MuiLink href="/terms" underline="none" sx={{ color: '#fff' }}>
                Terms & Conditions
              </MuiLink>
            </Stack>
          </Stack>
        </Container>
      </BottomBar>
    </Box>
  );
};

export default Footer;
