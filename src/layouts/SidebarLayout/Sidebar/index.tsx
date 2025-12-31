// Sidebar.tsx
import { useContext } from 'react';
import Scrollbar from 'src/components/Scrollbar';
import { SidebarContext } from 'src/contexts/SidebarContext';

import {
  Box,
  Drawer,
  styled,
  Divider,
  useTheme
} from '@mui/material';

import SidebarMenu from './SidebarMenu';

const SidebarWrapper = styled(Box)(({ theme }) => ({
  width: theme.sidebar.width,
  minWidth: theme.sidebar.width,
  color: theme.palette.text.primary,
  position: 'relative',
  zIndex: 7,
  height: '100vh',              // 🔑 full screen height
  backgroundColor: '#ffffff',
  borderRight: `1px solid #e5e7eb`,
  paddingBottom: 68
}));

function Sidebar() {
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);
  const closeSidebar = () => toggleSidebar();
  const theme = useTheme();

  const SidebarContent = (
    <SidebarWrapper>
      <Scrollbar>
        {/* Logo block – exactly tumhara wala */}
        <Box mt={2} mb={1.5} display="flex" justifyContent="center">
          <Box sx={{ width: 90 }}>
            <a href="/">
              <img
                src="/static/images/logo/f2.png"
                alt="F2Fin Logo"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </a>
          </Box>
        </Box>

        <Divider sx={{ mx: 2.5, mb: 1.5, background: '#e5e7eb' }} />

        {/* Menu */}
        <SidebarMenu />
      </Scrollbar>

      <Divider sx={{ background: '#e5e7eb' }} />
    </SidebarWrapper>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <Box
        sx={{
          display: {
            xs: 'none',
            lg: 'inline-block'
          },
          position: 'fixed',
          left: 0,
          top: 0,
          height: '100vh',                     // 🔑 parent height
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}
      >
        {SidebarContent}
      </Box>

      {/* Mobile Sidebar Drawer */}
      <Drawer
        sx={{ boxShadow: theme.sidebar.boxShadow }}
        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
        open={sidebarToggle}
        onClose={closeSidebar}
        variant="temporary"
        elevation={9}
      >
        {SidebarContent}
      </Drawer>
    </>
  );
}

export default Sidebar;
