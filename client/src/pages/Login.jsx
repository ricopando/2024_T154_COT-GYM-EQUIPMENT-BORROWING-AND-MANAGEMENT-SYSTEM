import React, { useState, useRef } from 'react';
import { 
  Box, Flex, Heading, Input, Button, FormControl, FormLabel, Stack, Text, Divider, 
  useColorModeValue, useToast, InputGroup, InputRightElement, IconButton, useBreakpointValue 
} from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import LoginImg from '../assets/LoginBg.jpg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const recaptchaRef = useRef(null);
  const navigate = useNavigate();
  const toast = useToast();


  const bgImage = useColorModeValue(LoginImg, LoginImg);

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

    setLoading(true);
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
      setLoading(false);
    }
  };

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  return (
    <Flex
      height="100vh"
      direction={{ base: "column", md: "row" }}  // Column-reverse for mobile, row for desktop
      position="relative"
      bgImage={bgImage}
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
    >
      {/* Left Box (Text) */}
      <Box
        flex="1"
        display="flex"
        
        alignItems="center"
        justifyContent={{ base: "center", md: "flex-center" }}
        textAlign={{ base: "center", md: "left" }}
        p={{ base: 6, md: 10 }}
        color="white"
        borderRadius="8px"
      >
        <Stack spacing={{ base: 4, md: 6 }} maxW={{ base: "90%", md: "80%" }} >
          <Text
            fontSize={{ base: "6xl", md: "4xl", lg: "7xl" }}
            fontWeight="extrabold"
            lineHeight="1.2"
            color="white"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            GYM EQUIPMENT MANAGEMENT AND BORROWING SYSTEM
          </Text>
          <Text
            fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
            fontWeight="medium"
            color="whiteAlpha.800"
            lineHeight="1.5"
          >
            Find the equipment you need right here.
            <br />
            Borrow wisely, return timely.
          </Text>
        </Stack>
      </Box>

      {/* Right Box (Form) */}
      <Box
        flex="1"
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={{ base: 4, md: 8 }}
      >
        <Box
          width="100%"
          maxW={{ base: "90%", md: "400px" }}
          p={{ base: 6, md: 8 }}
          boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"  // Subtle shadow for depth
          bg="white"
          borderRadius="8px"  // Rounded corners
          border="1px solid #e0e0e0"  // Light gray border for clean look
        >
          <Flex direction="column" align="center" mb="6">
            <Heading
              color="black"
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: "bold", textTransform: "uppercase" }}
              fontSize={{ base: "1.6rem", md: "2rem" }}  // Slightly larger font size for emphasis
            >
              Login
            </Heading>
          </Flex>

          <Stack spacing={{ base: 4, md: 5 }}>
            {/* Google Login Button */}
            <Button
              leftIcon={<FcGoogle />}
              colorScheme="gray"
              variant="outline"
              width="full"
              onClick={loginWithGoogle}
              border="1px solid #4a628a"  // Google blue border
              color="#4a628a"  // Google blue color
              _hover={{
                bg: "#4a628a",
                color: "white",
              }}
              _focus={{
                borderColor: "#4a628a",
              }}
            >
              Continue with Google
            </Button>

            <Divider my="4" borderColor="#e0e0e0" /> {/* Light gray divider */}

            {/* Email Input */}
            <FormControl id="email" isRequired>
              <FormLabel fontSize="sm" color="black" fontWeight="medium">
                Email
              </FormLabel>
              <Input
  type="email"
  placeholder="Enter your email"
  value={email}
  color="black"
  onChange={(e) => setEmail(e.target.value)}
  focusBorderColor="#4285F4"
  borderColor="#e0e0e0"
  borderWidth="1px"
  _hover={{ borderColor: "#4285F4" }}
  _focus={{ borderColor: "#4285F4" }}
  placeholderColor="gray.400" // Set a visible color for the placeholder
/>
            </FormControl>

            {/* Password Input */}
            <FormControl id="password" isRequired>
              <FormLabel fontSize="sm" color="black" fontWeight="medium">
                Password
              </FormLabel>
              <InputGroup>
              <Input
  type={showPassword ? "text" : "password"}
  placeholder="Enter your password"
  value={password}
  color="black"
  onChange={(e) => setPassword(e.target.value)}
  focusBorderColor="#4285F4"
  borderColor="#e0e0e0"
  borderWidth="1px"
  _hover={{ borderColor: "#4285F4" }}
  _focus={{ borderColor: "#4285F4" }}
  placeholderColor="gray.400" // Set a visible color for the placeholder
/>
                <InputRightElement>
                  <IconButton
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    icon={showPassword ? <HiEyeOff /> : <HiEye />}
                    onClick={() => setShowPassword(!showPassword)}
                    variant="link"
                    _hover={{ bg: "transparent" }}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            {/* reCAPTCHA */}
            <Box display="flex" justifyContent="center" mt="4">
              <ReCAPTCHA
                sitekey="6LchNHgqAAAAAMgvERINOjrK9Bsmvquidlxht9vl"
                onChange={handleRecaptchaChange}
                ref={recaptchaRef}
              />
            </Box>

            {/* Login Button */}
            <Button
              colorScheme="blue"
              width="full"
              onClick={handleManualLogin}
              isLoading={loading}
              borderRadius="4px"
              _hover={{
                bg: "blue.600",
                color: "white",
              }}
              mt="6"
            >
              Login
            </Button>
          </Stack>

          {/* Info Text */}
          <Text mt="4" fontSize="sm" textAlign="center" color="gray.600">
            Not your computer? Use a private browsing window to login.
          </Text>
        </Box>
      </Box>
    </Flex>
  );
};

export default Login;