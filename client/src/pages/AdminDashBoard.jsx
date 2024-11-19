import React, { useEffect, useState } from 'react';
import { Flex, Box, Text, Spinner, Alert, Stack, useBreakpointValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoAlertFill } from 'react-icons/go';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const AdminDashBoard = () => {
  const [userdata, setUserdata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const isSidebarDefaultOpen = useBreakpointValue({ base: false, md: true });
  const navigate = useNavigate();

  useEffect(() => {
    setIsSidebarOpen(isSidebarDefaultOpen);
  }, [isSidebarDefaultOpen]);

  const getUser = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/auth/status", { withCredentials: true });
      if (response.data.user) {
        setUserdata(response.data.user);
        setIsAdmin(response.data.user.role === 'Admin');
      } else {
        setError('You are not authenticated.');
        navigate("/");
      }
    } catch (error) {
      console.error("Error in authentication:", error);
      setError('An error occurred while fetching user data.');
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleSidebarToggle = () => setIsSidebarOpen(!isSidebarOpen);
  const handleLogout = () => navigate("/");

  if (loading) {
    return (
      <Flex align="center" justify="center" height="100vh" bg="gray.100">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex align="center" justify="center" height="100vh">
        <Alert status="error" borderRadius="md" maxWidth="500px" width="100%" textAlign="center">
          <GoAlertFill style={{ marginRight: '8px' }} />
          {error}
        </Alert>
      </Flex>
    );
  }

  if (!isAdmin) {
    return (
      <Flex align="center" justify="center" height="100vh">
        <Alert status="error" borderRadius="md" maxWidth="500px" width="100%" textAlign="center">
          <GoAlertFill style={{ marginRight: '8px' }} />
          You are not authorized to access this page.
        </Alert>
      </Flex>
    );
  }

  return (
    <Box width="100vw" height="100vh" overflow="hidden">
      <Flex direction="column" height="100%">
        {/* Navbar */}
        <Navbar userdata={userdata} onSidebarToggle={handleSidebarToggle} onLogout={handleLogout} />

        <Flex flex="1" direction="row" overflow="hidden">
          {/* Sidebar */}
          <Sidebar userdata={userdata} isSidebarOpen={isSidebarOpen} />

          <Box
            bg="#ffffff"
            flex="1"
            p="6"
            overflowY="auto"
            boxShadow="md"
            maxH="100vh"
          >
            {/* Welcome Section */}
            <Text fontSize="2xl" fontWeight="bold" color="gray.800" mb="6">
              Welcome, {userdata?.name}!
            </Text>

            {/* Dashboard Stats */}
            <Stack direction={{ base: 'column', md: 'row' }} spacing="6" mb="6" flexWrap="wrap">
              <Box
                bg="#12203A"
                color="white"
                flex="1"
                borderRadius="md"
                boxShadow="md"
                p="4"
                height={{ base: '150px', md: '180px', lg: '200px' }}
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
              >
                <Text fontWeight="bold" mb="3">Pending</Text>
                <Text color="gray.500" fontSize="sm">Overview of key statistics will go here.</Text>
              </Box>

              <Box
                bg="#12203A"
                color="white"
                flex="1"
                borderRadius="md"
                boxShadow="md"
                p="4"
                height={{ base: '150px', md: '180px', lg: '200px' }}
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
              >
                <Text fontWeight="bold" mb="3">Approve</Text>
                <Text color="gray.500" fontSize="sm">Number of active users will go here.</Text>
              </Box>

              <Box
                bg="#12203A"
                color="white"
                flex="1"
                borderRadius="md"
                boxShadow="md"
                p="4"
                height={{ base: '150px', md: '180px', lg: '200px' }}
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
              >
                <Text fontWeight="bold" mb="3">Declined</Text>
                <Text color="gray.500" fontSize="sm">Number of active users will go here.</Text>
              </Box>
            </Stack>

            {/* Additional Content */}
            {/* Add any additional content or sections here as needed */}
          </Box>
        </Flex >
      </Flex >
    </Box >
  );
};

export default AdminDashBoard;
