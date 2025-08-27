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
  Alert
} from '@mui/material';
import {
  EditTwoTone as EditIcon,
  DeleteTwoTone as DeleteIcon,
  AddCircleOutline as AddIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import LenderFormDialog, { Lender } from '../../../pages/components/LenderFormDialog';

const initials = (name?: string) =>
  (name || '?')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const CARD_SX = {
  p: 3,
  borderRadius: 3,
  position: 'relative',
  background:
    'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(249,250,252,0.9) 100%)',
  border: '1px solid',
  borderColor: 'divider',
  transition:
    'transform .25s ease, box-shadow .25s ease, border-color .25s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: 6,
    borderColor: 'primary.light'
  }
} as const;

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
      bgcolor: 'primary.main',
      '&:hover': { bgcolor: 'primary.dark' }
    }}
  >
    {children}
  </Button>
);

const LenderOverview = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [lenders, setLenders] = useState<Lender[]>([]);
  const [filtered, setFiltered] = useState<Lender[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedLender, setSelectedLender] = useState<Lender | null>(null);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [userRole, setUserRole] = useState<string | null>(null); // 👈 added role state
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
    // fetch lenders
    fetchLenders();

    // decode JWT role
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
    }, 180);
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
      setErr(
        e?.response?.data?.message || 'Something went wrong while deleting'
      );
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

  return (
    <>
      {/* Toolbar */}
      <Paper
        elevation={0}
        sx={{
          p: 1,
          mb: 3,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #F9FAFC 100%)'
        }}
      >
        <Box
          display="flex"
          flexDirection={isMobile ? 'column' : 'row'}
          gap={isMobile ? 1.25 : 2}
          alignItems={isMobile ? 'stretch' : 'center'}
          justifyContent="space-between"
        >
          <Box display="flex" gap={1} flex={1} justifyContent="flex-end">
            <TextField
              placeholder="Search lender, city, state, RM..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              size="small"
              fullWidth={isMobile}
              sx={{ minWidth: isMobile ? 'auto' : 320 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                )
              }}
            />

              <ToolbarButton onClick={handleAdd} startIcon={<AddIcon />}>
                Add Lender
              </ToolbarButton>
          
          </Box>
        </Box>
      </Paper>

      {/* Cards */}
      {!loading && filtered.length > 0 && (
        <Grid container spacing={3}>
          {filtered.map((lender) => (
            <Grid item xs={12} sm={6} md={4} key={lender._id}>
              <Paper elevation={0} sx={CARD_SX}>
                {/* Actions: only admin */}
                {userRole === 'admin' && (
                  <Box
                    position="absolute"
                    top={8}
                    right={8}
                    display="flex"
                    gap={0.5}
                  >
                    <Tooltip title="Edit" arrow>
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(lender)}
                        size="small"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete" arrow>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(lender._id!)}
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}

                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar
                    sx={{ mr: 2, bgcolor: 'primary.main', color: 'white' }}
                  >
                    {initials(lender.lenderName)}
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ color: 'primary.dark', fontWeight: 700 }}
                    >
                      {lender.lenderName}
                    </Typography>
                    <Chip
                      label={`${lender.city || '—'}, ${lender.state || '—'}`}
                      size="small"
                      sx={{
                        mt: 0.5,
                        bgcolor: 'primary.main',
                        color: 'white',
                        fontWeight: 600,
                        borderRadius: 1.5
                      }}
                    />
                  </Box>
                </Box>

                <Typography variant="body2" gutterBottom sx={{ color: '#000' }}>
                  <strong>Lender Name:</strong> {lender.lenderName || 'N/A'}
                </Typography>
                <Typography variant="body2" gutterBottom sx={{ color: '#000' }}>
                  <strong>Banker Name:</strong> {lender.bankerName || 'N/A'}
                </Typography>
                <Typography variant="body2" gutterBottom sx={{ color: '#000' }}>
                  <strong>RM/SM:</strong> {lender.rmName || 'N/A'}
                </Typography>
                <Typography variant="body2" gutterBottom sx={{ color: '#000' }}>
                  <strong>Contact:</strong> {lender.rmContact || 'N/A'}
                </Typography>
                {lender.email && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#000',
                      wordBreak: 'break-all',
                      overflowWrap: 'anywhere'
                    }}
                  >
                    <strong>Email:</strong> {lender.email}
                  </Typography>
                )}
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
        <Alert
          onClose={() => setErr(null)}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {err}
        </Alert>
      </Snackbar>
    </>
  );
};

export default LenderOverview;
