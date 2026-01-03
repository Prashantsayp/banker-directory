import SidebarLayout from '@/layouts/SidebarLayout';
import { useEffect, useMemo, useState } from 'react';
import Footer from '@/components/Footer';
import {
  Box,
  Grid,
  Typography,
  Avatar,
  Paper,
  Chip,
  Divider,
  Stack,
  TextField,
  Container,
  MenuItem,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
  LinearProgress,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Autocomplete,
  Popover
} from '@mui/material';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import useDebounce from 'hooks/useDebounce';
import BankerEditDialog from '../../components/BankerEditDialog';
import CustomSnackbar from '../../../src/components/CustomSnackbar';

import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DirectoryForm from '../../../src/content/Dashboards/Tasks/BankerDirectoryForm';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import GridViewIcon from '@mui/icons-material/GridView';
import TableChartIcon from '@mui/icons-material/TableChart';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import FilterListIcon from '@mui/icons-material/FilterList';

interface Banker {
  _id: string;
  bankerName: string;
  associatedWith: string;
  state?: string | string[];
  city?: string | string[];
  emailOfficial: string;
  emailPersonal?: string;
  contact: string;
  product: string[];
  lastCurrentDesignation?: string;
}

/* ---------- Design Tokens ---------- */
const COLORS = {
  primary: '#2563EB',
  primaryDark: '#1E40AF',
  textDark: '#111827',
  text: '#374151',
  subtle: '#6B7280',
  canvas: '#F3F4F6',
  card: '#FFFFFF',
  border: '#E5E7EB',
  rowHover: '#F0F9FF',
  rowAlt: '#FAFBFF'
};

const STORAGE_KEYS = {
  view: 'bankerDir:view'
};

