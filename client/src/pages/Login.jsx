import React, { useState, useRef } from 'react';
import { Box, Flex, Heading, Input, Button, FormControl, FormLabel, Image, Stack, Text, Divider, useColorMode, useColorModeValue, Center, useToast, InputGroup, InputRightElement, IconButton } from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import LoginImg from '../assets/LoginImg.jpg';
import BuksuLogo from '../assets/BuksuLogo.png';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { HiOutlineSun, HiOutlineMoon } from 'react-icons/hi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state
  const [showPassword, setShowPassword] = useState(false); // For toggling password visibility
  const recaptchaRef = useRef(null);
  const navigate = useNavigate();
  const toast = useToast();

  // Using Chakra's `useColorMode` to manage color modes
  const { colorMode, toggleColorMode } = useColorMode(); // Hook to manage color mode
  const bgColor = useColorModeValue('white', 'gray.800');  // Background color for the form
  const textColor = useColorModeValue('gray.700', 'white');  // Text color
  const buttonColorScheme = useColorModeValue('blue', 'teal');  // Button color scheme
  const bgImage = useColorModeValue(LoginImg, LoginImg); // Image stays the same, but we apply color adjustments below

  // Applying color adjustments based on color mode
  const imageFilter = useColorModeValue('none', 'brightness(50%) contrast(1.5)'); // No filter in light mode, darkened effect in dark mode

  // Function to handle Google login redirect
  const loginWithGoogle = () => {
    window.open("http://localhost:8000/api/auth/google", "_self");
  };

  const handleManualLogin = async () => {
    if (!email || !password) {
      toast({
        title: "Please fill in both email and password.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!recaptchaToken) {
      toast({
        title: "Please complete the reCAPTCHA.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true); // Start loading state

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
          navigate("/admin-dashboard");
        } else {
          navigate("/user-dashboard");
        }
      } else {
        toast({
          title: data.message || "Login failed",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        if (recaptchaRef.current) recaptchaRef.current.reset();
        setRecaptchaToken(null);
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast({
        title: "Error logging in, please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      if (recaptchaRef.current) recaptchaRef.current.reset();
      setRecaptchaToken(null);
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  return (
    <Flex height="100vh" direction={{ base: 'column', md: 'row' }} position="relative">
      {/* Left side - Login form */}
      <Flex
        flex="1"
        align="center"
        justify="center"
        p={{ base: 4, md: 8 }}
        position="relative"
        zIndex="2"
      >
        <Box
          width="100%"
          maxW="450px"
          p={{ base: 6, md: 8 }}
          boxShadow="md"
          bg={bgColor} // Background color changes based on light or dark mode
          borderRadius="8px"
          position="relative"
          zIndex="2"
        >
          <Flex direction="column" align="center" mb="8">
            {/* Logo */}
            <Image
              src={BuksuLogo}
              alt="Logo"
              boxSize="100px"
              mb="1"
            />
            <Heading size="md" fontWeight="bold" color={textColor} >
              Login
            </Heading>
            <Text fontSize="sm" color="gray.500">
              to continue to GEMBS
            </Text>
          </Flex>
          <Stack spacing="1">
            {/* Google sign-in button */}
            <Button leftIcon={<FcGoogle />} colorScheme={buttonColorScheme} variant="outline" width="full" onClick={loginWithGoogle}>
              Continue with Google
            </Button>
            <Divider my="4" />
            {/* Email Input */}
            <FormControl id="email" isRequired>
              <FormLabel fontSize="sm" color={textColor}>Email</FormLabel>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                focusBorderColor="blue.500"
                aria-label="Email address"
              />
            </FormControl>
            {/* Password Input with toggle visibility */}
            <FormControl id="password" isRequired>
              <FormLabel fontSize="sm" color={textColor}>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  focusBorderColor="blue.500"
                />
                <InputRightElement>
                  <IconButton
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    icon={showPassword ? <HiEyeOff /> : <HiEye />}
                    onClick={() => setShowPassword(!showPassword)}
                    variant="link"
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>
            {/* ReCAPTCHA */}
            <ReCAPTCHA
              sitekey="6LchNHgqAAAAAMgvERINOjrK9Bsmvquidlxht9vl"
              onChange={handleRecaptchaChange}
              ref={recaptchaRef}
              style={{ transform: 'scale(0.8)', transformOrigin: '0 0', display: 'flex', justifyContent: "center", marginLeft: "4rem", marginTop: "1rem" }}
            />
            {/* Submit Button */}
            <Button
              colorScheme="blue"
              width="full"
              aria-label="Login"
              onClick={handleManualLogin}
              isLoading={loading}
            >
              Login
            </Button>
          </Stack>
          <Text mt="4" fontSize="xs" textAlign="center" color="gray.500">
            Not your computer? Use a private browsing window to login.
          </Text>
        </Box>
      </Flex>

      {/* Right side - Image (for small screens with translucent and colored effect) */}
      <Box
        flex="1"
        display={{ base: 'block', md: 'none' }}
        position="absolute"
        top="0"
        left="0"
        height="100%"
        width="100%"
        zIndex="-1"
        backgroundImage={`url(${bgImage})`}
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundColor="rgba(0, 0, 0, 0.4)" // Apply a semi-transparent overlay on small screens
        filter={imageFilter} // Conditional filter based on color mode
      />

      {/* Image for larger screens */}
      <Box
        flex="1"
        display={{ base: 'none', md: 'block' }}
      >
        <Image
          src={bgImage}
          alt="Side Image"
          objectFit="cover"
          height="100%"
          width="100%"
          filter={imageFilter} // Conditional filter based on color mode
        />
      </Box>

   {/* Toggle Dark Mode Button */}
{/* Toggle Dark Mode Button */}
<Box
  position={{ base: 'absolute', md: 'fixed' }}
  top={{ base: '16px', md: '16px' }}
  left={{ base: '16px', md: '16px' }} // Moved to the left
  zIndex="3"
>
  <Button 
    onClick={toggleColorMode} 
    size="sm" 
    variant="ghost" // Makes the button background transparent
    colorScheme={colorMode === 'light' ? 'blue' : 'teal'}
  >
    {colorMode === 'light' ? <HiOutlineSun size={20} /> : <HiOutlineMoon size={20} />}
  </Button>
</Box>
    </Flex>
  );
};

export default Login;
