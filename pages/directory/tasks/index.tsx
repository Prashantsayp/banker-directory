import SidebarLayout from '@/layouts/SidebarLayout';
import { useEffect, useState } from 'react';
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
  LinearProgress
} from '@mui/material';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import SearchTextField from '../../../pages/components/searchTextFied';
import useDebounce from 'hooks/useDebounce';
import BankerEditDialog from '../../components/BankerEditDialog';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DirectoryForm from '../../../src/content/Dashboards/Tasks/BankerDirectoryForm';
import CloseIcon from '@mui/icons-material/Close';

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

const BankerOverview = ({ role }: { role: string | null }) => {
  const [filteredBankers, setFilteredBankers] = useState<Banker[]>([]);
  const [searchLocation, setSearchLocation] = useState('');
  const [searchBanker, setSearchBanker] = useState('');
  const [searchAssociatedWith, setSearchAssociatedWith] = useState('');
  const [searchEmailOfficial, setSearchEmailOfficial] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editBanker, setEditBanker] = useState<Banker | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [totalCount, setTotalCount] = useState(0);
  const [openFormModal, setOpenFormModal] = useState(false);

  // --- Upload Excel modal state ---
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const debouncedLocation = useDebounce(searchLocation, 500);
  const debouncedBanker = useDebounce(searchBanker, 500);
  const debouncedAssociated = useDebounce(searchAssociatedWith, 500);
  const debouncedEmail = useDebounce(searchEmailOfficial, 500);

  useEffect(() => {
    setPage(1);
  }, [debouncedLocation, debouncedBanker, debouncedAssociated, debouncedEmail]);

  useEffect(() => {
    const fetchFiltered = async () => {
      setLoading(true);
      try {
        const params: any = { page, limit };
        if (debouncedLocation.trim())
          params.location = debouncedLocation.trim();
        if (debouncedBanker.trim()) params.bankerName = debouncedBanker.trim();
        if (debouncedAssociated.trim())
          params.associatedWith = debouncedAssociated.trim();
        if (debouncedEmail.trim()) params.emailOfficial = debouncedEmail.trim();

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/banker-directory/filter`,
          { params }
        );
        const { data, totalCount } = res.data;
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
    debouncedLocation,
    debouncedBanker,
    debouncedAssociated,
    debouncedEmail,
    page,
    limit
  ]);

  const handleClearSearch = (
    type: 'location' | 'banker' | 'associated' | 'emailOfficial'
  ) => {
    if (type === 'location') setSearchLocation('');
    if (type === 'banker') setSearchBanker('');
    if (type === 'associated') setSearchAssociatedWith('');
    if (type === 'emailOfficial') setSearchEmailOfficial('');
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
        setTotalCount((prev) => prev - 1);
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
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/banker-directory/update-directory/${_id}`,
        updatePayload
      );
      setFilteredBankers((prev) =>
        prev.map((b) => (b._id === _id ? { ...b, ...updatePayload } : b))
      );
      setEditModalOpen(false);
    } catch (err) {
      console.error('Update failed:', err);
      alert('Update failed!');
    } finally {
      setLoading(false);
    }
  };

  // ---- Upload Excel handlers ----
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
      // Easiest way to refresh: reset page -> triggers useEffect fetch
      setPage(1);
    } catch (err: any) {
      console.error('Bulk upload failed:', err);
      setUploadError(err?.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  // optional: quick CSV template download
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

  return (
    <Box sx={{ px: 2, py: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display="flex" gap={1} flexWrap="wrap">
            <SearchTextField
              label="Search by Location"
              value={searchLocation}
              onChange={setSearchLocation}
              onClear={() => handleClearSearch('location')}
              icon="📍"
            />
            <SearchTextField
              label="Search by Associated With"
              value={searchAssociatedWith}
              onChange={setSearchAssociatedWith}
              onClear={() => handleClearSearch('associated')}
              icon="🏦"
            />
            <SearchTextField
              label="Search by Official Email"
              value={searchEmailOfficial}
              onChange={setSearchEmailOfficial}
              onClear={() => handleClearSearch('emailOfficial')}
              icon="📧"
            />
            <SearchTextField
              label="Search by Banker"
              value={searchBanker}
              onChange={setSearchBanker}
              onClear={() => handleClearSearch('banker')}
              icon="👤"
              maxWidth={250}
            />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end" gap={1}>
           {role === 'admin' && (
  <Button
    variant="outlined"
    startIcon={<CloudUploadIcon />}
    onClick={handleOpenUpload}
  >
    Upload Excel
  </Button>
)}


            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenFormModal(true)}
            >
              Add Banker Directory
            </Button>
          </Box>

          {/* Add Banker Modal */}
          <Dialog
            open={openFormModal}
            onClose={() => setOpenFormModal(false)}
            maxWidth="md"
            fullWidth
            scroll="body"
            PaperProps={{ sx: { borderRadius: 3, background: '#fff' } }}
          >
            <DialogTitle
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontWeight: 600,
                color: 'primary.main'
              }}
            >
              Add Banker Directory
              <IconButton onClick={() => setOpenFormModal(false)}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <DirectoryForm
                onSuccess={() => {
                  setOpenFormModal(false);
                  setPage(1); // trigger refresh
                }}
              />
            </DialogContent>
          </Dialog>

          {/* Upload Excel Modal */}
          <Dialog
            open={openUploadModal}
            onClose={() => setOpenUploadModal(false)}
            maxWidth="sm"
            fullWidth
            scroll="body"
            PaperProps={{ sx: { borderRadius: 3, background: '#fff' } }}
          >
            <DialogTitle
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontWeight: 600,
                color: 'primary.main'
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
                  Accepted formats: <strong>.xlsx, .xls, .csv</strong>
                </Typography>

                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  Choose File
                  <input
                    hidden
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileChange}
                  />
                </Button>

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

                <Button variant="text" onClick={downloadCsvTemplate} sx={{ alignSelf: 'flex-start' }}>
                  Download CSV Template
                </Button>

                <Box display="flex" justifyContent="flex-end" gap={1} mt={1}>
                  <Button variant="outlined" onClick={() => setOpenUploadModal(false)}>
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
        </Grid>

        {filteredBankers.map((banker) => (
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
                  <Typography variant="subtitle2" sx={{ color: '#6B7280' }}>
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
              <Stack direction="row" flexWrap="wrap" spacing={1} mb={2}>
                {(banker.locationCategories || []).map((loc, index) => (
                  <Chip
                    key={index}
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
              <Stack direction="row" flexWrap="wrap" spacing={1} mb={2}>
                {(banker.product || []).map((prod, index) => (
                  <Chip
                    key={index}
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
                  sx={{ color: '#374151', wordBreak: 'break-all' }}
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
                    <strong>Personal Email:</strong> {banker.emailPersonal}
                  </Typography>
                )}
                <Typography variant="body2" sx={{ color: '#374151' }}>
                  <strong>Contact:</strong> {banker.contact}
                </Typography>
              </Box>

              {role === 'admin' && (
                <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
                  <Chip
                    label="Edit"
                    onClick={() => handleEdit(banker)}
                    clickable
                    sx={{
                      color: '#1D4ED8',
                      borderColor: '#1D4ED8',
                      backgroundColor: '#EEF2FF',
                      '&:hover': { backgroundColor: '#E0E7FF' }
                    }}
                    variant="outlined"
                  />
                  <Chip
                    label="Delete"
                    onClick={() => handleDelete(banker._id)}
                    clickable
                    sx={{
                      color: '#B91C1C',
                      borderColor: '#FCA5A5',
                      backgroundColor: '#FEF2F2',
                      '&:hover': { backgroundColor: '#FEE2E2' }
                    }}
                    variant="outlined"
                  />
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
                '& .MuiPaginationItem-root': { color: '#2563EB' },
                '& .Mui-selected': {
                  backgroundColor: '#2563EB',
                  color: '#fff',
                  '&:hover': { backgroundColor: '#1E40AF' }
                }
              }}
            />

            <TextField
              select
              label="Rows per page"
              value={limit}
              onChange={(e) => {
                setLimit(parseInt(e.target.value));
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
                  '&.Mui-focused fieldset': { borderColor: '#2563EB' }
                },
                '& .MuiInputLabel-root': { color: '#374151', fontWeight: 500 },
                '& .Mui-focused .MuiInputLabel-root': { color: '#2563EB' }
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

        <BankerEditDialog
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          banker={editBanker}
          setBanker={(data) => setEditBanker(data)}
          onSave={handleSaveChanges}
          loading={loading}
        />
      </Grid>
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

    const userRole = getUserRole();
    setRole(userRole);
  }, []);

  return (
    <>
      <Container
        maxWidth="lg"
        sx={{ backgroundColor: '#e5e7eb', minHeight: '100vh', py: 3 }}
      >
        <Box borderBottom={1} borderColor="divider" mb={2}></Box>
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

LendersTasks.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default LendersTasks;
