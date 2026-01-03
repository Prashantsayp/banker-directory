'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Chip,
  Stack,
  Button,
  alpha,
  styled
} from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LogoNavbar from '../../src/content/Overview/Navbar/navbar1';
import MinimalFooter from '@/content/Overview/Footer/footer';

// ===== Styled =====
const PageShell = styled(Box)(() => ({
  minHeight: '100vh',
  background:
    'radial-gradient(circle at top left, #1d4ed8 0, transparent 45%), radial-gradient(circle at top right, #0ea5e9 0, transparent 50%), radial-gradient(circle at bottom, #020617 0, #020617 55%)',
  color: '#e5e7eb',
  display: 'flex',
  flexDirection: 'column'
}));

const Section = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(10),
  paddingBottom: theme.spacing(8)
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  fontSize: '2rem',
  letterSpacing: -0.5,
  textAlign: 'center',
  marginBottom: theme.spacing(1),
  color: '#f9fafb'
}));

const SectionSub = styled(Typography)(() => ({
  textAlign: 'center',
  color: alpha('#e5e7eb', 0.7),
  maxWidth: 640,
  margin: '0 auto',
  fontSize: 14.5
}));

const Card = styled(Paper)(({ theme }) => ({
  borderRadius: 18,
  padding: theme.spacing(2.2),
  background:
    'radial-gradient(circle at top left, rgba(15,23,42,0.96), rgba(15,23,42,1))',
  border: `1px solid ${alpha('#60a5fa', 0.25)}`,
  boxShadow: '0 18px 40px rgba(15,23,42,0.9)',
  color: '#e5e7eb',
  height: '100%',
  display: 'flex',
  flexDirection: 'column'
}));

const PremiumCard = styled(Paper)(({ theme }) => ({
  borderRadius: 20,
  padding: theme.spacing(3),
  background:
    'linear-gradient(135deg, rgba(15,23,42,0.98), rgba(15,23,42,1))',
  border: `1px solid ${alpha('#facc15', 0.4)}`,
  boxShadow: '0 22px 60px rgba(15,23,42,0.95)',
  color: '#f9fafb'
}));

const HighlightBadge = styled(Chip)(() => ({
  borderRadius: 999,
  fontSize: 11,
  height: 24,
  background:
    'linear-gradient(135deg, rgba(250,204,21,0.2), rgba(250,204,21,0.35))',
  color: '#facc15',
  borderColor: 'rgba(250,204,21,0.5)'
}));

// ===== Types (match DB) =====

type DirectoryBanker = {
  _id?: string;
  bankerName?: string;
  associatedWith?: string;
  emailOfficial?: string;
  emailPersonal?: string;
  contact?: string;
  city?: string[] | string;
  state?: string[] | string;
  product?: string[] | string;
  designation?: string;
  role?: string;
  bank_name?: string;
  organisation?: string;
  organization?: string;
  company_name?: string;
  products?: string[];
  tags?: string[];
};

// ===== Utils =====

const colorPalette = ['blue', 'purple', 'pink', 'amber', 'cyan', 'emerald'];

const getGradient = (color: string) => {
  switch (color) {
    case 'blue':
      return 'radial-gradient(circle at top left, rgba(56,189,248,0.22), rgba(15,23,42,1))';
    case 'purple':
      return 'radial-gradient(circle at top right, rgba(168,85,247,0.22), rgba(15,23,42,1))';
    case 'pink':
      return 'radial-gradient(circle at top, rgba(236,72,153,0.22), rgba(15,23,42,1))';
    case 'amber':
      return 'radial-gradient(circle at top, rgba(245,158,11,0.22), rgba(15,23,42,1))';
    case 'cyan':
      return 'radial-gradient(circle at top left, rgba(34,211,238,0.22), rgba(15,23,42,1))';
    case 'emerald':
      return 'radial-gradient(circle at top right, rgba(16,185,129,0.22), rgba(15,23,42,1))';
    default:
      return 'radial-gradient(circle at top left, rgba(56,189,248,0.18), rgba(15,23,42,1))';
  }
};

const toArray = (value?: string[] | string): string[] => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

const getTags = (b: DirectoryBanker): string[] => {
  const productArr = toArray(b.product);
  if (productArr.length) return productArr;

  if (b.tags && b.tags.length) return b.tags;
  if (b.products && b.products.length) return b.products;

  return [];
};

