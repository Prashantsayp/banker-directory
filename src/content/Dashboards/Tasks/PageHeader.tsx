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

import { useState } from 'react';
import { useRouter } from 'next/router';

import DirectoryForm from './DirectoryForm';
import LenderForm from './LenderForm';
import BankerDirectoryForm from './BankerDirectoryForm';
import UserForm from './userForm';

const AvatarPageTitle = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(8),
  height: theme.spacing(8),
  color: theme.palette.primary.main,
  marginRight: theme.spacing(2),
  backgroundColor: '#f4f6fa',
  boxShadow: '0px 2px 8px rgba(0,0,0,0.08)'
}));

const PageHeader = ({ onCreated }: { onCreated: () => void }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const path = router.pathname;

  let FormComponent = DirectoryForm;
  let icon = <PersonAddAltIcon fontSize="large" />;
  let label = 'Add Directory';

  if (path.includes('lender')) {
    FormComponent = LenderForm;
    icon = <AccountBalanceIcon fontSize="large" />;
    label = 'Add Lender';
  } else if (path.includes('banker') || path.includes('directory')) {
    FormComponent = BankerDirectoryForm;
    icon = <BusinessIcon fontSize="large" />;
    label = 'Add Banker Directory';
  } else if (path.includes('user')) {
    FormComponent = UserForm;
    icon = <PersonAddAltIcon fontSize="large" />;
    label = 'Create User';
  }

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        flexDirection={{ xs: 'column', md: 'row' }}
      >
        <Box display="flex" alignItems="center">
          <AvatarPageTitle variant="rounded">{icon}</AvatarPageTitle>
          <Box>
            <Typography variant="h3">Welcome, F2 Fintech!</Typography>
            <Typography variant="subtitle2">Manage your Directory</Typography>
          </Box>
        </Box>

        <Box mt={{ xs: 2, md: 0 }}>
          <Button
            variant="contained"
            startIcon={<AddTwoToneIcon />}
            sx={{ color: '#fff' }}
            onClick={() => setOpen(true)}
          >
            {label}
          </Button>
        </Box>
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle
          sx={{
            backgroundColor: 'primary.main',
            color: '#fff',
            fontWeight: 600
          }}
        >
          {label}
          <IconButton
            onClick={() => setOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8, color: '#fff' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <FormComponent
            onSuccess={() => {
              setOpen(false);
              onCreated();
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PageHeader;
