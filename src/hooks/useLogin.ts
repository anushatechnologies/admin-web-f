import React, { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useAppDispatch } from '@app/hooks';
import { useLoginMutation, useVerifyOtpMutation } from '@features/auth/api/authApi';
import { setCredentials } from '@features/auth/authSlice';
import { showSnackbar } from '@components/snackbarUtils';

export const useLogin = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login] = useLoginMutation();
  const [verifyOtp, { isLoading: verifyOtpLoading }] = useVerifyOtpMutation();

  const [step, setStep] = useState<'login' | 'otp'>('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(true);
  const [isPasswordExpired, setIsPasswordExpired] = useState(false);

  // Auto-detect autofill
  useEffect(() => {
    const handler = (e: AnimationEvent) => {
      if (e.animationName === 'autofillStart') {
        const email = (document.querySelector('input[type="email"]') as HTMLInputElement)?.value;
        const password = (document.querySelector('input[type="password"]') as HTMLInputElement)
          ?.value;

        if (email || password) {
          setLoginData({ email: email ?? '', password: password ?? '' });
        }
      }
    };

    document.addEventListener('animationstart', handler);
    return () => document.removeEventListener('animationstart', handler);
  }, []);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));

    const updatedData = { ...loginData, [name]: value };
    setIsLoginLoading(!!updatedData.email.trim() && !!updatedData.password.trim());
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginData.email || !loginData.password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoginLoading(true);
    const resValidate: any = { isSuccess: false };

    try {
      const res: any = await login(loginData).unwrap();

      if (res.status_code === 200) {
        setError('');
        setIsLoginLoading(false);
        resValidate.isSuccess = true;
        setStep('otp');
      } else {
        setIsLoginLoading(false);
        setIsPasswordExpired(res?.is_expired);
        resValidate.message = res.message;
      }
    } catch (err: any) {
      console.error('Login failed:', err);
      resValidate.message = err.message || 'Login failed';
      setIsLoginLoading(false);
    }

    showSnackbar({
      message: resValidate.isSuccess ? 'OTP sent successfully' : resValidate.message,
      severity: resValidate.isSuccess ? 'success' : 'error',
      duration: resValidate.isSuccess ? 3000 : 5000,
      position: { vertical: 'bottom', horizontal: 'right' },
    });
  };

  const handleVerifyOtp = async (otp: string) => {
    const resValidate: any = { isLoggedIn: false };

    try {
      const res: any = await verifyOtp({ email: loginData.email, otp }).unwrap();

      if (res.status_code === 200) {
        dispatch(
          setCredentials({
            token: res.access_token,
            user: res.user,
          }),
        );

        const expiryDate = new Date(res.user.token_expires_at);
        Cookies.set('token', res.access_token, { expires: expiryDate });
        Cookies.set('sessionid', res.session_key, { expires: expiryDate });

        resValidate.isLoggedIn = true;
      }
    } catch (error: any) {
      resValidate.msg = error.message;
    }

    showSnackbar({
      message: resValidate.isLoggedIn ? 'Login successful' : resValidate.msg,
      severity: resValidate.isLoggedIn ? 'success' : 'error',
      duration: 3000,
      position: { vertical: 'bottom', horizontal: 'right' },
    });

    if (resValidate.isLoggedIn) {
      navigate('/');
    }
  };

  const handleBackToLogin = () => {
    setStep('login');
    setError('');
  };

  const handleForgotPassword = () => {
    navigate(`/forgot-password/${isPasswordExpired ? 'reset' : 'forgot'}`);
  };

  return {
    step,
    loginData,
    showPassword,
    error,
    isLoginLoading,
    isPasswordExpired,
    verifyOtpLoading,
    setShowPassword,
    handleInputChange,
    handleLogin,
    handleVerifyOtp,
    handleBackToLogin,
    handleForgotPassword,
  };
};
