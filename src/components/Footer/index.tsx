import { Box, Container, Link, Typography, styled } from '@mui/material';

const FooterWrapper = styled(Container)(
  ({ theme }) => `
        margin-top: ${theme.spacing(4)};
`
);

function Footer() {
  return (
    <FooterWrapper className="footer-wrapper">
      <Box
        pb={4}
        display={{ xs: 'block', md: 'flex' }}
        alignItems="center"
        textAlign={{ xs: 'center', md: 'left' }}
        justifyContent="space-between"
        
      >
        <Box>
          <Typography variant="subtitle1" sx={{color:"black"}}>
            &copy; 2025 - Bankers Directory Powered By: F2 Fintech Pvt. Ltd.
          </Typography>
        </Box>
        <Typography
          sx={{
            pt: { xs: 2, md: 0 }
          }}
          variant="subtitle1"
        >
          {/* Developed by{' '} */}
          <Link
            href="#"
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* Prashant */}
          </Link>
        </Typography>
      </Box>
    </FooterWrapper>
  );
}

export default Footer;
