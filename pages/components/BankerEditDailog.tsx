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
  Paper,
  IconButton,
  InputAdornment
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import CategoryIcon from '@mui/icons-material/Category';
import PlaceIcon from '@mui/icons-material/Place';

interface BankerEditDialogProps {
  open: boolean;
  onClose: () => void;
  banker: any;
  setBanker: (data: any) => void;
  onSave: () => void;
  loading: boolean;
}

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    color: '#111827',
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    '& fieldset': { borderColor: '#E5E7EB' },
    '&:hover fieldset': { borderColor: '#93C5FD' },
    '&.Mui-focused fieldset': { borderColor: '#2563EB', boxShadow: '0 0 0 2px rgba(37,99,235,.15)' }
  },
  '& .MuiInputLabel-root': { color: '#2563EB' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#2563EB' }
} as const;

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

  const uniq = (arr: string[]) => Array.from(new Set(arr.map((s) => s.trim()).filter(Boolean)));

  const canSave =
    !!banker?.bankerName?.trim() &&
    !!banker?.associatedWith?.trim(); // align with your backend upsert rules

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="body">
      <DialogTitle
        sx={{
          background: 'linear-gradient(90deg, #2563EB, #7C3AED)',
          color: '#fff',
          fontWeight: 700,
          py: 1.5,
          pr: 6,
          position: 'relative'
        }}
      >
        Edit Banker
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: '#fff' }}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ bgcolor: '#F3F4F6' }}>
        <Paper elevation={0} sx={{ p: isMobile ? 2 : 3, bgcolor: '#fff', borderRadius: 2 }}>
          <Stack spacing={2}>
            <TextField
              label="Banker Name *"
              value={banker?.bankerName ?? ''}
              onChange={(e) => handleInputChange('bankerName', e.target.value)}
              fullWidth
              variant="outlined"
              size="medium"
              sx={fieldSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon fontSize="small" />
                  </InputAdornment>
                )
              }}
            />

            <TextField
              label="Associated With *"
              value={banker?.associatedWith ?? ''}
              onChange={(e) => handleInputChange('associatedWith', e.target.value)}
              fullWidth
              variant="outlined"
              size="medium"
              sx={fieldSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BusinessIcon fontSize="small" />
                  </InputAdornment>
                )
              }}
            />

            <TextField
              label="Official Email"
              type="email"
              value={banker?.emailOfficial ?? ''}
              onChange={(e) => handleInputChange('emailOfficial', e.target.value)}
              fullWidth
              variant="outlined"
              size="medium"
              sx={fieldSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutlineIcon fontSize="small" />
                  </InputAdornment>
                )
              }}
            />

            <TextField
              label="Personal Email"
              type="email"
              value={banker?.emailPersonal ?? ''}
              onChange={(e) => handleInputChange('emailPersonal', e.target.value)}
              fullWidth
              variant="outlined"
              size="medium"
              sx={fieldSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutlineIcon fontSize="small" />
                  </InputAdornment>
                )
              }}
            />

            <TextField
              label="Contact"
              value={banker?.contact ?? ''}
              onChange={(e) => handleInputChange('contact', e.target.value)}
              fullWidth
              variant="outlined"
              size="medium"
              sx={fieldSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocalPhoneIcon fontSize="small" />
                  </InputAdornment>
                )
              }}
            />

            {/* Products */}
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              filterSelectedOptions
              value={banker?.product || []}
              onChange={(_e, newVal) =>
                setBanker({
                  ...banker,
                  product: uniq(newVal.map((v) => (typeof v === 'string' ? v : '')))
                })
              }
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    key={option + index}
                    label={option}
                    {...getTagProps({ index })}
                    sx={{
                      bgcolor: '#2563EB',
                      color: '#FFFFFF',
                      borderRadius: '8px',
                      fontWeight: 500,
                      fontSize: '0.85rem',
                      '& .MuiChip-deleteIcon': {
                        color: '#FFFFFF',
                        '&:hover': { color: '#E0E7FF' }
                      }
                    }}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Products"
                  placeholder="Type and press Enter to add"
                  fullWidth
                  sx={fieldSx}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <InputAdornment position="start">
                          <CategoryIcon fontSize="small" />
                        </InputAdornment>
                        {params.InputProps.startAdornment}
                      </>
                    )
                  }}
                />
              )}
            />

            {/* Location Categories */}
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              filterSelectedOptions
              value={banker?.locationCategories || []}
              onChange={(_e, newVal) =>
                setBanker({
                  ...banker,
                  locationCategories: uniq(newVal.map((v) => (typeof v === 'string' ? v : '')))
                })
              }
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    key={option + index}
                    label={option}
                    {...getTagProps({ index })}
                    sx={{
                      bgcolor: '#0EA5E9',
                      color: '#fff',
                      borderRadius: '8px',
                      fontWeight: 500,
                      fontSize: '0.85rem',
                      '& .MuiChip-deleteIcon': {
                        color: '#FFFFFF',
                        '&:hover': { color: '#E0E7FF' }
                      }
                    }}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Location Categories"
                  placeholder="Type and press Enter to add"
                  fullWidth
                  sx={fieldSx}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <InputAdornment position="start">
                          <PlaceIcon fontSize="small" />
                        </InputAdornment>
                        {params.InputProps.startAdornment}
                      </>
                    )
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
          disabled={loading || !canSave}
          sx={{ textTransform: 'none', fontWeight: 700 }}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BankerEditDialog;
