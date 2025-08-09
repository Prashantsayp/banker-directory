import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import { useEffect, useState } from 'react';
import Footer from '@/components/Footer';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
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

interface BankerReview {
  _id: string;
  bankerName: string;
  associatedWith: string;
  locationCategories: string[];
  emailOfficial: string;
  emailPersonal?: string;
  contact: string;
  product: string[];
  lastCurrentDesignation?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
}

interface ReviewCounts {
  pending: number;
  approved: number;
  rejected: number;
}

const BankerReviewPage = () => {
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

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/banker-directory/review-requests`
      );
      setReviews(res.data);
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to fetch submissions', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchCounts = async () => {
    setCountsLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/banker-directory/review-counts`
      );
      setCounts(res.data);
    } catch {
      setSnackbar({ open: true, message: 'Failed to fetch counts', severity: 'error' });
    } finally {
      setCountsLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    // Optimistic UI: update UI first
    setReviews(prev => prev.map(r => (r._id === id ? { ...r, status: 'approved' } : r)));
    setCounts(c => ({ ...c, pending: Math.max(0, c.pending - 1), approved: c.approved + 1 }));

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/banker-directory/approve-request/${id}`
      );
      setSnackbar({ open: true, message: 'Approved successfully!', severity: 'success' });
    } catch {
      // revert on failure
      setReviews(prev => prev.map(r => (r._id === id ? { ...r, status: 'pending' } : r)));
      setCounts(c => ({ ...c, pending: c.pending + 1, approved: Math.max(0, c.approved - 1) }));
      setSnackbar({ open: true, message: 'Approval failed', severity: 'error' });
    }
  };

  const openRejectionDialog = (id: string) => {
    setSelectedBankerId(id);
    setRejectionReason('');
    setOpenDialog(true);
  };

  const confirmReject = async () => {
    if (!selectedBankerId || !rejectionReason.trim()) {
      setSnackbar({ open: true, message: 'Rejection reason is required', severity: 'error' });
      return;
    }

    // Optimistic UI
    setReviews(prev =>
      prev.map(r =>
        r._id === selectedBankerId ? { ...r, status: 'rejected', rejectionReason } : r
      )
    );
    setCounts(c => ({ ...c, pending: Math.max(0, c.pending - 1), rejected: c.rejected + 1 }));

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/banker-directory/reject-request/${selectedBankerId}`,
        { reason: rejectionReason }
      );
      setSubmittedReason(rejectionReason);
      setShowReasonDialog(true);
      setSnackbar({ open: true, message: 'Rejected successfully!', severity: 'success' });
    } catch {
      // revert on failure
      setReviews(prev =>
        prev.map(r =>
          r._id === selectedBankerId ? { ...r, status: 'pending', rejectionReason: undefined } : r
        )
      );
      setCounts(c => ({ ...c, pending: c.pending + 1, rejected: Math.max(0, c.rejected - 1) }));
      setSnackbar({ open: true, message: 'Rejection failed', severity: 'error' });
    } finally {
      setOpenDialog(false);
      setSelectedBankerId(null);
    }
  };

  useEffect(() => {
    // Load counts + list in parallel
    fetchCounts();
    fetchReviews();
  }, []);

  return (
    <>
      <Head><title>Banker Submissions Review</title></Head>

      {/* Summary Cards */}
      <Grid container spacing={2} paddingX={2} marginTop={2}>
        {[
          {
            label: 'TOTAL PENDING',
            value: counts.pending,
            icon: <PendingActionsIcon sx={{ color: '#EF4444', fontSize: 28 }} />,
            border: '#F87171'
          },
          {
            label: 'TOTAL APPROVED',
            value: counts.approved,
            icon: <CheckCircleIcon sx={{ color: '#10B981', fontSize: 28 }} />,
            border: '#34D399'
          },
          {
            label: 'TOTAL REJECTED',
            value: counts.rejected,
            icon: <CancelIcon sx={{ color: '#F59E0B', fontSize: 28 }} />,
            border: '#FBBF24'
          }
        ].map((card, idx) => (
          <Grid item xs={12} sm={4} key={idx}>
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
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#6B7280' }}>
                {card.label}
              </Typography>

              {countsLoading ? (
                <Skeleton variant="text" width={40} height={34} />
              ) : (
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#111827' }}>
                  {card.value}
                </Typography>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Reviews list */}
      {loading ? (
        <CircularProgress sx={{ mt: 4, display: 'block', mx: 'auto' }} />
      ) : (
        <Grid container spacing={4} padding={2} marginTop={1}>
          {reviews.length === 0 ? (
            <Grid item xs={12}>
              <Typography color="text.secondary" align="center">
                No submissions found.
              </Typography>
            </Grid>
          ) : (
            reviews.map((banker) => (
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
                      <Typography variant="h6" sx={{ color: '#2E3A59', fontWeight: 600 }}>
                        {banker.bankerName}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ color: '#6B7280' }}>
                        {banker.associatedWith}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  <Typography variant="subtitle2" sx={{ color: '#2E3A59', fontWeight: 500 }} gutterBottom>
                    Location Serve:
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" spacing={1} mb={2}>
                    {banker.locationCategories.map((loc, idx) => (
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

                  <Typography variant="subtitle2" sx={{ color: '#2E3A59', fontWeight: 500 }} gutterBottom>
                    Products:
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" spacing={1} mb={2}>
                    {banker.product.map((prod, idx) => (
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
                    <Typography variant="body2" sx={{ color: '#374151', wordBreak: 'break-word' }} gutterBottom>
                      <strong>Official Email:</strong> {banker.emailOfficial}
                    </Typography>
                    {banker.emailPersonal && (
                      <Typography variant="body2" sx={{ color: '#374151' }} gutterBottom>
                        <strong>Personal Email:</strong> {banker.emailPersonal}
                      </Typography>
                    )}
                    <Typography variant="body2" sx={{ color: '#374151' }} gutterBottom>
                      <strong>Contact:</strong> {banker.contact}
                    </Typography>
                    {banker.lastCurrentDesignation && (
                      <Typography variant="body2" sx={{ color: '#374151' }}>
                        <strong>Designation:</strong> {banker.lastCurrentDesignation}
                      </Typography>
                    )}
                  </Box>

                  <Box display="flex" flexDirection="column" justifyContent="flex-end" gap={1} mt={2}>
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
                    ) : (
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
                    )}
                  </Box>
                </Paper>
              </Grid>
            ))
          )}
        </Grid>
      )}

      {/* Rejection Reason Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { backgroundColor: '#fff' } }}
      >
        <DialogTitle sx={{ color: "#1976d2" }}>Reject Submission</DialogTitle>
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
          <Button onClick={() => setOpenDialog(false)} color="inherit">Cancel</Button>
          <Button onClick={confirmReject} color="error" variant="contained">Reject</Button>
        </DialogActions>
      </Dialog>

      {/* Rejection Reason Confirmation Dialog */}
      <Dialog open={showReasonDialog} onClose={() => setShowReasonDialog(false)}>
        <DialogTitle>Submission Rejected</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" gutterBottom><strong>Reason:</strong></Typography>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{submittedReason}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowReasonDialog(false)} autoFocus>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>

      <Footer />
    </>
  );
};

BankerReviewPage.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default BankerReviewPage;