const copyToClipboard = async (text: string) => {
  try {
    if (!text) return false;
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

// kis column pe filter chal raha hai
type ActiveFilter = 'stateCity' | 'associated' | 'emailOfficial' | 'banker';

const BankerOverview = ({ role }: { role: string | null }) => {
  const [filteredBankers, setFilteredBankers] = useState<Banker[]>([]);
const [refreshKey, setRefreshKey] = useState(0);

  // filters
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [searchBanker, setSearchBanker] = useState('');
  const [searchAssociatedWith, setSearchAssociatedWith] = useState('');
  const [searchEmailOfficial, setSearchEmailOfficial] = useState('');

  // active column filter
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>('stateCity');

  // state/city meta from DB
  const [stateOptions, setStateOptions] = useState<string[]>([]);
  const [citiesByState, setCitiesByState] = useState<Record<string, string[]>>(
    {}
  );

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editBanker, setEditBanker] = useState<Banker | null>(null);

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [totalCount, setTotalCount] = useState(0);

  const [openFormModal, setOpenFormModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // normalize role for admin checks
  const isAdmin = (role || '').toString().trim().toLowerCase() === 'admin';

  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [snack, setSnack] = useState<{
    open: boolean;
    msg: string;
    severity: 'success' | 'info' | 'error';
  }>({
    open: false,
    msg: '',
    severity: 'success'
  });

  // filter popover
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLElement | null>(
    null
  );
  const filterPopoverOpen = Boolean(filterAnchorEl);

  const handleOpenFilterPopover = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleCloseFilterPopover = () => {
    setFilterAnchorEl(null);
  };

  const debouncedBanker = useDebounce(searchBanker, 500);
  const debouncedAssociated = useDebounce(searchAssociatedWith, 500);
  const debouncedEmail = useDebounce(searchEmailOfficial, 500);
  const debouncedState = useDebounce(selectedState, 400);
  const debouncedCity = useDebounce(selectedCity, 400);

  /* ---------- Hydrate view mode ---------- */
  useEffect(() => {
    const storedView = (localStorage.getItem(STORAGE_KEYS.view) || 'grid') as
      | 'grid'
      | 'table';
    setViewMode(storedView);
  }, []);

  /* ---------- Load State/City Meta from backend ---------- */
  useEffect(() => {
    const loadStateCityMeta = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/banker-directory/state-city-meta`
        );
        const { states, stateCityMap } = res.data || {};
        if (Array.isArray(states)) setStateOptions(states);
        if (stateCityMap && typeof stateCityMap === 'object')
          setCitiesByState(stateCityMap);
      } catch (err) {
        console.error('State/City meta load error:', err);
      }
    };
    loadStateCityMeta();
  }, []);

  const getCityOptions = () => {
    if (!selectedState) return [];
    return citiesByState[selectedState] || [];
  };

  /* ---------- Filters change -> reset page ---------- */
  useEffect(() => {
    setPage(1);
  }, [debouncedState, debouncedCity, debouncedBanker, debouncedAssociated, debouncedEmail]);

  /* ---------- Fetch Filtered Bankers ---------- */
  useEffect(() => {
    const fetchFiltered = async () => {
      setLoading(true);
      try {
        const params: any = { page, limit };

        // only active filter ke hisaab se params bhejo
        if (activeFilter === 'stateCity') {
          if (debouncedState) params.state = debouncedState;
          if (debouncedCity) params.city = debouncedCity;
        }

        if (activeFilter === 'banker' && debouncedBanker.trim()) {
          params.bankerName = debouncedBanker.trim();
        }

        if (activeFilter === 'associated' && debouncedAssociated.trim()) {
          params.associatedWith = debouncedAssociated.trim();
        }

        if (activeFilter === 'emailOfficial' && debouncedEmail.trim()) {
          params.emailOfficial = debouncedEmail.trim();
        }

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/banker-directory/filter`,
          { params }
        );
        const { data, totalCount } = res.data || {};
        setFilteredBankers(Array.isArray(data) ? data : []);
        setTotalCount(typeof totalCount === 'number' ? totalCount : 0);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiltered();
  }, [
    activeFilter,
    debouncedState,
    debouncedCity,
    debouncedBanker,
    debouncedAssociated,
    debouncedEmail,
    page,
    limit,
    refreshKey  
  ]);

  /* ---------- Handlers ---------- */
  const handleClearSearch = (
    type: 'state' | 'city' | 'banker' | 'associated' | 'emailOfficial'
  ) => {
    if (type === 'state') {
      setSelectedState('');
      setSelectedCity('');
    }
    if (type === 'city') setSelectedCity('');
    if (type === 'banker') setSearchBanker('');
    if (type === 'associated') setSearchAssociatedWith('');
    if (type === 'emailOfficial') setSearchEmailOfficial('');
  };

  const handleClearAll = () => {
    setSelectedState('');
    setSelectedCity('');
    setSearchBanker('');
    setSearchAssociatedWith('');
    setSearchEmailOfficial('');
  };

  const handleEdit = (banker: Banker) => {
    setEditBanker(banker);
    setEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this banker?')) {
      try {
        setLoading(true);
        await axios.delete(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/banker-directory/delete-directory/${id}`
        );
        setFilteredBankers((prev) => prev.filter((b) => b._id !== id));
        setTotalCount((prev) => Math.max(prev - 1, 0));
        setSnack({
          open: true,
          msg: 'Banker deleted successfully',
          severity: 'success'
        });
      } catch (err) {
        console.error('Delete failed:', err);
        setSnack({
          open: true,
          msg: 'Delete failed!',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveChanges = async () => {
    if (!editBanker) return;

    const {
      _id,
      __v,
      createdAt,
      updatedAt,
      state,
      city,
      ...rest
    } = editBanker as any;

    // Abhi ke liye state/city ko payload me mat bhejna
    const updatePayload = {
      bankerName: rest.bankerName,
      associatedWith: rest.associatedWith,
      emailOfficial: rest.emailOfficial,
      emailPersonal: rest.emailPersonal,
      contact: rest.contact,
      product: Array.isArray(rest.product)
        ? rest.product
        : typeof rest.product === 'string'
        ? rest.product
            .split(',')
            .map((v: string) => v.trim())
            .filter(Boolean)
        : [],
      lastCurrentDesignation: rest.lastCurrentDesignation
    };

    console.log('🚀 PATCH payload (without state/city) =>', updatePayload);

    try {
      setLoading(true);
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/banker-directory/update-directory/${_id}`,
        updatePayload
      );

      const updated = res.data;
      setFilteredBankers(prev =>
        prev.map(b => (b._id === _id ? { ...b, ...updated } : b))
      );
      setEditModalOpen(false);
      setEditBanker(null);

      setSnack({
        open: true,
        msg: 'Banker updated successfully',
        severity: 'success'
      });
    } catch (err: any) {
      console.error('Update failed:', err);
      console.log('❌ ERROR RESPONSE:', err?.response?.data);
      setSnack({
        open: true,
        msg: err?.response?.data?.message
          ? Array.isArray(err.response.data.message)
            ? err.response.data.message.join(', ')
            : String(err.response.data.message)
          : 'Update failed!',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenUpload = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setUploadError(null);
    setOpenUploadModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files?.[0] || null);
    setUploadError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('Please select a file');
      return;
    }
    setUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/banker-directory/bulk-upload`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (evt) => {
            if (!evt.total) return;
            setUploadProgress(Math.round((evt.loaded * 100) / evt.total));
          }
        }
      );

      setOpenUploadModal(false);
      setSelectedFile(null);
      setPage(1);
      setSnack({
        open: true,
        msg: 'Upload completed successfully',
        severity: 'success'
      });
    } catch (err: any) {
      console.error('Bulk upload failed:', err);
      const msg = err?.response?.data?.message || 'Upload failed';
      setUploadError(msg);
      setSnack({
        open: true,
        msg,
        severity: 'error'
      });
    } finally {
      setUploading(false);
    }
  };

  const downloadCsvTemplate = () => {
    const csvHeader =
      'bankerName,associatedWith,state,city,emailOfficial,emailPersonal,contact,product\n';
    const blob = new Blob([csvHeader], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'banker_directory_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCurrentCSV = () => {
    const rows = filteredBankers.map((b) => ({
      bankerName: b.bankerName || '',
      associatedWith: b.associatedWith || '',
      state: (b.state as string) || '',
      city: (b.city as string) || '',
      emailOfficial: b.emailOfficial || '',
      emailPersonal: b.emailPersonal || '',
      contact: b.contact || '',
      product: (b.product || []).join('; ')
    }));

    const header =
      'bankerName,associatedWith,state,city,emailOfficial,emailPersonal,contact,product';
    const body = rows
      .map((r) =>
        [
          r.bankerName,
          r.associatedWith,
          r.state,
          r.city,
          r.emailOfficial,
          r.emailPersonal,
          r.contact,
          r.product
        ]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(',')
      )
      .join('\n');

    const csv = `${header}\n${body}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'banker_directory_results.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async (text: string) => {
    const ok = await copyToClipboard(text);
    setSnack({
      open: true,
      msg: ok ? 'Copied to clipboard' : 'Copy failed',
      severity: ok ? 'success' : 'error'
    });
  };

  const gridItems = useMemo(() => filteredBankers, [filteredBankers]);

  /* ---------- Reusable Chip Group for products ---------- */
  const ProductChipGroup = ({
    items = [],
    max = 6
  }: {
    items?: string[];
    max?: number;
  }) => {
    const visible = items.slice(0, max);
    const rest = Math.max(items.length - max, 0);
    return (
      <Stack direction="row" spacing={0.5} flexWrap="wrap">
        {visible.map((label, i) => (
          <Chip
            key={`${label}-${i}`}
            label={label}
            size="small"
            variant="outlined"
            sx={{
              height: 22,
              '& .MuiChip-label': { px: 1, fontSize: 11, fontWeight: 500 },
              color: '#065F46',
              borderColor: '#A7F3D0',
              bgcolor: '#ECFDF5'
            }}
          />
        ))}
        {rest > 0 && (
          <Chip
            size="small"
            label={`+${rest}`}
            variant="outlined"
            sx={{
              height: 22,
              '& .MuiChip-label': { px: 1, fontSize: 11 },
              borderColor: '#E5E7EB'
            }}
          />
        )}
      </Stack>
    );
  };

  /* ---------- UI ---------- */
  return (
    <Box sx={{ px: 2, py: 1 }}>
      {loading && (
        <Box mb={1}>
          <LinearProgress />
        </Box>
      )}

      {/* Top Action Strip — all right aligned */}
      <Paper
        elevation={0}
        sx={{
          mb: 1.5,
          borderRadius: 3,
          border: 'none',
          background: 'transparent',
          color: 'inherit',
          px: 2.6,
          py: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end'
        }}
      >
        <Stack
          direction="row"
          spacing={1.2}
          alignItems="center"
          flexWrap="nowrap"
        >
          {/* View Tabs */}
          <Tabs
            value={viewMode}
            onChange={(_, v) => {
              setViewMode(v);
              localStorage.setItem(STORAGE_KEYS.view, v);
            }}
            aria-label="view mode"
            sx={{
              minHeight: 0,
              '& .MuiTabs-flexContainer': { gap: 0.5 },
              '& .MuiTab-root': {
                minHeight: 0,
                px: 0.9,
                py: 0.55,
                borderRadius: 999,
                color: '#9CA3AF',
                fontSize: 11,
                textTransform: 'none',
                minWidth: 0,
                bgcolor: 'rgba(17,24,39,.82)',
                '&:hover': { bgcolor: 'rgba(31,41,55,.95)' },
                '&.Mui-selected': {
                  bgcolor: '#F9FAFB',
                  color: '#111827'
                }
              },
              '& .MuiTabs-indicator': { display: 'none' }
            }}
          >
            <Tab value="grid" icon={<GridViewIcon sx={{ fontSize: 16 }} />} />
            <Tab value="table" icon={<TableChartIcon sx={{ fontSize: 16 }} />} />
          </Tabs>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mx: 1
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: '#9CA3AF',
                fontWeight: 500,
                mr: 0.5
              }}
            >
              Total:
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#111827',
                fontWeight: 700
              }}
            >
              {totalCount}
            </Typography>
          </Box>

          {role === 'admin' && (
            <Button
              variant="contained"
              size="small"
              onClick={handleOpenUpload}
              startIcon={<CloudUploadIcon sx={{ fontSize: 16 }} />}
              sx={{
                textTransform: 'none',
                fontSize: 12,
                borderRadius: 999,
                bgcolor: '#F9FAFB',
                color: '#111827',
                px: 1.5,
                '&:hover': { bgcolor: '#E5E7EB' }
              }}
            >
              Upload
            </Button>
          )}

          {/* Filters */}
          <Button
            variant="outlined"
            size="small"
            startIcon={<FilterListIcon sx={{ fontSize: 16 }} />}
            onClick={handleOpenFilterPopover}
            sx={{
              textTransform: 'none',
              fontSize: 12,
              borderRadius: 999,
              borderColor: 'rgba(229,231,235,.7)',
              color: '#F3F4F6',
              background: '#38BDF8',
              px: 1.6,
              '&:hover': {
                borderColor: '#FFFFFF',
                background: '#38BDF8'
              }
            }}
          >
            Filters
          </Button>

          {/* Export */}
          <Button
            variant="outlined"
            size="small"
            startIcon={<FileDownloadIcon sx={{ fontSize: 16 }} />}
            onClick={exportCurrentCSV}
            sx={{
              textTransform: 'none',
              fontSize: 12,
              borderRadius: 999,
              background: '#38BDF8',
              borderColor: 'rgba(229,231,235,.7)',
              color: '#F3F4F6',
              px: 1.6,
              '&:hover': {
                borderColor: '#FFFFFF',
                background: '#38BDF8'
              }
            }}
          >
            Export
          </Button>

          {/* Add */}
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon sx={{ fontSize: 16 }} />}
            onClick={() => setOpenFormModal(true)}
            sx={{
              textTransform: 'none',
              fontSize: 12,
              borderRadius: 999,
              bgcolor: '#22C55E',
              px: 1.9,
              '&:hover': { bgcolor: '#16A34A' }
            }}
          >
            Add Banker
          </Button>
        </Stack>
      </Paper>

      {/* Filter Popover - DataGrid style */}
      <Popover
        open={filterPopoverOpen}
        anchorEl={filterAnchorEl}
        onClose={handleCloseFilterPopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            borderRadius: 4,
            p: 3,
            minWidth: 580,
            maxWidth: 600,
            background: 'linear-gradient(145deg, #ffffff 0%, #fafbff 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1.5px solid rgba(226,232,240,0.8)',
            boxShadow: '0 20px 60px rgba(15,23,42,0.15), 0 0 0 1px rgba(255,255,255,0.5) inset'
          }
        }}
      >
        {/* Header */}
        <Box
          mb={2.5}
          display="flex"
          alignItems="baseline"
          justifyContent="space-between"
        >
          <Box>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '0.95rem',
                color: '#0F172A'
              }}
            >
              Advanced Filters
            </Typography>
            <Typography
              sx={{
                mt: 0.4,
                fontSize: '0.8rem',
                color: '#64748B'
              }}
            >
              {totalCount > 0
                ? `${totalCount} banker${totalCount === 1 ? '' : 's'} match current filters`
                : 'No bankers match current filters'}
            </Typography>
          </Box>

          {/* Right side chhota chip / badge */}
          <Chip
            label={`${totalCount} result${totalCount === 1 ? '' : 's'}`}
            size="small"
            sx={{
              bgcolor: '#EEF2FF',
              color: '#4F46E5',
              fontWeight: 700,
              fontSize: '0.75rem',
              borderRadius: 2
            }}
          />
        </Box>

        {/* Filter Row */}
        <Box
          display="grid"
          gridTemplateColumns="1.5fr 2.5fr"
          columnGap={2}
          alignItems="start"
          mb={3}
        >
          {/* Column Selector */}
          <TextField
            select
            size="small"
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value as ActiveFilter)}
            variant="outlined"
            label="Filter By"
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor: '#F8FAFC',
                border: '1.5px solid #E2E8F0',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: '#CBD5E1',
                  bgcolor: '#FFFFFF'
                },
                '&.Mui-focused': {
                  borderColor: '#6366F1',
                  bgcolor: '#FFFFFF',
                  boxShadow: '0 0 0 3px rgba(99,102,241,0.1)'
                },
                '& fieldset': {
                  border: 'none'
                }
              },
              '& .MuiInputLabel-root': {
                color: '#64748B',
                fontWeight: 600,
                fontSize: '0.85rem',
                '&.Mui-focused': {
                  color: '#6366F1'
                }
              }
            }}
          >
            <MenuItem value="stateCity" sx={{ fontWeight: 600 }}>State & City</MenuItem>
            <MenuItem value="associated" sx={{ fontWeight: 600 }}>Associated With</MenuItem>
            <MenuItem value="emailOfficial" sx={{ fontWeight: 600 }}>Official Email</MenuItem>
            <MenuItem value="banker" sx={{ fontWeight: 600 }}>Banker Name</MenuItem>
          </TextField>

          {/* Dynamic Value Section */}
          <Box>
            {activeFilter === 'stateCity' ? (
              <Stack direction="row" spacing={1.5}>
                <Autocomplete
                  size="small"
                  options={stateOptions}
                  value={selectedState}
                  onChange={(_, v) => {
                    const next = v || '';
                    setSelectedState(next);
                    setSelectedCity('');
                  }}
                  sx={{ minWidth: 155, flex: 1 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select State"
                      variant="outlined"
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          bgcolor: '#F8FAFC',
                          border: '1.5px solid #E2E8F0',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            borderColor: '#CBD5E1',
                            bgcolor: '#FFFFFF'
                          },
                          '&.Mui-focused': {
                            borderColor: '#6366F1',
                            bgcolor: '#FFFFFF',
                            boxShadow: '0 0 0 3px rgba(99,102,241,0.1)'
                          },
                          '& fieldset': {
                            border: 'none'
                          }
                        },
                        '& input': {
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          color: '#0F172A'
                        }
                      }}
                    />
                  )}
                />
                <Autocomplete
                  size="small"
                  options={getCityOptions()}
                  value={selectedCity}
                  onChange={(_, v) => setSelectedCity(v || '')}
                  disabled={!selectedState}
                  sx={{ minWidth: 155, flex: 1 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select City"
                      variant="outlined"
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          bgcolor: selectedState ? '#F8FAFC' : '#F1F5F9',
                          border: '1.5px solid #E2E8F0',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            borderColor: selectedState ? '#CBD5E1' : '#E2E8F0',
                            bgcolor: selectedState ? '#FFFFFF' : '#F1F5F9'
                          },
                          '&.Mui-focused': {
                            borderColor: '#6366F1',
                            bgcolor: '#FFFFFF',
                            boxShadow: '0 0 0 3px rgba(99,102,241,0.1)'
                          },
                          '& fieldset': {
                            border: 'none'
                          }
                        },
                        '& input': {
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          color: '#0F172A'
                        }
                      }}
                    />
                  )}
                />
              </Stack>
            ) : activeFilter === 'associated' ? (
              <TextField
                variant="outlined"
                fullWidth
                placeholder="Enter associated organization..."
                value={searchAssociatedWith}
                onChange={(e) => setSearchAssociatedWith(e.target.value)}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    bgcolor: '#F8FAFC',
                    border: '1.5px solid #E2E8F0',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: '#CBD5E1',
                      bgcolor: '#FFFFFF'
                    },
                    '&.Mui-focused': {
                      borderColor: '#6366F1',
                      bgcolor: '#FFFFFF',
                      boxShadow: '0 0 0 3px rgba(99,102,241,0.1)'
                    },
                    '& fieldset': {
                      border: 'none'
                    }
                  },
                  '& input': {
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: '#0F172A'
                  }
                }}
              />
            ) : activeFilter === 'emailOfficial' ? (
              <TextField
                variant="outlined"
                fullWidth
                placeholder="Enter official email..."
                value={searchEmailOfficial}
                onChange={(e) => setSearchEmailOfficial(e.target.value)}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    bgcolor: '#F8FAFC',
                    border: '1.5px solid #E2E8F0',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: '#CBD5E1',
                      bgcolor: '#FFFFFF'
                    },
                    '&.Mui-focused': {
                      borderColor: '#6366F1',
                      bgcolor: '#FFFFFF',
                      boxShadow: '0 0 0 3px rgba(99,102,241,0.1)'
                    },
                    '& fieldset': {
                      border: 'none'
                    }
                  },
                  '& input': {
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: '#0F172A'
                  }
                }}
              />
            ) : (
              <TextField
                variant="outlined"
                fullWidth
                placeholder="Enter banker name..."
                value={searchBanker}
                onChange={(e) => setSearchBanker(e.target.value)}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    bgcolor: '#F8FAFC',
                    border: '1.5px solid #E2E8F0',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: '#CBD5E1',
                      bgcolor: '#FFFFFF'
                    },
                    '&.Mui-focused': {
                      borderColor: '#6366F1',
                      bgcolor: '#FFFFFF',
                      boxShadow: '0 0 0 3px rgba(99,102,241,0.1)'
                    },
                    '& fieldset': {
                      border: 'none'
                    }
                  },
                  '& input': {
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: '#0F172A'
                  }
                }}
              />
            )}
          </Box>
        </Box>

        {/* Active Filters Section */}
        <Box
          sx={{
            bgcolor: '#F8FAFC',
            borderRadius: 3,
            p: 2,
            border: '1.5px solid #E2E8F0',
            mb: 2.5
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: '#64748B',
              fontWeight: 700,
              fontSize: '0.7rem',
              letterSpacing: 0.8,
              textTransform: 'uppercase',
              display: 'block',
              mb: 1.5
            }}
          >
            Active Filters
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
            {[
              {
                key: 'State',
                val: selectedState,
                clear: () => handleClearSearch('state'),
                color: '#1E40AF',
                bg: '#EFF6FF'
              },
              {
                key: 'City',
                val: selectedCity,
                clear: () => handleClearSearch('city'),
                color: '#065F46',
                bg: '#ECFDF5'
              },
              {
                key: 'Associated',
                val: searchAssociatedWith,
                clear: () => handleClearSearch('associated'),
                color: '#7C3AED',
                bg: '#F3E8FF'
              },
              {
                key: 'Official Email',
                val: searchEmailOfficial,
                clear: () => handleClearSearch('emailOfficial'),
                color: '#C026D3',
                bg: '#FDF4FF'
              },
              {
                key: 'Banker',
                val: searchBanker,
                clear: () => handleClearSearch('banker'),
                color: '#DC2626',
                bg: '#FEF2F2'
              }
            ]
              .filter((f) => f.val)
              .map((f) => (
                <Chip
                  key={f.key}
                  label={`${f.key}: ${f.val}`}
                  onDelete={f.clear}
                  size="small"
                  sx={{
                    bgcolor: f.bg,
                    color: f.color,
                    border: `1.5px solid ${f.color}33`,
                    borderRadius: 2.5,
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    height: 32,
                    transition: 'all 0.2s ease',
                    '& .MuiChip-deleteIcon': {
                      color: f.color,
                      fontSize: 16,
                      '&:hover': {
                        color: f.color,
                        opacity: 0.7
                      }
                    },
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: `0 4px 12px ${f.color}33`
                    }
                  }}
                />
              ))}
            {![selectedState, selectedCity, searchAssociatedWith, searchEmailOfficial, searchBanker].some(Boolean) && (
              <Typography
                variant="body2"
                sx={{
                  color: '#94A3B8',
                  fontSize: '0.85rem',
                  fontStyle: 'italic'
                }}
              >
                No active filters
              </Typography>
            )}
          </Stack>
        </Box>

        {/* Action Buttons */}
        <Box display="flex" justifyContent="space-between" alignItems="center" gap={1.5}>
          {[selectedState, selectedCity, searchAssociatedWith, searchEmailOfficial, searchBanker].some(Boolean) && (
            <Button
              size="small"
              startIcon={<ClearAllIcon sx={{ fontSize: 16 }} />}
              onClick={handleClearAll}
              sx={{
                textTransform: 'none',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#64748B',
                borderRadius: 2.5,
                px: 2,
                py: 1,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: '#F1F5F9',
                  color: '#475569'
                }
              }}
            >
              Clear All
            </Button>
          )}
          <Box flex={1} />
          <Button
            size="small"
            variant="contained"
            onClick={handleCloseFilterPopover}
            sx={{
              textTransform: 'none',
              fontSize: '0.85rem',
              fontWeight: 700,
              borderRadius: 3,
              px: 3,
              py: 1.2,
              background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
              boxShadow: '0 4px 16px rgba(79,70,229,0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #4338CA 0%, #6D28D9 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(79,70,229,0.4)'
              }
            }}
          >
            Apply Filters
          </Button>
        </Box>
      </Popover>

      {/* Content */}
      <Grid container spacing={2}>
        {/* GRID VIEW */}
        {viewMode === 'grid' && (
          <>
            {gridItems.map((banker) => (
              <Grid item xs={12} sm={12} md={6} lg={6} key={banker._id}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.4,
                    pt: 3.2,
                    borderRadius: 4,
                    height: '100%',
                    background: 'linear-gradient(145deg, #ffffff 0%, #fafbff 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    border: '1px solid #E2E8F0',
                    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                    overflow: 'hidden',
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 18px 40px rgba(79,70,229,0.12)',
                      borderColor: '#C7D2FE',
                      '& .action-buttons': {
                        opacity: 1,
                        transform: 'translateY(0)'
                      }
                    }
                  }}
                >
                  {/* Decorative gradient top */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 5,
                      background:
                        'linear-gradient(90deg, #4F46E5 0%, #EC4899 50%, #06B6D4 100%)',
                      borderTopLeftRadius: 16,
                      borderTopRightRadius: 16
                    }}
                  />

                  {/* Header */}
                  <Box
                    display="flex"
                    alignItems="center"
                    mb={2}
                    sx={{ mt: -0.5 }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: 'transparent',
                        background:
                          'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #06B6D4 100%)',
                        color: '#fff',
                        mr: 2,
                        width: 48,
                        height: 48,
                        fontSize: 20,
                        fontWeight: 800,
                        boxShadow: '0 10px 28px rgba(99,102,241,0.22)',
                        border: '2px solid rgba(255,255,255,0.4)'
                      }}
                    >
                      {banker.bankerName?.charAt(0)?.toUpperCase() || 'B'}
                    </Avatar>
                    <Box flex={1}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: '#0F172A',
                          fontWeight: 800,
                          fontSize: '1.05rem',
                          mb: 0.2,
                          lineHeight: 1.25
                        }}
                      >
                        {banker.bankerName}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: '#64748B',
                          fontWeight: 600,
                          fontSize: '0.8rem'
                        }}
                      >
                        {banker.associatedWith}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 2, borderColor: '#E2E8F0', opacity: 0.6 }} />

                  <Box mb={1}>
                    <Stack direction="row" spacing={3} alignItems="center">
                      {/* CITY */}
                      {banker.city && (
                        <Stack spacing={0.6}>
                          <Typography
                            sx={{
                              color: '#64748B',
                              fontWeight: 800,
                              fontSize: 10,
                              letterSpacing: 1,
                              mb: 0.2
                            }}
                          >
                            Location
                          </Typography>

                          <Chip
                            label={banker.city}
                            size="small"
                            sx={{
                              height: 24,
                              borderRadius: '10px',
                              '& .MuiChip-label': {
                                px: 1.2,
                                fontSize: 12,
                                fontWeight: 600
                              },
                              color: '#047857',
                              border: '1px solid #A7F3D0',
                              bgcolor: '#ECFDF5'
                            }}
                          />
                        </Stack>
                      )}
                    </Stack>
                  </Box>

                  {/* Products */}
                  <Box mb={1.6}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: '#64748B',
                        fontWeight: 800,
                        fontSize: 10,
                        letterSpacing: 1,
                        mb: 0.7
                      }}
                    >
                      PRODUCTS OFFERED
                    </Typography>
                    <Tooltip
                      title={(banker.product || []).join(', ') || '-'}
                      arrow
                      placement="top"
                    >
                      <Box>
                        <ProductChipGroup items={banker.product || []} max={5} />
                      </Box>
                    </Tooltip>
                  </Box>

                  {/* Contact box */}
                  <Box mb={1}>
                    <Box
                      sx={{
                        p: 1.7,
                        borderRadius: 2.5,
                        border: '1.3px solid #E0E7FF',
                        bgcolor: '#FAFBFF',
                        boxShadow: '0 2px 6px rgba(99,102,241,0.03)'
                      }}
                    >
                      {/* Official Email */}
                      <Box mb={1.2}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#64748B',
                            fontWeight: 800,
                            fontSize: 9,
                            letterSpacing: 0.8,
                            display: 'block',
                            mb: 0.4
                          }}
                        >
                          OFFICIAL EMAIL
                        </Typography>
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="space_between"
                          gap={1}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#0F172A',
                              fontWeight: 600,
                              fontSize: '0.82rem',
                              wordBreak: 'break-all',
                              flex: 1
                            }}
                          >
                            {banker.emailOfficial || '-'}
                          </Typography>
                          <IconButton
                            aria-label="copy-official"
                            size="small"
                            onClick={() => handleCopy(banker.emailOfficial)}
                            sx={{
                              bgcolor: '#FFFFFF',
                              border: '1.3px solid #C7D2FE',
                              color: '#6366F1',
                              width: 30,
                              height: 30,
                              borderRadius: 2,
                              '&:hover': {
                                bgcolor: '#6366F1',
                                color: '#FFFFFF',
                                transform: 'scale(1.05)'
                              }
                            }}
                          >
                            <ContentCopyIcon sx={{ fontSize: 14 }} />
                          </IconButton>
                        </Box>
                      </Box>

                      {/* Personal Email */}
                      {banker.emailPersonal && (
                        <Box mb={1.2}>
                          <Typography
                            variant="caption"
                            sx={{
                              color: '#64748B',
                              fontWeight: 800,
                              fontSize: 9,
                              letterSpacing: 0.8,
                              display: 'block',
                              mb: 0.4
                            }}
                          >
                            PERSONAL EMAIL
                          </Typography>
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            gap={1}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                color: '#0F172A',
                                fontWeight: 600,
                                fontSize: '0.82rem',
                                wordBreak: 'break-all',
                                flex: 1
                              }}
                            >
                              {banker.emailPersonal}
                            </Typography>
                            <IconButton
                              aria-label="copy-personal"
                              size="small"
                              onClick={() =>
                                handleCopy(banker.emailPersonal as string)
                              }
                              sx={{
                                bgcolor: '#FFFFFF',
                                border: '1.3px solid #DDD6FE',
                                color: '#8B5CF6',
                                width: 30,
                                height: 30,
                                borderRadius: 2,
                                '&:hover': {
                                  bgcolor: '#8B5CF6',
                                  color: '#FFFFFF',
                                  transform: 'scale(1.05)'
                                }
                              }}
                            >
                              <ContentCopyIcon sx={{ fontSize: 14 }} />
                            </IconButton>
                          </Box>
                        </Box>
                      )}

                      {/* Contact Number */}
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#64748B',
                            fontWeight: 800,
                            fontSize: 9,
                            letterSpacing: 0.8,
                            display: 'block',
                            mb: 0.4
                          }}
                        >
                          CONTACT NUMBER
                        </Typography>
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                          gap={1}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#0F172A',
                              fontWeight: 700,
                              fontSize: '0.86rem',
                              fontFamily: 'monospace'
                            }}
                          >
                            {banker.contact || '-'}
                          </Typography>
                          <IconButton
                            aria-label="copy-contact"
                            size="small"
                            onClick={() => handleCopy(banker.contact)}
                            sx={{
                              bgcolor: '#FFFFFF',
                              border: '1.3px solid #A7F3D0',
                              color: '#10B981',
                              width: 30,
                              height: 30,
                              borderRadius: 2,
                              '&:hover': {
                                bgcolor: '#10B981',
                                color: '#FFFFFF',
                                transform: 'scale(1.05)'
                              }
                            }}
                          >
                            <ContentCopyIcon sx={{ fontSize: 14 }} />
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  {/* Action Buttons */}
                  {isAdmin && (
                    <Box
                      className="action-buttons"
                      display="flex"
                      justifyContent="flex-end"
                      gap={1}
                      mt={2}
                      sx={{
                        opacity: 0.7,
                        transform: 'translateY(4px)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <Tooltip title="Edit Banker" arrow>
                        <IconButton
                          onClick={() => handleEdit(banker)}
                          size="small"
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 3,
                            background:
                              'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
                            color: '#fff',
                            boxShadow: '0 8px 18px rgba(79,70,229,0.25)',
                            '&:hover': {
                              transform: 'scale(1.06)',
                              boxShadow: '0 12px 26px rgba(79,70,229,0.35)'
                            }
                          }}
                        >
                          <EditOutlinedIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete Banker" arrow>
                        <IconButton
                          onClick={() => handleDelete(banker._id)}
                          size="small"
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 3,
                            border: '2px solid #FCA5A5',
                            color: '#EF4444',
                            bgcolor: '#FEF2F2',
                            '&:hover': {
                              bgcolor: '#EF4444',
                              color: '#FFFFFF',
                              transform: 'scale(1.06)',
                              borderColor: '#EF4444'
                            }
                          }}
                        >
                          <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                </Paper>
              </Grid>
            ))}

            {filteredBankers.length === 0 && (
              <Grid item xs={12}>
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 6,
                    px: 3,
                    bgcolor: '#FAFBFF',
                    borderRadius: 4,
                    border: '2px dashed #E0E7FF'
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ color: '#64748B', fontWeight: 600, mb: 1 }}
                  >
                    No bankers found
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                    No bankers match your search criteria.
                  </Typography>
                </Box>
              </Grid>
            )}
          </>
        )}

        {/* TABLE VIEW */}
        {viewMode === 'table' && (
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                overflow: 'hidden',
                border: '1px solid #e5e7eb',
                bgcolor: '#fff'
              }}
            >
              <TableContainer sx={{ maxHeight: 620 }}>
                <Table
                  size="small"
                  stickyHeader
                  aria-label="bankers table"
                  sx={{
                    '& th': {
                      bgcolor: '#2563EB',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      fontSize: 13,
                      height: 60,
                      py: 2
                    },
                    '& td': {
                      borderBottom: '1px solid #f1f5f9',
                      fontSize: 13,
                      color: '#374151'
                    }
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>Banker</TableCell>
                      <TableCell>Associated</TableCell>
                      <TableCell sx={{ minWidth: 120 }}>State</TableCell>
                      <TableCell sx={{ minWidth: 120 }}>City</TableCell>
                      <TableCell sx={{ minWidth: 260 }}>Products</TableCell>
                      <TableCell sx={{ minWidth: 220 }}>
                        Official Email
                      </TableCell>
                      <TableCell sx={{ minWidth: 180 }}>
                        Personal Email
                      </TableCell>
                      <TableCell sx={{ minWidth: 160 }}>Contact</TableCell>
                      {isAdmin && (
                        <TableCell sx={{ minWidth: 120 }}>Actions</TableCell>
                      )}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {filteredBankers.map((b) => (
                      <TableRow
                        key={b._id}
                        hover
                        sx={{
                          transition:
                            'background 0.15s ease, transform 0.15s ease',
                          '&:hover': { background: '#F8FAFC' }
                        }}
                      >
                        {/* Banker */}
                        <TableCell sx={{ py: 2.1 }}>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            maxWidth={280}
                          >
                            <Avatar
                              sx={{
                                bgcolor: '#2563EB',
                                width: 28,
                                height: 28
                              }}
                            >
                              {b.bankerName?.charAt(0)?.toUpperCase() || 'B'}
                            </Avatar>
                            <Box sx={{ minWidth: 0 }}>
                              <Tooltip title={b.bankerName || '-'} arrow>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 700,
                                    color: '#111827',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                  }}
                                >
                                  {b.bankerName}
                                </Typography>
                              </Tooltip>
                              <Tooltip
                                title={b.associatedWith || '-'}
                                arrow
                              >
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: '#6B7280',
                                    display: 'block',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                  }}
                                >
                                  {b.associatedWith || '-'}
                                </Typography>
                              </Tooltip>
                            </Box>
                          </Stack>
                        </TableCell>

                        {/* Associated */}
                        <TableCell sx={{ py: 1.1, maxWidth: 220 }}>
                          <Tooltip
                            title={b.associatedWith || '-'}
                            arrow
                          >
                            <span
                              style={{
                                display: 'inline-block',
                                maxWidth: 220,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}
                            >
                              {b.associatedWith || '-'}
                            </span>
                          </Tooltip>
                        </TableCell>

                        {/* State */}
                        <TableCell sx={{ py: 1.1 }}>
                          {b.state ? (
                            <Chip
                              label={b.state}
                              size="small"
                              variant="outlined"
                              sx={{
                                height: 22,
                                '& .MuiChip-label': { px: 1, fontSize: 11 },
                                color: '#2563EB',
                                borderColor: '#C7D2FE',
                                bgcolor: '#EEF2FF'
                              }}
                            />
                          ) : (
                            '-'
                          )}
                        </TableCell>

                        {/* City */}
                        <TableCell sx={{ py: 1.1 }}>
                          {b.city ? (
                            <Chip
                              label={b.city}
                              size="small"
                              variant="outlined"
                              sx={{
                                height: 22,
                                '& .MuiChip-label': { px: 1, fontSize: 11 },
                                color: '#047857',
                                borderColor: '#A7F3D0',
                                bgcolor: '#ECFDF5'
                              }}
                            />
                          ) : (
                            '-'
                          )}
                        </TableCell>

                        {/* Products */}
                        <TableCell sx={{ py: 1.1 }}>
                          <Tooltip
                            title={(b.product || []).join(', ') || '-'}
                            arrow
                          >
                            <span>
                              <Stack
                                direction="row"
                                spacing={0.5}
                                flexWrap="wrap"
                              >
                                {(b.product || [])
                                  .slice(0, 4)
                                  .map((p, i) => (
                                    <Chip
                                      key={i}
                                      label={p}
                                      size="small"
                                      variant="outlined"
                                      sx={{
                                        height: 22,
                                        '& .MuiChip-label': {
                                          px: 1,
                                          fontSize: 11
                                        },
                                        color: '#065F46',
                                        borderColor: '#A7F3D0',
                                        bgcolor: '#ECFDF5'
                                      }}
                                    />
                                  ))}
                                {(b.product?.length || 0) > 4 && (
                                  <Chip
                                    size="small"
                                    label={`+${(b.product!.length - 4)}`}
                                    variant="outlined"
                                    sx={{
                                      height: 22,
                                      '& .MuiChip-label': {
                                        px: 1,
                                        fontSize: 11
                                      }
                                    }}
                                  />
                                )}
                              </Stack>
                            </span>
                          </Tooltip>
                        </TableCell>

                        {/* Official Email */}
                        <TableCell
                          sx={{ py: 1.1, wordBreak: 'break-all' }}
                        >
                          {b.emailOfficial ? (
                            <a
                              href={`mailto:${b.emailOfficial}`}
                              style={{
                                color: '#2563EB',
                                textDecoration: 'none'
                              }}
                            >
                              {b.emailOfficial}
                            </a>
                          ) : (
                            '-'
                          )}
                        </TableCell>

                        {/* Personal Email */}
                        <TableCell
                          sx={{ py: 1.1, wordBreak: 'break-all' }}
                        >
                          {b.emailPersonal ? (
                            <a
                              href={`mailto:${b.emailPersonal}`}
                              style={{
                                color: '#2563EB',
                                textDecoration: 'none'
                              }}
                            >
                              {b.emailPersonal}
                            </a>
                          ) : (
                            '-'
                          )}
                        </TableCell>

                        {/* Contact */}
                        <TableCell sx={{ py: 1.1 }}>
                          {b.contact ? (
                            <a
                              href={`tel:${b.contact}`}
                              style={{
                                color: '#2563EB',
                                textDecoration: 'none'
                              }}
                            >
                              {b.contact}
                            </a>
                          ) : (
                            '-'
                          )}
                        </TableCell>

                        {/* Actions */}
                        {isAdmin && (
                          <TableCell sx={{ py: 1.1 }}>
                            <Box
                              className="action-buttons"
                              display="flex"
                              justifyContent="flex-end"
                              gap={1}
                              sx={{
                                opacity: 0.9,
                                transition: 'all 0.3s ease'
                              }}
                            >
                              <Tooltip title="Edit Banker" arrow>
                                <IconButton
                                  onClick={() => handleEdit(b)}
                                  size="small"
                                  sx={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 2,
                                    background:
                                      'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
                                    color: '#fff',
                                    boxShadow: '0 4px 12px rgba(79,70,229,0.25)',
                                    '&:hover': {
                                      transform: 'scale(1.06)',
                                      boxShadow: '0 8px 18px rgba(79,70,229,0.35)'
                                    }
                                  }}
                                >
                                  <EditOutlinedIcon sx={{ fontSize: 18 }} />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Delete Banker" arrow>
                                <IconButton
                                  onClick={() => handleDelete(b._id)}
                                  size="small"
                                  sx={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 2,
                                    border: '2px solid #FCA5A5',
                                    color: '#EF4444',
                                    bgcolor: '#FEF2F2',
                                    '&:hover': {
                                      bgcolor: '#EF4444',
                                      color: '#FFFFFF',
                                      transform: 'scale(1.06)',
                                      borderColor: '#EF4444'
                                    }
                                  }}
                                >
                                  <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}

                    {filteredBankers.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={isAdmin ? 9 : 8}
                          align="center"
                          sx={{
                            py: 6,
                            color: 'text.secondary'
                          }}
                        >
                          No bankers match your search criteria.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        )}

        {/* Footer Pagination */}
        {totalCount > 0 && (
          <Grid
            item
            xs={12}
            mt={2}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Pagination
              count={Math.ceil(totalCount / limit)}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              sx={{
                '& .MuiPaginationItem-root': { color: COLORS.primary },
                '& .Mui-selected': {
                  backgroundColor: COLORS.primary,
                  color: '#fff',
                  '&:hover': { backgroundColor: COLORS.primaryDark }
                }
              }}
            />

            <TextField
              select
              label="Rows per page"
              value={limit}
              onChange={(e) => {
                const val = parseInt(e.target.value as string, 10);
                setLimit(val);
                setPage(1);
              }}
              size="small"
              sx={{
                width: 150,
                backgroundColor: '#f9fafb',
                borderRadius: 1,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f9fafb',
                  '& fieldset': { borderColor: '#cbd5e1' },
                  '&:hover fieldset': { borderColor: '#94a3b8' },
                  '&.Mui-focused fieldset': { borderColor: COLORS.primary }
                },
                '& .MuiInputLabel-root': {
                  color: COLORS.text,
                  fontWeight: 500
                },
                '& .Mui-focused .MuiInputLabel-root': {
                  color: COLORS.primary
                }
              }}
            >
              {[6, 9, 12, 15, 20].map((val) => (
                <MenuItem key={val} value={val}>
                  {val}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        )}

        {/* Modals */}
        <Dialog
          open={openFormModal}
          onClose={() => setOpenFormModal(false)}
          maxWidth="md"
          fullWidth
          scroll="body"
          PaperProps={{
            sx: { borderRadius: 3, background: '#FFF' }
          }}
        >
          <DialogTitle
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontWeight: 700,
              color: COLORS.primary
            }}
          >
            Add Banker
            <IconButton onClick={() => setOpenFormModal(false)}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <DirectoryForm
              onSuccess={() => {
                setOpenFormModal(false);
                setPage(1);
                  setRefreshKey(x => x + 1);

              }}
            />
          </DialogContent>
        </Dialog>

        <Dialog
          open={openUploadModal}
          onClose={() => setOpenUploadModal(false)}
          maxWidth="sm"
          fullWidth
          scroll="body"
          PaperProps={{
            sx: { borderRadius: 3, background: '#fff' }
          }}
        >
          <DialogTitle
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontWeight: 700,
              color: COLORS.primary
            }}
          >
            Upload Excel – Banker Directory
            <IconButton onClick={() => setOpenUploadModal(false)}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2}>
              <Typography variant="body2" color="text.secondary">
                Accepted: <strong>.xlsx, .xls, .csv</strong>
              </Typography>

              <Box display="flex" gap={1}>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                >
                  Choose File
                  <input
                    hidden
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileChange}
                  />
                </Button>
                <Button
                  variant="text"
                  startIcon={<FileDownloadIcon />}
                  onClick={downloadCsvTemplate}
                >
                  CSV Template
                </Button>
              </Box>

              {selectedFile && (
                <Typography variant="body2">
                  Selected: <strong>{selectedFile.name}</strong>
                </Typography>
              )}

              {uploading && (
                <Box>
                  <LinearProgress
                    variant="determinate"
                    value={uploadProgress}
                  />
                  <Typography
                    mt={0.5}
                    variant="caption"
                    color="text.secondary"
                  >
                    Uploading… {uploadProgress}%
                  </Typography>
                </Box>
              )}

              {uploadError && (
                <Typography variant="body2" color="error">
                  {uploadError}
                </Typography>
              )}

              <Divider />

              <Stack spacing={0.5}>
                <Typography variant="subtitle2">
                  Expected headers (row 1):
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontFamily: 'monospace' }}
                >
                  bankerName, associatedWith, state, city, emailOfficial,
                  emailPersonal, contact, product
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  • <strong>product</strong> can be comma-separated list.
                </Typography>
              </Stack>

              <Box
                display="flex"
                justifyContent="flex-end"
                gap={1}
                mt={1}
              >
                <Button
                  variant="outlined"
                  onClick={() => setOpenUploadModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleUpload}
                  disabled={!selectedFile || uploading}
                >
                  {uploading ? 'Uploading…' : 'Upload & Import'}
                </Button>
              </Box>
            </Stack>
          </DialogContent>
        </Dialog>

        <BankerEditDialog
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          banker={editBanker}
          setBanker={(data) => setEditBanker(data)}
          onSave={handleSaveChanges}
          loading={loading}
        />
      </Grid>

      {/* Custom Snackbar */}
      <CustomSnackbar
        open={snack.open}
        message={snack.msg}
        severity={snack.severity}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
      />
    </Box>
  );
};

const LendersTasks = () => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const getUserRole = (): string | null => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return null;

        const decoded: any = jwtDecode(token);

        console.log('🔐 Full decoded token =>', decoded);
        console.log('🎭 Role from token =>', decoded.role);

        return decoded.role ?? null;
      } catch (err) {
        console.error('❌ JWT Decode Failed:', err);
        return null;
      }
    };

    const r = getUserRole();
    console.log('🧾 Setting role state to =>', r);
    setRole(r);
  }, []);

  return (
    <>
      <Container
        maxWidth="lg"
        sx={{
          backgroundColor: COLORS.canvas,
          minHeight: '100vh',
          py: 3
        }}
      >
        <Grid container>
          <Grid item xs={12}>
            <BankerOverview role={role} />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

// @ts-ignore
LendersTasks.getLayout = (page: React.ReactElement) => (
  <SidebarLayout>{page}</SidebarLayout>
);
export default LendersTasks;
