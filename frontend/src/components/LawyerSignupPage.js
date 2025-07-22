import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Paper, 
  Box,
  FormHelperText,
  InputLabel,
  CircularProgress
} from '@mui/material';

const LawyerSignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    dateOfBirth: '',
    barRegistrationId: '',
    governmentIdProof: null,
    lawyerIdProof: null
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (name === 'email') {
      setIsEmailVerified(false);
      setCodeSent(false);
    }

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    
    if (files.length > 0) {
      const file = files[0];
      
      if (file.type !== 'application/pdf') {
        setErrors({
          ...errors,
          [name]: 'Only PDF files are allowed'
        });
        return;
      }
      
      setFormData({
        ...formData,
        [name]: file
      });
      
      if (errors[name]) {
        setErrors({
          ...errors,
          [name]: null
        });
      }
    }
  };

  const handleSendVerificationCode = async () => {
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors({ ...errors, email: 'Please enter a valid email address' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('${process.env.REACT_APP_API_BASE_URL}/api/users/send_email_verification/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      if (!response.ok) {
        throw new Error('Failed to send verification code');
      }

      setCodeSent(true);
      setErrors({ ...errors, email: null });
      alert('Verification code sent to your email');
    } catch (error) {
      setErrors({ ...errors, email: error.message });
    }
    setLoading(false);
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      alert('Please enter verification code');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/verify_email_otp/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          otp: verificationCode
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      setIsEmailVerified(true);
      alert('Email verified successfully!');
    } catch (error) {
      setErrors({ ...errors, email: error.message });
      setIsEmailVerified(false);
    }
    setLoading(false);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isEmailVerified) {
      newErrors.email = 'Email must be verified';
    }
    
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Mobile number must be 10 digits';
    }
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }
    
    if (!formData.barRegistrationId.trim()) {
      newErrors.barRegistrationId = 'BAR registration ID is required';
    }
    
    if (!formData.governmentIdProof) {
      newErrors.governmentIdProof = 'Government ID proof is required';
    }
    
    if (!formData.lawyerIdProof) {
      newErrors.lawyerIdProof = 'Lawyer ID proof is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const data = new FormData();
      data.append('Full_Name', formData.fullName);
      data.append('Email_ID', formData.email);
      data.append('Mobile_Number', formData.mobileNumber);
      data.append('Date_of_Birth', formData.dateOfBirth);
      data.append('BAR_registration_ID', formData.barRegistrationId);
      
      if (formData.governmentIdProof) {
        const govIdBase64 = await convertFileToBase64(formData.governmentIdProof);
        data.append('Government_ID_Proof', govIdBase64);
        data.append('Government_ID_Proof_Name', formData.governmentIdProof.name);
      }
      
      if (formData.lawyerIdProof) {
        const lawyerIdBase64 = await convertFileToBase64(formData.lawyerIdProof);
        data.append('Lawyer_ID_Proof', lawyerIdBase64);
        data.append('Lawyer_ID_Proof_Name', formData.lawyerIdProof.name);
      }
      
      // --- CHANGE THIS URL ---
      // Replace with the Google Apps Script Web App URL you copied in Step 3.
      const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwqjfy3YOzyvZEnPBPwbxp-cumRiEO2WyUGhcWNQ5nBxLxhVBbuyt1idCFDkx-ggzZB6Q/exec';

      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.result === 'success') {
        setLoading(false);
        alert('Registration successful! Your information has been submitted for verification.');
        navigate('/lawyer');
      } else {
        throw new Error(result.error || 'An unknown error occurred in the script.');
      }
      
    } catch (error) {
      setLoading(false);
      setErrors({
        ...errors,
        submit: 'An error occurred during submission. Please try again.',
      });
      console.error('Submission error:', error);
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = error => reject(error);
    });
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Lawyer Registration
        </Typography>
        <Typography variant="body1" align="center" color="textSecondary" paragraph>
          Join our platform to connect with clients and grow your practice
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                name="fullName"
                label="Full Name"
                fullWidth
                required
                value={formData.fullName}
                onChange={handleChange}
                error={!!errors.fullName}
                helperText={errors.fullName}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="email"
                label="Email Address"
                fullWidth
                required
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                disabled={isEmailVerified}
              />
              {!isEmailVerified && (
                <Box mt={1}>
                  <Button
                    variant="outlined"
                    onClick={handleSendVerificationCode}
                    disabled={!formData.email || loading}
                  >
                    {loading ? 'Sending...' : 'Send Verification Code'}
                  </Button>
                </Box>
              )}
            </Grid>
            
            {codeSent && !isEmailVerified && (
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Verification Code"
                  fullWidth
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  disabled={loading}
                  helperText="Enter 6-digit code sent to your email"
                />
                <Box mt={1}>
                  <Button
                    variant="outlined"
                    onClick={handleVerifyCode}
                    disabled={!verificationCode || loading}
                  >
                    {loading ? 'Verifying...' : 'Verify Code'}
                  </Button>
                </Box>
              </Grid>
            )}
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="mobileNumber"
                label="Mobile Number"
                fullWidth
                required
                type="tel"
                value={formData.mobileNumber}
                onChange={handleChange}
                error={!!errors.mobileNumber}
                helperText={errors.mobileNumber}
                inputProps={{ maxLength: 10 }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="dateOfBirth"
                label="Date of Birth"
                type="date"
                fullWidth
                required
                value={formData.dateOfBirth}
                onChange={handleChange}
                error={!!errors.dateOfBirth}
                helperText={errors.dateOfBirth || "MM/DD/YYYY"}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="barRegistrationId"
                label="BAR Registration ID"
                fullWidth
                required
                value={formData.barRegistrationId}
                onChange={handleChange}
                error={!!errors.barRegistrationId}
                helperText={errors.barRegistrationId}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <InputLabel htmlFor="governmentIdProof" required sx={{ mb: 1 }}>
                Government ID Proof (PDF only)
              </InputLabel>
              <input
                accept="application/pdf"
                id="governmentIdProof"
                name="governmentIdProof"
                type="file"
                onChange={handleFileChange}
                style={{ width: '100%' }}
              />
              {errors.governmentIdProof && (
                <FormHelperText error>{errors.governmentIdProof}</FormHelperText>
              )}
              <Typography variant="caption" color="textSecondary">
                Upload Aadhar Card, PAN Card, Driving License, or Voter ID
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <InputLabel htmlFor="lawyerIdProof" required sx={{ mb: 1 }}>
                Lawyer ID Proof (PDF only)
              </InputLabel>
              <input
                accept="application/pdf"
                id="lawyerIdProof"
                name="lawyerIdProof"
                type="file"
                onChange={handleFileChange}
                style={{ width: '100%' }}
              />
              {errors.lawyerIdProof && (
                <FormHelperText error>{errors.lawyerIdProof}</FormHelperText>
              )}
            </Grid>
            
            {errors.submit && (
              <Grid item xs={12}>
                <Typography color="error" align="center">
                  {errors.submit}
                </Typography>
              </Grid>
            )}
            
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                disabled={loading || !isEmailVerified}
                sx={{ mt: 2 }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={24} sx={{ mr: 1 }} color="inherit" />
                    Submitting...
                  </>
                ) : 'Sign Up'}
              </Button>
            </Grid>
            
            <Grid item xs={12}>
              <Box textAlign="center">
                <Typography variant="body2">
                  Already have an account?{' '}
                  <Button
                    color="primary"
                    onClick={() => navigate('/lawyer')}
                  >
                    Sign In
                  </Button>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default LawyerSignupPage;
