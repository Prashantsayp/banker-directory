import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  styled
} from '@mui/material';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const TypographyH1 = styled(Typography)(({ theme }) => ({
  fontSize: '3.5rem',
  fontWeight: 700,
  lineHeight: 1.2,
  color: '#0f172a',
  [theme.breakpoints.down('md')]: {
    fontSize: '2.5rem',
    textAlign: 'center'
  }
}));

const TypographyH2 = styled(Typography)(({ theme }) => ({
  fontSize: '1.25rem',
  color: '#475569',
  maxWidth: '36rem',
  fontWeight: 400,
  [theme.breakpoints.down('md')]: {
    textAlign: 'center',
    margin: '0 auto'
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: `${theme.spacing(1.2)} ${theme.spacing(4)}`,
  borderRadius: 50,
  fontWeight: 600,
  fontSize: '1rem',
  textTransform: 'none',
  transition: 'all 0.3s ease',
  boxShadow: '0px 4px 10px rgba(0,0,0,0.05)',
  '&:hover': {
    backgroundColor: 'transparent',
    color: theme.palette.primary.main,
    border: `1px solid ${theme.palette.primary.main}`
  }
}));

const RotatingCircle = styled(motion.div)(({ theme }) => ({
  width: 32,
  height: 32,
  borderRadius: '50%',
  border: `4px solid ${theme.palette.primary.light}`,
  borderTop: `4px solid ${theme.palette.primary.dark}`,
  backgroundColor: 'transparent',
  marginBottom: theme.spacing(0.5)
}));

function HeroBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 300); }, []);

  return (
    <Box sx={{
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(to right, #a8cff8 0%, #cde7f9 30%, #f9fcff 100%)',
      py: { xs: 8, md: 12 }
    }}>
      {/* Background Circles */}
      <motion.div style={{
        position: 'absolute', top: '20%', left: '5%', width: 80, height: 80, borderRadius: '50%', backgroundColor: '#dbeafe', zIndex: 0
      }} animate={{ y: [0, -20, 0] }} transition={{ duration: 6, repeat: Infinity }} />
      <motion.div style={{
        position: 'absolute', top: 0, left: '50%', width: 20, height: 20, borderRadius: '50%', backgroundColor: '#60a5fa', zIndex: 2
      }} animate={{ x: [0, 40, 80, 40, 0, -40, -80, -40, 0], y: [-80, -40, 0, 40, 80, 40, 0, -40, -80] }} transition={{ duration: 6, ease: 'linear', repeat: Infinity }} />
      <motion.div style={{
        position: 'absolute', bottom: '15%', right: '10%', width: 120, height: 120, borderRadius: '50%', backgroundColor: '#eff6ff', zIndex: 0
      }} animate={{ y: [0, 15, 0] }} transition={{ duration: 8, repeat: Infinity }} />

      <Container sx={{ position: 'relative', zIndex: 1 }}>
        {/* Decorative SVGs */}
        <Box component="img" src="/static/images/overview/star.svg" alt="Star" sx={{ position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)', width: 90, height: 90, opacity: 0.2, zIndex: 0 }} />
        <Box component="img" src="/static/images/overview/lineone.svg" alt="Line" sx={{ position: 'absolute', top: 60, left: '50%', transform: 'translateX(-50%)', width: 200, height: 120, opacity: 0.1, zIndex: 0 }} />
        <Box component="img" src="/static/images/overview/linetwo.svg" alt="Bottom" sx={{ position: 'absolute', bottom: -40, right: 0, width: 160, height: 120, opacity: 0.08, zIndex: 0 }} />

        <Grid container spacing={{ xs: 4, md: 4 }} alignItems="center">
          {/* Left */}
          <Grid item xs={12} md={6}>
            <motion.div initial={{ opacity: 0, x: -40 }} animate={show ? { opacity: 1, x: 0 } : {}} transition={{ duration: 1 }}>
              <RotatingCircle animate={{
                rotate: 360,
                boxShadow: [
                  `0 0 0 0 #60a5fa`,
                  `0 0 0 10px rgba(96,165,250,0)`,
                  `0 0 0 0 #60a5fa`
                ]
              }} transition={{
                rotate: { repeat: Infinity, duration: 6, ease: 'linear' },
                boxShadow: { repeat: Infinity, duration: 2, ease: 'easeInOut' }
              }} />
              <TypographyH1>Your Gateway to India’s Banking Network</TypographyH1>
              <TypographyH2 sx={{ mt: 2 }}>
                Explore a verified directory of bankers, loan officers, NBFC representatives, and financial partners.
              </TypographyH2>
              <motion.div animate={{ y: [0, -2, 0, 2, 0] }} transition={{ duration: 6, repeat: Infinity }}>
                <Box display="flex" flexWrap="wrap" gap={2} mt={4} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                  <StyledButton variant="contained" color="primary" href="/login">Login as Admin</StyledButton>
                  <StyledButton variant="contained" color="success" href="/login">Login as User</StyledButton>
                </Box>
              </motion.div>
            </motion.div>
          </Grid>

          {/* Right Image */}
          <Grid item xs={12} md={6}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={show ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 1.2 }}>
              <Box sx={{
                width: '100%', height: { xs: 300, md: 450 }, borderRadius: 4, overflow: 'hidden',
                boxShadow: '0px 10px 30px rgba(0,0,0,0.1)'
              }}>
                <img
                  src="https://directorist.com/blog/wp-content/uploads/sites/6/2022/03/How-to-Create-a-Directory-Website-in-WordPress-970x588.jpg"
                  alt="Hero"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default HeroBanner;
