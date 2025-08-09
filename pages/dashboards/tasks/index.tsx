import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import { useState, useEffect } from 'react';
import {

  Container,

  Box,
  styled,
  Button,
 
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import Footer from '@/components/Footer';
import TeamOverview from '@/content/Dashboards/Tasks/TeamOverview';
import DirectoryForm from '@/content/Dashboards/Tasks/DirectoryForm';


const BackgroundBox = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: '#f5f6fa',
  paddingBottom: theme.spacing(4),
  paddingTop: theme.spacing(2)
}));

function DashboardTasks() {
  const [mounted, setMounted] = useState(false);
  const [openForm, setOpenForm] = useState(false);
 
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const handleFormSuccess = () => {
    setOpenForm(false);
    
  };

  return (
    <>
      <Head><title>Bankers Directory</title></Head>
<BackgroundBox>
  <Container maxWidth="lg">
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 2
      }}
    >
      {/* Empty placeholder to keep button position */}
      <Box sx={{ flex: 1 }} />

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setOpenForm(true)}
        sx={{ borderRadius: 2 }}
      >
        Add Banker Profile
      </Button>
    </Box>

    {/* Cards grid; refresh when form submits */}
    <TeamOverview userRole="admin"  />
  </Container>
</BackgroundBox>

      <Footer />

      {/* Modal: Add Banker Directory */}
      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        maxWidth="md"
        fullWidth
        scroll="body"
        PaperProps={{ sx: { borderRadius: 3, background: '#fff' } }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontWeight: 600,
            color: 'primary.main'
          }}
        >
          Add Banker Directory
          <IconButton onClick={() => setOpenForm(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <DirectoryForm onSuccess={handleFormSuccess} />
        </DialogContent>
      </Dialog>
    </>
  );
}

DashboardTasks.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;
export default DashboardTasks;
