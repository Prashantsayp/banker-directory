// src/layouts/SidebarLayout/SidebarMenu.tsx

import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  List,
  styled,
  Button,
  ListItem,
  Badge,
  Tooltip,
  alpha,
  ListSubheader
} from '@mui/material';
import NextLink from 'next/link';
import { SidebarContext } from 'src/contexts/SidebarContext';

import DashboardCustomizeTwoToneIcon from '@mui/icons-material/DashboardCustomizeTwoTone';
import ContactPageTwoToneIcon from '@mui/icons-material/ContactPageTwoTone';
import AccountBalanceTwoToneIcon from '@mui/icons-material/AccountBalanceTwoTone';
import GroupTwoToneIcon from '@mui/icons-material/GroupTwoTone';
import FactCheckTwoToneIcon from '@mui/icons-material/FactCheckTwoTone';

interface SidebarMenuProps {
  pendingUsersCount?: number;
  pendingDirectoryCount?: number;
}

interface MenuItemConfig {
  label: string;
  href: string;
  icon: React.ReactNode;
  tooltip: string;
  badge?: number | null;
}

const MenuWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 2.5, 3),
  '.MuiList-root': {
    padding: 0
  }
}));

const IconBubble = styled('span')<{ active?: boolean }>(({ active }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 36,
  height: 36,
  borderRadius: 12,
  background: active
    ? 'linear-gradient(135deg,#6366f1,#3b82f6)'
    : 'linear-gradient(135deg,rgba(99,102,241,.08),rgba(59,130,246,.12))',
  color: active ? '#fff' : '#6366f1',
  transition: 'all .2s ease'
}));

const SubMenuWrapper = styled(Box)(({ theme }) => ({
  '.MuiListItem-root': {
    padding: '3px 0',
    '.MuiButton-root': {
      position: 'relative',
      width: '100%',
      justifyContent: 'flex-start',
      padding: theme.spacing(1.2, 1.6),
      borderRadius: 12,
      textTransform: 'none',
      fontWeight: 600,
      fontSize: theme.typography.pxToRem(14),
      color: '#64748b',
      gap: theme.spacing(1.5),
      '&.active': {
        backgroundColor: alpha('#eef2ff', 0.9),
        color: '#1e293b',
        boxShadow: `0 2px 8px ${alpha('#6366f1', 0.18)}`
      },
      '&:hover': {
        backgroundColor: alpha('#f1f5f9', 0.8),
        color: '#1e293b'
      }
    }
  }
}));

const StyledBadge = styled(Badge)(() => ({
  '& .MuiBadge-badge': {
    right: 8,
    top: 10,
    background: 'linear-gradient(135deg,#ef4444,#dc2626)',
    color: '#fff',
    fontSize: '0.65rem',
    fontWeight: 700,
    height: 18,
    minWidth: 18,
    padding: '0 4px',
    boxShadow: '0 2px 8px rgba(239,68,68,0.4)'
  }
}));

function SidebarMenu({
  pendingUsersCount = 0,
  pendingDirectoryCount = 0
}: SidebarMenuProps) {
  const { closeSidebar } = useContext(SidebarContext);
  const router = useRouter();
  const currentRoute = router.pathname;

  const [userRole, setUserRole] = useState<string | null>(null);

  // 🔹 JWT se role nikalna (sirf client pe)
  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserRole(payload.role || null);
    } catch {
      setUserRole(null);
    }
  }, []);

  // 🔹 Common menu (sabko dikhega – including Directory Review)
  const menuItems: MenuItemConfig[] = [
    {
      label: 'Bankers Profile',
      href: '/dashboards',
      icon: <DashboardCustomizeTwoToneIcon />,
      tooltip: 'View all banker profiles'
    },
    {
      label: 'Bankers Directory',
      href: '/directory/tasks',
      icon: <ContactPageTwoToneIcon />,
      tooltip: 'Search & filter bankers'
    },
    {
      label: 'Lenders',
      href: '/lender/tasks',
      icon: <AccountBalanceTwoToneIcon />,
      tooltip: 'Banks & NBFCs database'
    },
    {
      label: 'Directory Review',
      href: '/directoryReview/tasks',
      icon: <FactCheckTwoToneIcon />,
      tooltip:
        userRole === 'admin'
          ? 'Review & approve all submissions'
          : 'Track your directory submission status',
      // badge sirf admin ko
      badge: userRole === 'admin' ? pendingDirectoryCount || null : null
    }
  ];

  // 🔹 Admin extra
  const adminItems: MenuItemConfig[] = [
    {
      label: 'Users',
      href: '/user/tasks',
      icon: <GroupTwoToneIcon />,
      tooltip: 'Manage platform users',
      badge: pendingUsersCount || null
    }
  ];

  // Debug ke liye (agar bhi nahi dikhe to console check kar sakte ho)
  console.log('SidebarMenu role:', userRole, 'MENU ITEMS:', menuItems);

  return (
    <MenuWrapper>
      {/* Main items (ALL ROLES) */}
      <List component="div">
        <SubMenuWrapper>
          <List component="div">
            {menuItems.map((item) => (
              <ListItem component="div" key={item.href}>
                <NextLink href={item.href} passHref legacyBehavior>
                  <Tooltip title={item.tooltip} placement="right" arrow>
                    <Button
                      disableRipple
                      component="a"
                      onClick={closeSidebar}
                      className={currentRoute === item.href ? 'active' : ''}
                      startIcon={
                        <IconBubble active={currentRoute === item.href}>
                          {item.icon}
                        </IconBubble>
                      }
                    >
                      <Box
                        sx={{
                          flex: 1,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <span>{item.label}</span>
                        {item.badge && item.badge > 0 && (
                          <StyledBadge badgeContent={item.badge} max={99} />
                        )}
                      </Box>
                    </Button>
                  </Tooltip>
                </NextLink>
              </ListItem>
            ))}
          </List>
        </SubMenuWrapper>
      </List>

      {/* ADMIN ONLY SECTION */}
      {userRole === 'admin' && (
        <List
          component="div"
          subheader={
            <ListSubheader component="div" disableSticky>
              Administration
            </ListSubheader>
          }
        >
          <SubMenuWrapper>
            <List component="div">
              {adminItems.map((item) => (
                <ListItem component="div" key={item.href}>
                  <NextLink href={item.href} passHref legacyBehavior>
                    <Tooltip title={item.tooltip} placement="right" arrow>
                      <Button
                        disableRipple
                        component="a"
                        onClick={closeSidebar}
                        className={currentRoute === item.href ? 'active' : ''}
                        startIcon={
                          <IconBubble active={currentRoute === item.href}>
                            {item.icon}
                          </IconBubble>
                        }
                      >
                        <Box
                          sx={{
                            flex: 1,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <span>{item.label}</span>
                          {item.badge && item.badge > 0 && (
                            <StyledBadge badgeContent={item.badge} max={99} />
                          )}
                        </Box>
                      </Button>
                    </Tooltip>
                  </NextLink>
                </ListItem>
              ))}
            </List>
          </SubMenuWrapper>
        </List>
      )}
    </MenuWrapper>
  );
}

export default SidebarMenu;
