import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import { useEffect, useState } from 'react';
import Footer from '@/components/Footer';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EmojiEventsTwoToneIcon from '@mui/icons-material/EmojiEventsTwoTone';
import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Snackbar,
  Stack,
  Typography,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Skeleton
} from '@mui/material';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface BankerReview {
  _id: string;
  bankerName: string;
  associatedWith: string;

  locationCategories?: string[];
  state?: string;
  city?: string;

  emailOfficial: string;
  emailPersonal?: string;
  contact: string;
  product: string[];
  lastCurrentDesignation?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;

  createdBy?: string;
}

interface ReviewCounts {
  pending: number;
  approved: number;
  rejected: number;
}

interface DecodedToken {
  role?: string;
  _id?: string;
  id?: string;
  userId?: string;
  email?: string;
}

/* ---------- TOKEN HELPERS ---------- */

const getTokenFromLocalStorage = () => {
  if (typeof window === 'undefined') return null;

  const possibleKeys = ['token', 'authToken', 'accessToken', 'jwt', 'jwtToken'];

  for (const key of possibleKeys) {
    const val = localStorage.getItem(key);
    if (val) {
      console.log(`🔑 Using token from key "${key}" =>`, val);
      return val;
    }
  }

  console.warn('⚠️ No JWT token found in any known LS key');
  return null;
};

const getAuthHeaders = () => {
  const token = getTokenFromLocalStorage();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const BankerReviewPage = () => {
  const [role, setRole] = useState<'admin' | 'user' | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);

  const [reviews, setReviews] = useState<BankerReview[]>([]);
  const [loading, setLoading] = useState(true);

  const [counts, setCounts] = useState<ReviewCounts>({
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [countsLoading, setCountsLoading] = useState(true);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBankerId, setSelectedBankerId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showReasonDialog, setShowReasonDialog] = useState(false);
  const [submittedReason, setSubmittedReason] = useState('');

  /* ---------- Decode role from token ---------- */
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;

      const token = getTokenFromLocalStorage();
      if (!token) {
        console.warn('❌ No token found, defaulting role=user');
        setRole('user');
        setRoleLoading(false);
        return;
      }

      const decoded = jwtDecode<DecodedToken>(token);
      const rawRole = (decoded.role || '').toString().toLowerCase();
      const normalizedRole: 'admin' | 'user' =
        rawRole === 'admin' ? 'admin' : 'user';

      console.log('🔐 Decoded token =>', decoded, ' | role =>', normalizedRole);
      setRole(normalizedRole);
    } catch (err) {
      console.error('JWT decode failed in review page:', err);
      setRole('user');
    } finally {
      setRoleLoading(false);
    }
  }, []);

