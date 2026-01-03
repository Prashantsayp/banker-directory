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

/* -------- Nav Link Style (kept, but not used now) -------- */
const LinkBtn = styled(MuiLink)(() => ({
  textDecoration: 'none',
  fontWeight: 500,
  fontSize: 14,
  color: COLORS.ink,
  padding: '6px 10px',
  borderRadius: 999,
  WebkitTapHighlightColor: 'transparent',
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
}));

const Brand = () => (
  <MuiLink
    href="/"
    sx={{
      display: 'inline-flex',
      alignItems: 'center',
      textDecoration: 'none',
      WebkitTapHighlightColor: 'transparent'
    }}
  >
    <Box
      component="img"
      src="/static/images/logo/f2.png"
      alt="F2 Directory Logo"
      sx={{ height: 60, width: 'auto' }}
    />
  </MuiLink>
);


const Navbar: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

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

          {/* CENTER — EMPTY (spacing preserved) */}
          <Box
            sx={{
              display: { xs: 'none', md: 'block' },
            }}
          />

          {/* RIGHT — Login Button */}
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
            onClick={() => setDrawerOpen(true)}
            sx={{ display: { xs: 'inline-flex', md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>

      {/* MOBILE DRAWER — kept same, but links removed */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 300 } }}
      >
        <Box sx={{ p: 2 }}>
          <Brand />

          <Divider sx={{ my: 1.5 }} />

          <List>
            <ListItem disablePadding>
              <ListItemButton
                component="a"
                href="/login"
                onClick={() => setDrawerOpen(false)}
              >
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
