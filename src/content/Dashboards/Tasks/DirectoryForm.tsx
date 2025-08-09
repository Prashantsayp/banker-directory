import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Alert,
  Snackbar,
  IconButton,
  Paper,
  Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const DirectoryForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    profileImage: '',
    contact: '',
    location: '',
    designation: '',
    totalExperience: '',
    dateOfJoining: '',
    previousExperience: [
      {
        currentInstitutionName: '',
        startDate: '',
        endDate: '',
        description: ''
      }
    ]
  });

  const [error, setError] = useState('');
  const [successOpen, setSuccessOpen] = useState(false);

  const commonTextFieldStyles = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#ccc',
        borderRadius: 2
      },
      '&:hover fieldset': {
        borderColor: '#aaa'
      },
      '&.Mui-focused fieldset': {
        borderColor: '#1976d2',
        boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.1)'
      }
    },
    '& .MuiInputLabel-root': {
      color: '#666'
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#1976d2'
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleExperienceChange = (index: number, field: string, value: string) => {
    const updatedExperience = [...form.previousExperience];
    updatedExperience[index][field as keyof typeof updatedExperience[0]] = value;
    setForm({ ...form, previousExperience: updatedExperience });
  };

  const addExperience = () => {
    setForm((prev) => ({
      ...prev,
      previousExperience: [
        ...prev.previousExperience,
        {
          currentInstitutionName: '',
          startDate: '',
          endDate: '',
          description: ''
        }
      ]
    }));
  };

  const removeExperience = (index: number) => {
    const updatedExperience = form.previousExperience.filter((_, i) => i !== index);
    setForm({ ...form, previousExperience: updatedExperience });
  };

  const handleSubmit = async () => {
    if (!form.fullName.trim()) {
      setError('Full Name is required.');
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/bankers/create-banker`,
        form
      );

      console.log('Directory created:', res.data);

      setSuccessOpen(true);
      setForm({
        fullName: '',
        email: '',
        profileImage: '',
        contact: '',
        location: '',
        designation: '',
        totalExperience: '',
        dateOfJoining: '',
        previousExperience: [
          {
            currentInstitutionName: '',
            startDate: '',
            endDate: '',
            description: ''
          }
        ]
      });
      setError('');
      onSuccess();
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Something went wrong';
      setError(Array.isArray(message) ? message.join(', ') : message);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 900, margin: '0 auto', backgroundColor: '#fff', borderRadius: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#222' }}>
        Add banker Entry
      </Typography>
      <Divider sx={{ mb: 2}} />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="Full Name"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            sx={commonTextFieldStyles}
            inputProps={{ style: { color: '#333' } }}
          />
        </Grid>

        {['email', 'contact', 'location', 'designation'].map((field) => (
          <Grid item xs={12} sm={6} key={field}>
            <TextField
              fullWidth
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              name={field}
              value={form[field as keyof typeof form]}
              onChange={handleChange}
              sx={commonTextFieldStyles}
              inputProps={{ style: { color: '#333' } }}
            />
          </Grid>
        ))}

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Profile Image URL"
            name="profileImage"
            value={form.profileImage}
            onChange={handleChange}
            sx={commonTextFieldStyles}
            inputProps={{ style: { color: '#333' } }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Total Experience"
            name="totalExperience"
            value={form.totalExperience}
            onChange={handleChange}
            sx={commonTextFieldStyles}
            inputProps={{ style: { color: '#333' } }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Date of Joining"
            type="date"
            name="dateOfJoining"
            InputLabelProps={{ shrink: true }}
            value={form.dateOfJoining}
            onChange={handleChange}
            sx={commonTextFieldStyles}
            inputProps={{ style: { color: '#333' } }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
            Previous Experience
          </Typography>
          {form.previousExperience.map((exp, index) => (
            <Box
              key={index}
              mb={3}
              p={2}
              borderLeft="4px solid #9619f0"
              borderRadius={1}
              bgcolor="#f5f5f5"
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Institution"
                    value={exp.currentInstitutionName}
                    onChange={(e) =>
                      handleExperienceChange(index, 'currentInstitutionName', e.target.value)
                    }
                    sx={commonTextFieldStyles}
                    inputProps={{ style: { color: '#333' } }}
                  />
                </Grid>

                <Grid item xs={6} sm={3}>
                  <TextField
                    fullWidth
                    label="Start Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={exp.startDate}
                    onChange={(e) =>
                      handleExperienceChange(index, 'startDate', e.target.value)
                    }
                    sx={commonTextFieldStyles}
                    inputProps={{ style: { color: '#333' } }}
                  />
                </Grid>

                <Grid item xs={6} sm={3}>
                  <TextField
                    fullWidth
                    label="End Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={exp.endDate}
                    onChange={(e) =>
                      handleExperienceChange(index, 'endDate', e.target.value)
                    }
                    sx={commonTextFieldStyles}
                    inputProps={{ style: { color: '#333' } }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Designation / Role Description"
                    multiline
                    minRows={2}
                    value={exp.description}
                    onChange={(e) =>
                      handleExperienceChange(index, 'description', e.target.value)
                    }
                    sx={commonTextFieldStyles}
                    inputProps={{ style: { color: '#333' } }}
                  />
                </Grid>

                {form.previousExperience.length > 1 && (
                  <Grid item xs={12}>
                    <IconButton onClick={() => removeExperience(index)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Grid>
                )}
              </Grid>
            </Box>
          ))}
          <Button variant="outlined" onClick={addExperience} sx={{ mt: 1 }}>
            + Add Experience
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            fullWidth
            sx={{ mt: 2, backgroundColor: 'primary.main', '&:hover': { backgroundColor: 'primary.main' } }}
          >
            Submit
          </Button>
        </Grid>
      </Grid>

      <Snackbar
        open={successOpen}
        autoHideDuration={3000}
        onClose={() => setSuccessOpen(false)}
        message="Directory created successfully!"
      />
    </Paper>
  );
};

export default DirectoryForm;