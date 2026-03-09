import React from 'react';
import {
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  Fade,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { LOGIN_CONTENT } from '@utils/uiContent';
import styles from '@features/auth/pages/LoginPage/LoginPage.module.scss';

interface LoginFormProps {
  email: string;
  password: string;
  showPassword: boolean;
  error: string;
  isLoading: boolean;
  isPasswordExpired: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onTogglePassword: () => void;
  onForgotPassword: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  email,
  password,
  showPassword,
  error,
  isLoading,
  isPasswordExpired,
  onInputChange,
  onSubmit,
  onTogglePassword,
  onForgotPassword,
}) => {
  const getButtonLabel = () => {
    if (!email.trim() || !password.trim()) return 'Login';
    if (isLoading) return 'Logging In...';
    return 'Login';
  };

  return (
    <form onSubmit={onSubmit} className={styles.formContainer}>
      <Typography variant="h4" className={styles.title}>
        LMS
      </Typography>
      <Typography variant="body1" className={styles.subtitle}>
        Please login to your account
      </Typography>

      {error && (
        <Fade in={!!error}>
          <Alert severity="error" className={styles.errorAlert}>
            {error}
          </Alert>
        </Fade>
      )}

      <TextField
        label="Email id"
        type="email"
        value={email}
        onChange={onInputChange}
        required
        name="email"
        autoComplete="email"
        placeholder="Enter your email here"
        variant="outlined"
        className={styles.inputField}
        fullWidth
      />

      <TextField
        label="Password"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={onInputChange}
        name="password"
        required
        autoComplete="current-password"
        placeholder="Enter your password here"
        variant="outlined"
        className={styles.inputField}
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={onTogglePassword} edge="end" size="small">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        className={styles.loginButton}
        disabled={!email.trim() || !password.trim()}
      >
        {getButtonLabel()}
      </Button>

      <Typography variant="body2" onClick={onForgotPassword} className={styles.forgotLink}>
        {isPasswordExpired
          ? LOGIN_CONTENT.BUTTON_CHANGE_PASSWORD
          : LOGIN_CONTENT.BUTTON_FORGOT_PASSWORD}
      </Typography>
    </form>
  );
};
