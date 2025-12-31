// SidebarMenu.tsx
import { useContext } from 'react';
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
    padding: 0,
    '& > .MuiList-root': {
      padding: 0
    }
  },
  '.MuiListSubheader-root': {
    textTransform: 'uppercase',
    fontWeight: 800,
    fontSize: theme.typography.pxToRem(10),
    letterSpacing: '0.1em',
    color: alpha('#94a3b8', 0.7),
    padding: theme.spacing(0, 1.5, 1.2, 1.5),
    lineHeight: 1.4,
    marginTop: theme.spacing(2),
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 12,
      right: 12,
      height: 1,
      background: `linear-gradient(90deg, ${alpha('#cbd5e1', 0.2)}, transparent)`
    }
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
    ? 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)'
    : 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(59,130,246,0.12))',
  color: active ? '#ffffff' : '#6366f1',
  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: active ? '0 4px 12px rgba(99,102,241,0.3)' : 'none',
  '& .MuiSvgIcon-root': {
    fontSize: '1.25rem'
  }
}));

const SubMenuWrapper = styled(Box)(({ theme }) => ({
  '.MuiList-root': {
    '.MuiListItem-root': {
      padding: '3px 0',
      '.MuiButton-root': {
        position: 'relative',
        display: 'flex',
        color: '#64748b',
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: theme.spacing(1.2, 1.5),
        fontWeight: 600,
        fontSize: theme.typography.pxToRem(14),
        borderRadius: 12,
        textTransform: 'none',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        gap: theme.spacing(1.5),
        overflow: 'hidden',

        '&::before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          borderRadius: '0 999px 999px 0',
          background: 'linear-gradient(180deg, #6366f1 0%, #3b82f6 100%)',
          transform: 'scaleY(0)',
          transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          transformOrigin: 'center'
        },

        '&::after': {
          content: '""',
          position: 'absolute',
          inset: 0,
          borderRadius: 12,
          background:
            'linear-gradient(135deg, rgba(99,102,241,0.03), rgba(59,130,246,0.05))',
          opacity: 0,
          transition: 'opacity 0.2s ease-out'
        },

        '.MuiButton-startIcon': {
          marginRight: 0,
          zIndex: 1
        },

        '& .button-label': {
          zIndex: 1,
          position: 'relative'
        },

        '&:hover': {
          backgroundColor: alpha('#f1f5f9', 0.6),
          color: '#1e293b',
          transform: 'translateX(2px)',

          '&::after': {
            opacity: 1
          },

          '& .icon-bubble': {
            background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(99,102,241,0.25)'
          }
        },

        '&.active': {
          backgroundColor: alpha('#eef2ff', 0.8),
          color: '#1e293b',
          boxShadow: `0 2px 8px ${alpha(
            '#6366f1',
            0.12
          )}, inset 0 0 0 1px ${alpha('#6366f1', 0.1)}`,

          '&::before': {
            transform: 'scaleY(1)'
          },

          '&::after': {
            opacity: 1,
            background:
              'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(59,130,246,0.08))'
          }
        }
      }
    }
  }
}));

const StyledBadge = styled(Badge)(() => ({
  '& .MuiBadge-badge': {
    right: 8,
    top: 10,
    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
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

  let userRole: string | null = null;
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userRole = payload.role;
    } catch {
      // ignore invalid token
    }
  }

  const menuItems: MenuItemConfig[] = [
    {
      label: 'Bankers Profile',
      href: '/dashboards',
      icon: <DashboardCustomizeTwoToneIcon />,
      badge: null,
      tooltip: 'View all banker profiles'
    },
    {
      label: 'Bankers Directory',
      href: '/directory/tasks',
      icon: <ContactPageTwoToneIcon />,
      tooltip: 'Search & filter bankers',
      badge: null
    },
    {
      label: 'Lenders',
      href: '/lender/tasks',
      icon: <AccountBalanceTwoToneIcon />,
      badge: null,
      tooltip: 'Banks & NBFCs database'
    }
  ];

  const adminItems: MenuItemConfig[] = [
    {
      label: 'Users',
      href: '/user/tasks',
      icon: <GroupTwoToneIcon />,
      tooltip: 'Manage platform users',
      badge: pendingUsersCount || null
    },
    {
      label: 'Directory Review',
      href: '/directoryReview/tasks',
      icon: <FactCheckTwoToneIcon />,
      tooltip: 'Review pending submissions',
      badge: pendingDirectoryCount || null
    }
  ];

  return (
    <MenuWrapper>
      {/* Main items */}
      <List component="div">
        <SubMenuWrapper>
          <List component="div">
            {menuItems.map((item) => (
              <ListItem component="div" key={item.href}>
                <NextLink href={item.href} passHref legacyBehavior>
                  <Tooltip title={item.tooltip} placement="right" arrow>
                    <Button
                      className={currentRoute === item.href ? 'active' : ''}
                      disableRipple
                      component="a"
                      onClick={closeSidebar}
                      startIcon={
                        <IconBubble
                          className="icon-bubble"
                          active={currentRoute === item.href}
                        >
                          {item.icon}
                        </IconBubble>
                      }
                    >
                      <Box
                        className="button-label"
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

      {/* Admin section */}
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
                        className={currentRoute === item.href ? 'active' : ''}
                        disableRipple
                        component="a"
                        onClick={closeSidebar}
                        startIcon={
                          <IconBubble
                            className="icon-bubble"
                            active={currentRoute === item.href}
                          >
                            {item.icon}
                          </IconBubble>
                        }
                      >
                        <Box
                          className="button-label"
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
