'use client';

import { useRef, useState, useEffect } from 'react';
import axios from 'axios';

import {
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

// ⬇️ NextAuth
import { useSession, signOut as nextAuthSignOut } from 'next-auth/react';

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

function getInitials(input: string) {
  const s = (input || 'User').trim();
  const parts = s.split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return s[0]?.toUpperCase() || 'U';
}

function HeaderUserbox() {

  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState(false);

  // ⬇️ NextAuth session
  const { data: session, status } = useSession();

  const [userName, setUserName] = useState<string>(''); // no "Loading..." by default

  useEffect(() => {
    // 1) If logged in via Google / NextAuth → use session user
    if (status === 'authenticated' && session?.user) {
      const display = session.user.name || session.user.email || 'User';
      setUserName(getInitials(display));
      return;
    }

    // 2) Fallback: password login (your own JWT in localStorage)
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      // final fallback initial
      if (status !== 'loading') setUserName('U');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1] || ''));
      const email = payload?.email;

      if (email) {
        axios
          .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/profile-by-email/${email}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          .then((res) => {
            const fullName = res.data?.fullName || res.data?.name || 'User';
            setUserName(getInitials(fullName));
          })
          .catch(() => setUserName('U'));
      } else {
        setUserName('U');
      }
    } catch {
      setUserName('U');
    }
  }, [session, status]);

  const handleOpen = (): void => setOpen(true);
  const handleClose = (): void => setOpen(false);

  const handleSignOut = async (): Promise<void> => {
    // clear your custom token (password login case)
    localStorage.removeItem('token');
    // sign out NextAuth session (Google login case)
    await nextAuthSignOut({ callbackUrl: '/login' });
  };

  return (
    <>
      <UserBoxButton color="secondary" ref={ref} onClick={handleOpen}>
        <Hidden mdDown>
          <UserBoxText>
            <UserBoxLabel variant="body1">{userName || 'U'}</UserBoxLabel>
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
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuUserBox sx={{ minWidth: 210 }}>
          <UserBoxText>
            <UserBoxLabel variant="body1">{userName || 'U'}</UserBoxLabel>
            <UserBoxDescription variant="body2">
              {status === 'authenticated' ? 'Logged in' : 'Guest'}
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