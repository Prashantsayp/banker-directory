import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Chip,
  Autocomplete,
  useTheme,
  useMediaQuery,
  Paper
} from '@mui/material';

interface BankerEditDialogProps {
  open: boolean;
  onClose: () => void;
  banker: any;
  setBanker: (data: any) => void;
  onSave: () => void;
  loading: boolean;
}

const BankerEditDialog: React.FC<BankerEditDialogProps> = ({
  open,
  onClose,
  banker,
  setBanker,
  onSave,
  loading
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleInputChange = (key: string, value: string) => {
    setBanker({ ...banker, [key]: value });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth scroll="body">
      <DialogTitle sx={{ color: '#fff', bgcolor: 'primary.main' }}>
    Edit Banker
  </DialogTitle>
      <DialogContent sx={{ bgcolor: '#F3F4F6' }}>
        <Paper elevation={0} sx={{ p: isMobile ? 2 : 3, bgcolor: '#fff', borderRadius: 2 }}>
          <Stack spacing={2}>
            {[
              { label: 'Banker Name', key: 'bankerName' },
              { label: 'Associated With', key: 'associatedWith' },
              { label: 'Official Email', key: 'emailOfficial' },
              { label: 'Personal Email', key: 'emailPersonal' },
              { label: 'Contact', key: 'contact' }
            ].map(({ label, key }) => (
              <TextField
                key={key}
                label={label}
                value={banker?.[key] ?? ''}
                onChange={(e) => handleInputChange(key, e.target.value)}
                fullWidth
                variant="outlined"
                size="medium"
                 sx={{
            '& .MuiOutlinedInput-root': {
              color: '#000',
              backgroundColor: '#F9FAFB',
              '& fieldset': { borderColor: '#60A5FA' },
              '&:hover fieldset': { borderColor: '#3B82F6' },
              '&.Mui-focused fieldset': { borderColor: '#2563EB' }
            },
            '& .MuiInputLabel-root': { color: '#2563EB' },
            '& .MuiInputLabel-root.Mui-focused': { color: '#2563EB' }
          }}
              />
            ))}

     <Autocomplete
  multiple
  freeSolo
  options={[]}
  value={banker?.product || []}
  onChange={(_e, newVal) =>
    setBanker({
      ...banker,
      product: newVal
        .map((val) => (typeof val === 'string' ? val.trim() : ''))
        .filter(Boolean),
    })
  }
  renderTags={(value, getTagProps) =>
    value.map((option, index) => (
      <Chip
        key={option + index}
        label={option}
        {...getTagProps({ index })}
        sx={{
          backgroundColor: '#1873dbff',
          color: '#FFFFFF',
          borderRadius: '8px',
          fontWeight: 500,
          fontSize: '0.85rem',
          '& .MuiChip-deleteIcon': {
            color: '#FFFFFF',
            '&:hover': { color: '#E0E7FF' },
          },
        }}
      />
    ))
  }
  renderInput={(params) => (
    <TextField
      {...params}
      label="Products"
      fullWidth
      sx={{
        '& .MuiOutlinedInput-root': {
          bgcolor: '#F9FAFB',
          '& fieldset': { borderColor: '#60A5FA' },
          '&:hover fieldset': { borderColor: '#3B82F6' },
          '&.Mui-focused fieldset': { borderColor: '#2563EB' },
          '& input': {
            color: 'black', // input text color while typing
          },
        },
        '& .MuiInputLabel-root': { color: '#2563EB' },
        '& .MuiInputLabel-root.Mui-focused': { color: '#2563EB' },
      }}
    />
  )}
/>

 
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={banker?.locationCategories || []}
              onChange={(_e, newVal) =>
                setBanker({
                  ...banker,
                  locationCategories: newVal.map((val) => (typeof val === 'string' ? val.trim() : '')).filter(Boolean)
                })
              }
     renderTags={(value, getTagProps) =>
  value.map((option, index) => (
    <Chip
      key={option + index}
      label={option}
      {...getTagProps({ index })}
      sx={{
        backgroundColor: '#1873dbff', 
        color: '#fff',         
        borderRadius: '8px',
        fontWeight: 500,
        fontSize: '0.85rem',
      '& .MuiChip-deleteIcon': {
            color: '#FFFFFF',
            '&:hover': { color: '#E0E7FF' },
          },
      }}
    />
  ))
}

              
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Location Categories"
                  fullWidth
                     sx={{
        '& .MuiOutlinedInput-root': {
          color: '#1F2937',
          backgroundColor: '#F9FAFB',
          '& fieldset': { borderColor: '#60A5FA' },
          '&:hover fieldset': { borderColor: '#3B82F6' },
          '&.Mui-focused fieldset': { borderColor: '#2563EB' }
        },
        '& .MuiInputLabel-root': { color: '#2563EB' },
        '& .MuiInputLabel-root.Mui-focused': { color: '#2563EB' }
      }}
                />
              )}
            />
          </Stack>
        </Paper>
      </DialogContent>

      <DialogActions sx={{ bgcolor: '#F3F4F6', px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined" color="primary">
          Cancel
        </Button>
        <Button
          onClick={onSave}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BankerEditDialog;
