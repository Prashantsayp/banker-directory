'use client';

import {
  Box,
  Grid,
  Typography,
  Avatar,
  Paper,
  Button,
  IconButton,
  Tooltip,
  Chip,
  TextField,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
  Divider,
  Skeleton,
  Stack
} from '@mui/material';
import {
  EditTwoTone as EditIcon,
  DeleteTwoTone as DeleteIcon,
  AddCircleOutline as AddIcon,
  Search as SearchIcon,
  MailOutline as MailIcon,
  PersonOutline as PersonIcon,
  PhoneOutlined as PhoneIcon,
  Business as BankIcon,
  MapRounded as MapIcon
} from '@mui/icons-material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import LenderFormDialog, { Lender } from '../../../pages/components/LenderFormDialog';

/* ---------- Utils ---------- */
const initials = (name?: string) =>
  (name || '?')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

/* ---------- Design Tokens ---------- */
const COLORS = {
  primary: '#2563EB',
  primaryDark: '#1E40AF',
  cardBorder: '#E5E7EB',
  textStrong: '#0B1220',
  text: '#111827',
  subtle: '#6B7280',
  canvas: '#F3F4F6',
  chip: '#EEF2FF'
} as const;

const CARD_SX = {
  position: 'relative',
  borderRadius: 3,
  p: 2.25,
  height: '100%',
  background:
    'linear-gradient(180deg, rgba(255,255,255,0.97) 0%, rgba(249,250,252,0.96) 100%)',
  border: `1px solid ${COLORS.cardBorder}`,
  transition: 'transform .18s ease, box-shadow .18s ease, border-color .18s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 10px 22px rgba(2,6,23,0.06)',
    borderColor: '#cbd5e1'
  }
} as const;

/* ---------- Small UI helpers ---------- */
const ToolbarButton = ({
  onClick,
  children,
  startIcon
}: {
  onClick: () => void;
  children: React.ReactNode;
  startIcon?: React.ReactNode;
}) => (
  <Button
    onClick={onClick}
    variant="contained"
    startIcon={startIcon}
    sx={{
      borderRadius: 2,
      textTransform: 'none',
      px: 2,
      bgcolor: COLORS.primary,
      boxShadow: '0 8px 20px rgba(37,99,235,.18)',
      '&:hover': { bgcolor: COLORS.primaryDark }
    }}
  >
    {children}
  </Button>
);

const LineItem = ({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value?: React.ReactNode;
}) => (
  <Stack direction="row" spacing={1} alignItems="center">
    <Box
      sx={{
        width: 28,
        height: 28,
        minWidth: 28,
        display: 'grid',
        placeItems: 'center',
        borderRadius: 1.5,
        bgcolor: COLORS.chip,
        color: COLORS.primary,
        border: `1px solid rgba(37,99,235,.25)`
      }}
    >
      {icon}
    </Box>
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="caption" sx={{ color: COLORS.subtle }}>
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: COLORS.text, fontWeight: 600, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
      >
        {value || 'N/A'}
      </Typography>
    </Box>
  </Stack>
);

