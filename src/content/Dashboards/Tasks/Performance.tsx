import {
  Card,
  Box,
  CardContent,
  Typography,
  Avatar,
  useTheme,
  LinearProgress,
  styled
} from '@mui/material';
import AssignmentTurnedInTwoToneIcon from '@mui/icons-material/AssignmentTurnedInTwoTone';
import CancelPresentationTwoToneIcon from '@mui/icons-material/CancelPresentationTwoTone';
import { useEffect, useState } from 'react';
import axios from 'axios';

const RootWrapper = styled(Card)(
  ({ theme }) => `
    background: ${theme.colors.gradients.green1};
    color: ${theme.colors.alpha.white[100]};
`
);

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
    background-color: ${theme.colors.alpha.white[100]};
    color: ${theme.palette.success.contrastText};
    width: ${theme.spacing(8)};
    height: ${theme.spacing(8)};
    box-shadow: ${theme.colors.shadows.success};
`
);

const AvatarError = styled(Avatar)(
  ({ theme }) => `
    background-color: ${theme.colors.error.main};
    color: ${theme.palette.error.contrastText};
    width: ${theme.spacing(8)};
    height: ${theme.spacing(8)};
    box-shadow: ${theme.colors.shadows.error};
`
);

const TypographySecondary = styled(Typography)(
  ({ theme }) => `
    color: ${theme.colors.alpha.white[70]};
`
);

const LinearProgressWrapper = styled(LinearProgress)(
  ({ theme }) => `
    flex-grow: 1;
    margin-right: ${theme.spacing(1)};
    height: 10px;
    background-color: ${theme.colors.error.main};

    .MuiLinearProgress-barColorPrimary {
      background-color: ${theme.colors.alpha.white[100]};
      border-top-right-radius: ${theme.general.borderRadius};
      border-bottom-right-radius: ${theme.general.borderRadius};
    }
`
);

function Performance() {
  const theme = useTheme();

  const [bankerCount, setBankerCount] = useState(0);
  const [lenderCount, setLenderCount] = useState(0);

 useEffect(() => {
  const fetchCounts = async () => {
    try {
      const [lendersRes, bankersRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/lenders/get-lenders`),
        axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/directories/get-directories`)
      ]);

      // Debug: Show response structure
      console.log('Lenders Response:', lendersRes.data);
      console.log('Directories Response:', bankersRes.data);

      // Handles both direct array or nested under "data"
      const lendersData = Array.isArray(lendersRes.data)
        ? lendersRes.data
        : lendersRes.data.data;

      const bankersData = Array.isArray(bankersRes.data)
        ? bankersRes.data
        : bankersRes.data.data;

      setLenderCount(lendersData?.length || 0);
      setBankerCount(bankersData?.length || 0);
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  fetchCounts();
}, []);

  const total = bankerCount + lenderCount;
  const completionRate = total === 0 ? 0 : Math.round((lenderCount / total) * 100);

  return (
    <RootWrapper sx={{ p: 2 }}>
      <Typography
        variant="h3"
        sx={{
          px: 2,
          pb: 1,
          pt: 2,
          fontSize: `${theme.typography.pxToRem(23)}`,
          color: `${theme.colors.alpha.white[100]}`
        }}
      >
        Performance
      </Typography>
      <CardContent>
        <Box display="flex" px={2} pb={3} alignItems="center">
          <AvatarSuccess sx={{ mr: 2 }} variant="rounded">
            <AssignmentTurnedInTwoToneIcon fontSize="large" />
          </AvatarSuccess>
          <Box>
            <Typography variant="h1">{bankerCount}</Typography>
            <TypographySecondary variant="subtitle2" noWrap>
              Bankers Count
            </TypographySecondary>
          </Box>
        </Box>
        <Box display="flex" px={2} pb={3} alignItems="center">
          <AvatarError sx={{ mr: 2 }} variant="rounded">
            <CancelPresentationTwoToneIcon fontSize="large" />
          </AvatarError>
          <Box>
            <Typography variant="h1">{lenderCount}</Typography>
            <TypographySecondary variant="subtitle2" noWrap>
              Lenders Count
            </TypographySecondary>
          </Box>
        </Box>
        <Box pt={3}>
          <LinearProgressWrapper
            value={completionRate}
            color="primary"
            variant="determinate"
          />
        </Box>
      </CardContent>
    </RootWrapper>
  );
}

export default Performance;
