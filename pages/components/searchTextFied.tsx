// SearchTextField.tsx
import * as React from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  icon?: React.ReactNode;
  maxWidth?: number;
  sxOverride?: any;     // extra sx to merge (e.g., same object you use for Autocomplete)
  height?: number;      // default 40 to match small Autocomplete
  primary?: string;     // accent color for icon/focus
};

const SearchTextField: React.FC<Props> = ({
  label,
  value,
  onChange,
  onClear,
  icon,
  maxWidth = 240,
  sxOverride,
  height = 40,
  primary = '#2563EB'
}) => {
  return (
    <TextField
      label={label}
      variant="outlined"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      size="small"          // matches Autocomplete small
      fullWidth
      sx={{
        mb: 1,
        maxWidth,
        minWidth: 220,

        // OUTER: label style
        '& .MuiInputLabel-root': {
          fontSize: 14,
          color: '#374151',
          fontWeight: 500,
          lineHeight: 1.1
        },
        '& .MuiInputLabel-root.Mui-focused': { color: primary },

        // FIELD: height + borders consistent with Autocomplete
        '& .MuiOutlinedInput-root': {
          height,
          borderRadius: 1.2,
          backgroundColor: '#F9FAFB',
          color: '#0B1220',
          paddingRight: 1, // room for clear icon
          '& fieldset': { borderColor: '#cbd5e1' },
          '&:hover fieldset': { borderColor: '#94a3b8' },
          '&.Mui-focused fieldset': { borderColor: primary }
        },

        // INPUT: vertical alignment so text aligns with Autocomplete
        '& .MuiOutlinedInput-input': {
          paddingTop: 0,
          paddingBottom: 0,
          height: height - 2 * 6,   // subtract default vertical paddings to center text
          lineHeight: `${height - 2 * 6}px`,
          fontSize: 14
        },

        // ADORNMENTS: icon + clear alignment and spacing
        '& .MuiInputAdornment-root': {
          marginTop: 0,
          maxHeight: height,
          '& svg': { verticalAlign: 'middle' }
        },
        '& .MuiInputAdornment-positionStart': {
          marginRight: 0.5,
          '& svg': { color: primary }
        },
        '& .MuiInputAdornment-positionEnd': {
          marginLeft: 0.25
        },

        ...sxOverride
      }}
      InputProps={{
        startAdornment: icon ? (
          <InputAdornment position="start">
            {icon}
          </InputAdornment>
        ) : undefined,
        endAdornment:
          onClear && value ? (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={onClear}
                edge="end"
                aria-label="clear"
                sx={{ p: 0.5 }} // tighter to align with small height
              >
                <ClearIcon fontSize="small" sx={{ color: '#9CA3AF' }} />
              </IconButton>
            </InputAdornment>
          ) : undefined
      }}
    />
  );
};

export default SearchTextField;
