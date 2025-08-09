
import SidebarLayout from '@/layouts/SidebarLayout';
import {  useEffect, useState } from 'react';
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
  Button

  
} from '@mui/material';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import SearchTextField from '../../../pages/components/searchTextFied';
import useDebounce from 'hooks/useDebounce';
import BankerEditDialog from '../../components/BankerEditDialog';
import AddIcon from '@mui/icons-material/Add';
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
        if (debouncedLocation.trim()) params.location = debouncedLocation.trim();
        if (debouncedBanker.trim()) params.bankerName = debouncedBanker.trim();
        if (debouncedAssociated.trim()) params.associatedWith = debouncedAssociated.trim();
        if (debouncedEmail.trim()) params.emailOfficial = debouncedEmail.trim();

        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/banker-directory/filter`, { params });
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
  }, [debouncedLocation, debouncedBanker, debouncedAssociated, debouncedEmail, page, limit]);

  const handleClearSearch = (type: 'location' | 'banker' | 'associated' | 'emailOfficial') => {
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
        await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/banker-directory/delete-directory/${id}`);
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

  return (
    <Box sx={{ px: 2, py: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box display="flex" gap={1} flexWrap="wrap">
            <SearchTextField label="Search by Location" value={searchLocation} onChange={setSearchLocation} onClear={() => handleClearSearch('location')} icon="📍" />
            <SearchTextField label="Search by Associated With" value={searchAssociatedWith} onChange={setSearchAssociatedWith} onClear={() => handleClearSearch('associated')} icon="🏦" />
            <SearchTextField label="Search by Official Email" value={searchEmailOfficial} onChange={setSearchEmailOfficial} onClear={() => handleClearSearch('emailOfficial')} icon="📧" />
            <SearchTextField label="Search by Banker" value={searchBanker} onChange={setSearchBanker} onClear={() => handleClearSearch('banker')} icon="👤" maxWidth={250} />
          </Box>
        </Grid>

      <Grid item xs={12}>
  <Box display="flex" justifyContent="flex-end">
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      onClick={() => setOpenFormModal(true)}
    >
      Add Banker Directory
    </Button>
  </Box>

  {/* Modal with DirectoryForm */}
  <Dialog
    open={openFormModal}
    onClose={() => setOpenFormModal(false)}
    maxWidth="md"
    fullWidth
    scroll="body"
    PaperProps={{ sx: { borderRadius: 3 ,background:"#fff"} }}
  >
    <DialogTitle
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontWeight: 600,
        color:"primary.main"
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
          // Optional: trigger data refresh
        }}
      />
    </DialogContent>
  </Dialog>
</Grid>


        {filteredBankers.map((banker) => (
          <Grid item xs={12} sm={6} md={4} key={banker._id}>
            {/* Existing card design retained here */}
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
          <Typography variant="body2" sx={{ color: '#374151' }} gutterBottom>
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
              '&:hover': {
                backgroundColor: '#E0E7FF'
              }
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
              '&:hover': {
                backgroundColor: '#FEE2E2'
              }
            }}
            variant="outlined"
          />
        </Box>
      )}
    </Paper>          </Grid>
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
        '& .MuiPaginationItem-root': {
          color: '#2563EB', // Primary blue text
        },
        '& .Mui-selected': {
          backgroundColor: '#2563EB',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#1E40AF'
          }
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
          '& fieldset': {
            borderColor: '#cbd5e1'
          },
          '&:hover fieldset': {
            borderColor: '#94a3b8'
          },
          '&.Mui-focused fieldset': {
            borderColor: '#2563EB'
          }
        },
        '& .MuiInputLabel-root': {
          color: '#374151',
          fontWeight: 500
        },
        '& .Mui-focused .MuiInputLabel-root': {
          color: '#2563EB'
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

  // const tabs = [{ value: 'overview', label: 'Bankers Directory' }];


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
     
      <Container maxWidth="lg" sx={{ backgroundColor: '#e5e7eb', minHeight: '100vh', py: 3 }}>
        <Box borderBottom={1} borderColor="divider" mb={2}>
       
        </Box>
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
