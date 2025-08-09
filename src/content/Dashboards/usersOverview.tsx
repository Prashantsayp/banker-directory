import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  CircularProgress,
  Avatar,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  SelectChangeEvent
} from '@mui/material';

import { useEffect, useState } from 'react';
import axios from 'axios';

import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import CustomSnackbar from '@/components/CustomSnackbar';

interface User {
  _id: string;
  fullName: string;
  email: string;
  gender: 'male' | 'female' | 'other';
  role: 'admin' | 'user';
}

function UserOverview() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const textFieldStyles = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#fff',
    borderRadius: '12px',
    color: '#333',
    '& input': {
      color: '#333',
    },
    '& fieldset': {
      borderColor: '#c084fc',
    },
    '&:hover fieldset': {
      borderColor: '#a855f7',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#9333ea',
      boxShadow: '0 0 0 2px rgba(147, 51, 234, 0.2)',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#a855f7',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#9333ea',
  },
  '& .MuiSelect-select': {
    color: '#333',
    borderRadius: '12px',
    backgroundColor: '#fff',
  },
};


  const [updatedUserData, setUpdatedUserData] = useState({
    fullName: '',
    email: '',
    role: 'user' as 'admin' | 'user',
    password: ''
  });

  const [newUserData, setNewUserData] = useState({
    fullName: '',
    email: '',
    role: 'user',
    gender: 'male',
    password: ''
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const handleSnackbarClose = (_: unknown, reason?: any) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/get-users`);
        setUsers(response.data);
      } catch {
        setSnackbarMessage('Error fetching users.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.role);
      } catch (err) {
        console.error('Failed to decode JWT', err);
      }
    }

    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/delete-users/${id}`);
      setUsers(users.filter((user) => user._id !== id));
      setSnackbarMessage('User deleted successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch {
      setSnackbarMessage('Failed to delete user.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setUpdatedUserData({
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      password: ''
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedUserData({
      ...updatedUserData,
      [e.target.name]: e.target.value
    });
  };

  const handleRoleChange = (e: SelectChangeEvent<'admin' | 'user'>) => {
    setUpdatedUserData({
      ...updatedUserData,
      role: e.target.value as 'admin' | 'user'
    });
  };

  const handleUpdate = async () => {
    if (!selectedUser) return;

    try {
      const token = localStorage.getItem('token');
      const payload = { ...updatedUserData };
      if (!payload.password?.trim()) delete payload.password;

      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/update-users/${selectedUser._id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedUsers = users.map((user) =>
        user._id === selectedUser._id ? { ...user, ...payload } : user
      );
      setUsers(updatedUsers);
      setOpen(false);

      setSnackbarMessage('User updated successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch {
      setSnackbarMessage('Failed to update user.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleCreateUser = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/create-users`,
        newUserData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers([...users, response.data]);
      setCreateOpen(false);
      setNewUserData({
        fullName: '',
        email: '',
        role: 'user',
        gender: 'male',
        password: ''
      });

      setSnackbarMessage('User created successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch {
      setSnackbarMessage('Failed to create user.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box display="flex" justifyContent="flex-end" mb={2} >
        {/* <Button variant="contained" color="primary" onClick={() => setCreateOpen(true)}>
          + Create User
        </Button> */}
      </Box>

      <Grid container spacing={4}>
        {users.map((user) => (
          <Grid item xs={12} sm={6} md={4} key={user._id}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 2,
                boxShadow: 4,
                transition: '0.3s',
                '&:hover': { boxShadow: 8 },
                backgroundColor: '#1D2C3D',
                padding: '16px',
                position: 'relative'
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar
                    sx={{
                      bgcolor: user.role === 'admin' ? 'secondary.main' : 'primary.main',
                      width: 56,
                      height: 56,
                      fontSize: '2rem',
                      mr: 2
                    }}
                  >
                    <PersonIcon sx={{ fontSize: '1.5rem' }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight={600} color="#fff">
                      {user.fullName}
                    </Typography>
                    <Typography variant="body2" color="#fff">
                      {user.email}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box display="flex" flexWrap="wrap" gap={1}>
                  <Chip
                    label={user.gender}
                    icon={
                      user.gender === 'male' ? (
                        <MaleIcon fontSize="small" />
                      ) : user.gender === 'female' ? (
                        <FemaleIcon fontSize="small" />
                      ) : (
                        <TransgenderIcon fontSize="small" />
                      )
                    }
                    variant="outlined"
                    color="primary"
                    size="small"
                    sx={{ fontWeight: 500, color: '#fff' }}
                  />
                  <Chip
                    label={user.role === 'admin' ? 'Admin' : 'User'}
                    icon={
                      user.role === 'admin' ? (
                        <AdminPanelSettingsIcon fontSize="small" />
                      ) : (
                        <PersonOutlineIcon fontSize="small" />
                      )
                    }
                    variant="outlined"
                    color={user.role === 'admin' ? 'secondary' : 'default'}
                    size="small"
                    sx={{ fontWeight: 500, color: '#fff' }}
                  />
                </Box>

                <Box
                  display="flex"
                  justifyContent="flex-end"
                  mt={2}
                  position="absolute"
                  bottom={16}
                  right={16}
                >
                  <Tooltip title="Edit" placement="top">
                    <IconButton onClick={() => handleEdit(user)}>
                      <EditIcon sx={{ color: '#fff' }} />
                    </IconButton>
                  </Tooltip>

                  {userRole === 'admin' && (
                    <Tooltip title="Delete" placement="top">
                      <IconButton onClick={() => handleDelete(user._id)}>
                        <DeleteIcon sx={{ color: 'error.main' }} />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Edit Dialog */}
   <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ bgcolor: '#a78bfa', color: '#fff', fontWeight: 600 }}>
        Edit User
      </DialogTitle>

      <DialogContent sx={{ pt: 3, backgroundColor: '#f9f5ff' }}>
        <TextField
          label="Full Name"
          name="fullName"
          value={updatedUserData.fullName}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 3, ...textFieldStyles }}
          variant="outlined"
        />
        <TextField
          label="Email"
          name="email"
          value={updatedUserData.email}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 3, ...textFieldStyles }}
          variant="outlined"
        />
        <FormControl fullWidth sx={{ mb: 3, ...textFieldStyles }}>
          <InputLabel>Role</InputLabel>
          <Select
            label="Role"
            value={updatedUserData.role}
            onChange={handleRoleChange}
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="user">User</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Password"
          name="password"
          type="password"
          value={updatedUserData.password}
          onChange={handleChange}
          fullWidth
          sx={{ mb: 1, ...textFieldStyles }}
          variant="outlined"
        />
      </DialogContent>

      <DialogActions sx={{ p: 2, backgroundColor: '#f9f5ff' }}>
        <Button
          onClick={handleClose}
          sx={{
            color: '#9333ea',
            fontWeight: 600,
            textTransform: 'none',
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleUpdate}
          variant="contained"
          sx={{
            backgroundColor: '#9333ea',
            color: '#fff',
            borderRadius: '12px',
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#7e22ce',
            },
          }}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>

     <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth>
  <Box
    sx={{
      bgcolor: 'white',
      borderRadius: 2,
      m: 2,
      overflow: 'hidden',
    }}
  >
    <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
      Create New User
    </DialogTitle>

    <DialogContent sx={{ p: 3 ,backgroundcolor:"#fff"}}>
      <TextField
        label="Full Name"
        value={newUserData.fullName}
        onChange={(e) => setNewUserData({ ...newUserData, fullName: e.target.value })}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Email"
        value={newUserData.email}
        onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
        fullWidth
        sx={{ mb: 2 }}
      />

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Gender</InputLabel>
        <Select
          value={newUserData.gender}
          label="Gender"
          onChange={(e) => setNewUserData({ ...newUserData, gender: e.target.value })}
        >
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Role</InputLabel>
        <Select
          value={newUserData.role}
          label="Role"
          onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
        >
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="user">User</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Password"
        type="password"
        value={newUserData.password}
        onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
        fullWidth
        sx={{ mb: 2 }}
      />
    </DialogContent>

    <DialogActions sx={{ px: 3, pb: 3 }}>
      <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
      <Button onClick={handleCreateUser} variant="contained" color="primary">
        Create
      </Button>
    </DialogActions>
  </Box>
</Dialog>


      {/* Snackbar */}
      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={handleSnackbarClose}
        duration={4000} l={undefined}      />
    </>
  );
}

export default UserOverview;