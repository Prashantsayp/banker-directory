'use client';

import { useRef, useState, useEffect } from 'react';
import axios from 'axios';

import {
  Avatar,
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

import { useSession, signOut as nextAuthSignOut } from 'next-auth/react';

// Avatar button container
const UserBoxButton = styled(Button)(({ theme }) => `
  padding: ${theme.spacing(0.5, 1)};
  border-radius: 999px;
`);

// popover top area
const MenuUserBox = styled(Box)(({ theme }) => `
  background: ${theme.colors.alpha.black[5]};
  padding: ${theme.spacing(2)};
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

  const { data: session, status } = useSession();

  const [initials, setInitials] = useState('U');
  const [fullName, setFullName] = useState('User');
  const [email, setEmail] = useState('---');

  useEffect(() => {
    // NextAuth session
    if (status === 'authenticated' && session?.user) {
      const name = session.user.name || 'User';
      const em = session.user.email || '---';

      setInitials(getInitials(name));
      setFullName(name);
      setEmail(em);
      return;
    }

    // JWT fallback
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1] || ''));
      const userEmail = payload?.email;

      if (!userEmail) return;

      axios
        .get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/profile-by-email/${userEmail}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          const name = res.data?.fullName || res.data?.name || 'User';
          setInitials(getInitials(name));
          setFullName(name);
          setEmail(userEmail);
        })
        .catch(() => {});
    } catch {
      
    }
  }, [session, status]);

  const handleSignOut = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }

    // Logout from NextAuth WITHOUT redirect
    await nextAuthSignOut({ redirect: false });

    // Force redirect to main login (NO callbackUrl)
    if (typeof window !== 'undefined') {
      window.location.href = 'https://connectbankers.com/login';
    }
  };

  return (
    <>
      {/* Avatar Button */}
      <UserBoxButton ref={ref} onClick={() => setOpen(true)}>
        <Avatar
          sx={{
            width: 24,
            height: 24,
            fontSize: 14,
            fontWeight: 700,
            bgcolor: '#2563eb',
            background:
              'linear-gradient(135deg, #6366f1 0%, #2563eb 45%, #0ea5e9 100%)',
            boxShadow: '0 10px 25px rgba(37,99,235,.25)'
          }}
        >
          {initials}
        </Avatar>

        <Hidden smDown>
          <Typography
            sx={{
              ml: 1,
              fontWeight: 700,
              fontSize: 14,
              color: '#111827'
            }}
          >
            {fullName}
          </Typography>
        </Hidden>

        <Hidden smDown>
          <ExpandMoreTwoToneIcon sx={{ ml: 0.5 }} />
        </Hidden>
      </UserBoxButton>

      {/* Popover */}
      <Popover
        anchorEl={ref.current}
        open={isOpen}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { mt: 1.5, borderRadius: 2, minWidth: 260 }
        }}
      >
        <MenuUserBox>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Avatar
              sx={{
                width: 42,
                height: 42,
                fontSize: 16,
                fontWeight: 700,
                bgcolor: '#2563eb',
                background:
                  'linear-gradient(135deg, #6366f1 0%, #2563eb 45%, #0ea5e9 100%)'
              }}
            >
              {initials}
            </Avatar>

            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: 15 }}>
                {fullName}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: '#6b7280', wordBreak: 'break-all' }}
              >
                {email}
              </Typography>
            </Box>
          </Box>
        </MenuUserBox>

        <Divider />

        <Box sx={{ m: 1 }}>
          <Button
            color="primary"
            fullWidth
            onClick={handleSignOut}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            <LockOpenTwoToneIcon sx={{ mr: 1 }} />
            Sign out
          </Button>
        </Box>
      </Popover>
    </>
  );
}

export default HeaderUserbox;
