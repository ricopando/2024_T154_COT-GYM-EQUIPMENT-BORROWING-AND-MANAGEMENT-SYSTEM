import React, { useState, useRef } from 'react';
import { 
  Box, Button, CssBaseline, FormControl, FormLabel, TextField, Typography, Divider, Card, Grid,
} from '@mui/material';
import { FcGoogle } from "react-icons/fc";
import LoginImg from '../assets/LoginImg.jpg';
import ReCAPTCHA from 'react-google-recaptcha';
import { LoadingButton } from '@mui/lab';



const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [loading, setLoading] = useState(false);
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
    console.log("reCAPTCHA token:", token);
    setRecaptchaToken(token);
  };

  const loginWithGoogle = () => {
    window.open("http://localhost:8000/api/auth/google", "_self");
  };

  return (
    <>
      <CssBaseline enableColorScheme />
      <Grid container sx={{ 
        minHeight: '100vh', 
        backgroundImage: `url(${LoginImg})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        flexDirection: { xs: 'column', md: 'row' }
      }}>
        {/* Text Section - Moved to top */}
        <Grid item xs={12} md={6} sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: { xs: 4, sm: 6 },
          
          minHeight: { xs: '40vh', md: '100vh' },
          animation: 'fadeIn 1s ease-in',
          '@keyframes fadeIn': {
            '0%': {
              opacity: 0,
              transform: 'translateY(-20px)'
            },
            '100%': {
              opacity: 1,
              transform: 'translateY(0)'
            }
          }
        }}>
          <Box sx={{
            maxWidth: '800px',
            animation: 'slideIn 1s ease-out',
            '@keyframes slideIn': {
              '0%': {
                opacity: 0,
                transform: 'translateX(-50px)'
              },
              '100%': {
                opacity: 1,
                transform: 'translateX(0)'
              }
            }
          }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 'bold', 
                marginBottom: 3, 
                color: 'white', 
                textAlign: { xs: 'center', md: 'left' },
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              GYM EQUIPMENT MANAGEMENT AND BORROWING SYSTEM
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                fontStyle: 'italic', 
                color: 'white', 
                textAlign: { xs: 'center', md: 'left' },
                fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' },
                opacity: 0.9,
                animation: 'fadeInDelayed 1.5s ease-in',
                '@keyframes fadeInDelayed': {
                  '0%': { opacity: 0 },
                  '50%': { opacity: 0 },
                  '100%': { opacity: 0.9 }
                }
              }}
            >
              Find the equipment you need right here.
              <br />
              Borrow wisely, return timely.
            </Typography>
          </Box>
        </Grid>

        {/* Login Form Section */}
        <Grid item xs={12} md={6} sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: { xs: 2, sm: 4 },
          minHeight: { xs: '60vh', md: '100vh' },
          animation: 'fadeIn 1s ease-in 0.5s backwards',
        }}>
          <Card variant="outlined" sx={{ 
            padding: { xs: 2, sm: 3 }, 
            width: '100%', 
            maxWidth: 380, 
            backgroundColor: 'rgba(255, 255, 255, 0.98)', 
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '16px',
            margin: { xs: '1rem 0', md: 0 },
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
            }
          }}>
            <Typography 
              component="h1" 
              variant="h4" 
              align="center" 
              sx={{ 
                marginBottom: 2,
                fontWeight: 700,
                fontSize: { xs: '1.5rem', sm: '1.75rem' },
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px'
              }}
            >
              Log In
            </Typography>

            {/* Update the error message styling */}
            {loginError && (
              <Box
                sx={{
                  backgroundColor: 'rgba(211, 47, 47, 0.1)',
                  color: 'error.main',
                  padding: 2,
                  borderRadius: '12px',
                  marginY: 2,
                  border: '1px solid rgba(211, 47, 47, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography 
                  variant="body2" 
                  align="center"
                  sx={{ 
                    fontWeight: 500,
                    letterSpacing: '0.25px'
                  }}
                >
                  {loginError}
                </Typography>
              </Box>
            )}

            {/* Update the form container spacing */}
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: { xs: 1.5, sm: 2 }
            }}>
              {/* Email Field */}
              <FormControl>
                <FormLabel htmlFor="email" sx={{ marginBottom: 0.5 }}>Email</FormLabel>
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
                      '& fieldset': {
                        borderColor: 'divider',
                      },
                      '& input': {
                        padding: '10px 14px',
                      },
                    },
                  }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>

              {/* Password Field - Updated */}
              <FormControl>
                <FormLabel htmlFor="password" sx={{ marginBottom: 0.5 }}>Password</FormLabel>
                <TextField
                  error={passwordError}
                  helperText={passwordErrorMessage}
                  name="password"
                  placeholder="••••••"
                  type="password"
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
                      '& fieldset': {
                        borderColor: 'divider',
                      },
                      '& input': {
                        padding: '10px 14px',
                      },
                    },
                  }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>

              {/* reCAPTCHA - Make it responsive */}
              <Box 
                display="flex" 
                justifyContent="center" 
                mt="4"
                sx={{
                  transform: { xs: 'scale(0.75)', sm: 'scale(0.85)' },
                  transformOrigin: 'center',
                  margin: { xs: '0.25rem 0', sm: '0.5rem 0' }
                }}
              >
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                  onChange={handleRecaptchaChange}
                />
              </Box>

              {/* Submit Button - Updated */}
              <LoadingButton
                type="submit"
                fullWidth
                loading={loading}
                variant="contained"
                sx={{
                  marginTop: { xs: 0.5, sm: 1 },
                  padding: { xs: 1, sm: 1.5 },
                  backgroundColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  '&.Mui-disabled': {
                    backgroundColor: 'action.disabledBackground',
                  },
                }}
              >
                {loading ? 'Logging in...' : 'Log in'}
              </LoadingButton>

              {/* Divider with Or */}
              <Divider sx={{ marginY: 2 }}>or</Divider>

              {/* Google Login */}
              <Button
                fullWidth
                variant="outlined"
                onClick={loginWithGoogle}
                startIcon={<FcGoogle />}
                sx={{
                  color: 'text.primary',
                  borderColor: 'divider',
                  padding: 1,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    borderColor: 'text.primary',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                Sign in with Google
              </Button>

              <Typography sx={{ 
                textAlign: 'center', 
                marginTop: 1.5,
                fontSize: '0.875rem'
              }}>
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
