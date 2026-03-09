import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { FORGOT_PASSWORD_CONTENT } from '@utils/uiContent';
import { showSnackbar } from '@components/snackbarUtils';

interface Props {
  onSubmit: (email: string) => void;
  onBack: () => void;
  isLoading: boolean;
}

const ForgotPasswordForm: React.FC<Props> = ({ onSubmit, onBack, isLoading }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showSnackbar({
        message: 'Please enter a valid email address!',
        severity: 'error',
      });
      return;
    }
    
    onSubmit(email);
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography sx={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', mb: 1 }}>
          Forgot Password?
        </Typography>
        <Typography sx={{ fontSize: 14, color: '#666' }}>
          {FORGOT_PASSWORD_CONTENT.DESCRIPTION_REQUEST}
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ fontSize: 14, color: '#1a1a1a', mb: 1, fontWeight: 500 }}>
            Email Address
          </Typography>
          <TextField
            fullWidth
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            disabled={isLoading}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'white',
                borderRadius: 3,
                '& fieldset': { borderColor: 'transparent' },
                '&:hover fieldset': { borderColor: '#1565c0' },
                '&.Mui-focused fieldset': { borderColor: '#1565c0' },
              },
            }}
          />
        </Box>

        <Button
          fullWidth
          type="submit"
          variant="contained"
          disabled={isLoading || !email}
          sx={{
            py: 1.5,
            mb: 2,
            borderRadius: 3,
            textTransform: 'none',
            fontSize: 16,
            fontWeight: 600,
            bgcolor: '#1565c0',
            '&:hover': { bgcolor: '#0d47a1' },
          }}
        >
          {isLoading ? 'Sending OTP...' : 'Send OTP Code'}
        </Button>

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button
            size="small"
            onClick={onBack}
            disabled={isLoading}
            sx={{
              textTransform: 'none',
              color: '#1565c0',
              fontSize: 13,
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            ← Back to Login
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ForgotPasswordForm;
