import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import { ChangeEvent, useEffect, useState } from 'react';
import PageHeader from '@/content/Dashboards/Tasks/PageHeader';
import Footer from '@/components/Footer';
import {
  Box,
  Grid,
  Tab,
  Tabs,
  Typography,
  Avatar,
  Paper,
  Chip,
  Divider,
  Stack,
  TextField,
  Container,
  Card,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import axios from 'axios';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import { styled } from '@mui/material/styles';
import ClearIcon from '@mui/icons-material/Clear';
import { jwtDecode } from 'jwt-decode';

interface Banker {
  _id: string;
  bankerName: string;
  associatedWith: string;
  locationCategories: string[];
  emailOfficial: string;
  emailPersonal?: string;
  contact: string;
  product: string[];
}

const BankerOverview = ({ role }: { role: string | null }) => {
  const [bankers, setBankers] = useState<Banker[]>([]);
  const [filteredBankers, setFilteredBankers] = useState<Banker[]>([]);
  const [searchLocation, setSearchLocation] = useState('');
  const [searchBanker, setSearchBanker] = useState('');
  const [searchAssociatedWith, setSearchAssociatedWith] = useState('');
  const [searchEmailOfficial, setSearchEmailOfficial] = useState('');

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editBanker, setEditBanker] = useState<Banker | null>(null);
 

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/banker-directory/get-directories`)
      .then((res) => {
        setBankers(res.data);
        setFilteredBankers(res.data);
      })
      .catch((err) => console.error('❌ Error:', err));
  }, []);

 useEffect(() => {
  const filtered = bankers.filter((banker) => {
    const locationQuery = searchLocation.trim().toLowerCase();
    const bankerQuery = searchBanker.trim().toLowerCase();
    const associatedQuery = searchAssociatedWith.trim().toLowerCase();
    const emailQuery = searchEmailOfficial.trim().toLowerCase(); // 👈 Add this line

    const matchesLocation = locationQuery
      ? banker.locationCategories.some((location) =>
          location.toLowerCase().includes(locationQuery)
        )
      : true;

    const matchesBanker = bankerQuery
      ? banker.bankerName.toLowerCase().includes(bankerQuery)
      : true;

    const matchesAssociatedWith = associatedQuery
      ? banker.associatedWith.toLowerCase().includes(associatedQuery)
      : true;

    const matchesEmail = emailQuery
      ? banker.emailOfficial.toLowerCase().includes(emailQuery)
      : true;

    return (
      matchesLocation &&
      matchesBanker &&
      matchesAssociatedWith &&
      matchesEmail
    );
  });

  setFilteredBankers(filtered);
}, [searchLocation, searchBanker, searchAssociatedWith, searchEmailOfficial, bankers]);

const handleClearSearch = (type: 'location' | 'banker' | 'associated' | 'emailOfficial') => {
  if (type === 'location') setSearchLocation('');
  if (type === 'banker') setSearchBanker('');
  if (type === 'associated') setSearchAssociatedWith('');
  if (type === 'emailOfficial') setSearchEmailOfficial('');
};

  const handleEdit = (banker: Banker) => {
    setEditBanker(banker);
    setEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this banker?')) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/banker-directory/delete-directory/${id}`);
        setBankers((prev) => prev.filter((banker) => banker._id !== id));
      } catch (err) {
        console.error('❌ Failed to delete banker:', err);
        alert('Something went wrong while deleting!');
      }
    }
  };

