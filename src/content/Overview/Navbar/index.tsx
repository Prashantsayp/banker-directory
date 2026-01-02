'use client';

import * as React from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  Link as MuiLink,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  alpha,
  styled,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

/* -------- UI Tokens -------- */
const COLORS = {
  ink: '#0f172a',
  blue: '#2563eb',
};

/* -------- Nav Link -------- */
const LinkBtn = styled(MuiLink)(() => ({
  textDecoration: 'none',
  fontWeight: 500,
  fontSize: 14,
  color: COLORS.ink,
  padding: '6px 10px',
  borderRadius: 999,
  cursor: 'pointer',
  WebkitTapHighlightColor: 'transparent',
  transition: 'background-color .16s ease, color .16s ease',

  '&:hover': {
    backgroundColor: alpha(COLORS.blue, 0.08),
    color: COLORS.blue,
    textDecoration: 'none',
  },
  '&:active,&:focus,&:focus-visible': {
    outline: 'none',
    textDecoration: 'none',
  },
}));

/* -------- Sign Up Button -------- */
const SignUpBtn = styled(Button)(() => ({
  textTransform: 'none',
  fontWeight: 700,
  borderRadius: 999,
  padding: '7px 18px',
  fontSize: 14,
  background: 'linear-gradient(90deg,#2563eb,#1d4ed8)',
  color: '#fff',
  boxShadow: '0 10px 22px rgba(37,99,235,0.30)',
  WebkitTapHighlightColor: 'transparent',

  '&:hover': {
    background: 'linear-gradient(90deg,#1d4ed8,#2563eb)',
    boxShadow: '0 12px 26px rgba(37,99,235,0.35)',
  },
  '&:focus-visible': { outline: 'none' },
}));

/* -------- BRAND (BACK TO ORIGINAL) -------- */
const Brand = () => (
  <MuiLink
    href="#home"
    onClick={(e) => {
      e.preventDefault();
      const el = document.querySelector('#home');
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', '#home');
    }}
    sx={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 1,
      textDecoration: 'none',
      WebkitTapHighlightColor: 'transparent',
      '&:focus-visible': { outline: 'none' },
    }}
  >
    <Box
      component="img"
      src="/static/images/logo/f2.png"
      alt="F2 Directory Logo"
      sx={{ height: 60, width: 'auto', display: 'block' }}
    />
  </MuiLink>
);

type Props = { onToggleTheme?: () => void };

const Navbar: React.FC<Props> = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleAnchorClick = (e: React.MouseEvent, hash: string) => {
    e.preventDefault();
    const el = document.querySelector(hash);

    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', hash);
    }

    setDrawerOpen(false);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: alpha('#ffffff', 0.92),
        backdropFilter: 'blur(14px)',
        borderBottom: `1px solid ${alpha('#0f172a', 0.06)}`,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            minHeight: 72,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr auto', md: '1fr auto 1fr' },
            alignItems: 'center',
            gap: 2,
          }}
        >
          {/* LEFT — Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Brand />
          </Box>

          {/* CENTER — Desktop Nav */}
          <Stack
            direction="row"
            spacing={0.5}
            alignItems="center"
            sx={{
              display: { xs: 'none', md: 'flex' },
              justifySelf: 'center',
            }}
          >
            {navLinks.map((link) => (
              <LinkBtn
                key={link.label}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
              >
                {link.label}
              </LinkBtn>
            ))}
          </Stack>

          {/* RIGHT — Auth Buttons */}
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ display: { xs: 'none', md: 'flex' }, justifySelf: 'end' }}
          >
            <SignUpBtn href="/login">Login</SignUpBtn>
  
          </Stack>

          {/* MOBILE MENU BUTTON */}
          <IconButton
            edge="end"
            disableRipple
            onClick={() => setDrawerOpen(true)}
            sx={{
              display: { xs: 'inline-flex', md: 'none' },
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>

      {/* -------- MOBILE DRAWER -------- */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 300,
            borderLeft: `1px solid ${alpha('#0f172a', 0.08)}`,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 1 }}
          >
            <Brand />
          </Stack>

          <Divider sx={{ mb: 1.5, borderColor: alpha('#0f172a', 0.08) }} />

          <List>
            {navLinks.map((l) => (
              <ListItem key={l.label} disablePadding>
                <ListItemButton
                  component="a"
                  href={l.href}
                  onClick={(e: any) => handleAnchorClick(e, l.href)}
                  disableRipple
                  sx={{
                    '&:hover': { backgroundColor: alpha('#0f172a', 0.05) },
                    '&:focus-visible': { outline: 'none' },
                  }}
                >
                  <ListItemText
                    primary={l.label}
                    primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }}
                  />
                </ListItemButton>
              </ListItem>
            ))}

            <Divider sx={{ my: 1.5, borderColor: alpha('#0f172a', 0.08) }} />

            <ListItem disablePadding>
              <ListItemButton
                component="a"
                href="/login"
                onClick={() => setDrawerOpen(false)}
              >
                <ListItemText primary="Sign In" />
              </ListItemButton>
            </ListItem>

            {/* <ListItem disablePadding>
              <ListItemButton
                component="a"
                href="/signup"
                onClick={() => setDrawerOpen(false)}
              >
                <ListItemText
                  primary="Sign Up"
                  primaryTypographyProps={{ fontWeight: 700 }}
                />
              </ListItemButton>
            </ListItem> */}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;

