'use client';

import { useRef, useState, useEffect } from 'react';
import axios from 'axios';

import {
  Box,
  Button,
  Divider,
  Hidden,
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

  const [initials, setInitials] = useState<string>('U');
  const [fullName, setFullName] = useState<string>('User');
  const [email, setEmail] = useState<string>('---');

  useEffect(() => {
    // 1) If logged in via Google / NextAuth
    if (status === 'authenticated' && session?.user) {
      const displayName = session.user.name || 'User';
      const displayEmail = session.user.email || '---';

      setInitials(getInitials(displayName));
      setFullName(displayName);
      setEmail(displayEmail);
      return;
    }

    // 2) Fallback: JWT login
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      if (status !== 'loading') {
        setInitials('U');
        setFullName('User');
        setEmail('---');
      }
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1] || ''));
      const userEmail = payload?.email;

      if (userEmail) {
        axios
          .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/profile-by-email/${userEmail}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          .then((res) => {
            const name = res.data?.fullName || res.data?.name || 'User';
            setInitials(getInitials(name));
            setFullName(name);
            setEmail(userEmail);
          })
          .catch(() => {
            setInitials('U');
            setFullName('User');
            setEmail('---');
          });
      } else {
        setInitials('U');
        setFullName('User');
        setEmail('---');
      }
    } catch {
      setInitials('U');
      setFullName('User');
      setEmail('---');
    }
  }, [session, status]);

  const handleOpen = (): void => setOpen(true);
  const handleClose = (): void => setOpen(false);

  const handleSignOut = async (): Promise<void> => {
    localStorage.removeItem('token'); // JWT clear
    await nextAuthSignOut({ callbackUrl: '/login' }); // NextAuth logout
  };

  return (
    <>
      <UserBoxButton color="secondary" ref={ref} onClick={handleOpen}>
        <Hidden mdDown>
          <UserBoxText>
            <UserBoxLabel variant="body1">{initials}</UserBoxLabel>
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
        <MenuUserBox sx={{ minWidth: 230 }}>
          <UserBoxText>
            <UserBoxLabel variant="body1">{fullName}</UserBoxLabel>
            <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
              {email}
            </Typography>
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
