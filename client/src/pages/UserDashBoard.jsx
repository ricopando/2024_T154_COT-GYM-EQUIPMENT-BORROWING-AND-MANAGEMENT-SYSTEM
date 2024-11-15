import React from "react";
import { Box, Button, Container, Flex, Grid, Heading, Text, Menu, MenuButton, MenuList, MenuItem, Skeleton, SkeletonText, useBreakpointValue } from "@chakra-ui/react";
import { FaRegUserCircle } from "react-icons/fa";

function UserDashboard() {
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Retrieve user data from localStorage
  const user = JSON.parse(localStorage.getItem('user')) || {};
  
  return (
    <Box>
      {/* Navbar */}
      <Box as="nav" bg="gray.800" py={4} boxShadow="md">
        <Container maxW="container.lg" display="flex" alignItems="center" justifyContent="space-between">
          <Box bg="gray.700" width="150px" height="50px" borderRadius="md" /> {/* Placeholder for logo */}
          <Flex align="center">
            <Button colorScheme="blue" variant="link" mr={4}>Home</Button>
            <Button colorScheme="blue" variant="link" mr={4}>Borrows</Button>
            <Button colorScheme="blue" variant="link" mr={4}>About Us</Button>
            {/* User Dropdown */}
            <Menu>
              <MenuButton
                as={Button}
                variant="link"
                color="white"
                fontSize="xl"
                icon={<FaRegUserCircle />}
              />
              <MenuList>
                <MenuItem>Profile</MenuItem>
                <MenuItem>Settings</MenuItem>
                <MenuItem>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="container.lg" py={8}>
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
          {/* Left Side: Dashboard Content */}
          <Box>
            <Heading as="h1" size="2xl" mb={4} color="blue.500">
              GYM EQUIPMENT MANAGEMENT AND BORROWING SYSTEM
            </Heading>
            <Text fontSize="xl" color="gray.600" mb={8}>
              Welcome to your dashboard, {user.name}! Your email: {user.email}.
            </Text>

            {/* Skeleton Loader for Equipment Categories */}
            <Grid templateColumns={{ base: "1fr", sm: "repeat(3, 1fr)" }} gap={4}>
              <Box>
                <Skeleton height="200px" borderRadius="md" />
              </Box>
              <Box>
                <Skeleton height="200px" borderRadius="md" />
              </Box>
              <Box>
                <Skeleton height="200px" borderRadius="md" />
              </Box>
            </Grid>

            <Button mt={4} colorScheme="blue" size="lg" w="full" _hover={{ bg: "blue.600" }}>
              BORROW
            </Button>
          </Box>

          {/* Right Side: Welcome Image Placeholder */}
          <Box display={{ base: "none", md: "block" }}>
            <Skeleton height="300px" borderRadius="md" />
          </Box>
        </Grid>
      </Container>
    </Box>
  );
}

export default UserDashboard;
