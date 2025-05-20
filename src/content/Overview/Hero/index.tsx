import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  styled
} from '@mui/material';

// Styled typography components
const TypographyH1 = styled(Typography)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(50)};
`
);

const TypographyH2 = styled(Typography)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(17)};
`
);

const LabelWrapper = styled(Box)(
  ({ theme }) => `
    background-color: ${theme.colors.success.main};
    color: ${theme.palette.success.contrastText};
    font-weight: bold;
    border-radius: 30px;
    text-transform: uppercase;
    display: inline-block;
    font-size: ${theme.typography.pxToRem(11)};
    padding: ${theme.spacing(0.5)} ${theme.spacing(1.5)};
    margin-bottom: ${theme.spacing(2)};
`
);

// 3D Button styling with reduced padding
const StyledButton = styled(Button)(
  ({ theme }) => `
    box-shadow: 0 4px ${theme.palette.grey[500]};
    padding: ${theme.spacing(1)} ${theme.spacing(3)}; /* Reduced padding */
    transition: all 0.2s ease-in-out;
    &:active {
      box-shadow: none;
      transform: translateY(4px);
    }
`
);

function Hero() {
  return (
    <>
      <Container maxWidth="lg" sx={{ textAlign: 'center', marginTop: '5rem' }}>
        <Grid
          spacing={{ xs: 6, md: 10 }}
          justifyContent="center"
          alignItems="center"
          container
        >
          <Grid item md={10} lg={8} mx="auto">
            <LabelWrapper color="success">Version 1.0.0</LabelWrapper>
            <TypographyH1 sx={{ mb: 2 }} variant="h1">
              Bankers Directory
            </TypographyH1>
            <TypographyH2
              sx={{ lineHeight: 1.5, pb: 4 }}
              variant="h4"
              color="text.secondary"
              fontWeight="normal"
            >
              "Your trusted gateway to the banking world. Discover institutions, connect with professionals, and build lasting networks in the financial industry."
            </TypographyH2>
            {/* 3D Buttons for Login */}
            <Box display="flex" justifyContent="center" gap={2}>
              <StyledButton
                size="large"
                variant="contained"
                href="/login"
                sx={{
                  backgroundColor: '#1a73e8',
                  color: '#fff',
                  '&:hover': { backgroundColor: '#155db2' }
                }}
              >
                Login as Admin
              </StyledButton>
              <StyledButton
                size="large"
                variant="contained"
                href="/login"
                sx={{
                  backgroundColor: '#34a853',
                  color: '#fff',
                  '&:hover': { backgroundColor: '#2c8c42' }
                }}
              >
                Login as User
              </StyledButton>
            </Box>
          </Grid>
        </Grid>
      </Container>
      {/* Footer with positioned copyright */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          width: '100%',
          textAlign: 'center',
          backgroundColor: '#0A1929',
          padding: 2,
          color: '#FFFFFF',
          fontSize: '0.875rem'
        }}
      >
        © 2025 - F2 Fintech Pvt. Ltd.
      </Box>
    </>
  );
}

export default Hero;