import { useContext } from 'react';

import {
  Box,
  alpha,
  Stack,
  IconButton,
  Tooltip,
  styled
} from '@mui/material';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';

import { SidebarContext } from 'src/contexts/SidebarContext';

import HeaderButtons from './Buttons';
import HeaderUserbox from './Userbox';
import HeaderMenu from './Menu';

// 🔹 yahan se header height control karna sabse easy hai
const HEADER_HEIGHT = 60; // px

const HeaderWrapper = styled(Box)(({ theme }) => ({
  height: HEADER_HEIGHT,
  color: theme.header.textColor,
  padding: theme.spacing(0, 2),
  right: 0,
  zIndex: 6,
  backgroundColor: '#ffffff',
  position: 'fixed',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  borderBottom: `1px solid ${alpha(theme.colors.alpha.black[100], 0.06)}`,
  backdropFilter: 'blur(6px)',
  boxShadow: `0 6px 20px ${alpha('#0f172a', 0.04)}`, // thoda halka shadow
  [theme.breakpoints.up('lg')]: {
    left: theme.sidebar.width,
    width: 'auto'
  }
}));

function Header() {
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);

  return (
    <HeaderWrapper>
      {/* LEFT: Logo / main menu */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{
          pr: 2,
          mr: 2,
          borderRight: (theme) =>
            `1px solid ${alpha(theme.colors.alpha.black[100], 0.06)}`
        }}
      >
        <HeaderMenu />
      </Stack>

      {/* RIGHT: actions + user + mobile toggle */}
      <Box
        display="flex"
        alignItems="center"
        sx={{ gap: 1.5 }}
      >
        <HeaderButtons />
        <HeaderUserbox />

        {/* Mobile sidebar toggle */}
        <Box
          component="span"
          sx={{
            ml: 1,
            display: { lg: 'none', xs: 'inline-block' }
          }}
        >
          <Tooltip arrow title="Toggle Menu">
            <IconButton
              onClick={toggleSidebar}
              sx={{
                borderRadius: 999,
                p: 0.7,
                backgroundColor: alpha('#e5e7eb', 0.6),
                '&:hover': {
                  backgroundColor: alpha('#e5e7eb', 0.95)
                },
                color: '#111827'
              }}
            >
              {sidebarToggle ? (
                <CloseTwoToneIcon fontSize="small" />
              ) : (
                <MenuTwoToneIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </HeaderWrapper>
  );
}

export default Header;
