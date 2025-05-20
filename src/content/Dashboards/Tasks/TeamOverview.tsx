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
  Paper
} from '@mui/material';
import PhoneTwoToneIcon from '@mui/icons-material/PhoneTwoTone';
import EmailTwoToneIcon from '@mui/icons-material/EmailTwoTone';
import BusinessTwoToneIcon from '@mui/icons-material/BusinessTwoTone';
import LocationOnTwoToneIcon from '@mui/icons-material/LocationOnTwoTone';
import CalendarMonthTwoToneIcon from '@mui/icons-material/CalendarMonthTwoTone';
import WorkHistoryTwoToneIcon from '@mui/icons-material/WorkHistoryTwoTone';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Member {
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

const TeamOverview = () => {
  const theme = useTheme();
  const [members, setMembers] = useState<Member[]>([]);

 useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bankers/get-bankers`);
      setMembers(Array.isArray(res.data.data) ? res.data.data : res.data);
    } catch (error) {
      console.error('Error fetching directory:', error);
    }
  };

  fetchData();
}, []);

  return (
    <Grid container spacing={3}>
      {members.map((member, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 3,
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: theme.shadows[6]
              }
            }}
          >
            <Box textAlign="center">
              <Avatar
                src={member.profileImage}
                alt={member.fullName}
                sx={{
                  width: theme.spacing(12),
                  height: theme.spacing(12),
                  mx: 'auto',
                  mb: 2,
                  border: `3px solid ${theme.palette.primary.main}`
                }}
              />
              <Typography variant="h5" fontWeight={600}>
                {member.fullName}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                {member.designation} @ {member.currentInstitutionName}
              </Typography>

              <Box display="flex" justifyContent="center" mt={2} mb={1}>
                <Tooltip title={member.contact || 'No contact'} arrow>
                  <IconButton color="primary">
                    <PhoneTwoToneIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={member.email || 'No email'} arrow>
                  <IconButton color="primary">
                    <EmailTwoToneIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Stack spacing={1}>
              <InfoRow icon={<CalendarMonthTwoToneIcon />} label="Join Date" value={new Date(member.dateOfJoining).toLocaleDateString()} />
              <InfoRow icon={<WorkHistoryTwoToneIcon />} label="Experience" value={member.totalExperience} />
              <InfoRow icon={<BusinessTwoToneIcon />} label="Bank" value={member.bankName} />
              <InfoRow icon={<EmailTwoToneIcon />} label="Email" value={member.email} />
              <InfoRow icon={<LocationOnTwoToneIcon />} label="Location" value={member.location} />
            </Stack>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default TeamOverview;

const InfoRow = ({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => {
  return (
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
};