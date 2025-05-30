import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import Footer from '@/components/Footer';

import { Grid, Container } from '@mui/material';

import ProfileCover from '@/content/Management/Users/details/ProfileCover';
import RecentActivity from '@/content/Management/Users/details/RecentActivity';
import Feed from '@/content/Management/Users/details/Feed';
import PopularTags from '@/content/Management/Users/details/PopularTags';
import MyCards from '@/content/Management/Users/details/MyCards';
import Addresses from '@/content/Management/Users/details/Addresses';

function ManagementUserProfile() {
  const user = {
    savedCards: 7,
    name: 'F2 Fintech',
    coverImg: '/static/images/placeholders/covers/5.jpg',
    avatar: '/static/images/logo/f2fin.png',
    description:
      "Asm at bajaj finserve in delhi-NCR",
    jobtitle: 'ASM',
    location: 'Delhi-NCR',
    followers: 1065
  };

  return (
    <>
      <Head>
        <title>User Details - Management</title>
      </Head>
      <Container sx={{ mt: 3 }} maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12} md={8}>
           <ProfileCover user={user} />
          </Grid>
          <Grid item xs={12} md={4}>
            <RecentActivity />
          </Grid>
          <Grid item xs={12} md={8}>
            <Feed />
          </Grid>
          <Grid item xs={12} md={4}>
            <PopularTags />
          </Grid>
          <Grid item xs={12} md={7}>
            <MyCards />
          </Grid>
          <Grid item xs={12} md={5}>
            <Addresses />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

ManagementUserProfile.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default ManagementUserProfile;
