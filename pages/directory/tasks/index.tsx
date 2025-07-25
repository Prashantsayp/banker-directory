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
  Button,
  Autocomplete 
} from '@mui/material';
import axios from 'axios';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import { styled } from '@mui/material/styles';
import { jwtDecode } from 'jwt-decode';
import SearchTextField from '../../../pages/components/searchTextFied';
import FullScreenLoader from '../../components/FullScreenLoader';
import { useRouter } from 'next/router';


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
 const [loading, setLoading] = useState(false);
const router = useRouter();


  useEffect(() => {
  console.log('Total bankers fetched::', bankers.length);
}, [bankers]);


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
  const fetchFiltered = async () => {
   
    setLoading(true);
    try {
      const params: any = {};
      if (searchLocation.trim()) params.location = searchLocation.trim();
      if (searchBanker.trim()) params.bankerName = searchBanker.trim();
      if (searchAssociatedWith.trim()) params.associatedWith = searchAssociatedWith.trim();
      if (searchEmailOfficial.trim()) params.emailOfficial = searchEmailOfficial.trim();

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/banker-directory/filter`,
        { params }
      );
      setFilteredBankers(res.data);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

    fetchFiltered();
 
}, [searchLocation, searchBanker, searchAssociatedWith, searchEmailOfficial]);


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
      setLoading(true);
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/banker-directory/delete-directory/${id}`);
      router.reload(); // 👈 Refresh the page
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Delete failed!');
    } finally {
      setLoading(false);
    }
  }
};

const handleSaveChanges = async () => {
  if (!editBanker) return;

  const { _id, ...updatePayload } = editBanker;

  try {
    setLoading(true);
    await axios.put(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/banker-directory/update-directory/${_id}`,
      updatePayload
    );

    // Update UI
    setBankers((prev) =>
      prev.map((b) => (b._id === _id ? { ...b, ...updatePayload } : b))
    );
    setFilteredBankers((prev) =>
      prev.map((b) => (b._id === _id ? { ...b, ...updatePayload } : b))
    );

    setEditModalOpen(false);
  } catch (err) {
    console.error('Update failed:', err);
    alert('Update failed!');
  } finally {
    setLoading(false);
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
      {banker.bankerName?.charAt(0)?.toUpperCase() || 'B'}

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
       {(banker.locationCategories || []).map((loc, index) => (

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
      {/* Text Fields */}
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
          value={editBanker?.[key] ?? ''}
          onChange={(e) =>
            setEditBanker({ ...editBanker, [key]: e.target.value })
          }
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
              color: '#1F2937',
              backgroundColor: '#F9FAFB',
              '& fieldset': { borderColor: '#60A5FA' },
              '&:hover fieldset': { borderColor: '#3B82F6' },
              '&.Mui-focused fieldset': { borderColor: '#2563EB' }
            },
            '& .MuiInputLabel-root': { color: '#2563EB' },
            '& .MuiInputLabel-root.Mui-focused': { color: '#2563EB' }
          }}
        />
      ))}
<Autocomplete<string, true, true, true>
  multiple
  freeSolo
  options={[]} // Optional: suggestions like ['PL', 'BL']
  value={editBanker?.product || []}
  onChange={(_event, newValue) => {
    if (!editBanker) return;

    setEditBanker({
      ...editBanker,
      product: (newValue || [])
        .map((val) => (typeof val === 'string' ? val.trim() : ''))
        .filter(Boolean)
    });
  }}
  renderTags={(value, getTagProps) =>
    value.map((option, index) => (
      <Chip
        key={option + index}
        label={option}
        {...getTagProps({ index })}
        sx={{
          backgroundColor: '#3B82F6',
          color: '#FFFFFF',
          borderRadius: '8px',
          fontWeight: 500,
          fontSize: '0.85rem',
          '& .MuiChip-deleteIcon': {
            color: '#FFFFFF',
            '&:hover': { color: '#E0E7FF' }
          }
        }}
      />
    ))
  }
  renderInput={(params) => (
    <TextField
      {...params}
      label="Products"
      fullWidth
      sx={{
        '& .MuiOutlinedInput-root': {
          color: '#1F2937',
          backgroundColor: '#F9FAFB',
          '& fieldset': { borderColor: '#60A5FA' },
          '&:hover fieldset': { borderColor: '#3B82F6' },
          '&.Mui-focused fieldset': { borderColor: '#2563EB' }
        },
        '& .MuiInputLabel-root': { color: '#2563EB' },
        '& .MuiInputLabel-root.Mui-focused': { color: '#2563EB' }
      }}
    />
  )}
/>



     <Autocomplete<string, true, true, true>
  multiple
  freeSolo
  options={[]} // Add suggestions if needed
  value={editBanker?.locationCategories || []}
  onChange={(_event, newValue) =>
    setEditBanker({
      ...editBanker,
      locationCategories: newValue
        .map((val) => (typeof val === 'string' ? val.trim() : ''))
        .filter(Boolean)
    })
  }
  renderTags={(value: readonly string[], getTagProps) =>
    value.map((option: string, index: number) => (
    
       <Chip
      key={option + index}
        label={option}
        {...getTagProps({ index })}
        sx={{
          backgroundColor: '#3B82F6',
          color: '#FFFFFF',
          borderRadius: '8px',
          fontWeight: 500,
          fontSize: '0.85rem',
          '& .MuiChip-deleteIcon': {
            color: '#FFFFFF',
            '&:hover': {
              color: '#E0E7FF'
            }
          }
        }}
      />
    ))
  }
  renderInput={(params) => (
    <TextField
      {...params}
      label="Location Categories"
      fullWidth
      sx={{
        '& .MuiOutlinedInput-root': {
          color: '#1F2937',
          backgroundColor: '#F9FAFB',
          '& fieldset': { borderColor: '#60A5FA' },
          '&:hover fieldset': { borderColor: '#3B82F6' },
          '&.Mui-focused fieldset': { borderColor: '#2563EB' }
        },
        '& .MuiInputLabel-root': { color: '#2563EB' },
        '& .MuiInputLabel-root.Mui-focused': { color: '#2563EB' }
      }}
    />
  )}
/>

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
<FullScreenLoader open={loading} />


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
