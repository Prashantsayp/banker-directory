import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import { ChangeEvent, useState, useEffect } from 'react';
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
  InputAdornment
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

const BankerOverview = () => {
  const [bankers, setBankers] = useState<Banker[]>([]);
  const [filteredBankers, setFilteredBankers] = useState<Banker[]>([]);
  const [searchLocation, setSearchLocation] = useState('');
  const [searchBanker, setSearchBanker] = useState('');
  const [searchAssociatedWith, setSearchAssociatedWith] = useState('');

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
      const matchesLocation = searchLocation
        ? banker.locationCategories.some((location) =>
            location.toLowerCase().includes(searchLocation.toLowerCase())
          )
        : true;

      const matchesBanker = searchBanker
        ? banker.bankerName.toLowerCase().includes(searchBanker.toLowerCase())
        : true;

      const matchesAssociatedWith = searchAssociatedWith
        ? banker.associatedWith.toLowerCase().includes(searchAssociatedWith.toLowerCase())
        : true;

      return matchesLocation && matchesBanker && matchesAssociatedWith;
    });

    setFilteredBankers(filtered);
  }, [searchLocation, searchBanker, searchAssociatedWith, bankers]);

  const handleClearSearch = (type: 'location' | 'banker' | 'associated') => {
    if (type === 'location') setSearchLocation('');
    if (type === 'banker') setSearchBanker('');
    if (type === 'associated') setSearchAssociatedWith('');
  };

  return (
    <Grid container spacing={4} padding={2}>
      <Grid item xs={12}>
        <Box display="flex" gap={2} flexWrap="wrap">
          <TextField
            label="Search by Location"
            variant="outlined"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            sx={{ mb: 1, maxWidth: 250 }}
            InputProps={{
              startAdornment: <InputAdornment position="start">📍</InputAdornment>,
              endAdornment: searchLocation && (
                <ClearIcon onClick={() => handleClearSearch('location')} sx={{ cursor: 'pointer', color: 'text.secondary' }} />
              )
            }}
            fullWidth
          />

          <TextField
            label="Search by Associated With"
            variant="outlined"
            value={searchAssociatedWith}
            onChange={(e) => setSearchAssociatedWith(e.target.value)}
            sx={{ mb: 1, maxWidth: 250 }}
            InputProps={{
              startAdornment: <InputAdornment position="start">🏦</InputAdornment>,
              endAdornment: searchAssociatedWith && (
                <ClearIcon onClick={() => handleClearSearch('associated')} sx={{ cursor: 'pointer', color: 'text.secondary' }} />
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
                <ClearIcon onClick={() => handleClearSearch('banker')} sx={{ cursor: 'pointer', color: 'text.secondary' }} />
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
          </Paper>
        </Grid>
      ))}
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
    console.log("✅ Decoded Role:", decoded.role);
    return decoded.role ?? null;
  } catch (err) {
    console.error("❌ JWT Decode Failed:", err);
    return null;
  }
};

    const userRole = getUserRole();
    console.log("✅ Decoded Role:", userRole);
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
                  <BankerOverview />
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
