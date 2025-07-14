import { TextField, InputAdornment } from '@mui/material';
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
}: SearchTextFieldProps) => {
  return (
    <TextField
      label={label}
      variant="outlined"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      sx={{
    mb: 1,
    maxWidth: 200,
    '& .MuiOutlinedInput-root': {
     color: 'primary.main',
      '& fieldset': {
        borderColor: 'primary.main' 
      },
      '&:hover fieldset': {
        borderColor: '#fff' 
      },
      '&.Mui-focused fieldset': {
        borderColor: '#fff' 
      }
    },
    '& .MuiInputLabel-root': {
      color: '#fff' 
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'primary.main' 
    }
  }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">{icon}</InputAdornment>
        ),
        endAdornment: value && (
          <ClearIcon
            onClick={onClear}
            sx={{ cursor: 'pointer', color: 'secondary.main' }}
          />
        )
      }}
      fullWidth
    />
  );
};

export default SearchTextField;