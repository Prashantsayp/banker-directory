// pages/_app.tsx

import { useState, useEffect } from 'react';
import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import nProgress from 'nprogress';
import 'nprogress/nprogress.css';
import ThemeProvider from 'src/theme/ThemeProvider';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from 'src/createEmotionCache';
import { SidebarProvider } from 'src/contexts/SidebarContext';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { CircularProgress, Box } from '@mui/material';

// ⬇️ ADD: NextAuth SessionProvider
import { SessionProvider } from 'next-auth/react';

const clientSideEmotionCache = createEmotionCache();

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

interface TokyoAppProps extends AppProps {
  emotionCache?: EmotionCache;
  Component: NextPageWithLayout;
}

function TokyoApp(props: TokyoAppProps) {
  // ⬇️ NOTE: pageProps me session aa sakta hai (NextAuth)
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const getLayout = Component.getLayout ?? ((page) => page);

  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const loader = document.getElementById('global-loader');
    if (loader) loader.remove();

    const timer = setTimeout(() => setShowContent(true), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    Router.events.on('routeChangeStart', nProgress.start);
    Router.events.on('routeChangeError', nProgress.done);
    Router.events.on('routeChangeComplete', nProgress.done);
    return () => {
      Router.events.off('routeChangeStart', nProgress.start);
      Router.events.off('routeChangeError', nProgress.done);
      Router.events.off('routeChangeComplete', nProgress.done);
    };
  }, []);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Bankers Directory</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      </Head>

      {/* ⬇️ Wrap your app with SessionProvider (pass pageProps.session) */}
      <SessionProvider session={(pageProps as any)?.session}>
        <SidebarProvider>
          <ThemeProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <CssBaseline />
              {!showContent ? (
                <Box
                  sx={{
                    height: '100vh',
                    width: '100vw',
                    backgroundColor: '#fff',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <CircularProgress color="primary" />
                </Box>
              ) : (
                getLayout(<Component {...pageProps} />)
              )}
            </LocalizationProvider>
          </ThemeProvider>
        </SidebarProvider>
      </SessionProvider>
    </CacheProvider>
  );
}

export default TokyoApp;
