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
  TextField
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
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Member {
  _id: string;
  fullName: string;
  profileImage: string;
  designation: string;
  currentInstitutionName: string;
  dateOfJoining: string;
  totalExperience: string;
  contact: string;
  email: string;
  location: string;
  bankName: string;
}

const TeamOverview = ({ userRole = 'admin' }: { userRole?: 'admin' | 'user' }) => {
  const theme = useTheme();
  const [members, setMembers] = useState<Member[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editMember, setEditMember] = useState<Member | null>(null);

  const fetchMembers = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bankers/get-bankers`);
      setMembers(Array.isArray(res.data.data) ? res.data.data : res.data);
    } catch (error) {
      console.error('Error fetching directory:', error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleEdit = (member: Member) => {
    setEditMember(member);
    setEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this profile?')) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bankers/delete-bankers/${id}`);
        fetchMembers();
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  const handleSaveChanges = async () => {
    if (!editMember) return;
    const { _id, ...updateData } = editMember;
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bankers/update-bankers/${_id}`, updateData);
      fetchMembers();
      setEditModalOpen(false);
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

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
                  boxShadow: theme.shadows[6],
                },
              }}
            >
              {/* Action Buttons */}
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

              {/* Member Details */}
              <Box textAlign="center">
                <Avatar
                  src={member.profileImage || undefined}
                  alt={member.fullName}
                  sx={{
                    bgcolor: '#2563EB',
                    width: theme.spacing(12),
                    height: theme.spacing(12),
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  {!member.profileImage && member.fullName?.[0]}
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
                    {member.dateOfJoining ? new Date(member.dateOfJoining).toLocaleDateString() : '—'}
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
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          {editMember && (
            <Stack spacing={2} mt={2}>
              <TextField
                label="Full Name"
                value={editMember.fullName}
                onChange={(e) => setEditMember({ ...editMember, fullName: e.target.value })}
                fullWidth
              />
              <TextField
                label="Designation"
                value={editMember.designation}
                onChange={(e) => setEditMember({ ...editMember, designation: e.target.value })}
                fullWidth
              />
              <TextField
                label="Institution"
                value={editMember.currentInstitutionName}
                onChange={(e) => setEditMember({ ...editMember, currentInstitutionName: e.target.value })}
                fullWidth
              />
              <TextField
                label="Contact"
                value={editMember.contact}
                onChange={(e) => setEditMember({ ...editMember, contact: e.target.value })}
                fullWidth
              />
              <TextField
                label="Email"
                value={editMember.email}
                onChange={(e) => setEditMember({ ...editMember, email: e.target.value })}
                fullWidth
              />
              <TextField
                label="Location"
                value={editMember.location}
                onChange={(e) => setEditMember({ ...editMember, location: e.target.value })}
                fullWidth
              />
              <TextField
                label="Experience"
                value={editMember.totalExperience}
                onChange={(e) => setEditMember({ ...editMember, totalExperience: e.target.value })}
                fullWidth
              />
              <TextField
                label="Joining Date"
                type="date"
                value={editMember.dateOfJoining ? editMember.dateOfJoining.slice(0, 10) : ''}
                onChange={(e) => setEditMember({ ...editMember, dateOfJoining: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true }}
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

export default TeamOverview;
