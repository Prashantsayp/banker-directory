import {
  Box,
  Card,
  Container,
  styled
} from '@mui/material';
import type { ReactElement } from 'react';
import BaseLayout from 'src/layouts/BaseLayout';
import Head from 'next/head';
import Hero from 'src/content/Overview/Hero';

const HeaderWrapper = styled(Card)(({ theme }) => ({
  width: '100%',
  height: theme.spacing(8),
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 2),
  backgroundColor: theme.palette.primary.light,
  borderBottom: `1px solid ${theme.palette.divider}`,
  boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
}));

const OverviewWrapper = styled(Box)(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh'
}));

function Overview() {
  return (
    <OverviewWrapper>
      <Head>
        <title>Bankers Directory</title>
      </Head>

      {/* Header */}
      <HeaderWrapper>
        <Container
          maxWidth="lg"
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 100 }}>
              <img
                src="/static/images/logo/f2fin.png"
                alt="F2 Fintech"
                style={{
                  width: '100%',
                  objectFit: 'contain',
                  borderRadius: 6
                }}
              />
            </Box>
      
          </Box>
        </Container>
      </HeaderWrapper>

      {/* Hero Section */}
      <Hero />
    </OverviewWrapper>
  );
}

export default Overview;

Overview.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};