// 🔗 Payment + WhatsApp constants
const PAYU_LINK =
  'https://payu.in/invoice/97808E255BB5C97B00C27853C60CFDC67E7188F585220534625FAFB9C5BA7A91/E4C8E54A2C922F54180E364247224ED0';

// Display vs link version
const WHATSAPP_NUMBER_DISPLAY = '+91 88106 00135';
const WHATSAPP_NUMBER_LINK = '918810600135';

// ===== Page =====

const DirectoryPreviewPage: React.FC = () => {
  const [bankers, setBankers] = useState<DirectoryBanker[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDirectories = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/banker-directory/get-directories`
        );
        console.log('Fetched directories response:', res.data);

        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];
        setBankers(data || []);
      } catch (err) {
        console.error('Error fetching directories', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDirectories();
  }, []);

  // max 2 real bankers visible
  const visibleBankers = bankers.slice(0, 2);

  return (
    <>
      <LogoNavbar />
      <PageShell>
        <Section>
          <Container maxWidth="lg">
            <Box textAlign="center" mb={5}>
              <SectionTitle sx={{ mt: 2 }}>
                Preview the F2 Banker Directory
              </SectionTitle>
              <SectionSub>
                The first few cards below are <b>real banker profiles</b> fetched
                directly from our database. The Premium card shows what you unlock
                when you upgrade to F2 Directory Premium.
              </SectionSub>

              {loading && (
                <Typography
                  sx={{
                    mt: 1.5,
                    fontSize: 13,
                    color: alpha('#e5e7eb', 0.7)
                  }}
                >
                  Loading live banker snapshots…
                </Typography>
              )}
            </Box>

            <Grid container spacing={3}>
              {/* ✅ Real cards – full DB-based layout (max 2) */}
              {visibleBankers.map((b, idx) => {
                const cityArr = toArray(b.city);
                const stateArr = toArray(b.state);
                const location =
                  cityArr.length || stateArr.length
                    ? `${cityArr.join(', ')}${
                        stateArr.length ? `, ${stateArr.join(', ')}` : ''
                      }`
                    : '';

                const tags = getTags(b);

                return (
                  <Grid item xs={12} sm={6} md={4} key={b._id || `real-${idx}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                      style={{ height: '100%' }}
                    >
                      <Card
                        sx={{
                          background: getGradient(
                            colorPalette[idx % colorPalette.length]
                          )
                        }}
                      >
                        {/* Name + Associated With */}
                        <Box>
                          <Typography
                            sx={{
                              fontSize: 16,
                              fontWeight: 800,
                              color: '#f9fafb',
                              mb: 0.3
                            }}
                          >
                            {b.bankerName || 'Banker profile'}
                          </Typography>

                          {b.associatedWith && (
                            <Typography
                              sx={{
                                fontSize: 13,
                                color: '#cbd5f5',
                                mb: 0.4
                              }}
                            >
                              {b.associatedWith}
                            </Typography>
                          )}
                        </Box>

                        {/* Location */}
                        {location && (
                          <Typography
                            sx={{
                              fontSize: 12.5,
                              color: '#9ca3af',
                              mb: 1
                            }}
                          >
                            📍 {location}
                          </Typography>
                        )}

                        {/* Contact + Emails */}
                        <Stack spacing={0.4} sx={{ mb: 1 }}>
                          {b.contact && (
                            <Typography
                              sx={{
                                fontSize: 12.5,
                                color: '#e5e7eb'
                              }}
                            >
                              📞 {b.contact}
                            </Typography>
                          )}

                          {b.emailOfficial && (
                            <Typography
                              sx={{
                                fontSize: 12.5,
                                color: '#e5e7eb'
                              }}
                            >
                              ✉️ Official: {b.emailOfficial}
                            </Typography>
                          )}

                          {b.emailPersonal && (
                            <Typography
                              sx={{
                                fontSize: 12.5,
                                color: '#e5e7eb'
                              }}
                            >
                              🧾 Personal: {b.emailPersonal}
                            </Typography>
                          )}
                        </Stack>

                        {/* Products / Tags */}
                        {tags.length > 0 && (
                          <Stack
                            direction="row"
                            spacing={1}
                            flexWrap="wrap"
                            sx={{ mb: 1 }}
                          >
                            {tags.map((tag) => (
                              <Chip
                                key={tag}
                                label={tag}
                                size="small"
                                sx={{
                                  height: 22,
                                  borderRadius: 999,
                                  fontSize: 10,
                                  background: 'rgba(15,23,42,0.9)',
                                  borderColor: alpha('#e5e7eb', 0.2),
                                  color: '#f9fafb'
                                }}
                                variant="outlined"
                              />
                            ))}
                          </Stack>
                        )}

                        {/* Spacer to push content to bottom */}
                        <Box sx={{ flexGrow: 1 }} />

                        {/* Note */}
                        <Typography
                          sx={{
                            mt: 1.2,
                            fontSize: 11,
                            color: alpha('#e5e7eb', 0.8)
                          }}
                        >
                          🔓 Live banker profile preview from F2 Directory.
                        </Typography>

                        {/* 👇 CTA button – same design language */}
                        <Button
                          size="small"
                          sx={{
                            mt: 1,
                            alignSelf: 'flex-start',
                            borderRadius: 999,
                            textTransform: 'none',
                            fontSize: 12,
                            fontWeight: 600,
                            px: 2.4,
                            py: 0.6,
                            background:
                              'linear-gradient(135deg, #4ade80, #22c55e)',
                            color: '#022c22',
                            boxShadow: '0 8px 18px rgba(34,197,94,0.35)',
                            '&:hover': {
                              background:
                                'linear-gradient(135deg, #22c55e, #4ade80)',
                              boxShadow: '0 10px 22px rgba(34,197,94,0.45)'
                            }
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open('/onlineform/form-online', '_blank');
                          }}
                        >
                          You can also add your profile
                        </Button>
                      </Card>
                    </motion.div>
                  </Grid>
                );
              })}

              {/* ⭐ Single Premium teaser card */}
              <Grid item xs={12} sm={6} md={4}>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.25 }}
                  style={{ height: '100%' }}
                >
                  <Card
                    sx={{
                      position: 'relative',
                      overflow: 'hidden',
                      background:
                        'radial-gradient(circle at top, rgba(250,204,21,0.18), rgba(15,23,42,1))',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      window.open(PAYU_LINK, '_blank');
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        background:
                          'linear-gradient(135deg, rgba(15,23,42,0.4), rgba(15,23,42,0.95))',
                        pointerEvents: 'none'
                      }}
                    />

                    <Box
                      sx={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        zIndex: 1
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <LockOutlinedIcon
                          sx={{
                            fontSize: 26,
                            color: '#facc15'
                          }}
                        />
                        <Chip
                          label="Premium Access"
                          size="small"
                          sx={{
                            borderRadius: 999,
                            height: 22,
                            fontSize: 10,
                            background: 'rgba(250,204,21,0.18)',
                            color: '#facc15',
                            borderColor: 'rgba(250,204,21,0.7)'
                          }}
                          variant="outlined"
                        />
                      </Stack>

                      <Typography
                        sx={{
                          fontSize: 15.5,
                          fontWeight: 700,
                          color: '#fefce8',
                          mb: 1
                        }}
                      >
                        Unlock 500+ banker contacts across India
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: 12.5,
                          color: alpha('#e5e7eb', 0.9),
                          mb: 1
                        }}
                      >
                        View full names, direct calling numbers, official & personal
                        emails, and product-wise coverage for every banker.
                      </Typography>

                      {/* Spacer to push button to bottom */}
                      <Box sx={{ flexGrow: 1 }} />

                      <Button
                        size="small"
                        sx={{
                          mt: 1.8,
                          borderRadius: 999,
                          textTransform: 'none',
                          fontSize: 12.5,
                          fontWeight: 600,
                          px: 2.4,
                          py: 0.6,
                          background:
                            'linear-gradient(135deg, #facc15, #f97316)',
                          color: '#0f172a',
                          '&:hover': {
                            background:
                              'linear-gradient(135deg, #f97316, #facc15)'
                          }
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(PAYU_LINK, '_blank');
                        }}
                      >
                        Pay & unlock full directory
                      </Button>

                      <Typography
                        sx={{
                          mt: 1,
                          fontSize: 10.5,
                          color: alpha('#e5e7eb', 0.8)
                        }}
                      >
                        After payment, your login ID & password will be shared on
                        WhatsApp / email within a few hours.
                      </Typography>
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            </Grid>
          </Container>
        </Section>

        {/* ===== Premium + QR Section ===== */}
        <Box
          id="premium-section"
          sx={{
            pt: 2,
            pb: 8,
            borderTop: `1px solid ${alpha('#1f2937', 0.8)}`,
            background:
              'radial-gradient(circle at top, rgba(250,204,21,0.08), rgba(15,23,42,1))'
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <PremiumCard>
                  <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                    <HighlightBadge
                      label="F2 Directory Premium"
                      variant="outlined"
                    />
                    <Chip
                      size="small"
                      label="Lifetime access (beta)"
                      sx={{
                        borderRadius: 999,
                        height: 22,
                        fontSize: 10,
                        background: 'rgba(34,197,94,0.12)',
                        color: '#bbf7d0',
                        borderColor: 'rgba(34,197,94,0.5)'
                      }}
                      variant="outlined"
                    />
                  </Stack>

                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: 20,
                      mb: 1,
                      color: '#fefce8'
                    }}
                  >
                    Unlock the full banker directory, filters & micro-markets
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 13.5,
                      color: alpha('#e5e7eb', 0.85),
                      mb: 2
                    }}
                  >
                    Get direct calling contacts, official and personal emails,
                    internal product notes and daily updates across banks,
                    NBFCs and DSAs. Perfect for brokers, CAs and fintech teams
                    who are actively closing files.
                  </Typography>

                  <Stack component="ul" sx={{ pl: 2, mb: 2 }}>
                    <Typography component="li" sx={{ fontSize: 13.5 }}>
                      ✔ Unlimited access to all verified banker profiles
                    </Typography>
                    <Typography component="li" sx={{ fontSize: 13.5 }}>
                      ✔ City / micro-market filters and product-wise filters
                    </Typography>
                    <Typography component="li" sx={{ fontSize: 13.5 }}>
                      ✔ WhatsApp support for special or tricky cases
                    </Typography>
                  </Stack>

                  <Typography
                    sx={{
                      fontSize: 13,
                      color: '#e5e7eb',
                      mb: 1
                    }}
                  >
                    💳 One-time online payment (PayU / UPI). After payment,
                    you&apos;ll receive your <b>login ID and password on email</b>.
                    Use those credentials to log in and access the full F2
                    Banker Directory.
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 12,
                      color: alpha('#e5e7eb', 0.8)
                    }}
                  >
                    Access is usually activated within a few hours after we
                    confirm your payment.
                  </Typography>
                </PremiumCard>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    maxWidth: 360,
                    margin: '0 auto',
                    textAlign: 'center'
                  }}
                >
                  <Paper
                    sx={{
                      borderRadius: 18,
                      p: 2.5,
                      background: 'rgba(15,23,42,0.98)',
                      border: `1px solid ${alpha('#facc15', 0.4)}`,
                      boxShadow: '0 18px 40px rgba(15,23,42,0.95)'
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: 600,
                        mb: 1,
                        color: '#fefce8'
                      }}
                    >
                      Scan UPI QR to Pay
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 13,
                        color: alpha('#e5e7eb', 0.85),
                        mb: 2
                      }}
                    >
                      Use any UPI app (GPay, PhonePe etc.).
                    </Typography>

                    <Box
                      sx={{
                        borderRadius: 2,
                        overflow: 'hidden',
                        background: '#ffffff',
                        mb: 1.5,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '6px',
                        border: '1px solid #e5e7eb'
                      }}
                    >
                      <img
                        src="/static/images/199plan.jpeg"
                        alt="UPI QR for F2 Directory Premium"
                        style={{
                          width: 140,
                          height: 'auto',
                          display: 'block'
                        }}
                      />
                    </Box>

                    <Typography
                      sx={{
                        fontSize: 13,
                        color: '#e5e7eb',
                        mb: 1
                      }}
                    >
                      After payment, share the screenshot on:
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: '#bfdbfe',
                        mb: 2
                      }}
                    >
                      {WHATSAPP_NUMBER_DISPLAY}
                    </Typography>

                    <Button
                      fullWidth
                      sx={{
                        mt: 0.1,
                        borderRadius: 999,
                        textTransform: 'none',
                        fontSize: 13,
                        fontWeight: 400,
                        background:
                          'linear-gradient(135deg, #facc15, #f97316)',
                        color: '#0f172a',
                        '&:hover': {
                          background:
                            'linear-gradient(135deg, #f97316, #facc15)'
                        }
                      }}
                      onClick={() => {
                        window.open(
                          `https://wa.me/${WHATSAPP_NUMBER_LINK}`,
                          '_blank'
                        );
                      }}
                    >
                      Message us on WhatsApp after payment
                    </Button>
                  </Paper>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        <MinimalFooter />
      </PageShell>
    </>
  );
};

export default DirectoryPreviewPage;