import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import { ChangeEvent, useState, useEffect } from 'react';
import PageHeader from '@/content/Dashboards/Tasks/PageHeader';
import Footer from '@/components/Footer';
import { Box, Grid, Tab, Tabs, Typography, Avatar, Paper, Chip, Divider, Stack, TextField, Container, Card, InputAdornment } from '@mui/material';

import axios from 'axios';

import PageTitleWrapper from '@/components/PageTitleWrapper';
import { styled } from '@mui/material/styles';
import ClearIcon from '@mui/icons-material/Clear'; 

// Define the interface for Banker
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


useEffect(() => {
  console.log('📡 Calling API directly');

  axios
    .get('http://3.25.110.0:3001/banker-directory/get-directories')
    .then((res) => {
      console.log('✅ Fetched data:', res.data);
      setBankers(res.data);
      setFilteredBankers(res.data);
    })
    .catch((err) => console.error('❌ Error:', err));
}, []);



  // Filter bankers based on the search term (either location or banker name)
  useEffect(() => {
    if (searchLocation) {
      const filtered = bankers.filter((banker) =>
        banker.locationCategories.some((location) =>
          location.toLowerCase().includes(searchLocation.toLowerCase())
        )
      );
      setFilteredBankers(filtered);
    } else if (searchBanker) {
      const filtered = bankers.filter((banker) =>
        banker.bankerName.toLowerCase().includes(searchBanker.toLowerCase())
      );
      setFilteredBankers(filtered);
    } else {
      setFilteredBankers(bankers);
    }
  }, [searchLocation, searchBanker, bankers]);

  // Functions to handle search inputs
  const handleSearchLocation = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchLocation(event.target.value);
    setSearchBanker(''); 
  };

  const handleClearSearchLocation = () => {
    setSearchLocation('');
    setFilteredBankers(bankers);
  };

  const handleSearchBanker = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchBanker(event.target.value);
    setSearchLocation(''); 
  };

  const handleClearSearchBanker = () => {
    setSearchBanker('');
    setFilteredBankers(bankers);
  };

  return (
    <Grid container spacing={4} padding={2}>
      <Grid item xs={12}>
        <Box display="flex" gap={2}>
          {/* Search bar to filter bankers by location */}
          <TextField
            label="Search by Location"
            variant="outlined"
            value={searchLocation}
            onChange={handleSearchLocation}
            sx={{ mb: 1, maxWidth: 400 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Typography>🔍</Typography>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {searchLocation && (
                    <ClearIcon
                      onClick={handleClearSearchLocation}
                      sx={{ cursor: 'pointer', color: 'text.secondary' }}
                    />
                  )}
                </InputAdornment>
              ),
            }}
            fullWidth
          />
          {/* Search bar to filter bankers by Banker*/}
          <TextField
            label="Search by Banker"
            variant="outlined"
            value={searchBanker}
            onChange={handleSearchBanker}
            sx={{ mb: 1, maxWidth: 400 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Typography>🔍</Typography>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {searchBanker && (
                    <ClearIcon
                      onClick={handleClearSearchBanker}
                      sx={{ cursor: 'pointer', color: 'text.secondary' }}
                    />
                  )}
                </InputAdornment>
              ),
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
              Location Categories:
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

// Main page wrapper with tabs and layout
const TabsContainerWrapper = styled(Box)(({ theme }) => ({
  padding: `0 ${theme.spacing(2)}`,
  position: 'relative',
  bottom: '-1px',
}));

const LendersTasks = () => {
  const [currentTab, setCurrentTab] = useState<string>('overview');


  const tabs = [
    { value: 'overview', label: 'Bankers Directory' },
    // { value: 'search', label: 'Search Directories' }
  ];

  const handleTabsChange = (_event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  };

  return (
    <>
      <Head>
        <title>Bankers Directory</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader onCreated={() => window.location.reload()} />
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
        <Card variant="outlined">
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
