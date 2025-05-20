import {
  Typography,
  Box,
  Card,
  Container,
  Button,
  styled
} from '@mui/material';
import type { ReactElement } from 'react';
import BaseLayout from 'src/layouts/BaseLayout';

import Link from 'src/components/Link';
import Head from 'next/head';


// import Logo from 'src/components/LogoSign';
import Hero from 'src/content/Overview/Hero';

const HeaderWrapper = styled(Card)(
  ({ theme }) => `
  width: 100%;
  display: flex;
  align-items: center;
  height: ${theme.spacing(10)};
  margin-bottom: ${theme.spacing(10)};
`
);

const OverviewWrapper = styled(Box)(
  ({ theme }) => `
    overflow: auto;
    background: ${theme.palette.common.white};
    flex: 1;
    overflow-x: hidden;
`
);

function Overview() {
  return (
    <OverviewWrapper>
      <Head>
        <title>Bankers Directory</title>
      </Head>
      <HeaderWrapper>
        <Container maxWidth="lg">
          <Box display="flex" alignItems="center">
            {/* <Logo /> */}
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              flex={1}
            >
              <Box />
              <Box>
                <Button
                  component={Link}
                  href="#"
                  variant="contained"
                  sx={{ ml: 2 }}
                >
              
                </Button>
              </Box>
            </Box>
          </Box>

        <Box
            sx={{
            flex: 1,
            display: "flex",
            alignItems: "center", 
            justifyContent: "flex-start", 
            maxWidth: "140px", 
            height: "auto",
            overflow: "hidden",
          }}
        >
          <img
            src="/static/images/logo/f2fin.png"
            alt="Logo"
            style={{
              maxWidth: "100%", 
              height: "auto", 
              objectFit: "contain", 
              borderRadius: "8px", 
            }}
          />
        </Box>
        </Container>
      </HeaderWrapper>
      <Hero />
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Typography textAlign="center" variant="subtitle1">
          {/* Developed by{' '} */}
          <Link
            href="#"
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* Prashant */}
          </Link>
        </Typography>
      </Container>
    </OverviewWrapper>
  );
}

export default Overview;

Overview.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};
