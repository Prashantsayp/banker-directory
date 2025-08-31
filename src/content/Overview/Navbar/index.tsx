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
  styled
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

/* --- Styled helpers --- */
const LinkBtn = styled(MuiLink)(({}) => ({
  textDecoration: 'none',
  fontWeight: 600,
  color: '#0f172a',
  padding: '8px 10px',
  borderRadius: 8,
  cursor: 'pointer',
  WebkitTapHighlightColor: 'transparent',
  '&:hover': { backgroundColor: alpha('#0f172a', 0.06), textDecoration: 'none' },
  '&:active': { textDecoration: 'none' },
  '&:focus': { textDecoration: 'none' },
  '&:focus-visible': { outline: 'none' }
}));

const SignUpBtn = styled(Button)(({  }) => ({
  textTransform: 'none',
  fontWeight: 700,
  borderRadius: 10,
  // ⬇️ vertical padding kam, horizontal zyada
  padding: '6px 20px',   
  background: 'linear-gradient(90deg,#6b77f6,#7c8bff)',
  color: '#fff',
  WebkitTapHighlightColor: 'transparent',
  '&:hover': { background: 'linear-gradient(90deg,#7c8bff,#6b77f6)' },
  '&:focus-visible': { outline: 'none' }
}));

/* --- Brand --- */
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
      '&:focus-visible': { outline: 'none' }
    }}
    aria-label="Home"
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

  // Center nav items for same-page sections
  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Features', href: '#features' },

    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' }
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
        background: '#fff',
        backdropFilter: 'saturate(180%) blur(10px)',
        borderBottom: `1px solid ${alpha('#0f172a', 0.06)}`
      }}
    >
      <Container>
        {/* Grid layout: left brand, center nav, right actions */}
        <Toolbar
          disableGutters
          sx={{
            minHeight: 72,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr auto', md: '1fr auto 1fr' },
            alignItems: 'center',
            gap: 2
          }}
        >
          {/* Left: Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Brand />
          </Box>

          {/* Center: desktop nav */}
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ display: { xs: 'none', md: 'flex' }, justifySelf: 'center' }}
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

          {/* Right: actions */}
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ display: { xs: 'none', md: 'flex' }, justifySelf: 'end' }}
          >
            <LinkBtn href="/login">Sign In</LinkBtn>
            <SignUpBtn href="/signup" disableRipple disableFocusRipple>
              Sign Up
            </SignUpBtn>
          </Stack>

          {/* Mobile hamburger */}
          <IconButton
            edge="end"
            disableRipple
            disableFocusRipple
            sx={{ display: { xs: 'inline-flex', md: 'none' }, justifySelf: 'end', WebkitTapHighlightColor: 'transparent' }}
            onClick={() => setDrawerOpen(true)}
            aria-label="open menu"
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 300, WebkitTapHighlightColor: 'transparent' } }}
      >
        <Box sx={{ p: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
            <Brand />
          </Stack>
          <List>
            {navLinks.map((l) => (
              <ListItem key={l.label} disablePadding>
                <ListItemButton
                  component="a"
                  href={l.href}
                  onClick={(e: any) => handleAnchorClick(e, l.href)}
                  disableRipple
                  disableTouchRipple
                  sx={{
                    WebkitTapHighlightColor: 'transparent',
                    '&:hover': { backgroundColor: alpha('#0f172a', 0.06) },
                    '&:focus-visible': { outline: 'none' }
                  }}
                >
                  <ListItemText
                    primary={l.label}
                    primaryTypographyProps={{ fontWeight: 700 }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem disablePadding>
              <ListItemButton
                component="a"
                href="/login"
                onClick={() => setDrawerOpen(false)}
                disableRipple
                disableTouchRipple
                sx={{ WebkitTapHighlightColor: 'transparent', '&:focus-visible': { outline: 'none' } }}
              >
                <ListItemText primary="Sign In" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component="a"
                href="/signup"
                onClick={() => setDrawerOpen(false)}
                disableRipple
                disableTouchRipple
                sx={{ WebkitTapHighlightColor: 'transparent', '&:focus-visible': { outline: 'none' } }}
              >
                <ListItemText primary="Sign Up" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