const handleSaveChanges = async () => {
  if (!editBanker) return;

  const updatePayload = {
    bankerName: editBanker.bankerName,
    associatedWith: editBanker.associatedWith,
    emailOfficial: editBanker.emailOfficial,
    emailPersonal: editBanker.emailPersonal || '',
    contact: editBanker.contact,
    locationCategories: editBanker.locationCategories || [],
    product: editBanker.product || []
  };

  try {
    await axios.put(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/banker-directory/update-directory/${editBanker._id}`,
      updatePayload
    );
    setBankers((prev) =>
      prev.map((b) => (b._id === editBanker._id ? { ...editBanker } : b))
    );
    setEditModalOpen(false);
  } catch (err: any) {
    console.error('❌ Update Failed:', err.response?.data || err.message);
    alert(`Update failed: ${err.response?.data?.message || err.message}`);
  }
};



  return (
    <Grid container spacing={4} padding={2}>
      <Grid item xs={12}>
        <Box display="flex" gap={1} flexWrap="wrap">
          <TextField
            label="Search by Location"
            variant="outlined"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            sx={{ mb: 1, maxWidth: 200 }}
            InputProps={{
              startAdornment: <InputAdornment position="start">📍</InputAdornment>,
              endAdornment: searchLocation && (
                <ClearIcon
                  onClick={() => handleClearSearch('location')}
                  sx={{ cursor: 'pointer', color: 'text.secondary' }}
                />
              )
            }}
            fullWidth
          />

          <TextField
            label="Search by Associated With"
            variant="outlined"
            value={searchAssociatedWith}
            onChange={(e) => setSearchAssociatedWith(e.target.value)}
            sx={{ mb: 1, maxWidth: 200 }}
            InputProps={{
              startAdornment: <InputAdornment position="start">🏦</InputAdornment>,
              endAdornment: searchAssociatedWith && (
                <ClearIcon
                  onClick={() => handleClearSearch('associated')}
                  sx={{ cursor: 'pointer', color: 'text.secondary' }}
                />
              )
            }}
            fullWidth
          />
<TextField
  label="Search by Official Email"
  variant="outlined"
  value={searchEmailOfficial}
  onChange={(e) => setSearchEmailOfficial(e.target.value)}
  sx={{ mb: 1, maxWidth: 200 }}
  InputProps={{
    startAdornment: <InputAdornment position="start">📧</InputAdornment>,
    endAdornment: searchEmailOfficial && (
      <ClearIcon
        onClick={() => handleClearSearch('emailOfficial')}
        sx={{ cursor: 'pointer', color: 'text.secondary' }}
      />
    )
  }}
  fullWidth
/>

          <TextField
            label="Search by Banker"
            variant="outlined"
            value={searchBanker}
            onChange={(e) => setSearchBanker(e.target.value)}
            sx={{ mb: 1, maxWidth: 250 }}
            InputProps={{
              startAdornment: <InputAdornment position="start">👤</InputAdornment>,
              endAdornment: searchBanker && (
                <ClearIcon
                  onClick={() => handleClearSearch('banker')}
                  sx={{ cursor: 'pointer', color: 'text.secondary' }}
                />
              )
            }}
            fullWidth
          />
          
        </Box>
      </Grid>

      {filteredBankers.map((banker) => (
        <Grid item xs={12} sm={6} md={4} key={banker._id}>
          <Paper elevation={6} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                {banker.bankerName.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h6">{banker.bankerName}</Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {banker.associatedWith}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Typography variant="subtitle2" gutterBottom>
              Location Serve:
            </Typography>
            <Stack direction="row" flexWrap="wrap" spacing={1} mb={2}>
              {banker.locationCategories.map((loc, index) => (
                <Chip key={index} label={loc} size="small" variant="outlined" />
              ))}
            </Stack>

            <Typography variant="subtitle2">Products:</Typography>
            <Stack direction="row" flexWrap="wrap" spacing={1} mb={2}>
              {(banker.product || []).map((prod, index) => (
                <Chip key={index} label={prod} size="small" color="success" variant="outlined" />
              ))}
            </Stack>

            <Box mb={1}>
              <Typography variant="body2" gutterBottom>
                <strong>Official Email:</strong> {banker.emailOfficial}
              </Typography>
              {banker.emailPersonal && (
                <Typography variant="body2" gutterBottom>
                  <strong>Personal Email:</strong> {banker.emailPersonal}
                </Typography>
              )}
              <Typography variant="body2">
                <strong>Contact:</strong> {banker.contact}
              </Typography>
            </Box>

            {role === 'admin' && (
              <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
                <Chip label="Edit" onClick={() => handleEdit(banker)} color="primary" clickable />
                <Chip label="Delete" onClick={() => handleDelete(banker._id)} color="error" clickable />
              </Box>
            )}
          </Paper>
        </Grid>
      ))}

      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Banker</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          {editBanker && (
            <Stack spacing={2} sx={{mt:2}} >
              <TextField
                label="Banker Name"
                value={editBanker.bankerName}
                onChange={(e) => setEditBanker({ ...editBanker, bankerName: e.target.value })}
                fullWidth
              />
              <TextField
                label="Associated With"
                value={editBanker.associatedWith}
                onChange={(e) => setEditBanker({ ...editBanker, associatedWith: e.target.value })}
                fullWidth
              />
              <TextField
                label="Official Email"
                value={editBanker.emailOfficial}
                onChange={(e) => setEditBanker({ ...editBanker, emailOfficial: e.target.value })}
                fullWidth
              />
              <TextField
                label="Personal Email"
                value={editBanker.emailPersonal || ''}
                onChange={(e) => setEditBanker({ ...editBanker, emailPersonal: e.target.value })}
                fullWidth
              />
              <TextField
                label="Contact"
                value={editBanker.contact}
                onChange={(e) => setEditBanker({ ...editBanker, contact: e.target.value })}
                fullWidth
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveChanges}>Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

const TabsContainerWrapper = styled(Box)(({ theme }) => ({
  padding: `0 ${theme.spacing(2)}`,
  position: 'relative',
  bottom: '-1px'
}));

const LendersTasks = () => {
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [role, setRole] = useState<string | null>(null);

  const tabs = [{ value: 'overview', label: 'Bankers Directory' }];

  const handleTabsChange = (_event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  };

  useEffect(() => {
    const getUserRole = (): string | null => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return null;
        const decoded: any = jwtDecode(token);
        return decoded.role ?? null;
      } catch (err) {
        console.error('❌ JWT Decode Failed:', err);
        return null;
      }
    };

    const userRole = getUserRole();
    setRole(userRole);
  }, []);

  return (
    <>
      <Head>
        <title>Bankers Directory</title>
      </Head>
      <PageTitleWrapper>
        {role && (
          <PageHeader
            onCreated={() => window.location.reload()}
            showAddButton={['admin'].includes(role)}
          />
        )}
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <TabsContainerWrapper>
          <Tabs
            onChange={handleTabsChange}
            value={currentTab}
            variant="scrollable"
            scrollButtons="auto"
            textColor="primary"
            indicatorColor="primary"
          >
            {tabs.map((tab) => (
              <Tab key={tab.value} label={tab.label} value={tab.value} />
            ))}
          </Tabs>
        </TabsContainerWrapper>

        <Card variant="outlined" sx={{ mt: 2 }}>
          <Grid container>
            {currentTab === 'overview' && (
              <Grid item xs={12}>
                <Box p={4}>
                  <BankerOverview role={role} />
                </Box>
              </Grid>
            )}
          </Grid>
        </Card>
      </Container>
      <Footer />
    </>
  );
};

LendersTasks.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default LendersTasks;