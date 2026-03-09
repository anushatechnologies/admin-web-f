import React, { useState } from 'react';
import { Box, Paper, Fade } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSendOtpMutation, useVerifyOtpMutation } from '@features/auth/api/authApi';
import { showSnackbar } from '@components/snackbarUtils';

// ✅ FIX SPELLING
import ForgotPasswordForm from './compoents/ForgotPasswordForm'
import ResetPasswordForm from './compoents/ResetPasswordForm';

import styles from './ForgotPasswordPage.module.scss';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  const [sendOtp, { isLoading: sendOtpLoading }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: verifyOtpLoading }] = useVerifyOtpMutation();

  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');

  // ==============================
  // STEP 1: Send OTP
  // ==============================
  const handleSendOtp = async (emailValue: string) => {
    try {
      console.log("Sending OTP...");
      await sendOtp({ email: emailValue }).unwrap();
      console.log("OTP Success");

      setEmail(emailValue);
      setStep('otp'); // ✅ THIS switches form

      showSnackbar({
        message: 'OTP sent to your email!',
        severity: 'success',
      });

    } catch (error: any) {
      console.log("OTP Failed");
      showSnackbar({
        message: error?.data?.message || 'Failed to send OTP',
        severity: 'error',
      });
    }
  };

  // ==============================
  // STEP 2: Verify OTP
  // ==============================
  const handleResetPassword = async (otp: string, newPassword: string) => {
    try {
      await verifyOtp({ email, otp, newPassword }).unwrap();

      showSnackbar({
        message: 'Password reset successfully! Redirecting to login...',
        severity: 'success',
      });

      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (error: any) {
      showSnackbar({
        message: error?.data?.message || 'Password reset failed',
        severity: 'error',
      });
    }
  };

  const handleBackToLogin = () => navigate('/login');

  return (
    <Box
      className={`min-h-screen flex items-center justify-center 
      bg-gradient-to-br from-blue-50 to-indigo-100 p-4 ${styles.forgotPage}`}
    >
      <Fade in timeout={600}>
        <Paper elevation={8} className={styles.forgotPaper}>
          <div className={styles.content}>
            {step === 'email' ? (
              <ForgotPasswordForm
                onSubmit={handleSendOtp}
                onBack={handleBackToLogin}
                isLoading={sendOtpLoading}
                email={email}
              />
            ) : (
              <ResetPasswordForm
                email={email}
                onSubmit={handleResetPassword}
                onBack={() => setStep('email')}
                isLoading={verifyOtpLoading}
              />
            )}
          </div>
        </Paper>
      </Fade>
    </Box>
  );
};

export default ForgotPasswordPage;