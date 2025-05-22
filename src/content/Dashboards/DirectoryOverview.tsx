import {
  Box,
  Grid,
  Typography,
  Avatar,
  Paper,
  Button,
  Chip,
  Divider,
  Stack
} from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

interface Banker {
  _id: string;
  bankerName: string;
  associatedWith: string;
  locationCategories: string[];
  emailOfficial: string;
  emailPersonal?: string;
  contact: string;
  product: string[]; // updated to match your backend
}

const BankerOverview = () => {
  const [bankers, setBankers] = useState<Banker[]>([]);
  const router = useRouter();

  useEffect(() => {
   axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/banker-directory/get-directories`)
      .then((res) => setBankers(res.data))
      .catch((err) => console.error('Error fetching bankers:', err));
  }, []);

  // const handleViewMore = (id: string) => {
  //   router.push(`/management/bankers/${id}`);
  // };

  return (
    <Grid container spacing={4} padding={2}>
      {bankers.map((banker) => (
        <Grid item xs={12} sm={6} md={4} key={banker._id}>
          <Paper elevation={6} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                {banker.bankerName.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h6">{banker.bankerName}</Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {banker.associatedWith}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Typography variant="subtitle2" gutterBottom>
              Location Categories:
            </Typography>
            <Stack direction="row" flexWrap="wrap" spacing={1} mb={2}>
              {banker.locationCategories.map((loc, index) => (
                <Chip key={index} label={loc} size="small" variant="outlined" />
              ))}
            </Stack>

            <Typography variant="subtitle2">Products:</Typography>
            <Stack direction="row" flexWrap="wrap" spacing={1} mb={2}>
              {(banker.product || []).map((prod, index) => (
                <Chip key={index} label={prod} size="small" color="success" variant="outlined" />
              ))}
            </Stack>

            <Box mb={1}>
              <Typography variant="body2" gutterBottom>
                <strong>Official Email:</strong> {banker.emailOfficial}
              </Typography>
              {banker.emailPersonal && (
                <Typography variant="body2" gutterBottom>
                  <strong>Personal Email:</strong> {banker.emailPersonal}
                </Typography>
              )}
              <Typography variant="body2">
                <strong>Contact:</strong> {banker.contact}
              </Typography>
            </Box>

            {/* <Button
              variant="contained"
              color="primary"
              size="small"
              fullWidth
              onClick={() => handleViewMore(banker._id)}
              sx={{ mt: 2 }}
            >
              View More Details
            </Button> */}
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default BankerOverview;
