import React, { useState, useRef } from 'react';
import { 
  Box, Button, CssBaseline, FormControl, FormLabel, TextField, Typography, Divider, Card, Grid, InputAdornment, IconButton
} from '@mui/material';
import { FcGoogle } from "react-icons/fc";
import LoginImg from '../assets/LoginImg.jpg';
import ReCAPTCHA from 'react-google-recaptcha';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [loginError, setLoginError] = useState('');
  const recaptchaRef = useRef(null);

  const validateInputs = () => {
  let isValid = true;

  // Email Validation
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    setEmailError(true);
    setEmailErrorMessage('Please enter a valid email address.');
    isValid = false;
  } else {
    setEmailError(false);
    setEmailErrorMessage('');
  }

  // Password Validation
  if (!password || password.length < 8) {
    setPasswordError(true);
    setPasswordErrorMessage('Password must be at least 6 characters long.');
    isValid = false;
  } else {
    setPasswordError(false);
    setPasswordErrorMessage('');
  }

  // Reset reCAPTCHA if there's any validation error
  if (!isValid) {
    recaptchaRef.current.reset();
  }

  return isValid;
};

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validateInputs() && recaptchaToken) {
      setLoading(true);
      setLoginError(''); // Reset previous login error
      try {
        const response = await fetch("http://localhost:8000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, recaptchaToken }),
          credentials: 'include',
        });

        const data = await response.json();
        if (response.ok && data.message.includes("login successful")) {
          if (data.user.role === 'Admin' || data.user.role === 'SuperAdmin') {
            // Navigate to Admin Dashboard
            window.location.href = "/dashboard";
          } else {
            // Navigate to User Dashboard
            window.location.href = "/catalog";
          }
        } else {
          setLoginError(data.message || 'An unexpected error occurred.');
        }
      } catch (error) {
        setLoginError('Network error. Please try again later.');
        console.error("Error during login:", error);
      } finally {
        setLoading(false);
      }
    } else {
      console.log("Validation failed or reCAPTCHA not completed");
    }
  };

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  const loginWithGoogle = () => {
    window.open("http://localhost:8000/api/auth/google", "_self");
  };

  return (
    <>
      <CssBaseline enableColorScheme />
      <Grid container sx={{ minHeight: '100vh', backgroundImage: `url(${LoginImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        {/* Left Side: Text */}
        <Grid item xs={12} md={6} sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start', 
          padding: 4,
        }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', marginBottom: 2, color: 'white', textAlign: 'left' }}>
            GYM EQUIPMENT MANAGEMENT AND BORROWING SYSTEM
          </Typography>
          <Typography variant="h6" sx={{ fontStyle: 'italic', color: 'white', textAlign: 'left' }}>
            Find the equipment you need right here.
            <br />
            Borrow wisely, return timely.
          </Typography>
        </Grid>

        {/* Right Side: Login Form */}
        <Grid item xs={12} md={6} sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 4,
        }}>
          <Card variant="outlined" sx={{ padding: 4, width: '100%', maxWidth: 450, backgroundColor: 'rgba(255, 255, 255, 0.9)', boxShadow: 4 }}>
            <Typography component="h1" variant="h4" align="center" sx={{ marginBottom: 3, fontWeight: 'bold' }}>
              Sign In
            </Typography>

            {/* Error Message from Login */}
            {loginError && (
              <Typography color="error" sx={{ marginBottom: 2, textAlign: 'center' }}>
                {loginError}
              </Typography>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Email Field */}
              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <TextField
                  error={emailError}
                  helperText={emailErrorMessage}
                  id="email"
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  autoComplete="email"
                  autoFocus
                  required
                  fullWidth
                  variant="outlined"
                  color={emailError ? 'error' : 'primary'}
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: 1,
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>

              {/* Password Field */}
              <FormControl>
                <FormLabel htmlFor="password">Password</FormLabel>
                <TextField
                  error={passwordError}
                  helperText={passwordErrorMessage}
                  name="password"
                  placeholder="••••••"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  required
                  fullWidth
                  variant="outlined"
                  color={passwordError ? 'error' : 'primary'}
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: 1,
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>

              {/* reCAPTCHA */}
              <Box display="flex" justifyContent="center" mt="4">
                <ReCAPTCHA
                 ref={recaptchaRef}
                  sitekey="6LchNHgqAAAAAMgvERINOjrK9Bsmvquidlxht9vl"
                  onChange={handleRecaptchaChange}
                />
              </Box>

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  marginTop: 2,
                  padding: 1.5,
                  backgroundColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Log in'}
              </Button>

              {/* Divider with Or */}
              <Divider sx={{ marginY: 3, fontWeight: 'bold' }}>or</Divider>

              {/* Google Login */}
              <Button
                fullWidth
                variant="outlined"
                onClick={loginWithGoogle}
                startIcon={<FcGoogle />}
                sx={{
                  color: 'black',
                  borderColor: 'black',
                  padding: 1.5,
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                  },
                }}
              >
                Sign in with Google
              </Button>

              <Typography sx={{ textAlign: 'center', marginTop: 2 }}>
                Not your computer? Use a private browsing window to login.
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default Login;
