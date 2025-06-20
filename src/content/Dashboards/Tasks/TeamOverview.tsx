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
} from '@mui/material';
import {
  PhoneTwoTone as PhoneIcon,
  EmailTwoTone as EmailIcon,
  LocationOnTwoTone as LocationIcon,
  CalendarMonthTwoTone as CalendarIcon,
  WorkHistoryTwoTone as ExperienceIcon,
  EditTwoTone as EditIcon,
  DeleteTwoTone as DeleteIcon,
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

    const { _id, ...updateData } = editMember; // Remove _id from payload
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
        {members.map((member, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 3,
                position: 'relative',
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
                  src={member.profileImage}
                  alt={member.fullName}
                  sx={{
                    width: theme.spacing(12),
                    height: theme.spacing(12),
                    mx: 'auto',
                    mb: 2,
                    border: `3px solid ${theme.palette.primary.main}`,
                  }}
                />
                <Typography variant="h5" fontWeight={600}>
                  {member.fullName}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {member.designation}
                </Typography>
                <Box display="flex" justifyContent="center" mt={2} mb={1}>
                  <Tooltip title={member.contact || 'No contact'} arrow>
                    <IconButton color="primary">
                      <PhoneIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={member.email || 'No email'} arrow>
                    <IconButton color="primary">
                      <EmailIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Stack spacing={1}>
                <InfoRow icon={<CalendarIcon />} label="Join Date" value={new Date(member.dateOfJoining).toLocaleDateString()} />
                <InfoRow icon={<ExperienceIcon />} label="Experience" value={member.totalExperience} />
                <InfoRow icon={<EmailIcon />} label="Email" value={member.email} />
                <InfoRow icon={<LocationIcon />} label="Location" value={member.location} />
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
                value={editMember.dateOfJoining.slice(0, 10)}
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

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <Box display="flex" alignItems="center" gap={1}>
    <Box color="primary.main">{icon}</Box>
    <Typography variant="body2" fontWeight={500}>
      {label}:
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {value}
    </Typography>
  </Box>
);