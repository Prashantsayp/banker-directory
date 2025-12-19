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
  Snackbar,
  Alert,
  Autocomplete
} from '@mui/material';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import SearchTextField from '../../../pages/components/searchTextFied';
import useDebounce from 'hooks/useDebounce';
import BankerEditDialog from '../../../pages/components/BankerEditDailog';
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
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined';

interface Banker {
  _id: string;
  bankerName: string;
  associatedWith: string;
  locationCategories: string[];
  emailOfficial: string;
  emailPersonal?: string;
  contact: string;
  product: string[];
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
  rowAlt: '#FAFBFF',
  chipBlueBg: '#EEF2FF',
  chipBlueBorder: '#C7D2FE',
  chipGreenBg: '#ECFDF5',
  chipGreenBorder: '#A7F3D0'
};

const STORAGE_KEYS = {
  view: 'bankerDir:view'
};

const FILTER_MIN_WIDTH = 220;
const FILTER_HEIGHT = 40; // uniform height for all filter fields

const filterFieldSx = {
  minWidth: FILTER_MIN_WIDTH,
  '& .MuiInputBase-root': {
    height: FILTER_HEIGHT,
    borderRadius: 1.2
  },
  '& .MuiOutlinedInput-input': {
    py: 0.5,
    fontSize: 14
  },
  '& .MuiInputLabel-root': {
    fontSize: 14
  }
} as const;

