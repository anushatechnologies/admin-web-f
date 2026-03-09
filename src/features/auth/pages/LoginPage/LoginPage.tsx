import React from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  Fade,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { LoginIllustration } from '@features/auth/components/LoginIllustration';
import OTPVerification from '@features/auth/components/OTPVerification/OTPVerification';
import { useNavigate } from 'react-router-dom'; // ✅ NEEDED FOR NAVIGATION
import styles from './LoginPage.module.scss';
import { LOGIN_CONTENT } from '@utils/uiContent';
import { useLoginLogic } from '@features/auth/utils/useLoginLogic';

const LoginPage: React.FC = () => {
  const navigate = useNavigate(); // ✅ FIX 1: Add navigation
  
  const {
    step,
    loginData,
    error,
    showPassword,
    isLoginLoading,
    verifyOtpLoading,
    isPasswordExpired,
    onchangeHandler,
    handleBackToLogin,
    handleLogin,
    handleLoginSuccess,
    handleResendOTP,
    isLoginDisabled,
    setShowPassword,
  } = useLoginLogic();

  // ✅ FIX 2: Direct navigation handlers
  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <Box className={`min-h-screen flex items-center justify-center bg-gray-50 p-1 ${styles.loginPage}`}>
      <Fade in timeout={600}>
        <Paper
          elevation={0}
          className={styles.loginPaper}
          sx={{ maxWidth: step === 'otp' ? '530px' : '1000px' }}
        >
          <Box
            className={`${styles.loginContainer} grid`}
            sx={{ gridTemplateColumns: step === 'otp' ? '1fr' : { xs: '1fr', md: '1fr 1fr' } }}
          >
            {/* LEFT SECTION */}
            <Box className={styles.formSection}>
              {step === 'login' ? (
                <>
                  <Box className={styles.headerBox}>
                    <Typography className={styles.loginTitle}>Anusha Bazaar</Typography>
                    <Typography className={styles.loginSubtitle}>
                      Please login to your account
                    </Typography>
                  </Box>

                  {error && (
                    <Fade in>
                      <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                        {error}
                      </Alert>
                    </Fade>
                  )}

                  <Box component="form" onSubmit={handleLogin}>
                    {/* EMAIL */}
                    <Box className={styles.fieldWrapper}>
                      <Typography className={styles.label}>Email id</Typography>
                      <TextField
                        fullWidth
                        name="email"
                        type="email"
                        value={loginData.email}
                        onChange={onchangeHandler}
                        placeholder="Enter your email here"
                        className={styles.inputField}
                      />
                    </Box>

                    {/* PASSWORD */}
                    <Box className={styles.fieldWrapper}>
                      <Typography className={styles.label}>Password</Typography>
                      <TextField
                        fullWidth
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={loginData.password}
                        onChange={onchangeHandler}
                        placeholder="Enter your password here"
                        className={styles.inputField}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword((prev) => !prev)}
                                size="small"
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>

                    <Button
                      fullWidth
                      type="submit"
                      variant="contained"
                      disabled={isLoginDisabled || isLoginLoading}
                      className={styles.loginButton}
                    >
                      {isLoginLoading ? 'Logging In...' : 'Login'}
                    </Button>

                    {/* ✅ FIX 3: FORGOT PASSWORD - DIRECT NAVIGATION */}
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                      <Typography
                        component="span"
                        onClick={handleForgotPassword}  // ✅ WORKS INSTANTLY
                        className={styles.forgotLink}
                        sx={{ 
                          cursor: 'pointer', 
                          color: '#1565c0',
                          '&:hover': { textDecoration: 'underline' }
                        }}
                      >
                        {LOGIN_CONTENT.BUTTON_FORGOT_PASSWORD}
                      </Typography>
                    </Box>

                    {/* ✅ REGISTER BUTTON */}
                    <Box sx={{ textAlign: 'center', mt: 1 }}>
                      <Typography
                        component="span"
                        onClick={handleRegister}
                        className={styles.forgotLink}
                        sx={{ 
                          cursor: 'pointer', 
                          color: '#28a745',
                          '&:hover': { textDecoration: 'underline' }
                        }}
                      >
                        Don't have an account? <strong>Register here</strong>
                      </Typography>
                    </Box>
                  </Box>
                </>
              ) : (
                <OTPVerification
                  email={loginData.email}
                  isLoading={verifyOtpLoading}
                  onVerifySuccess={handleLoginSuccess}
                  resendOtpHandler={handleResendOTP}
                  onBack={handleBackToLogin}
                />
              )}
            </Box>

            {/* RIGHT SECTION - Illustration */}
            {step === 'login' && (
              <Box className={styles.illustrationWrapper}>
                <Box className={`${styles.circle} ${styles.circleOne}`} />
                <Box className={`${styles.circle} ${styles.circleTwo}`} />
                <Box className={`${styles.circle} ${styles.circleThree}`} />
                <LoginIllustration />
              </Box>
            )}
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
};

export default LoginPage;