/* ---------- Component ---------- */
const LenderOverview = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [lenders, setLenders] = useState<Lender[]>([]);
  const [filtered, setFiltered] = useState<Lender[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedLender, setSelectedLender] = useState<Lender | null>(null);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [userRole, setUserRole] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const fetchLenders = async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/lenders/get-lenders`
      );
      setLenders(res?.data || []);
    } catch (e: any) {
      console.error('Error fetching lenders:', e);
      setErr(e?.response?.data?.message || 'Failed to fetch lenders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLenders();
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.role);
      } catch (err) {
        console.error('Failed to decode JWT', err);
      }
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      const q = query.trim().toLowerCase();
      const list = lenders.filter((l) =>
        [l.lenderName, l.city, l.state, l.bankerName, l.rmName, l.email]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q))
      );
      setFiltered(list);
    }, 160);
    return () => clearTimeout(t);
  }, [lenders, query]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this lender?')) return;
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/lenders/delete-lenders/${id}`
      );
      setLenders((prev) => prev.filter((l) => l._id !== id));
    } catch (e: any) {
      console.error('Failed to delete lender:', e);
      setErr(e?.response?.data?.message || 'Something went wrong while deleting');
    }
  };

  const handleAdd = () => {
    setSelectedLender(null);
    setFormOpen(true);
  };

  const handleEdit = (lender: Lender) => {
    setSelectedLender(lender);
    setFormOpen(true);
  };

  /* ---------- UI ---------- */
  return (
    <>
      {/* Top Bar */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          border: `1px solid ${COLORS.cardBorder}`,
          background: `linear-gradient(135deg, ${COLORS.primary} 0%, #60A5FA 100%)`,
          color: '#fff'
        }}
      >
        <Stack
          direction={isMobile ? 'column' : 'row'}
          gap={isMobile ? 1.5 : 2}
          alignItems={isMobile ? 'stretch' : 'center'}
        >
          <Typography variant="h6" sx={{ fontWeight: 800, flex: 1 }}>
            Lenders
          </Typography>

          <Box display="flex" gap={1} flex={2} flexWrap="wrap" justifyContent="flex-end">
            <TextField
              placeholder="Search lender, city, state, RM..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              size="small"
              fullWidth={isMobile}
              sx={{
                minWidth: isMobile ? 'auto' : 340,
                bgcolor: 'rgba(255,255,255,.96)',
                borderRadius: 2,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255,255,255,.65)' },
                  '&:hover fieldset': { borderColor: '#e5e7eb' },
                  '&.Mui-focused fieldset': { borderColor: '#fff' }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: COLORS.primary }} />
                  </InputAdornment>
                )
              }}
            />

            <ToolbarButton onClick={handleAdd} startIcon={<AddIcon />}>
              Add Lender
            </ToolbarButton>
          </Box>
        </Stack>
      </Paper>

      {/* Loading skeletons */}
      {loading && (
        <Grid container spacing={3}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Paper sx={CARD_SX}>
                <Stack direction="row" spacing={2} alignItems="center" mb={1.5}>
                  <Skeleton variant="circular" width={40} height={40} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton width="60%" height={24} />
                    <Skeleton width="40%" height={18} />
                  </Box>
                </Stack>
                <Skeleton height={18} width="90%" />
                <Skeleton height={18} width="82%" />
                <Skeleton height={18} width="70%" />
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 5,
            borderRadius: 3,
            border: `1px dashed ${COLORS.cardBorder}`,
            textAlign: 'center',
            bgcolor: '#fff'
          }}
        >
          <Typography variant="h6" sx={{ color: COLORS.textStrong, fontWeight: 800 }}>
            No lenders found
          </Typography>
          <Typography sx={{ color: COLORS.subtle, mt: 0.5 }}>
            Try a different search keyword or add a new lender.
          </Typography>
          <Button
            onClick={handleAdd}
            startIcon={<AddIcon />}
            sx={{ mt: 2 }}
            variant="contained"
          >
            Add Lender
          </Button>
        </Paper>
      )}

      {/* Cards */}
      {!loading && filtered.length > 0 && (
        <Grid container spacing={3}>
          {filtered.map((l) => (
            <Grid item xs={12} sm={6} md={4} key={l._id}>
              <Paper elevation={0} sx={CARD_SX}>
                {/* Actions: only admin */}
                {userRole === 'admin' && (
                  <Box position="absolute" top={8} right={8} display="flex" gap={0.5}>
                    <Tooltip title="Edit" arrow>
                      <IconButton
                        onClick={() => handleEdit(l)}
                        size="small"
                        sx={{
                          bgcolor: '#EEF2FF',
                          color: COLORS.primary,
                          border: `1px solid rgba(37,99,235,.4)`,
                          '&:hover': { bgcolor: '#E0E7FF' }
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete" arrow>
                      <IconButton
                        onClick={() => handleDelete(l._id!)}
                        size="small"
                        sx={{
                          bgcolor: '#FEF2F2',
                          color: '#B91C1C',
                          border: '1px solid #FCA5A5',
                          '&:hover': { bgcolor: '#FEE2E2' }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}

                {/* Header */}
                <Stack direction="row" spacing={1.5} alignItems="center" mb={1.25}>
                  <Avatar sx={{ bgcolor: COLORS.primary, color: '#fff', width: 42, height: 42 }}>
                    {initials(l.lenderName)}
                  </Avatar>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ color: COLORS.textStrong, fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    >
                      {l.lenderName}
                    </Typography>
                    <Chip
                      size="small"
                      icon={<MapIcon sx={{ color: 'inherit !important' }} />}
                      label={`${l.city || '—'}, ${l.state || '—'}`}
                      sx={{
                        mt: 0.5,
                        bgcolor: COLORS.chip,
                        color: COLORS.primary,
                        fontWeight: 600,
                        borderRadius: 1.5,
                        border: `1px solid rgba(37,99,235,.35)`,
                        '& .MuiChip-icon': { color: COLORS.primary }
                      }}
                    />
                  </Box>
                </Stack>

                <Divider sx={{ my: 1.25 }} />

                {/* Details */}
                <Stack spacing={1.1}>
                  <LineItem icon={<BankIcon fontSize="small" />} label="Lender" value={l.lenderName} />
                  <LineItem icon={<PersonIcon fontSize="small" />} label="Banker Name" value={l.bankerName} />
                  <LineItem icon={<PersonIcon fontSize="small" />} label="RM / SM" value={l.rmName} />
                  <LineItem icon={<PhoneIcon fontSize="small" />} label="Contact" value={l.rmContact} />
                  {l.email && (
                    <LineItem
                      icon={<MailIcon fontSize="small" />}
                      label="Email"
                      value={
                        <span style={{ wordBreak: 'break-word' }}>
                          {l.email}
                        </span>
                      }
                    />
                  )}
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add/Edit Dialog */}
      <LenderFormDialog
        open={formOpen}
        initialData={selectedLender}
        onClose={() => setFormOpen(false)}
        onSuccess={() => {
          setFormOpen(false);
          fetchLenders();
        }}
      />

      {/* Error Snackbar */}
      <Snackbar
        open={!!err}
        autoHideDuration={3500}
        onClose={() => setErr(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setErr(null)} severity="error" variant="filled" sx={{ width: '100%' }}>
          {err}
        </Alert>
      </Snackbar>
    </>
  );
};

export default LenderOverview;
