import {
  Box,
  Grid,
  Typography,
  Avatar,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  EditTwoTone as EditIcon,
  DeleteTwoTone as DeleteIcon
} from '@mui/icons-material';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Lender {
  _id: string;
  lenderName: string;
  state: string;
  city: string;
  managerName: string;
  rmName?: string;
  bankerName?: string;
  rmContact?: string;
}

const LenderOverview = ({ role }: { role: string | null }) => {
  const [lenders, setLenders] = useState<Lender[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editLender, setEditLender] = useState<Lender | null>(null);

  const isAdmin = role === 'admin';

  useEffect(() => {
    fetchLenders();
  }, []);

  const fetchLenders = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/lenders/get-lenders`)
      .then((res) => setLenders(res.data))
      .catch((err) => console.error('Error fetching lenders:', err));
  };

  const handleEdit = (lender: Lender) => {
    setEditLender(lender);
    setEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this lender?')) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/lenders/delete-lenders/${id}`);
        setLenders((prev) => prev.filter((l) => l._id !== id));
      } catch (err) {
        console.error('Failed to delete lender:', err);
        alert('Something went wrong while deleting!');
      }
    }
  };

  const handleSaveChanges = async () => {
    if (!editLender) return;
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/lenders/update-lenders/${editLender._id}`,
        editLender
      );
      fetchLenders();
      setEditModalOpen(false);
    } catch (err) {
      console.error('Update failed:', err);
      alert('Update failed!');
    }
  };

  return (
    <>
      <Grid container spacing={3}>
        {lenders.map((lender) => (
          <Grid item xs={12} sm={6} md={4} key={lender._id}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 3,
                position: 'relative',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}
            >
              {/* ✅ Admin-only action buttons */}
              {isAdmin && (
                <Box position="absolute" top={8} right={8}>
                  <Tooltip title="Edit Lender" arrow>
                    <IconButton color="primary" onClick={() => handleEdit(lender)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Lender" arrow>
                    <IconButton color="error" onClick={() => handleDelete(lender._id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}

              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ mr: 2 }}>{lender.lenderName.charAt(0)}</Avatar>
                <Box>
                  <Typography variant="h6">{lender.lenderName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Location: {lender.city}, {lender.state}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body2" gutterBottom>
                <strong>Banker Name:</strong> {lender.bankerName || 'N/A'}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>RM/SM:</strong> {lender.rmName || 'N/A'}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Contact:</strong> {lender.rmContact || 'N/A'}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Lender</DialogTitle>
        <DialogContent>
          {editLender && (
            <Stack spacing={2} mt={2}>
              <TextField
                label="Lender Name"
                value={editLender.lenderName}
                onChange={(e) => setEditLender({ ...editLender, lenderName: e.target.value })}
                fullWidth
              />
              <TextField
                label="State"
                value={editLender.state}
                onChange={(e) => setEditLender({ ...editLender, state: e.target.value })}
                fullWidth
              />
              <TextField
                label="City"
                value={editLender.city}
                onChange={(e) => setEditLender({ ...editLender, city: e.target.value })}
                fullWidth
              />
              <TextField
                label="Manager Name"
                value={editLender.managerName}
                onChange={(e) => setEditLender({ ...editLender, managerName: e.target.value })}
                fullWidth
              />
              <TextField
                label="Banker Name"
                value={editLender.bankerName || ''}
                onChange={(e) => setEditLender({ ...editLender, bankerName: e.target.value })}
                fullWidth
              />
              <TextField
                label="RM Name"
                value={editLender.rmName || ''}
                onChange={(e) => setEditLender({ ...editLender, rmName: e.target.value })}
                fullWidth
              />
              <TextField
                label="RM Contact"
                value={editLender.rmContact || ''}
                onChange={(e) => setEditLender({ ...editLender, rmContact: e.target.value })}
                fullWidth
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LenderOverview;
