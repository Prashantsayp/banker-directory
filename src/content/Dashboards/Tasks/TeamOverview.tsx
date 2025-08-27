import {
  Box,
  Grid,
  Typography,
  Avatar,
  Tooltip,
  IconButton,
  Divider,
  useTheme,
  Stack,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  PhoneTwoTone as PhoneIcon,
  EmailTwoTone as EmailIcon,
  LocationOnTwoTone as LocationIcon,
  CalendarMonthTwoTone as CalendarIcon,
  WorkHistoryTwoTone as ExperienceIcon,
  EditTwoTone as EditIcon,
  DeleteTwoTone as DeleteIcon
} from '@mui/icons-material';

import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import TimelineIcon from '@mui/icons-material/Timeline';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ImageIcon from '@mui/icons-material/Image';

import { useEffect, useState } from 'react';
import axios from 'axios';

type Role = 'admin' | 'user';

interface Member {
  _id: string;
  fullName: string;
  profileImage: string;
  designation: string;
  currentInstitutionName: string;
  dateOfJoining: string;     // "YYYY-MM-DD" or ISO
  totalExperience: string;   // e.g., "10 years"
  contact: string;
  email: string;
  location: string;
  bankName: string;
}

/* -------------------- Helpers -------------------- */
const DTO_KEYS = [
  'fullName',
  'profileImage',
  'designation',
  'currentInstitutionName',
  'dateOfJoining',
  'totalExperience',
  'contact',
  'email',
  'location',
  'bankName'
] as const;

const pickForBankerDto = (m: Partial<Member>) => {
  const out: Record<string, any> = {};
  DTO_KEYS.forEach((k) => {
    const v = (m as any)[k];
    if (v === undefined || v === null) return;
    if (typeof v === 'string' && v.trim() === '') return;
    out[k] = v;
  });
  if (out.dateOfJoining) out.dateOfJoining = String(out.dateOfJoining).slice(0, 10);
  return out;
};

const fmtDateForDisplay = (s?: string) => {
  if (!s) return '—';
  const d = new Date(s);
  return isNaN(d.getTime()) ? s : d.toLocaleDateString();
};

