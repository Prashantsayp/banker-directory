import { Typography, Grid } from '@mui/material';

function PageHeader() {
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          Lenders
        </Typography>
        <Typography variant="subtitle2">
          Explore the complete list of lenders and their details below.
        </Typography>
      </Grid>
    </Grid>
  );
}

export default PageHeader;