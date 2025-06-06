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
import AddAlertTwoToneIcon from '@mui/icons-material/AddAlertTwoTone';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { useRouter } from 'next/router';
import DirectoryForm from './DirectoryForm';
import LenderForm from './LenderForm';
import BankerDirectoryForm from './BankerDirectoryForm';

const AvatarPageTitle = styled(Avatar)(
  ({ theme }) => `
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
  `
);

function PageHeader({
  onCreated,
  showAddButton = true
}: {
  onCreated: () => void;
  showAddButton?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const pathname = router.pathname;

  const isLenderRoute = pathname.includes('lender');
  const isBankerRoute = pathname.includes('banker') || pathname.includes('directory');

  const buttonLabel = isLenderRoute
    ? 'Add Lender'
    : isBankerRoute
    ? 'Add Banker Directory'
    : 'Add Directory';

  const dialogTitle = isLenderRoute
    ? 'Add Lender'
    : isBankerRoute
    ? 'Add Banker Directory Entry'
    : 'Add Directory';

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
            <AddAlertTwoToneIcon fontSize="large" />
          </AvatarPageTitle>
          <Box>
            <Typography variant="h3" component="h3" gutterBottom>
              Welcome, F2 Fintech!
            </Typography>
            <Typography variant="subtitle2">"Manage your Directory"</Typography>
          </Box>
        </Box>

        {showAddButton && (
          <Box mt={{ xs: 3, md: 0 }}>
            <Button
              variant="contained"
              startIcon={<AddTwoToneIcon fontSize="small" />}
              onClick={() => setOpen(true)}
            >
              {buttonLabel}
            </Button>
          </Box>
        )}
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>
          {dialogTitle}
          <IconButton
            onClick={() => setOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
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