const initials = (name?: string) =>
  (name || '?')
    .split(' ')
    .map((s) => s[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const LIST_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/bankers/get-bankers`;
const UPDATE_URL = (id: string) =>
  `${process.env.NEXT_PUBLIC_BACKEND_URL}/bankers/update-bankers/${id}`;
const DELETE_URL = (id: string) =>
  `${process.env.NEXT_PUBLIC_BACKEND_URL}/bankers/delete-bankers/${id}`;

const textFieldSx = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    transition: 'border-color .2s, box-shadow .2s',
    '& fieldset': { borderColor: '#E5E7EB' },
    '&:hover fieldset': { borderColor: '#93C5FD' },
    '&.Mui-focused fieldset': {
      borderColor: '#2563EB',
      boxShadow: '0 0 0 2px rgba(37,99,235,.15)'
    }
  },
  '& .MuiInputLabel-root': { color: '#2563EB' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#2563EB' }
} as const;

/* -------------------- Component -------------------- */
const TeamOverview = ({ userRole = 'admin' }: { userRole?: Role }) => {
  const theme = useTheme();
  const [members, setMembers] = useState<Member[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editMember, setEditMember] = useState<Member | null>(null);

  const fetchMembers = async () => {
    try {
      const res = await axios.get(LIST_URL);
      const list = Array.isArray(res.data?.data) ? res.data.data : res.data;
      setMembers(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('Error fetching bankers:', error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleEdit = (m: Member) => {
    setEditMember(m);
    setEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this profile?')) return;
    try {
      await axios.delete(DELETE_URL(id));
      fetchMembers();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleSaveChanges = async () => {
    if (!editMember) return;
    const { _id } = editMember;

    // whitelist + trim empty strings
    const payload = pickForBankerDto(editMember);

    // optimistic UI update
    setMembers((prev) => prev.map((m) => (m._id === _id ? { ...m, ...payload } as Member : m)));

    try {
      await axios.put(UPDATE_URL(_id), payload, {
        headers: { 'Content-Type': 'application/json' }
      });
      setEditModalOpen(false);
      setEditMember(null);
      // sync server truth
      fetchMembers();
    } catch (err: any) {
      console.error('Update failed:', err?.response?.data || err);
      alert(
        `Update failed: ${err?.response?.status ?? ''}\n` +
          `${JSON.stringify(err?.response?.data ?? {}, null, 2)}`
      );
      // revert by refetch
      fetchMembers();
    }
  };

  const canSave =
    !!editMember?.fullName?.trim() &&
    !!editMember?.email?.trim();

  return (
    <>
      <Grid container spacing={3}>
        {members.map((member) => (
          <Grid item xs={12} sm={6} md={4} key={member._id}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 3,
                position: 'relative',
                backgroundColor: '#fff',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: theme.shadows[6]
                }
              }}
            >
              {userRole === 'admin' && (
                <Box position="absolute" top={8} right={8}>
                  <Tooltip title="Edit Profile" arrow>
                    <IconButton color="primary" onClick={() => handleEdit(member)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Profile" arrow>
                    <IconButton color="error" onClick={() => handleDelete(member._id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}

              {/* Header */}
              <Box textAlign="center">
                <Avatar
                  src={member.profileImage || undefined}
                  alt={member.fullName}
                  sx={{
                    bgcolor: '#2563EB',
                    width: theme.spacing(12),
                    height: theme.spacing(12),
                    mx: 'auto',
                    mb: 2
                  }}
                >
                  {!member.profileImage && initials(member.fullName)}
                </Avatar>
                <Typography variant="h5" sx={{ color: '#2E3A59', fontWeight: 600 }}>
                  {member.fullName}
                </Typography>
                <Typography variant="subtitle2" color="primary">
                  {member.designation}
                </Typography>

                <Box display="flex" justifyContent="center" mt={2} mb={1}>
                  <Tooltip title={member.contact || 'No contact'} arrow>
                    <IconButton
                      color="primary"
                      component="a"
                      href={member.contact ? `tel:${member.contact}` : undefined}
                      disabled={!member.contact}
                    >
                      <PhoneIcon sx={{ color: '#2563EB' }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={member.email || 'No email'} arrow>
                    <IconButton
                      color="primary"
                      component="a"
                      href={member.email ? `mailto:${member.email}` : undefined}
                      disabled={!member.email}
                    >
                      <EmailIcon sx={{ color: '#2563EB' }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Info rows */}
              <Stack spacing={1.2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CalendarIcon sx={{ fontSize: 18, color: '#2563EB' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#2E3A59' }}>
                    Join Date:
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#4B5563' }}>
                    {fmtDateForDisplay(member.dateOfJoining)}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <ExperienceIcon sx={{ fontSize: 18, color: '#2563EB' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#2E3A59' }}>
                    Experience:
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#4B5563' }}>
                    {member.totalExperience || '—'}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <EmailIcon sx={{ fontSize: 18, color: '#2563EB' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#2E3A59' }}>
                    Email:
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#4B5563', wordBreak: 'break-all' }}>
                    {member.email || '—'}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <LocationIcon sx={{ fontSize: 18, color: '#2563EB' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#2E3A59' }}>
                    Location:
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#4B5563' }}>
                    {member.location || '—'}
                  </Typography>
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Edit Dialog */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            background: 'linear-gradient(90deg, #2563EB, #7C3AED)',
            color: '#fff',
            fontWeight: 700,
            py: 1.5,
            pr: 6,
            position: 'relative'
          }}
        >
          Edit Profile
          <IconButton
            onClick={() => setEditModalOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8, color: '#fff' }}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ bgcolor: '#fff' }}>
          {editMember && (
            <Stack spacing={3} mt={2}>
              {/* Avatar preview */}
              {/* <Box display="flex" alignItems="center" gap={2}>
                <Avatar
                  src={editMember.profileImage || undefined}
                  sx={{ width: 72, height: 72, bgcolor: 'primary.main', fontSize: 24 }}
                >
                  {initials(editMember.fullName)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={700} color="text.primary">
                    {editMember.fullName || '—'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Update profile details below.
                  </Typography>
                </Box>
              </Box> */}

              <Divider />

              {/* Form grid */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Full Name *"
                    value={editMember.fullName ?? ''}
                    onChange={(e) => setEditMember({ ...editMember, fullName: e.target.value })}
                    fullWidth
                    sx={textFieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon fontSize="small" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Designation"
                    value={editMember.designation ?? ''}
                    onChange={(e) => setEditMember({ ...editMember, designation: e.target.value })}
                    fullWidth
                    sx={textFieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <WorkOutlineIcon fontSize="small" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Contact"
                    value={editMember.contact ?? ''}
                    onChange={(e) => setEditMember({ ...editMember, contact: e.target.value })}
                    fullWidth
                    sx={textFieldSx}
                    placeholder="e.g., 9876543210"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIphoneIcon fontSize="small" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email *"
                    type="email"
                    value={editMember.email ?? ''}
                    onChange={(e) => setEditMember({ ...editMember, email: e.target.value })}
                    fullWidth
                    sx={textFieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MailOutlineIcon fontSize="small" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Location"
                    value={editMember.location ?? ''}
                    onChange={(e) => setEditMember({ ...editMember, location: e.target.value })}
                    fullWidth
                    sx={textFieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PlaceOutlinedIcon fontSize="small" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Experience"
                    value={editMember.totalExperience ?? ''}
                    onChange={(e) =>
                      setEditMember({ ...editMember, totalExperience: e.target.value })
                    }
                    fullWidth
                    sx={textFieldSx}
                    placeholder="e.g., 5 years"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <TimelineIcon fontSize="small" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Joining Date"
                    type="date"
                    value={editMember.dateOfJoining ? editMember.dateOfJoining.slice(0, 10) : ''}
                    onChange={(e) => setEditMember({ ...editMember, dateOfJoining: e.target.value })}
                    fullWidth
                    sx={textFieldSx}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonthIcon fontSize="small" />
                        </InputAdornment>
                      )
                    }}
                    helperText="YYYY-MM-DD"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Profile Image URL"
                    value={editMember.profileImage ?? ''}
                    onChange={(e) => setEditMember({ ...editMember, profileImage: e.target.value })}
                    fullWidth
                    sx={textFieldSx}
                    placeholder="https://…"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ImageIcon fontSize="small" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ bgcolor: '#F8FAFC', p: 2 }}>
          <Button
            onClick={() => setEditModalOpen(false)}
            sx={{ color: 'primary.main', fontWeight: 600, textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveChanges}
            disabled={!canSave}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              px: 2.5,
              borderRadius: 2,
              bgcolor: 'primary.main',
              '&:hover': { bgcolor: 'primary.dark' }
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TeamOverview;
