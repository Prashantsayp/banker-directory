'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

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
  const router = useRouter();
  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState(false);
  const [userName, setUserName] = useState<string>('Loading...');

  useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn("No token found in localStorage");
    return;
  }

  try {
    const decodedPayload = JSON.parse(atob(token.split('.')[1])); // decode JWT payload
    const email = decodedPayload?.email;

   

    if (email) {
      
       axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/profile-by-email/${email}`, {

          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((res) => {
          const fullName = res.data.fullName || 'User';
          const nameParts = fullName.trim().split(' ');
          let initials = 'U';
          if (nameParts.length >= 2) {
            initials =
              nameParts[0][0].toUpperCase() + nameParts[1][0].toUpperCase();
          } else if (nameParts.length === 1) {
            initials = nameParts[0][0].toUpperCase();
          }
          setUserName(initials);
        })
        .catch((err) => {
          console.error('Error fetching profile:', err);
          setUserName('U');
        });
    }
  } catch (err) {
    console.error('Token decode error:', err);
  }
}, []);


  const handleOpen = (): void => setOpen(true);
  const handleClose = (): void => setOpen(false);

  const handleSignOut = (): void => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <>
      <UserBoxButton color="secondary" ref={ref} onClick={handleOpen}>
        <Avatar variant="rounded" alt={userName} src="/static/images/logo/f2fin.png" />
        <Hidden mdDown>
          <UserBoxText>
            <UserBoxLabel variant="body1">{userName}</UserBoxLabel>
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
            <UserBoxLabel variant="body1">{userName}</UserBoxLabel>
            <UserBoxDescription variant="body2">Logged in</UserBoxDescription>
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
