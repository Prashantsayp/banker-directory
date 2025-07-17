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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import axios from 'axios';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import { styled } from '@mui/material/styles';
import { jwtDecode } from 'jwt-decode';
import SearchTextField from '../../../pages/components/searchTextFied';


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
    const emailQuery = searchEmailOfficial.trim().toLowerCase();

    const matchesLocation = locationQuery
      ? (banker.locationCategories || []).some((location) =>
          (location || '').toLowerCase().includes(locationQuery)
        )
      : true;

    const matchesBanker = bankerQuery
      ? (banker.bankerName || '').toLowerCase().includes(bankerQuery)
      : true;

    const matchesAssociatedWith = associatedQuery
      ? (banker.associatedWith || '').toLowerCase().includes(associatedQuery)
      : true;

    const matchesEmail = emailQuery
      ? (banker.emailOfficial || '').toLowerCase().includes(emailQuery)
      : true;

    return (
      matchesLocation &&
      matchesBanker &&
      matchesAssociatedWith &&
      matchesEmail
    );
  });

  setFilteredBankers(filtered);
}, [
  searchLocation,
  searchBanker,
  searchAssociatedWith,
  searchEmailOfficial,
  bankers
]);

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
  <SearchTextField
    label="Search by Location"
    value={searchLocation}
    onChange={setSearchLocation}
    onClear={() => handleClearSearch('location')}
    icon="📍"
  />
  <SearchTextField
    label="Search by Associated With"
    value={searchAssociatedWith}
    onChange={setSearchAssociatedWith}
    onClear={() => handleClearSearch('associated')}
    icon="🏦"
  />
  <SearchTextField
    label="Search by Official Email"
    value={searchEmailOfficial}
    onChange={setSearchEmailOfficial}
    onClear={() => handleClearSearch('emailOfficial')}
    icon="📧"
  />
  <SearchTextField
    label="Search by Banker"
    value={searchBanker}
    onChange={setSearchBanker}
    onClear={() => handleClearSearch('banker')}
    icon="👤"
    maxWidth={250}
  />
</Box>

      </Grid>

 {filteredBankers.map((banker) => (
  <Grid item xs={12} sm={6} md={4} key={banker._id}>
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 3,
        height: '100%',
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 6px 20px rgba(0,0,0,0.05)',
          borderColor: '#cbd5e1'
        }
      }}
    >
      <Box display="flex" alignItems="center" mb={2}>
        <Avatar sx={{ bgcolor: '#2563EB', mr: 2 }}>
          {banker.bankerName.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography
            variant="h6"
            sx={{ color: '#2E3A59', fontWeight: 600 }}
          >
            {banker.bankerName}
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{ color: '#6B7280' }}
          >
            {banker.associatedWith}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Typography
        variant="subtitle2"
        sx={{ color: '#2E3A59', fontWeight: 500 }}
        gutterBottom
      >
        Location Serve:
      </Typography>
      <Stack direction="row" flexWrap="wrap" spacing={1} mb={2}>
        {banker.locationCategories.map((loc, index) => (
          <Chip
            key={index}
            label={loc}
            size="small"
            variant="outlined"
            sx={{
              color: '#2563EB',
              borderColor: '#93C5FD',
              backgroundColor: '#F0F9FF',
              fontWeight: 500
            }}
          />
        ))}
      </Stack>

      <Typography
        variant="subtitle2"
        sx={{ color: '#2E3A59', fontWeight: 500 }}
        gutterBottom
      >
        Products:
      </Typography>
      <Stack direction="row" flexWrap="wrap" spacing={1} mb={2}>
        {(banker.product || []).map((prod, index) => (
          <Chip
            key={index}
            label={prod}
            size="small"
            variant="outlined"
            sx={{
              color: '#047857',
              borderColor: '#6EE7B7',
              backgroundColor: '#ECFDF5',
              fontWeight: 500
            }}
          />
        ))}
      </Stack>

      <Box mb={1}>
        <Typography variant="body2" sx={{ color: '#374151' }} gutterBottom>
          <strong>Official Email:</strong> {banker.emailOfficial}
        </Typography>
        {banker.emailPersonal && (
          <Typography variant="body2" sx={{ color: '#374151' }} gutterBottom>
            <strong>Personal Email:</strong> {banker.emailPersonal}
          </Typography>
        )}
        <Typography variant="body2" sx={{ color: '#374151' }}>
          <strong>Contact:</strong> {banker.contact}
        </Typography>
      </Box>

      {role === 'admin' && (
        <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
          <Chip
            label="Edit"
            onClick={() => handleEdit(banker)}
            clickable
            sx={{
              color: '#1D4ED8',
              borderColor: '#1D4ED8',
              backgroundColor: '#EEF2FF',
              '&:hover': {
                backgroundColor: '#E0E7FF'
              }
            }}
            variant="outlined"
          />
          <Chip
            label="Delete"
            onClick={() => handleDelete(banker._id)}
            clickable
            sx={{
              color: '#B91C1C',
              borderColor: '#FCA5A5',
              backgroundColor: '#FEF2F2',
              '&:hover': {
                backgroundColor: '#FEE2E2'
              }
            }}
            variant="outlined"
          />
        </Box>
      )}
    </Paper>
  </Grid>
))}
{filteredBankers.length === 0 && (
  <Grid item xs={12}>
    <Typography align="center" color="text.secondary">
      No bankers match your search criteria.
    </Typography>
  </Grid>
)}

<Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="sm" fullWidth>
  {/* Dialog Header with white background and primary color text */}
  <DialogTitle sx={{ color: '#fff', bgcolor: 'primary.main' }}>
    Edit Banker
  </DialogTitle>

  {/* Dialog Content with white background and dark text field theme */}
  <DialogContent sx={{ mt: 0, bgcolor: '#fff' }}>
    {editBanker && (
      <Stack spacing={2} sx={{ mt: 1 }}>
        {[
          { label: 'Banker Name', key: 'bankerName' },
          { label: 'Associated With', key: 'associatedWith' },
          { label: 'Official Email', key: 'emailOfficial' },
          { label: 'Personal Email', key: 'emailPersonal' },
          { label: 'Contact', key: 'contact' }
        ].map(({ label, key }) => (
          <TextField
            key={key}
            label={label}
            value={(editBanker as any)[key] || ''}
            onChange={(e) =>
              setEditBanker({ ...editBanker, [key]: e.target.value })
            }
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'black', // Input text color
                '& fieldset': {
                  borderColor: 'primary.main'
                },
                '&:hover fieldset': {
                  borderColor: 'primary.main'
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main'
                }
              },
              '& .MuiInputLabel-root': {
                color: 'primary.main'
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'primary.main'
              }
            }}
          />
        ))}
      </Stack>
    )}
  </DialogContent>

  {/* Dialog Footer with white background */}
  <DialogActions sx={{ bgcolor: '#fff', px: 3, py: 2 }}>
    <Button onClick={() => setEditModalOpen(false)} color="inherit" sx={{ color: 'primary.main' }}>
      Cancel
    </Button>
    <Button variant="contained" onClick={handleSaveChanges} color="primary">
      Save Changes
    </Button>
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