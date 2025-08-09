import { useContext } from 'react';
import { useRouter } from 'next/router';
import {
  ListSubheader,

  Box,
  List,
  styled,
  Button,
  ListItem,
  Chip
} from '@mui/material';
import NextLink from 'next/link';
import { SidebarContext } from 'src/contexts/SidebarContext';

import DashboardCustomizeTwoToneIcon from '@mui/icons-material/DashboardCustomizeTwoTone';
import ContactPageTwoToneIcon from '@mui/icons-material/ContactPageTwoTone';
import AccountBalanceTwoToneIcon from '@mui/icons-material/AccountBalanceTwoTone';
import GroupTwoToneIcon from '@mui/icons-material/GroupTwoTone';
import FactCheckTwoToneIcon from '@mui/icons-material/FactCheckTwoTone';

const MenuWrapper = styled(Box)(({ theme }) => ({
  '.MuiList-root': {
    padding: theme.spacing(1),
    '& > .MuiList-root': {
      padding: `0 ${theme.spacing(0)} ${theme.spacing(1)}`
    }
  },
  '.MuiListSubheader-root': {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: theme.typography.pxToRem(14),
    color: '#9ca3af',
    padding: theme.spacing(0, 2.5),
    lineHeight: 1.4
  }
}));

const SubMenuWrapper = styled(Box)(({ theme }) => ({
  '.MuiList-root': {
    '.MuiListItem-root': {
      padding: '1px 0',
      '.MuiButton-root': {
        display: 'flex',
        color: '#4b5563',
        backgroundColor: 'transparent',
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: theme.spacing(1.2, 2),
        fontWeight: 500,
        fontSize: theme.typography.pxToRem(15),
        borderRadius: '10px',
        textTransform: 'none',

        '.MuiButton-startIcon': {
          color: '#5c60f5',
          fontSize: theme.typography.pxToRem(20),
          marginRight: theme.spacing(1)
        },

        '&.active, &:hover': {
          backgroundColor: '#edeef0ff',
          color: '#051027ff',
          '.MuiButton-startIcon': {
            color: '#2563EB'
          }
        }
      }
    }
  }
}));

const NewBadge = () => (
  <Chip
    label="NEW"
    size="small"
    sx={{
      bgcolor: '#dcfce7',
      color: '#22c55e',
      fontSize: '0.65rem',
      fontWeight: 600,
      ml: 1,
      height: 20,
      px: 1
    }}
  />
);

function SidebarMenu() {
  const { closeSidebar } = useContext(SidebarContext);
  const router = useRouter();
  const currentRoute = router.pathname;

  let userRole: string | null = null;
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userRole = payload.role;
    } catch (err) {
      console.error('Invalid token', err);
    }
  }

  return (
    <MenuWrapper>
      <List
        component="div"
        subheader={<ListSubheader component="div" disableSticky>Dashboards</ListSubheader>}
      >
        <SubMenuWrapper>
          <List component="div">

            <ListItem component="div">
              <NextLink href="/dashboards" passHref>
                <Button
                  className={currentRoute === '/dashboards' ? 'active' : ''}
                  disableRipple
                  component="a"
                  onClick={closeSidebar}
                  startIcon={<DashboardCustomizeTwoToneIcon />}
                >
                  Bankers Profile
                </Button>
              </NextLink>
            </ListItem>

            <ListItem component="div">
              <NextLink href="/directory/tasks" passHref>
                <Button
                  className={currentRoute === '/directory/tasks' ? 'active' : ''}
                  disableRipple
                  component="a"
                  onClick={closeSidebar}
                  startIcon={<ContactPageTwoToneIcon />}
                >
                  Bankers Directory 
                </Button>
              </NextLink>
            </ListItem>

            <ListItem component="div">
              <NextLink href="/lender/tasks" passHref>
                <Button
                  className={currentRoute === '/lender/tasks' ? 'active' : ''}
                  disableRipple
                  component="a"
                  onClick={closeSidebar}
                  startIcon={<AccountBalanceTwoToneIcon />}
                >
                  Lenders 
                </Button>
              </NextLink>
            </ListItem>

            {userRole === 'admin' && (
              <>
                <ListItem component="div">
                  <NextLink href="/user/tasks" passHref>
                    <Button
                      className={currentRoute === '/user/tasks' ? 'active' : ''}
                      disableRipple
                      component="a"
                      onClick={closeSidebar}
                      startIcon={<GroupTwoToneIcon />}
                    >
                      Users
                    </Button>
                  </NextLink>
                </ListItem>

                <ListItem component="div">
                  <NextLink href="/directoryReview/tasks" passHref>
                    <Button
                      className={currentRoute === '/directoryReview/tasks' ? 'active' : ''}
                      disableRipple
                      component="a"
                      onClick={closeSidebar}
                      startIcon={<FactCheckTwoToneIcon />}
                    >
                      Directory Review <NewBadge />
                    </Button>
                  </NextLink>
                </ListItem>
              </>
            )}
          </List>
        </SubMenuWrapper>
      </List>
    </MenuWrapper>
  );
}

export default SidebarMenu;
