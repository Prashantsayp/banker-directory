import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import {
  
  Container,
  Box,
  
} from '@mui/material';
import Footer from '@/components/Footer';
// import PageHeader from '@/content/Dashboards/Tasks/PageHeader';
import LenderOverview from '@/content/Dashboards/LenderOverview';


function LendersTasks() {
  

  return (
    <>
      <Head>
        <title>Lenders Directory</title>
      </Head>
      {/* <PageTitleWrapper>
        <PageHeader onCreated={() => window.location.reload()} />
      </PageTitleWrapper> */}
      <Container maxWidth="lg">
{/*         
        <Card variant="outlined" sx={{ p: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                select
                label="Choose Lender Format"
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
              >
                {lenderFormats.map((format) => (
                  <MenuItem key={format} value={format}>
                    {format}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                select
                label="Choose State"
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setSelectedCity('');
                }}
              >
                {indianStates.map((state) => (
                  <MenuItem key={state} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                select
                label="Choose City"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                disabled={!selectedState}
              >
                {(indianCities[selectedState] || []).map((city) => (
                  <MenuItem key={city} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </Card> */}
     
        <Box mt={4}>
          <LenderOverview 

          />
        </Box>
      </Container>
      <Footer />
    </>
  );
}

LendersTasks.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default LendersTasks;
