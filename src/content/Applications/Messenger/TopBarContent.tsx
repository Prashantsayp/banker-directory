// Header.tsx
import {
  alpha,
  AppBar,
  Box,
  IconButton,
  InputBase,
  Toolbar,
  Typography,
  Avatar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import { useContext } from 'react';
import { SidebarContext } from 'src/contexts/SidebarContext';

// import HeaderNotifications from './HeaderNotifications'; 

// Search box style
const SearchRoot = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 999,
  backgroundColor: alpha('#e5e7eb', 0.8),
  '&:hover': {
    backgroundColor: alpha('#e5e7eb', 1)
  },
  marginLeft: theme.spacing(2),
  width: '100%',
  maxWidth: 320,
  display: 'flex',
  alignItems: 'center',
  paddingInline: theme.spacing(1.5),
  paddingBlock: theme.spacing(0.25)
}));

const SearchInput = styled(InputBase)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  flex: 1,
  fontSize: 14
}));

function Header() {
  const { toggleSidebar } = useContext(SidebarContext);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Toolbar
        sx={{
          minHeight: 64,
          px: { xs: 2, lg: 3 },
          display: 'flex',
          justifyContent: 'space-between',
          gap: 2
        }}
      >
        {/* LEFT: Logo + Name */}
        <Box display="flex" alignItems="center" gap={1.5}>
          {/* Mobile menu icon */}
          <Box sx={{ display: { xs: 'inline-flex', lg: 'none' } }}>
            <IconButton
              edge="start"
              onClick={toggleSidebar}
              sx={{ mr: 1 }}
            >
              <MenuIcon sx={{ color: '#4b5563' }} />
            </IconButton>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.2
            }}
          >
            <Box sx={{ width: 38 }}>
              <img
                src="/static/images/logo/f2.png" // 👈 tumhara logo
                alt="F2 Fintech"
                style={{ width: '100%', display: 'block' }}
              />
            </Box>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, color: '#111827', lineHeight: 1.2 }}
              >
                FINTECH
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: '#9ca3af', lineHeight: 1.2 }}
              >
                Banker Experience OS
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* CENTER: Search (optional) */}
        <Box
          sx={{
            flex: 1,
            display: { xs: 'none', md: 'flex' },
            justifyContent: 'center'
          }}
        >
          <SearchRoot>
            <SearchIcon sx={{ fontSize: 18, color: '#9ca3af' }} />
            <SearchInput
              placeholder="Search bankers, lenders, users…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </SearchRoot>
        </Box>

        {/* RIGHT: Icons + Profile */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          {/* Mobile search icon only */}
          <Box sx={{ display: { xs: 'inline-flex', md: 'none' } }}>
            <IconButton>
              <SearchIcon sx={{ color: '#6b7280' }} />
            </IconButton>
          </Box>

          {/* Notifications (tumhara refined component) */}
          {/* <HeaderNotifications /> */}

          {/* User avatar */}
          <Box
            sx={{
              ml: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: '#2563eb',
                fontSize: 14,
                fontWeight: 600
              }}
            >
              AR
            </Avatar>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
