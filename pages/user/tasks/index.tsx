import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import PageHeader from '@/content/Dashboards/Tasks/PageHeader';
import Footer from '@/components/Footer';
import {
  Grid,
 
  Container,
  Card,
  Box,
  
} from '@mui/material';
import PageTitleWrapper from '@/components/PageTitleWrapper';

import UserOverview from '../../../src/content/Dashboards/usersOverview'; 


function UsersTasks() {

  // const tabs = [
  //   { value: 'overview', label: 'Users Overview' },
  //   { value: 'search', label: 'Search Users' }
  // ];



  return (
    <>
      <Head>
        <title>Users Directory</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader onCreated={() => window.location.reload()} />
      </PageTitleWrapper>
      <Container maxWidth="lg">
     
        <Card variant="outlined">
          <Grid container>
              <Grid item xs={12}>
                <Box p={4}>
                  <UserOverview />
                </Box>
              </Grid>
          
          
          </Grid>
        </Card>
      </Container>
      <Footer />
    </>
  );
}

UsersTasks.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default UsersTasks;
