// components/HeaderUserbox.tsx
import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Hidden,
  lighten,
  Popover,
  Typography,
  styled
} from '@mui/material';

import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';

const UserBoxButton = styled(Button)(({ theme }) => `
  padding-left: ${theme.spacing(1)};
  padding-right: ${theme.spacing(1)};
`);

const MenuUserBox = styled(Box)(({ theme }) => `
  background: ${theme.colors.alpha.black[5]};
  padding: ${theme.spacing(2)};
`);

const UserBoxText = styled(Box)(({ theme }) => `
  text-align: left;
  padding-left: ${theme.spacing(1)};
`);

const UserBoxLabel = styled(Typography)(({ theme }) => `
  font-weight: ${theme.typography.fontWeightBold};
  color: ${theme.palette.secondary.main};
  display: block;
`);

const UserBoxDescription = styled(Typography)(({ theme }) => `
  color: ${lighten(theme.palette.secondary.main, 0.5)};
`);

function HeaderUserbox() {
  const user = {
    name: 'F2 Fintech',
    avatar: '/static/images/logo/f2fin.png'
  };

  const router = useRouter();
  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState(false);

  const handleOpen = (): void => setOpen(true);
  const handleClose = (): void => setOpen(false);

  const handleSignOut = (): void => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <>
      <UserBoxButton color="secondary" ref={ref} onClick={handleOpen}>
        <Avatar variant="rounded" alt={user.name} src={user.avatar} />
        <Hidden mdDown>
          <UserBoxText>
            <UserBoxLabel variant="body1">{user.name}</UserBoxLabel>
          </UserBoxText>
        </Hidden>
        <Hidden smDown>
          <ExpandMoreTwoToneIcon sx={{ ml: 1 }} />
        </Hidden>
      </UserBoxButton>

      <Popover
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <MenuUserBox sx={{ minWidth: 210 }}>
          <UserBoxText>
            <UserBoxLabel variant="body1">{user.name}</UserBoxLabel>
            <UserBoxDescription variant="body2">
              Logged in
            </UserBoxDescription>
          </UserBoxText>
        </MenuUserBox>

        <Divider />
        <Box sx={{ m: 1 }}>
          <Button color="primary" fullWidth onClick={handleSignOut}>
            <LockOpenTwoToneIcon sx={{ mr: 1 }} />
            Sign out
          </Button>
        </Box>
      </Popover>
    </>
  );
}

export default HeaderUserbox;
