import { useContext } from 'react';
import { useRouter } from 'next/router';
import {
  ListSubheader,
  alpha,
  Box,
  List,
  styled,
  Button,
  ListItem
} from '@mui/material';
import NextLink from 'next/link';
import { SidebarContext } from 'src/contexts/SidebarContext';

import DesignServicesTwoToneIcon from '@mui/icons-material/DesignServicesTwoTone';
import BrightnessLowTwoToneIcon from '@mui/icons-material/BrightnessLowTwoTone';
import MmsTwoToneIcon from '@mui/icons-material/MmsTwoTone';
// import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import PersonOutlineTwoToneIcon from '@mui/icons-material/PersonOutlineTwoTone';

const MenuWrapper = styled(Box)(
  ({ theme }) => `
  .MuiList-root {
    padding: ${theme.spacing(1)};
    & > .MuiList-root {
      padding: 0 ${theme.spacing(0)} ${theme.spacing(1)};
    }
  }

  .MuiListSubheader-root {
    text-transform: uppercase;
    font-weight: bold;
    font-size: ${theme.typography.pxToRem(12)};
    color: ${theme.colors.alpha.trueWhite[50]};
    padding: ${theme.spacing(0, 2.5)};
    line-height: 1.4;
  }
`
);

const SubMenuWrapper = styled(Box)(
  ({ theme }) => `
  .MuiList-root {
    .MuiListItem-root {
      padding: 1px 0;

      .MuiButton-root {
        display: flex;
        color: ${theme.colors.alpha.trueWhite[70]};
        background-color: transparent;
        width: 100%;
        justify-content: flex-start;
        padding: ${theme.spacing(1.2, 3)};

        .MuiButton-startIcon {
          color: ${theme.colors.alpha.trueWhite[30]};
          font-size: ${theme.typography.pxToRem(20)};
          margin-right: ${theme.spacing(1)};
        }

        .MuiButton-endIcon {
          color: ${theme.colors.alpha.trueWhite[50]};
          margin-left: auto;
          opacity: 0.8;
          font-size: ${theme.typography.pxToRem(20)};
        }

        &.active,
        &:hover {
          background-color: ${alpha(theme.colors.alpha.trueWhite[100], 0.06)};
          color: ${theme.colors.alpha.trueWhite[100]};

          .MuiButton-startIcon,
          .MuiButton-endIcon {
            color: ${theme.colors.alpha.trueWhite[100]};
          }
        }
      }
    }
  }
`
);

function SidebarMenu() {
  const { closeSidebar } = useContext(SidebarContext);
  const router = useRouter();
  const currentRoute = router.pathname;

  // Get user role from JWT
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
    <>
      <MenuWrapper>
        <List component="div">
          <SubMenuWrapper>
            <List component="div">
              <ListItem component="div">
                <NextLink href="/" passHref>
                  <Button
                    className={currentRoute === '/' ? 'active' : ''}
                    disableRipple
                    component="a"
                    onClick={closeSidebar}
                    startIcon={<DesignServicesTwoToneIcon />}
                  >
                    Overview
                  </Button>
                </NextLink>
              </ListItem>
            </List>
          </SubMenuWrapper>
        </List>

        <List
          component="div"
          subheader={
            <ListSubheader component="div" disableSticky>
              Dashboards
            </ListSubheader>
          }
        >
          <SubMenuWrapper>
            <List component="div">
              <ListItem component="div">
                <NextLink href="/dashboards" passHref>
                  <Button
                    className={currentRoute === '/dashboards/tasks' ? 'active' : ''}
                    disableRipple
                    component="a"
                    onClick={closeSidebar}
                    startIcon={<BrightnessLowTwoToneIcon />}
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
                    startIcon={<BrightnessLowTwoToneIcon />}
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
                    startIcon={<MmsTwoToneIcon />}
                  >
                    Lenders
                  </Button>
                </NextLink>
              </ListItem>

              {userRole === 'admin' && (
                <ListItem component="div">
                  <NextLink href="/user/tasks" passHref>
                    <Button
                      className={currentRoute === '/user/tasks' ? 'active' : ''}
                      disableRipple
                      component="a"
                      onClick={closeSidebar}
                      startIcon={<PersonOutlineTwoToneIcon />}
                    >
                      Users
                    </Button>
                  </NextLink>
                </ListItem>
              )}
            </List>
          </SubMenuWrapper>
        </List>

        {/* <List
          component="div"
          subheader={
            <ListSubheader component="div" disableSticky>
              Accounts
            </ListSubheader>
          }
        >
          <SubMenuWrapper>
            <List component="div">
              <ListItem component="div">
                <NextLink href="/management/profile" passHref>
                  <Button
                    className={currentRoute === '/management/profile' ? 'active' : ''}
                    disableRipple
                    component="a"
                    onClick={closeSidebar}
                    startIcon={<AccountCircleTwoToneIcon />}
                  >
                    User Profile
                  </Button>
                </NextLink>
              </ListItem>
            </List>
          </SubMenuWrapper>
        </List> */}
      </MenuWrapper>
    </>
  );
}

export default SidebarMenu;
