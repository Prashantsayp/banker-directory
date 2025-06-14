import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import { ChangeEvent, useState } from 'react';
import PageHeader from '@/content/Dashboards/Tasks/PageHeader';
import Footer from '@/components/Footer';
import {
  Grid,
  Tab,
  Tabs,
  Container,
  Card,
  Box,
  styled
} from '@mui/material';
import PageTitleWrapper from '@/components/PageTitleWrapper';

import UserOverview from '../../../src/content/Dashboards/usersOverview'; 

const TabsContainerWrapper = styled(Box)(
  ({ theme }) => `
    padding: 0 ${theme.spacing(2)};
    position: relative;
    bottom: -1px;
`
);

function UsersTasks() {
  const [currentTab, setCurrentTab] = useState<string>('overview');

  const tabs = [
    { value: 'overview', label: 'Users Overview' },
    { value: 'search', label: 'Search Users' }
  ];

  const handleTabsChange = (_event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  };

  return (
    <>
      <Head>
        <title>Users Directory</title>
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
                  <UserOverview />
                </Box>
              </Grid>
            )}
            {currentTab === 'search' && (
              <Grid item xs={12}>
                <Box p={4}>
                  {/* Placeholder for User Search Component */}
                  <Box>Search functionality coming soon...</Box>
                </Box>
              </Grid>
            )}
          </Grid>
        </Card>
      </Container>
      <Footer />
    </>
  );
}

UsersTasks.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default UsersTasks;
