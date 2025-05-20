import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Alert,
  Snackbar,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const DirectoryForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    // role: '',
    // avatar: '',
    profileImage: '',
    contact: '',
    location: '',
    designation: '',
    totalExperience: '',
    dateOfJoining: '',
    previousExperience: [
      {
        currentInstitutionName: '',
        // role: '',
        startDate: '',
        endDate: '',
        description: ''
      }
    ]
  });

  const [error, setError] = useState('');
  const [successOpen, setSuccessOpen] = useState(false);

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
          // role: '',
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
        // // role: '',
        // avatar: '',
        profileImage: '',
        contact: '',
        location: '',
        designation: '',
        totalExperience: '',
        dateOfJoining: '',
        previousExperience: [
          {
            currentInstitutionName: '',
            // role: '',
            startDate: '',
            endDate: '',
            description: ''
          }
        ]
      });
      setError('');
      onSuccess();
    } catch (err: any) {
      console.error('Submit error:', err.response?.data || err.message);
      const message = err?.response?.data?.message || 'Something went wrong';
      setError(Array.isArray(message) ? message.join(', ') : message);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Create Directory Entry
      </Typography>

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
          />
        </Grid>

        {['email',  'contact', 'location', 'designation'].map((field) => (
          <Grid item xs={12} sm={6} key={field}>
            <TextField
              fullWidth
              label={field.replace(/([A-Z])/g, ' $1')}
              name={field}
              value={form[field as keyof typeof form]}
              onChange={handleChange}
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
          />
        </Grid>

        {/* <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Avatar (optional)"
            name="avatar"
            value={form.avatar}
            onChange={handleChange}
          />
        </Grid> */}

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Total Experience"
            name="totalExperience"
            value={form.totalExperience}
            onChange={handleChange}
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
          />
        </Grid>

        {/* Previous Experience Section */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Previous Experience
          </Typography>
          {form.previousExperience.map((exp, index) => (
            <Box key={index} mb={3} borderLeft="3px solid #1976d2" pl={2} pb={2}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Institution"
                    fullWidth
                    value={exp.currentInstitutionName}
                    onChange={(e) =>
                      handleExperienceChange(index, 'currentInstitutionName', e.target.value)
                    }
                  />
                </Grid>
                {/* <Grid item xs={12} sm={6}>
                  <TextField
                    label="Role"
                    fullWidth
                    value={exp.role}
                    onChange={(e) =>
                      handleExperienceChange(index, 'role', e.target.value)
                    }
                  />
                </Grid> */}
                <Grid item xs={6} sm={3}>
                  <TextField
                    label="Start Date"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={exp.startDate}
                    onChange={(e) =>
                      handleExperienceChange(index, 'startDate', e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <TextField
                    label="End Date"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={exp.endDate}
                    onChange={(e) =>
                      handleExperienceChange(index, 'endDate', e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Designatation"
                    fullWidth
                    multiline
                    minRows={1}
                    value={exp.description}
                    onChange={(e) =>
                      handleExperienceChange(index, 'description', e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  {form.previousExperience.length > 1 && (
                    <IconButton onClick={() => removeExperience(index)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  )}
                </Grid>
              </Grid>
            </Box>
          ))}
          <Button variant="outlined" onClick={addExperience}>
            + Add Experience
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" onClick={handleSubmit}>
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
    </Box>
  );
};

export default DirectoryForm;