import { Box, styled } from '@mui/material';
import Link from 'src/components/Link';

const LogoWrapper = styled(Link)(
  ({ theme }) => `
        color: ${theme.palette.text.primary};
        padding: ${theme.spacing(0, 1, 0, 0)};
        display: flex;
        text-decoration: none;
        font-weight: ${theme.typography.fontWeightBold};

        &:hover {
          text-decoration: none;
        }
`
);

// const LogoImage = styled('img')(
//   () => `
//         max-width: 100%;
//         height: auto;
//         object-fit: contain;
//         border-radius: 8px;
// `
// );

function Logo() {
  return (
    <LogoWrapper href="/">
      {/* <LogoImage
        src="/static/images/logo/f2fin.png"
        alt="Logo"
      /> */}
      <Box
        component="span"
        sx={{
          display: { xs: 'none', sm: 'inline-block' },
          marginLeft: 1,
        }}
      >
        
          <Box
            sx={{
              background: (theme) => theme.palette.success.main,
              color: (theme) => theme.palette.success.contrastText,
              padding: (theme) => theme.spacing(0.4, 1),
              borderRadius: (theme) => theme.general.borderRadiusSm,
              textAlign: 'center',
              display: 'inline-block',
              lineHeight: 1,
              fontSize: (theme) => theme.typography.pxToRem(11),
            }}
          >
            1.0
          </Box>
       
        {/* <Box
          sx={{
            fontSize: (theme) => theme.typography.pxToRem(15),
            fontWeight: (theme) => theme.typography.fontWeightBold,
          }}
        >
          Bankers Directory
        </Box> */}
      </Box>
    </LogoWrapper>
  );
}

export default Logo;