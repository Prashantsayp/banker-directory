// BankerEditDialog.tsx

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

  const handleMultiChange = (key: 'state' | 'city' | 'product', newVal: (string | any)[]) => {
    setBanker({
      ...banker,
      [key]: newVal
        .map((val) => (typeof val === 'string' ? val.trim() : ''))
        .filter(Boolean),
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      scroll="body"
    >
      <DialogTitle sx={{ color: '#fff', bgcolor: 'primary.main' }}>
        Edit Banker
      </DialogTitle>

      <DialogContent sx={{ bgcolor: '#F3F4F6' }}>
        <Paper
          elevation={0}
          sx={{
            p: isMobile ? 2 : 3,
            bgcolor: '#fff',
            borderRadius: 2
          }}
        >
          <Stack spacing={2}>
            {/* Basic Text Fields */}
            {[
              { label: 'Banker Name', key: 'bankerName' },
              { label: 'Associated With', key: 'associatedWith' },
              { label: 'Official Email', key: 'emailOfficial' },
              { label: 'Personal Email', key: 'emailPersonal' },
              { label: 'Contact', key: 'contact', type: 'tel' },
              // { label: 'Last / Current Designation', key: 'lastCurrentDesignation' }
            ].map(({ label, key, type }) => (
              <TextField
                key={key}
                label={label}
                type={type || 'text'}
                value={banker?.[key] ?? ''}
                onChange={(e) => handleInputChange(key, e.target.value)}
                fullWidth
                size={isMobile ? 'small' : 'medium'}
                variant="outlined"
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

            {/* State (string[]) */}
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              size={isMobile ? 'small' : 'medium'}
              value={banker?.state || []}
              onChange={(_e, newVal) => handleMultiChange('state', newVal)}
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
                      fontSize: '0.8rem',
                      maxWidth: '100%',
                      '& .MuiChip-label': {
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden'
                      },
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
                  label="State(s)"
                  placeholder="Type & press Enter to add"
                  fullWidth
                  size={isMobile ? 'small' : 'medium'}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#F9FAFB',
                      '& fieldset': { borderColor: '#60A5FA' },
                      '&:hover fieldset': { borderColor: '#3B82F6' },
                      '&.Mui-focused fieldset': { borderColor: '#2563EB' },
                      '& input': {
                        color: 'black'
                      }
                    },
                    '& .MuiInputLabel-root': { color: '#2563EB' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#2563EB' }
                  }}
                />
              )}
            />

            {/* City (string[]) */}
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              size={isMobile ? 'small' : 'medium'}
              value={banker?.city || []}
              onChange={(_e, newVal) => handleMultiChange('city', newVal)}
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
                      fontSize: '0.8rem',
                      maxWidth: '100%',
                      '& .MuiChip-label': {
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden'
                      },
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
                  label="City(ies)"
                  placeholder="Type & press Enter to add"
                  fullWidth
                  size={isMobile ? 'small' : 'medium'}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#F9FAFB',
                      '& fieldset': { borderColor: '#60A5FA' },
                      '&:hover fieldset': { borderColor: '#3B82F6' },
                      '&.Mui-focused fieldset': { borderColor: '#2563EB' },
                      '& input': {
                        color: 'black'
                      }
                    },
                    '& .MuiInputLabel-root': { color: '#2563EB' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#2563EB' }
                  }}
                />
              )}
            />

            {/* Product (string[]) */}
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              size={isMobile ? 'small' : 'medium'}
              value={banker?.product || []}
              onChange={(_e, newVal) => handleMultiChange('product', newVal)}
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
                      fontSize: '0.8rem',
                      maxWidth: '100%',
                      '& .MuiChip-label': {
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden'
                      },
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
                  placeholder="Type & press Enter to add"
                  fullWidth
                  size={isMobile ? 'small' : 'medium'}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#F9FAFB',
                      '& fieldset': { borderColor: '#60A5FA' },
                      '&:hover fieldset': { borderColor: '#3B82F6' },
                      '&.Mui-focused fieldset': { borderColor: '#2563EB' },
                      '& input': {
                        color: 'black'
                      }
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