const fetchReviews = async () => {
  setLoading(true);
  try {
    const isAdmin = role === 'admin';

    const url = isAdmin
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/banker-directory/review-requests`
      : `${process.env.NEXT_PUBLIC_BACKEND_URL}/banker-directory/my-review-requests`;

    const res = await axios.get(url, { headers: getAuthHeaders() });
    setReviews(res.data || []);
  } catch (error: any) {
    // same error handling
  } finally {
    setLoading(false);
  }
};


  const fetchCounts = async () => {
    try {
      console.log('📤 Calling /review-counts with headers:', getAuthHeaders());

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/banker-directory/review-counts`,
        { headers: getAuthHeaders() }
      );
      setCounts(res.data);
    } catch (e: any) {
      console.error('fetchCounts error:', e?.response || e);
      const msg =
        e?.response?.status === 401
          ? 'Unauthorized: token missing/invalid. Please login again.'
          : 'Failed to fetch counts';
      setSnackbar({
        open: true,
        message: msg,
        severity: 'error'
      });
    } finally {
      setCountsLoading(false);
    }
  };

  /* ---------- Load data after role resolved ---------- */
  useEffect(() => {
    if (roleLoading) return;

    fetchReviews();
    if (role === 'admin') {
      fetchCounts();
    } else {
      setCountsLoading(false);
    }
  }, [roleLoading, role]);

  /* ---------- Derived counts + points (user side) ---------- */
  const userCounts: ReviewCounts = {
    pending: reviews.filter((r) => r.status === 'pending').length,
    approved: reviews.filter((r) => r.status === 'approved').length,
    rejected: reviews.filter((r) => r.status === 'rejected').length
  };

  const effectiveCounts: ReviewCounts = role === 'admin' ? counts : userCounts;
  const isCountsLoading = role === 'admin' ? countsLoading : loading;

  const userPoints = userCounts.approved;

  /* ---------- Approve / Reject handlers ---------- */
  const handleApprove = async (id: string) => {
    if (role !== 'admin') return;

    setReviews((prev) =>
      prev.map((r) =>
        r._id === id
          ? { ...r, status: 'approved', rejectionReason: undefined }
          : r
      )
    );

    if (role === 'admin') {
      setCounts((c) => ({
        ...c,
        pending: Math.max(0, c.pending - 1),
        approved: c.approved + 1
      }));
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/banker-directory/approve-request/${id}`,
        {},
        { headers: getAuthHeaders() }
      );
      setSnackbar({
        open: true,
        message: 'Approved successfully!',
        severity: 'success'
      });
    } catch (e: any) {
      console.error('approve error:', e?.response || e);
      setReviews((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: 'pending' } : r))
      );
      if (role === 'admin') {
        setCounts((c) => ({
          ...c,
          pending: c.pending + 1,
          approved: Math.max(0, c.approved - 1)
        }));
      }

      const msg =
        e?.response?.status === 401
          ? 'Unauthorized: token missing/invalid. Please login again.'
          : 'Approval failed';
      setSnackbar({
        open: true,
        message: msg,
        severity: 'error'
      });
    }
  };

  const openRejectionDialog = (id: string) => {
    if (role !== 'admin') return;
    setSelectedBankerId(id);
    setRejectionReason('');
    setOpenDialog(true);
  };

  const confirmReject = async () => {
    if (role !== 'admin') return;

    if (!selectedBankerId || !rejectionReason.trim()) {
      setSnackbar({
        open: true,
        message: 'Rejection reason is required',
        severity: 'error'
      });
      return;
    }

    setReviews((prev) =>
      prev.map((r) =>
        r._id === selectedBankerId
          ? { ...r, status: 'rejected', rejectionReason }
          : r
      )
    );

    if (role === 'admin') {
      setCounts((c) => ({
        ...c,
        pending: Math.max(0, c.pending - 1),
        rejected: c.rejected + 1
      }));
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/banker-directory/reject-request/${selectedBankerId}`,
        { reason: rejectionReason },
        { headers: getAuthHeaders() }
      );
      setSubmittedReason(rejectionReason);
      setShowReasonDialog(true);
      setSnackbar({
        open: true,
        message: 'Rejected successfully!',
        severity: 'success'
      });
    } catch (e: any) {
      console.error('reject error:', e?.response || e);
      setReviews((prev) =>
        prev.map((r) =>
          r._id === selectedBankerId
            ? { ...r, status: 'pending', rejectionReason: undefined }
            : r
        )
      );
      if (role === 'admin') {
        setCounts((c) => ({
          ...c,
          pending: c.pending + 1,
          rejected: Math.max(0, c.rejected - 1)
        }));
      }

      const msg =
        e?.response?.status === 401
          ? 'Unauthorized: token missing/invalid. Please login again.'
          : 'Rejection failed';
      setSnackbar({
        open: true,
        message: msg,
        severity: 'error'
      });
    } finally {
      setOpenDialog(false);
      setSelectedBankerId(null);
    }
  };

  /* ---------- UI ---------- */
  const cardsConfig = [
    {
      label: role === 'admin' ? 'TOTAL PENDING' : 'YOUR PENDING',
      value: effectiveCounts.pending,
      icon: <PendingActionsIcon sx={{ color: '#EF4444', fontSize: 28 }} />,
      border: '#F87171'
    },
    {
      label: role === 'admin' ? 'TOTAL APPROVED' : 'YOUR APPROVED',
      value: effectiveCounts.approved,
      icon: <CheckCircleIcon sx={{ color: '#10B981', fontSize: 28 }} />,
      border: '#34D399'
    },
    {
      label: role === 'admin' ? 'TOTAL REJECTED' : 'YOUR REJECTED',
      value: effectiveCounts.rejected,
      icon: <CancelIcon sx={{ color: '#F59E0B', fontSize: 28 }} />,
      border: '#FBBF24'
    },
    ...(role === 'admin'
      ? []
      : [
          {
            label: 'YOUR POINTS',
            value: userPoints,
            icon: (
              <EmojiEventsTwoToneIcon
                sx={{ color: '#FACC15', fontSize: 28 }}
              />
            ),
            border: '#FACC15'
          }
        ])
  ];

  return (
    <>
      <Head>
        <title>Banker Submissions Review</title>
      </Head>

      <Grid container spacing={2} paddingX={2} marginTop={2}>
        {cardsConfig.map((card, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Paper
              elevation={1}
              sx={{
                backgroundColor: '#fff',
                p: 2.5,
                borderRadius: 2,
                borderBottom: `4px solid ${card.border}`,
                display: 'flex',
                flexDirection: 'column',
                gap: 1.2,
                alignItems: 'flex-start'
              }}
            >
              {card.icon}
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, color: '#6B7280' }}
              >
                {card.label}
              </Typography>

              {isCountsLoading ? (
                <Skeleton variant="text" width={40} height={34} />
              ) : (
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: '#111827' }}
                >
                  {card.value}
                </Typography>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>

      {loading ? (
        <CircularProgress sx={{ mt: 4, display: 'block', mx: 'auto' }} />
      ) : (
        <Grid container spacing={4} padding={2} marginTop={1}>
          {reviews.length === 0 ? (
            <Grid item xs={12}>
              <Typography color="text.secondary" align="center">
                {role === 'admin'
                  ? 'No submissions found.'
                  : 'You have not submitted any bankers yet.'}
              </Typography>
            </Grid>
          ) : (
            reviews.map((banker) => {
              const locations: string[] =
                banker.locationCategories && banker.locationCategories.length
                  ? banker.locationCategories
                  : [banker.state, banker.city].filter(
                      (x): x is string => !!x && x.trim().length > 0
                    );

              return (
                <Grid item xs={12} sm={6} md={4} key={banker._id}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      height: '100%',
                      background: '#ffffff',
                      border: '1px solid #e5e7eb',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 6px 20px rgba(0,0,0,0.05)',
                        borderColor: '#cbd5e1'
                      }
                    }}
                  >
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar sx={{ bgcolor: '#2563EB', mr: 2 }}>
                        {banker.bankerName?.charAt(0)?.toUpperCase() || 'B'}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{ color: '#2E3A59', fontWeight: 600 }}
                        >
                          {banker.bankerName}
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          sx={{ color: '#6B7280' }}
                        >
                          {banker.associatedWith}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <Typography
                      variant="subtitle2"
                      sx={{ color: '#2E3A59', fontWeight: 500 }}
                      gutterBottom
                    >
                      Location Serve:
                    </Typography>
                    <Stack
                      direction="row"
                      flexWrap="wrap"
                      spacing={1}
                      mb={2}
                    >
                      {locations.map((loc, idx) => (
                        <Chip
                          key={idx}
                          label={loc}
                          size="small"
                          variant="outlined"
                          sx={{
                            color: '#2563EB',
                            borderColor: '#93C5FD',
                            backgroundColor: '#F0F9FF',
                            fontWeight: 500
                          }}
                        />
                      ))}
                    </Stack>

                    <Typography
                      variant="subtitle2"
                      sx={{ color: '#2E3A59', fontWeight: 500 }}
                      gutterBottom
                    >
                      Products:
                    </Typography>
                    <Stack
                      direction="row"
                      flexWrap="wrap"
                      spacing={1}
                      mb={2}
                    >
                      {banker.product?.map((prod, idx) => (
                        <Chip
                          key={idx}
                          label={prod}
                          size="small"
                          variant="outlined"
                          sx={{
                            color: '#047857',
                            borderColor: '#6EE7B7',
                            backgroundColor: '#ECFDF5',
                            fontWeight: 500
                          }}
                        />
                      ))}
                    </Stack>

                    <Box mb={1}>
                      <Typography
                        variant="body2"
                        sx={{ color: '#374151', wordBreak: 'break-word' }}
                        gutterBottom
                      >
                        <strong>Official Email:</strong> {banker.emailOfficial}
                      </Typography>
                      {banker.emailPersonal && (
                        <Typography
                          variant="body2"
                          sx={{ color: '#374151' }}
                          gutterBottom
                        >
                          <strong>Personal Email:</strong>{' '}
                          {banker.emailPersonal}
                        </Typography>
                      )}
                      <Typography
                        variant="body2"
                        sx={{ color: '#374151' }}
                        gutterBottom
                      >
                        <strong>Contact:</strong> {banker.contact}
                      </Typography>
                      {banker.lastCurrentDesignation && (
                        <Typography
                          variant="body2"
                          sx={{ color: '#374151' }}
                        >
                          <strong>Designation:</strong>{' '}
                          {banker.lastCurrentDesignation}
                        </Typography>
                      )}
                    </Box>

                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="flex-end"
                      gap={1}
                      mt={2}
                    >
                      {banker.status === 'approved' ? (
                        <Chip
                          label="Approved"
                          sx={{
                            color: '#047857',
                            borderColor: '#6EE7B7',
                            backgroundColor: '#ECFDF5',
                            fontWeight: 600
                          }}
                        />
                      ) : banker.status === 'rejected' ? (
                        <>
                          <Chip
                            label="Rejected"
                            sx={{
                              color: '#B91C1C',
                              borderColor: '#FCA5A5',
                              backgroundColor: '#FEF2F2',
                              fontWeight: 600
                            }}
                          />
                          {banker.rejectionReason && (
                            <Typography
                              variant="body2"
                              sx={{
                                color: '#B91C1C',
                                fontStyle: 'italic',
                                fontSize: '0.875rem',
                                mt: 0.5
                              }}
                            >
                              Reason: {banker.rejectionReason}
                            </Typography>
                          )}
                        </>
                      ) : role === 'admin' ? (
                        <Stack direction="row" spacing={1}>
                          <Chip
                            label="Approve"
                            onClick={() => handleApprove(banker._id)}
                            clickable
                            sx={{
                              color: '#047857',
                              borderColor: '#6EE7B7',
                              backgroundColor: '#ECFDF5',
                              '&:hover': { backgroundColor: '#D1FAE5' }
                            }}
                            variant="outlined"
                          />
                          <Chip
                            label="Reject"
                            onClick={() => openRejectionDialog(banker._id)}
                            clickable
                            sx={{
                              color: '#B91C1C',
                              borderColor: '#FCA5A5',
                              backgroundColor: '#FEF2F2',
                              '&:hover': { backgroundColor: '#FEE2E2' }
                            }}
                            variant="outlined"
                          />
                        </Stack>
                      ) : (
                        <Chip
                          label="Pending Review"
                          sx={{
                            color: '#92400E',
                            borderColor: '#FDBA74',
                            backgroundColor: '#FFFBEB',
                            fontWeight: 600
                          }}
                        />
                      )}
                    </Box>
                  </Paper>
                </Grid>
              );
            })
          )}
        </Grid>
      )}

      {/* Rejection Reason Dialog (ADMIN ONLY) */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { backgroundColor: '#fff' } }}
      >
        <DialogTitle sx={{ color: '#1976d2' }}>Reject Submission</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Reason for Rejection"
            fullWidth
            multiline
            rows={3}
            placeholder="Write a clear reason why this submission is being rejected..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            sx={{
              '& .MuiInputBase-input': { color: '#000' },
              '& .MuiInputLabel-root': { color: '#000' },
              '& .MuiOutlinedInput-root fieldset': { borderColor: '#ccc' }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={confirmReject} color="error" variant="contained">
            Reject
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rejection Reason Confirmation Dialog */}
      <Dialog
        open={showReasonDialog}
        onClose={() => setShowReasonDialog(false)}
      >
        <DialogTitle>Submission Rejected</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" gutterBottom>
            <strong>Reason:</strong>
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
            {submittedReason}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowReasonDialog(false)} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Footer />
    </>
  );
};

BankerReviewPage.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default BankerReviewPage;
