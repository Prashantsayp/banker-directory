import { TextField, InputAdornment, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

interface SearchTextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  icon: React.ReactNode;
  maxWidth?: number;
}

const SearchTextField = ({
  label,
  value,
  onChange,
  onClear,
  icon,
  maxWidth = 220
}: SearchTextFieldProps) => {
  return (
    <TextField
      label={label}
      variant="outlined"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
      sx={{
        mb: 1,
        maxWidth,
        '& .MuiOutlinedInput-root': {
          fontSize: '0.9rem',
          color: '#1f2937', // text-gray-800
          backgroundColor: '#f9fafb',
          borderRadius: 1.5,
          paddingRight: '8px',
          '& fieldset': {
            borderColor: '#cbd5e1' // light border
          },
          '&:hover fieldset': {
            borderColor: '#94a3b8' // darker on hover
          },
          '&.Mui-focused fieldset': {
            borderColor: '#2563EB' // blue on focus
          }
        },
        '& .MuiInputLabel-root': {
          fontSize: '0.85rem',
          color: '#374151', // gray-700
          fontWeight: 500
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: '#2563EB' // primary on focus
        }
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start" sx={{ fontSize: '1rem' }}>
            {icon}
          </InputAdornment>
        ),
        endAdornment: value && (
          <InputAdornment position="end">
            <IconButton size="small" onClick={onClear}>
              <ClearIcon fontSize="small" sx={{ color: '#9ca3af' }} />
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  );
};

export default SearchTextField;
