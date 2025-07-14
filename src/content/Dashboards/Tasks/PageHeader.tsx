import {
  Typography,
  Button,
  Box,
  Avatar,
  styled,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton
} from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import CloseIcon from '@mui/icons-material/Close';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import BusinessIcon from '@mui/icons-material/Business';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import FolderSharedIcon from '@mui/icons-material/FolderShared';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import DirectoryForm from './DirectoryForm';
import LenderForm from './LenderForm';
import BankerDirectoryForm from './BankerDirectoryForm';
import UserForm from './userForm';

const AvatarPageTitle = styled(Avatar)(({ theme }) => `
  width: ${theme.spacing(8)};
  height: ${theme.spacing(8)};
  color: ${theme.colors.primary.main};
  margin-right: ${theme.spacing(2)};
  background: ${
    theme.palette.mode === 'dark'
      ? theme.colors.alpha.trueWhite[10]
      : theme.colors.alpha.white[50]
  };
  box-shadow: ${
    theme.palette.mode === 'dark'
      ? '0 1px 0 ' +
        theme.palette.primary.light +
        ', 0px 2px 4px -3px rgba(0, 0, 0, 0.3), 0px 5px 16px -4px rgba(0, 0, 0, .5)'
      : '0px 2px 4px -3px rgba(0, 0, 0, 0.1), 0px 5px 16px -4px rgba(0, 0, 0, 0.05)'
  };
`);

function PageHeader({
  onCreated,
  showAddButton = true
}: {
  onCreated: () => void;
  showAddButton?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();
  const pathname = router.pathname;

  const isLenderRoute = pathname.includes('lender');
  const isBankerRoute = pathname.includes('banker') || pathname.includes('directory');
  const isUserRoute = pathname.includes('user');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.role);
      } catch (err) {
        console.error('Failed to decode JWT', err);
      }
    }
  }, []);

  const buttonLabel = isLenderRoute
    ? 'Add Lender'
    : isBankerRoute
    ? 'Add Banker Directory'
    : isUserRoute
    ? 'Create User'
    : 'Add Directory';

  const dialogTitle = buttonLabel;

  const IconComponent = isLenderRoute
    ? AccountBalanceIcon
    : isBankerRoute
    ? BusinessIcon
    : isUserRoute
    ? PersonAddAltIcon
    : FolderSharedIcon;

  const shouldShowButton =
    (isUserRoute && userRole === 'admin') ||
    !isUserRoute;

  return (
    <>
      <Box
        display="flex"
        alignItems={{ xs: 'stretch', md: 'center' }}
        flexDirection={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
      >
        <Box display="flex" alignItems="center">
          <AvatarPageTitle variant="rounded">
            <IconComponent fontSize="large" />
          </AvatarPageTitle>
          <Box>
            <Typography variant="h3" component="h3" gutterBottom>
              Welcome, F2 Fintech!
            </Typography>
            <Typography variant="subtitle2">"Manage your Directory"</Typography>
          </Box>
        </Box>

        {showAddButton && shouldShowButton && (
          <Box mt={{ xs: 3, md: 0 }}>
            <Button
              variant="contained"
             sx={{
              color:"#fff"
             }}
              startIcon={<AddTwoToneIcon fontSize="small" />}
              onClick={() => setOpen(true)}
            >
              {buttonLabel}
            </Button>
          </Box>
        )}
      </Box>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            backgroundColor: '#fff',
            borderRadius: 3
          }
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: 'primary.main',
            color: '#fff',
            fontWeight: 600,
            borderBottom: '1px solid #ddd'
          }}
        >
          {dialogTitle}
          <IconButton
            onClick={() => setOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            backgroundColor: '#fff',
            px: 3,
            py: 2
          }}
        >
          {isLenderRoute ? (
            <LenderForm
              onSuccess={() => {
                setOpen(false);
                onCreated();
              }}
            />
          ) : isBankerRoute ? (
            <BankerDirectoryForm
              onSuccess={() => {
                setOpen(false);
                onCreated();
              }}
            />
          ) : isUserRoute ? (
            <UserForm
              onSuccess={() => {
                setOpen(false);
                onCreated();
              }}
            />
          ) : (
            <DirectoryForm
              onSuccess={() => {
                setOpen(false);
                onCreated();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default PageHeader;