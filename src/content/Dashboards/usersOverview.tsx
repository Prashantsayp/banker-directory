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

interface User {
  _id: string;
  fullName: string;
  email: string;
  gender: 'male' | 'female' | 'other';
  role: 'admin' | 'user';
}

function UserOverview() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const [updatedUserData, setUpdatedUserData] = useState<{
    fullName: string;
    email: string;
    role: 'admin' | 'user';
    password: string;
  }>({
    fullName: '',
    email: '',
    role: 'user',
    password: ''
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/get-users`
        );
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
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
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${id}`);
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      console.error('Failed to delete user:', error);
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
    if (selectedUser) {
      try {
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${selectedUser._id}`,
          updatedUserData
        );
        console.log(response);
        const updatedUsers = users.map((user) =>
          user._id === selectedUser._id ? { ...user, ...updatedUserData } : user
        );
        setUsers(updatedUsers);
        setOpen(false);
      } catch (error) {
        console.error('Failed to update user:', error);
      }
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
                    bgcolor:
                      user.role === 'admin' ? 'secondary.main' : 'primary.main',
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

      {/* Edit User Modal */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            label="Full Name"
            name="fullName"
            value={updatedUserData.fullName}
            onChange={handleChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Email"
            name="email"
            value={updatedUserData.email}
            onChange={handleChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
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
            sx={{ marginBottom: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleUpdate} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default UserOverview;
