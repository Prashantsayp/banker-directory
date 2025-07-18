// components/FullScreenLoader.tsx
import { CircularProgress, Backdrop } from '@mui/material';

const FullScreenLoader = ({ open }: { open: boolean }) => (
  <Backdrop
    open={open}
    sx={{
      zIndex: (theme) => theme.zIndex.drawer + 1,
      color: '#fff',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    }}
  >
    <CircularProgress color="inherit" />
  </Backdrop>
);

export default FullScreenLoader;