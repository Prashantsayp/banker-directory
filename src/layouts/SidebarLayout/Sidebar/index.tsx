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
  height: '100%',
  backgroundColor: '#ffffff', // ✅ Sidebar background white
  borderRight: `1px solid #e5e7eb`, // ✅ Light divider
  paddingBottom: 68
}));

function Sidebar() {
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);
  const closeSidebar = () => toggleSidebar();
  const theme = useTheme();

  return (
    <>
      {/* Desktop Sidebar */}
      <SidebarWrapper
        sx={{
          display: {
            xs: 'none',
            lg: 'inline-block'
          },
          position: 'fixed',
          left: 0,
          top: 0,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)' // ✅ Soft shadow
        }}
      >
        <Scrollbar>
          {/* Logo */}
          <Box mt={2} display="flex" justifyContent="center">
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

          {/* Divider */}
          <Divider sx={{ mt: 2, mx: 2, background: '#e5e7eb' }} />

          {/* Menu */}
          <SidebarMenu />
        </Scrollbar>

        {/* Bottom Divider */}
        <Divider sx={{ background: '#e5e7eb' }} />
      </SidebarWrapper>

      {/* Mobile Sidebar Drawer */}
      <Drawer
        sx={{ boxShadow: theme.sidebar.boxShadow }}
        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
        open={sidebarToggle}
        onClose={closeSidebar}
        variant="temporary"
        elevation={9}
      >
        <SidebarWrapper>
          <Scrollbar>
            <Box mt={3}>
              <Box mx={2} sx={{ width: 52 }}>
                <img
                  src="/static/images/logo/f2fin.png"
                  alt="F2Fin Logo"
                  style={{ width: '100%' }}
                />
              </Box>
            </Box>

            <Divider sx={{ mt: 3, mx: 2, background: '#e5e7eb' }} />

            <SidebarMenu />
          </Scrollbar>
        </SidebarWrapper>
      </Drawer>
    </>
  );
}

export default Sidebar;
