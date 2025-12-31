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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Paper
} from '@mui/material';

import { useEffect, useMemo, useState } from 'react';
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

const COLORS = {
  bgPanel: '#050816',
  bgCard: '#0b1020',
  borderSubtle: 'rgba(148,163,184,0.35)',
  accent: '#6366f1',
  accentSoft: '#4f46e5',
  accentPink: '#ec4899',
  textMain: '#f9fafb',
  textMuted: '#9ca3af'
};

const textFieldStyles = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: COLORS.bgCard,
    borderRadius: '12px',
    color: COLORS.textMain,
    '& input': {
      color: COLORS.textMain
    },
    '& fieldset': {
      borderColor: COLORS.borderSubtle
    },
    '&:hover fieldset': {
      borderColor: COLORS.accentSoft
    },
    '&.Mui-focused fieldset': {
      borderColor: COLORS.accent
    }
  },
  '& .MuiInputLabel-root': {
    color: COLORS.textMuted
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: COLORS.accent
  },
  '& .MuiSelect-select': {
    color: COLORS.textMain,
    borderRadius: '12px',
    backgroundColor: COLORS.bgCard
  }
};

function UserOverview() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const [updatedUserData, setUpdatedUserData] = useState({
    fullName: '',
    email: '',
    role: 'user' as 'admin' | 'user',
    password: ''
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<'success' | 'error'>('success');

  const [searchTerm, setSearchTerm] = useState('');

  const handleSnackbarClose = (_: unknown, reason?: any) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const showSnack = (msg: string, type: 'success' | 'error') => {
    setSnackbarMessage(msg);
    setSnackbarSeverity(type);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/get-users`
        );
        setUsers(response.data);
      } catch {
        showSnack('Error fetching users.', 'error');
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
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/delete-users/${id}`
      );
      setUsers((prev) => prev.filter((user) => user._id !== id));
      showSnack('User deleted successfully!', 'success');
    } catch {
      showSnack('Failed to delete user.', 'error');
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
      const payload: any = { ...updatedUserData };
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
      showSnack('User updated successfully!', 'success');
    } catch {
      showSnack('Failed to update user.', 'error');
    }
  };

  const totalUsers = users.length;
  const admins = users.filter((u) => u.role === 'admin').length;

  const genderStats = useMemo(() => {
    const m = users.filter((u) => u.gender === 'male').length;
    const f = users.filter((u) => u.gender === 'female').length;
    const o = users.filter((u) => u.gender === 'other').length;
    return { m, f, o };
  }, [users]);

  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;
    const q = searchTerm.toLowerCase();
    return users.filter(
      (u) =>
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
    );
  }, [users, searchTerm]);

  const listToRender = filteredUsers;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4} mb={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          bgcolor: COLORS.bgPanel,
          p: 3,
          borderRadius: 3
        }}
      >
        {/* Header + Search */}
        <Box
          sx={{
            mb: 3,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2,
            alignItems: { xs: 'stretch', md: 'center' },
            justifyContent: 'space-between'
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{ color: COLORS.textMain, fontWeight: 600 }}
            >
              Users Overview
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: COLORS.textMuted, mt: 0.5 }}
            >
              Manage all users, roles and access from this panel.
            </Typography>
          </Box>

          <TextField
            placeholder="Search by name, email or role"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{
              minWidth: { xs: '100%', md: 260 },
              ...textFieldStyles
            }}
            InputProps={{
              sx: {
                height: 40
              }
            }}
          />
        </Box>

        {/* Stats cards */}
        <Grid container spacing={2.5} mb={3}>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                borderRadius: 3,
                bgcolor: COLORS.bgCard,
                border: `1px solid ${COLORS.borderSubtle}`
              }}
              elevation={0}
            >
              <CardContent>
                <Typography
                  variant="caption"
                  sx={{
                    color: COLORS.textMuted,
                    fontWeight: 700,
                    letterSpacing: 1,
                    textTransform: 'uppercase'
                  }}
                >
                  Total Users
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    mt: 1,
                    color: COLORS.textMain,
                    fontWeight: 700
                  }}
                >
                  {totalUsers}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                borderRadius: 3,
                bgcolor: COLORS.bgCard,
                border: `1px solid ${COLORS.borderSubtle}`
              }}
              elevation={0}
            >
              <CardContent>
                <Typography
                  variant="caption"
                  sx={{
                    color: COLORS.textMuted,
                    fontWeight: 700,
                    letterSpacing: 1,
                    textTransform: 'uppercase'
                  }}
                >
                  Admins
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    mt: 1,
                    color: COLORS.textMain,
                    fontWeight: 700
                  }}
                >
                  {admins}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                borderRadius: 3,
                bgcolor: COLORS.bgCard,
                border: `1px solid ${COLORS.borderSubtle}`
              }}
              elevation={0}
            >
              <CardContent>
                <Typography
                  variant="caption"
                  sx={{
                    color: COLORS.textMuted,
                    fontWeight: 700,
                    letterSpacing: 1,
                    textTransform: 'uppercase'
                  }}
                >
                  Gender Split
                </Typography>

                <Box sx={{ mt: 1.5, display: 'flex', gap: 1 }}>
                  <Chip
                    size="small"
                    label={`M: ${genderStats.m}`}
                    icon={<MaleIcon sx={{ fontSize: 16 }} />}
                    sx={{
                      bgcolor: 'rgba(59,130,246,0.15)',
                      color: '#bfdbfe',
                      borderRadius: 2
                    }}
                  />
                  <Chip
                    size="small"
                    label={`F: ${genderStats.f}`}
                    icon={<FemaleIcon sx={{ fontSize: 16 }} />}
                    sx={{
                      bgcolor: 'rgba(236,72,153,0.18)',
                      color: '#fecaca',
                      borderRadius: 2
                    }}
                  />
                  <Chip
                    size="small"
                    label={`O: ${genderStats.o}`}
                    icon={<TransgenderIcon sx={{ fontSize: 16 }} />}
                    sx={{
                      bgcolor: 'rgba(14,165,233,0.15)',
                      color: '#bae6fd',
                      borderRadius: 2
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* User cards */}
        <Grid container spacing={3}>
          {listToRender.map((user) => (
            <Grid item xs={12} sm={6} md={4} key={user._id}>
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  boxShadow: '0 16px 40px rgba(15,23,42,0.7)',
                  transition: '0.25s',
                  '&:hover': {
                    boxShadow: '0 18px 48px rgba(15,23,42,0.9)',
                    transform: 'translateY(-4px)',
                    borderColor: COLORS.accent
                  },
                  background: COLORS.bgCard,
                  padding: '16px',
                  position: 'relative',
                  border: `1px solid ${COLORS.borderSubtle}`
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar
                      sx={{
                        bgcolor:
                          user.role === 'admin'
                            ? 'rgba(244,114,182,0.95)'
                            : 'rgba(59,130,246,0.95)',
                        width: 52,
                        height: 52,
                        fontSize: '2rem',
                        mr: 2
                      }}
                    >
                      <PersonIcon sx={{ fontSize: '1.5rem' }} />
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{ color: COLORS.textMain }}
                      >
                        {user.fullName}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: COLORS.textMuted,
                          wordBreak: 'break-all'
                        }}
                      >
                        {user.email}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider
                    sx={{
                      my: 2,
                      borderColor: COLORS.borderSubtle
                    }}
                  />

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
                      size="small"
                      sx={{
                        fontWeight: 500,
                        color: COLORS.textMain,
                        borderColor: COLORS.borderSubtle
                      }}
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
                      size="small"
                      sx={{
                        fontWeight: 500,
                        color:
                          user.role === 'admin'
                            ? '#f9a8d4'
                            : COLORS.textMain,
                        borderColor:
                          user.role === 'admin'
                            ? 'rgba(249,168,212,0.9)'
                            : COLORS.borderSubtle
                      }}
                    />
                  </Box>

                  <Box
                    display="flex"
                    justifyContent="flex-end"
                    mt={2}
                    position="absolute"
                    bottom={10}
                    right={10}
                  >
                    <Tooltip title="Edit" placement="top">
                      <IconButton onClick={() => handleEdit(user)}>
                        <EditIcon sx={{ color: COLORS.textMain }} />
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

          {listToRender.length === 0 && (
            <Grid item xs={12}>
              <Box
                sx={{
                  textAlign: 'center',
                  py: 6,
                  borderRadius: 3,
                  border: `1px dashed ${COLORS.borderSubtle}`,
                  bgcolor: COLORS.bgCard
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ color: COLORS.textMain, mb: 1 }}
                >
                  No users found
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: COLORS.textMuted }}
                >
                  Try adjusting your search or create a new user from the
                  top banner.
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Edit Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle
          sx={{
            bgcolor: COLORS.bgPanel,
            color: COLORS.textMain,
            fontWeight: 600
          }}
        >
          Edit User
        </DialogTitle>

        <DialogContent sx={{ pt: 3, backgroundColor: COLORS.bgPanel }}>
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

        <DialogActions sx={{ p: 2, backgroundColor: COLORS.bgPanel }}>
          <Button
            onClick={handleClose}
            sx={{
              color: COLORS.accentPink,
              fontWeight: 600,
              textTransform: 'none'
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            variant="contained"
            sx={{
              backgroundColor: COLORS.accent,
              color: '#fff',
              borderRadius: '12px',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: COLORS.accentSoft
              }
            }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={handleSnackbarClose}
        duration={4000}
      />
    </>
  );
}

export default UserOverview;
