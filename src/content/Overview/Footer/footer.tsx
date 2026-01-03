'use client';

import { Box, Container, Stack, Typography, IconButton, Link as MuiLink } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';

const SimpleFooter = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        bgcolor: '#4f46e5', // blue/purple strip
        color: '#fff',
        py: 2,
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14
      }}
    >
      <Container>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          {/* Left: Logo + text */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              component="img"
              src="/static/images/logo/f2.png" // 🔹 F2 logo
              alt="F2 Directory"
              sx={{ height: 28, width: 'auto', display: 'block' }}
            />
            <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
              © {new Date().getFullYear()} F2 Directory. All rights reserved.
            </Typography>
          </Stack>

          {/* Center: Social icons */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            <MuiLink
              href="https://www.facebook.com/f2fintech"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconButton size="small" sx={{ color: '#fff' }}>
                <FacebookIcon fontSize="small" />
              </IconButton>
            </MuiLink>

            <MuiLink
              href="https://www.instagram.com/f2fintech"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconButton size="small" sx={{ color: '#fff' }}>
                <InstagramIcon fontSize="small" />
              </IconButton>
            </MuiLink>

            <MuiLink
              href="https://www.linkedin.com/company/f2fintech"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconButton size="small" sx={{ color: '#fff' }}>
                <LinkedInIcon fontSize="small" />
              </IconButton>
            </MuiLink>

            <MuiLink
              href="https://www.youtube.com/channel/UCMyV4yKd27_Vx3Sq2FSDN5A"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconButton size="small" sx={{ color: '#fff' }}>
                <YouTubeIcon fontSize="small" />
              </IconButton>
            </MuiLink>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default SimpleFooter;
