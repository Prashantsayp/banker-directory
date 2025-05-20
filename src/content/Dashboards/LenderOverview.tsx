import {
  Box,
  Grid,
  Typography,
  Avatar,
  Paper,
  Button
} from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

interface Lender {
  _id: string;
  lenderName: string;
  state: string;
  city: string;
  managerName: string;
  rmName?: string; 
  rmContact?: string; 
}

const LenderOverview = () => {
  const [lenders, setLenders] = useState<Lender[]>([]);
  const router = useRouter();

  useEffect(() => {
    axios
    .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/lenders/get-lenders`)
      
      .then((res) => setLenders(res.data))
      .catch((err) => console.error('Error fetching lenders:', err));
  }, []);

  const handleViewMore = () => {
    router.push(`${process.env.NEXT_PUBLIC_BACKEND_URL}/management/lenders`)
  
    
  };

  return (
    <Grid container spacing={3}>
      {lenders.map((lender) => (
        <Grid item xs={12} sm={6} md={4} key={lender._id}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar sx={{ mr: 2 }}>{lender.lenderName.charAt(0)}</Avatar>
              <Box>
                <Typography variant="h6">{lender.lenderName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Location: {lender.state}
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" gutterBottom>
              <strong>RM/SM:</strong> {lender.rmName || 'N/A'} ({lender.rmContact || 'N/A'})
            </Typography>
            <Button
              variant="contained"
              size="small"
              onClick={handleViewMore}
              sx={{ mt: 1 }}
            >
              View More Details
            </Button>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default LenderOverview;