const copyToClipboard = async (text: string) => {
  try {
    if (!text) return false;
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

/* ---------- India States & Cities ---------- */
const INDIA_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh',
  'Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland',
  'Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Andaman and Nicobar Islands','Chandigarh','Dadra and Nagar Haveli and Daman and Diu','Delhi','Jammu and Kashmir',
  'Ladakh','Lakshadweep','Puducherry'
];

const CITIES_BY_STATE: Record<string, string[]> = {
  'Uttar Pradesh': ['Lucknow','Kanpur','Ghaziabad','Agra','Varanasi','Meerut','Prayagraj','Noida','Aligarh','Bareilly'],
  'Maharashtra': ['Mumbai','Pune','Nagpur','Nashik','Thane','Aurangabad','Solapur','Amravati'],
  'Delhi': ['New Delhi','Dwarka','Rohini','Karol Bagh','Saket','Connaught Place'],
  'Karnataka': ['Bengaluru','Mysuru','Mangaluru','Hubballi','Belagavi'],
  'Gujarat': ['Ahmedabad','Surat','Vadodara','Rajkot','Bhavnagar'],
  'Rajasthan': ['Jaipur','Jodhpur','Kota','Udaipur','Ajmer'],
  'Tamil Nadu': ['Chennai','Coimbatore','Madurai','Tiruchirappalli','Salem'],
  'Telangana': ['Hyderabad','Warangal','Nizamabad','Karimnagar'],
  'West Bengal': ['Kolkata','Howrah','Durgapur','Siliguri','Asansol'],
  'Madhya Pradesh': ['Bhopal','Indore','Gwalior','Jabalpur','Ujjain'],
  // add more as needed…
};

const BankerOverview = ({ role }: { role: string | null }) => {
  const [filteredBankers, setFilteredBankers] = useState<Banker[]>([]);
  const [searchLocation, setSearchLocation] = useState('');
  const [searchBanker, setSearchBanker] = useState('');
  const [searchAssociatedWith, setSearchAssociatedWith] = useState('');
  const [searchEmailOfficial, setSearchEmailOfficial] = useState('');

  // NEW: State/City controlled filters
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editBanker, setEditBanker] = useState<Banker | null>(null);

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [totalCount, setTotalCount] = useState(0);

  const [openFormModal, setOpenFormModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [snack, setSnack] = useState<{ open: boolean; msg: string; severity: 'success' | 'info' | 'error' }>({
    open: false,
    msg: '',
    severity: 'success'
  });

  const debouncedLocation = useDebounce(searchLocation, 500);
  const debouncedBanker = useDebounce(searchBanker, 500);
  const debouncedAssociated = useDebounce(searchAssociatedWith, 500);
  const debouncedEmail = useDebounce(searchEmailOfficial, 500);

  /* ---------- Prefs Hydrate ---------- */
  useEffect(() => {
    const storedView = (localStorage.getItem(STORAGE_KEYS.view) || 'grid') as 'grid' | 'table';
    setViewMode(storedView);
  }, []);

  /* ---------- Tie State/City -> searchLocation ---------- */
  useEffect(() => {
    if (selectedCity) {
      setSearchLocation(`${selectedCity}, ${selectedState}`.trim());
    } else if (selectedState) {
      setSearchLocation(selectedState);
    } else {
      // if user cleared both state & city but typed something manually, don't override
      // here we only reset if the searchLocation matches previous state/city pattern
      // Keep simple: clear if we were driving it via state/city
      setSearchLocation((prev) => (prev.includes(', ') || INDIA_STATES.includes(prev) ? '' : prev));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedState, selectedCity]);

  /* ---------- Filters Reset Page ---------- */
  useEffect(() => {
    setPage(1);
  }, [debouncedLocation, debouncedBanker, debouncedAssociated, debouncedEmail]);

  /* ---------- Fetch ---------- */
  useEffect(() => {
    const fetchFiltered = async () => {
      setLoading(true);
      try {
        const params: any = { page, limit };
        if (debouncedLocation.trim()) params.location = debouncedLocation.trim();
        if (debouncedBanker.trim()) params.bankerName = debouncedBanker.trim();
        if (debouncedAssociated.trim()) params.associatedWith = debouncedAssociated.trim();
        if (debouncedEmail.trim()) params.emailOfficial = debouncedEmail.trim();

        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/banker-directory/filter`, { params });
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
  }, [debouncedLocation, debouncedBanker, debouncedAssociated, debouncedEmail, page, limit]);

  /* ---------- Handlers ---------- */
  const handleClearSearch = (type: 'location' | 'banker' | 'associated' | 'emailOfficial') => {
    if (type === 'location') {
      setSearchLocation('');
      setSelectedState('');
      setSelectedCity('');
    }
    if (type === 'banker') setSearchBanker('');
    if (type === 'associated') setSearchAssociatedWith('');
    if (type === 'emailOfficial') setSearchEmailOfficial('');
  };

  const handleClearAll = () => {
    setSearchLocation('');
    setSearchBanker('');
    setSearchAssociatedWith('');
    setSearchEmailOfficial('');
    setSelectedState('');
    setSelectedCity('');
  };

  const handleEdit = (banker: Banker) => {
    setEditBanker(banker);
    setEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this banker?')) {
      try {
        setLoading(true);
        await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/banker-directory/delete-directory/${id}`);
        setFilteredBankers((prev) => prev.filter((b) => b._id !== id));
        setTotalCount((prev) => Math.max(prev - 1, 0));
      } catch (err) {
        console.error('Delete failed:', err);
        alert('Delete failed!');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveChanges = async () => {
    if (!editBanker) return;
    const { _id, ...updatePayload } = editBanker;
    try {
      setLoading(true);
      await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/banker-directory/update-directory/${_id}`, updatePayload);
      setFilteredBankers((prev) => prev.map((b) => (b._id === _id ? { ...b, ...updatePayload } : b)));
      setEditModalOpen(false);
    } catch (err) {
      console.error('Update failed:', err);
      alert('Update failed!');
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
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/banker-directory/bulk-upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (evt) => {
          if (!evt.total) return;
          setUploadProgress(Math.round((evt.loaded * 100) / evt.total));
        }
      });

      setOpenUploadModal(false);
      setSelectedFile(null);
      setPage(1);
    } catch (err: any) {
      console.error('Bulk upload failed:', err);
      setUploadError(err?.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const downloadCsvTemplate = () => {
    const csvHeader =
      'bankerName,associatedWith,locationCategories,emailOfficial,emailPersonal,contact,product\n';
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
      locationCategories: (b.locationCategories || []).join('; '),
      emailOfficial: b.emailOfficial || '',
      emailPersonal: b.emailPersonal || '',
      contact: b.contact || '',
      product: (b.product || []).join('; ')
    }));

    const header =
      'bankerName,associatedWith,locationCategories,emailOfficial,emailPersonal,contact,product';
    const body = rows
      .map((r) =>
        [
          r.bankerName,
          r.associatedWith,
          r.locationCategories,
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

  /* ---------- KPIs ---------- */
  const uniqueLocations = useMemo(() => {
    const set = new Set<string>();
    filteredBankers.forEach((b) => (b.locationCategories || []).forEach((l) => set.add(l)));
    return set.size;
  }, [filteredBankers]);

  const uniqueProducts = useMemo(() => {
    const set = new Set<string>();
    filteredBankers.forEach((b) => (b.product || []).forEach((p) => set.add(p)));
    return set.size;
  }, [filteredBankers]);

  /* ---------- Reusable Chip Group ---------- */
  const ChipGroup = ({
    items = [],
    max = 6,
    type = 'location'
  }: { items?: string[]; max?: number; type?: 'location' | 'product' }) => {
    const visible = items.slice(0, max);
    const rest = Math.max(items.length - max, 0);

    const sxBase =
      type === 'location'
        ? { color: '#2563EB', borderColor: '#93C5FD', bgcolor: '#F0F9FF' }
        : { color: '#047857', borderColor: '#6EE7B7', bgcolor: '#ECFDF5' };

    return (
      <Stack direction="row" spacing={0.5}  flexWrap="wrap">
        {visible.map((label, i) => (
          <Chip
            key={`${label}-${i}`}
            label={label}
            size="small"
            variant="outlined"
            sx={{
              height: 22,
              '& .MuiChip-label': { px: 1, fontSize: 11, fontWeight: 500 },
              ...sxBase
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

      {/* Hero Header */}
      <Paper
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 3,
          overflow: 'hidden',
          border: `1px solid ${COLORS.border}`,
          background: `linear-gradient(135deg, ${COLORS.primary} 0%, #60A5FA 60%, #60A5FA 100%)`,
          color: '#fff'
        }}
      >
        <Box sx={{ p: { xs: 2, md: 2 } }}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" >
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff' }}>
              Banker Directory
            </Typography>

            <Box flex={1} />

            {/* View toggle next to actions */}
            <Tabs
              value={viewMode}
              onChange={(_, v) => {
                setViewMode(v);
                localStorage.setItem(STORAGE_KEYS.view, v);
              }}
              aria-label="view mode"
              sx={{
                minHeight: 36,
                '& .MuiTabs-flexContainer': { gap: 0.5 },
                '& .MuiTab-root': {
                  px: 1,
                  borderRadius: 1,
                  color: '#0B1220',
                  bgcolor: 'rgba(255,255,255,0.18)',
                  border: '1px solid rgba(255,255,255,0.45)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.26)' },
                  '&.Mui-selected': {
                    bgcolor: '#FFFFFF',
                    color: '#0B1220',
                    borderColor: '#FFFFFF'
                  }
                },
                '& .MuiTabs-indicator': { display: 'none' }
              }}
            >
              <Tab value="grid" icon={<GridViewIcon />} aria-label="Grid" />
              <Tab value="table" icon={<TableChartIcon />} aria-label="Table" />
            </Tabs>

            {/* Actions */}
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {role === 'admin' && (
                <Button
                  variant="contained"
                  color="inherit"
                  startIcon={<CloudUploadIcon />}
                  onClick={handleOpenUpload}
                  sx={{ color: COLORS.primary }}
                >
                  Upload Excel
                </Button>
              )}
              <Button
                variant="contained"
                color="inherit"
                startIcon={<FileDownloadIcon />}
                onClick={exportCurrentCSV}
                sx={{ color: COLORS.primary }}
              >
                Export CSV
              </Button>
              <Button
                variant="contained"
                color="inherit"
                startIcon={<AddIcon />}
                onClick={() => setOpenFormModal(true)}
                sx={{ color: COLORS.primary }}
              >
                Add Banker
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>

      {/* Filters + Counts */}
      <Paper
        elevation={0}
        sx={{
          p: 1.25,
          borderRadius: 2,
          border: `1px solid ${COLORS.border}`,
          background: COLORS.card,
          mb: 1
        }}
      >
        <Box display="flex" gap={1} flexWrap="wrap" alignItems="center">
          {/* State / City (uniform size) */}
          <Autocomplete
            size="small"
            disableClearable
            options={INDIA_STATES}
            value={selectedState}
            onChange={(_, v) => {
              setSelectedState(v || '');
              setSelectedCity('');
            }}
            sx={filterFieldSx}
            renderInput={(params) => (
              <TextField {...params} label="State" size="small" sx={filterFieldSx} />
            )}
          />

          <Autocomplete
            size="small"
            disableClearable
            options={selectedState ? (CITIES_BY_STATE[selectedState] || []) : []}
            value={selectedCity}
            onChange={(_, v) => setSelectedCity(v || '')}
            disabled={!selectedState}
            sx={filterFieldSx}
            renderInput={(params) => (
              <TextField {...params} label="City" size="small" sx={filterFieldSx} />
            )}
          />

          {/* Existing search fields (same height) */}
          <SearchTextField
            label="Search by Location"
            value={searchLocation}
            onChange={setSearchLocation}
            onClear={() => handleClearSearch('location')}
            icon={<LocationOnOutlinedIcon fontSize="small" sx={{ color: '#2563EB' }} />}
            sxOverride={filterFieldSx}
          />
          <SearchTextField
            label="Search by Associated With"
            value={searchAssociatedWith}
            onChange={setSearchAssociatedWith}
            onClear={() => handleClearSearch('associated')}
            icon={<AccountBalanceOutlinedIcon fontSize="small" sx={{ color: '#2563EB' }} />}
            sxOverride={filterFieldSx}
          />
          <SearchTextField
            label="Search by Official Email"
            value={searchEmailOfficial}
            onChange={setSearchEmailOfficial}
            onClear={() => handleClearSearch('emailOfficial')}
            icon={<EmailOutlinedIcon fontSize="small" sx={{ color: '#2563EB' }} />}
            sxOverride={filterFieldSx}
          />
          <SearchTextField
            label="Search by Banker"
            value={searchBanker}
            onChange={setSearchBanker}
            onClear={() => handleClearSearch('banker')}
            icon={<PersonSearchOutlinedIcon fontSize="small" sx={{ color: '#2563EB' }} />}
            sxOverride={filterFieldSx}
          />

          {/* Counts right next to search */}
          <Box flex={1} />

          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip label={`Bankers: ${totalCount}`} variant="outlined" sx={{ bgcolor: '#F9FAFB', color: '#2563EB' }} />
            <Chip label={`Locations: ${uniqueLocations}`} variant="outlined" sx={{ bgcolor: '#F9FAFB', color: '#2563EB' }} />
            <Chip label={`Products: ${uniqueProducts}`} variant="outlined" sx={{ bgcolor: '#F9FAFB', color: '#2563EB' }} />
          </Stack>
        </Box>

        {/* Active filter chips */}
        <Box mt={1} display="flex" alignItems="center" gap={1} flexWrap="wrap">
          {[
            { key: 'State', val: selectedState, clear: () => setSelectedState('') },
            { key: 'City', val: selectedCity, clear: () => setSelectedCity('') },
            { key: 'Location', val: searchLocation, clear: () => setSearchLocation('') },
            { key: 'Associated', val: searchAssociatedWith, clear: () => setSearchAssociatedWith('') },
            { key: 'Official Email', val: searchEmailOfficial, clear: () => setSearchEmailOfficial('') },
            { key: 'Banker', val: searchBanker, clear: () => setSearchBanker('') }
          ]
            .filter((f) => f.val)
            .map((f) => (
              <Chip key={f.key} label={`${f.key}: ${f.val}`} onDelete={f.clear} variant="outlined" sx={{ bgcolor: '#F9FAFB' }} />
            ))}
          {([selectedState, selectedCity, searchLocation, searchAssociatedWith, searchEmailOfficial, searchBanker].some(Boolean)) && (
            <Button size="small" startIcon={<ClearAllIcon />} onClick={handleClearAll}>
              Clear all
            </Button>
          )}
        </Box>
      </Paper>

      {/* Content */}
      <Grid container spacing={2}>
        {/* GRID */}
        {viewMode === 'grid' && (
          <>
            {gridItems.map((banker) => (
              <Grid item xs={12} sm={6} md={4} key={banker._id}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    height: '100%',
                    background: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    border: '1px solid #e5e7eb',
                    transition: 'all 0.3s ease',
                    '&:hover': { boxShadow: '0 6px 20px rgba(0,0,0,0.05)', borderColor: '#cbd5e1' }
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

                  {/* Locations */}
                  <Typography variant="subtitle2" sx={{ color: '#2E3A59', fontWeight: 500 }} gutterBottom>
                    Locations
                  </Typography>
                  <Tooltip title={(banker.locationCategories || []).join(', ') || '-'} arrow>
                    <Box mb={2.25}>
                      <ChipGroup items={banker.locationCategories || []} max={3} type="location" />
                    </Box>
                  </Tooltip>

                  {/* Products */}
                  <Typography variant="subtitle2" sx={{ color: '#2E3A59', fontWeight: 500 }} gutterBottom>
                    Products
                  </Typography>
                  <Tooltip title={(banker.product || []).join(', ') || '-'} arrow>
                    <Box mb={2}>
                      <ChipGroup items={banker.product || []} max={6} type="product" />
                    </Box>
                  </Tooltip>

                  <Box mb={1}>
                    <Typography variant="body2" sx={{ color: '#374151', wordBreak: 'break-all' }} gutterBottom>
                      <strong>Official Email:</strong>{' '}
                      {banker.emailOfficial}
                      <IconButton size="small" onClick={() => handleCopy(banker.emailOfficial)} sx={{ ml: 0.5 }}>
                        <ContentCopyIcon fontSize="inherit" />
                      </IconButton>
                    </Typography>

                    {banker.emailPersonal && (
                      <Typography variant="body2" sx={{ color: '#374151' }} gutterBottom>
                        <strong>Personal Email:</strong>{' '}
                        {banker.emailPersonal}
                        <IconButton size="small" onClick={() => handleCopy(banker.emailPersonal!)} sx={{ ml: 0.5 }}>
                          <ContentCopyIcon fontSize="inherit" />
                        </IconButton>
                      </Typography>
                    )}

                    <Typography variant="body2" sx={{ color: '#374151' }}>
                      <strong>Contact:</strong>{' '}
                      {banker.contact}
                      <IconButton size="small" onClick={() => handleCopy(banker.contact)} sx={{ ml: 0.5 }}>
                        <ContentCopyIcon fontSize="inherit" />
                      </IconButton>
                    </Typography>
                  </Box>

                  {role === 'admin' && (
                    <Box display="flex" justifyContent="flex-end" gap={0.5} mt={2}>
                      <Tooltip title="Edit" arrow>
                        <IconButton
                          onClick={() => handleEdit(banker)}
                          size="small"
                          sx={{
                            bgcolor: '#EEF2FF',
                            color: '#1D4ED8',
                            border: '1px solid #1D4ED8',
                            borderRadius: 2,
                            boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                            '&:hover': { bgcolor: '#E0E7FF' }
                          }}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete" arrow>
                        <IconButton
                          onClick={() => handleDelete(banker._id)}
                          size="small"
                          sx={{
                            bgcolor: '#FEF2F2',
                            color: '#B91C1C',
                            border: '1px solid #FCA5A5',
                            borderRadius: 2,
                            boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                            '&:hover': { bgcolor: '#FEE2E2' }
                          }}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                </Paper>
              </Grid>
            ))}

            {filteredBankers.length === 0 && (
              <Grid item xs={12}>
                <Typography align="center" color="text.secondary">
                  No bankers match your search criteria.
                </Typography>
              </Grid>
            )}
          </>
        )}

        {/* TABLE */}
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
                      <TableCell sx={{ minWidth: 260 }}>Locations</TableCell>
                      <TableCell sx={{ minWidth: 260 }}>Products</TableCell>
                      <TableCell sx={{ minWidth: 220 }}>Official Email</TableCell>
                      <TableCell sx={{ minWidth: 180 }}>Personal Email</TableCell>
                      <TableCell sx={{ minWidth: 160 }}>Contact</TableCell>
                      {role === 'admin' && <TableCell sx={{ minWidth: 120 }}>Actions</TableCell>}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {filteredBankers.map((b) => (
                      <TableRow
                        key={b._id}
                        hover
                        sx={{
                          transition: 'background 0.15s ease, transform 0.15s ease',
                          '&:hover': { background: '#F8FAFC' }
                        }}
                      >
                        {/* Banker */}
                        <TableCell sx={{ py: 2.1 }}>
                          <Stack direction="row" spacing={1} alignItems="center" maxWidth={280}>
                            <Avatar sx={{ bgcolor: '#2563EB', width: 28, height: 28 }}>
                              {b.bankerName?.charAt(0)?.toUpperCase() || 'B'}
                            </Avatar>
                            <Box sx={{ minWidth: 0 }}>
                              <Tooltip title={b.bankerName || '-'} arrow>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 700, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                >
                                  {b.bankerName}
                                </Typography>
                              </Tooltip>
                              <Tooltip title={b.associatedWith || '-'} arrow>
                                <Typography
                                  variant="caption"
                                  sx={{ color: '#6B7280', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                >
                                  {b.associatedWith || '-'}
                                </Typography>
                              </Tooltip>
                            </Box>
                          </Stack>
                        </TableCell>

                        {/* Associated With */}
                        <TableCell sx={{ py: 1.1, maxWidth: 220 }}>
                          <Tooltip title={b.associatedWith || '-'} arrow>
                            <span style={{ display: 'inline-block', maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {b.associatedWith || '-'}
                            </span>
                          </Tooltip>
                        </TableCell>

                        {/* Locations */}
                        <TableCell sx={{ py: 1.1 }}>
                          <Tooltip title={(b.locationCategories || []).join(', ') || '-'} arrow>
                            <span>
                              <Stack direction="row" spacing={0.5}  flexWrap="wrap">
                                {(b.locationCategories || []).slice(0, 4).map((loc, i) => (
                                  <Chip
                                    key={i}
                                    label={loc}
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
                                ))}
                                {(b.locationCategories?.length || 0) > 4 && (
                                  <Chip
                                    size="small"
                                    label={`+${(b.locationCategories!.length - 4)}`}
                                    variant="outlined"
                                    sx={{ height: 22, '& .MuiChip-label': { px: 1, fontSize: 11 } }}
                                  />
                                )}
                              </Stack>
                            </span>
                          </Tooltip>
                        </TableCell>

                        {/* Products */}
                        <TableCell sx={{ py: 1.1 }}>
                          <Tooltip title={(b.product || []).join(', ') || '-'} arrow>
                            <span>
                              <Stack direction="row" spacing={0.5}  flexWrap="wrap">
                                {(b.product || []).slice(0, 4).map((p, i) => (
                                  <Chip
                                    key={i}
                                    label={p}
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                      height: 22,
                                      '& .MuiChip-label': { px: 1, fontSize: 11 },
                                      color: '#065F46',
                                      borderColor: '#A7F3D0',
                                      bgcolor: '#ECFDF5'
                                    }}
                                  />
                                ))}
                                {(b.product?.length || 0) > 4 && (
                                  <Chip size="small" label={`+${(b.product!.length - 4)}`} variant="outlined" sx={{ height: 22, '& .MuiChip-label': { px: 1, fontSize: 11 } }} />
                                )}
                              </Stack>
                            </span>
                          </Tooltip>
                        </TableCell>

                        {/* Official Email */}
                        <TableCell sx={{ py: 1.1, wordBreak: 'break-all' }}>
                          {b.emailOfficial ? (
                            <a href={`mailto:${b.emailOfficial}`} style={{ color: '#2563EB', textDecoration: 'none' }}>
                              {b.emailOfficial}
                            </a>
                          ) : (
                            '-'
                          )}
                        </TableCell>

                        {/* Personal Email */}
                        <TableCell sx={{ py: 1.1, wordBreak: 'break-all' }}>
                          {b.emailPersonal ? (
                            <a href={`mailto:${b.emailPersonal}`} style={{ color: '#2563EB', textDecoration: 'none' }}>
                              {b.emailPersonal}
                            </a>
                          ) : (
                            '-'
                          )}
                        </TableCell>

                        {/* Contact */}
                        <TableCell sx={{ py: 1.1 }}>
                          {b.contact ? (
                            <a href={`tel:${b.contact}`} style={{ color: '#2563EB', textDecoration: 'none' }}>
                              {b.contact}
                            </a>
                          ) : (
                            '-'
                          )}
                        </TableCell>

                        {/* Actions */}
                        {role === 'admin' && (
                          <TableCell sx={{ py: 0.6 }}>
                            <Stack direction="row" spacing={1}>
                              <Button size="small" variant="outlined" onClick={() => handleEdit(b)} startIcon={<EditOutlinedIcon />}>
                                Edit
                              </Button>
                              <Button size="small" color="error" variant="outlined" onClick={() => handleDelete(b._id)} startIcon={<DeleteOutlineIcon />}>
                                Delete
                              </Button>
                            </Stack>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}

                    {filteredBankers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={role === 'admin' ? 8 : 7} align="center" sx={{ py: 6, color: 'text.secondary' }}>
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

        {/* Footer Bar */}
        {totalCount > 0 && (
          <Grid item xs={12} mt={2} display="flex" justifyContent="space-between" alignItems="center">
            <Pagination
              count={Math.ceil(totalCount / limit)}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              sx={{
                '& .MuiPaginationItem-root': { color: COLORS.primary },
                '& .Mui-selected': { backgroundColor: COLORS.primary, color: '#fff', '&:hover': { backgroundColor: COLORS.primaryDark } }
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
                '& .MuiInputLabel-root': { color: COLORS.text, fontWeight: 500 },
                '& .Mui-focused .MuiInputLabel-root': { color: COLORS.primary }
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
        <Dialog open={openFormModal} onClose={() => setOpenFormModal(false)} maxWidth="md" fullWidth scroll="body" PaperProps={{ sx: { borderRadius: 3, background: '#FFF' } }}>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 700, color: COLORS.primary }}>
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
              }}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={openUploadModal} onClose={() => setOpenUploadModal(false)} maxWidth="sm" fullWidth scroll="body" PaperProps={{ sx: { borderRadius: 3, background: '#fff' } }}>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 700, color: COLORS.primary }}>
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
                <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />}>
                  Choose File
                  <input hidden type="file" accept=".xlsx,.xls,.csv" onChange={handleFileChange} />
                </Button>
                <Button variant="text" startIcon={<FileDownloadIcon />} onClick={downloadCsvTemplate}>
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
                  <LinearProgress variant="determinate" value={uploadProgress} />
                  <Typography mt={0.5} variant="caption" color="text.secondary">
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
                <Typography variant="subtitle2">Expected headers (row 1):</Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                  bankerName, associatedWith, locationCategories, emailOfficial, emailPersonal, contact, product
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  • <strong>locationCategories</strong> and <strong>product</strong> can be comma-separated lists.
                </Typography>
              </Stack>

              <Box display="flex" justifyContent="flex-end" gap={1} mt={1}>
                <Button variant="outlined" onClick={() => setOpenUploadModal(false)}>
                  Cancel
                </Button>
                <Button variant="contained" onClick={handleUpload} disabled={!selectedFile || uploading}>
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

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={2000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snack.severity} variant="filled" onClose={() => setSnack((s) => ({ ...s, open: false }))}>
          {snack.msg}
        </Alert>
      </Snackbar>
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
        return decoded.role ?? null;
      } catch (err) {
        console.error('❌ JWT Decode Failed:', err);
        return null;
      }
    };
    setRole(getUserRole());
  }, []);

  return (
    <>
      <Container maxWidth="lg" sx={{ backgroundColor: COLORS.canvas, minHeight: '100vh', py: 3 }}>
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
LendersTasks.getLayout = (page: React.ReactElement) => <SidebarLayout>{page}</SidebarLayout>;
export default LendersTasks;
