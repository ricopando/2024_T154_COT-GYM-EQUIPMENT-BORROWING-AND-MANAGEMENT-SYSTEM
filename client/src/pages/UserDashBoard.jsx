import React from "react";
import { Box, Button, Container, Flex, Grid, Heading, Text, Menu, MenuButton, MenuList, MenuItem, Skeleton, SkeletonText, useBreakpointValue } from "@chakra-ui/react";
import { FaRegUserCircle } from "react-icons/fa";


import "./index.css"
import BuksuLogo from '../assets/buksuTransparent.png';
import sportsImg from '../assets/sports.jpg'
import electronicsImg from '../assets/electronicsImg.png'
import furnitureImg from '../assets/furnitureImg.jpg'
import welcomeImg from '../assets/welcomeImg.jpg'



function UserDashboard() {
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Retrieve user data from localStorage
  const user = JSON.parse(localStorage.getItem('user')) || {};

  return (
    <Box>
      {/* Navbar */}
      <Box as="nav" py={4} boxShadow="md" style={{ background: "#12203A" }} >
        <Container maxW="container.lg" display="flex" alignItems="center" justifyContent="space-between">
          <div><img src={BuksuLogo} alt="" style={{ width: "5rem" }} /></div>{/* Placeholder for logo */}
          <Flex align="center">
            <Button variant="link" mr={4} style={{ color: "white" }}>Home</Button>
            <Button variant="link" mr={4} style={{ color: "white" }}>Borrows</Button>
            <Button variant="link" mr={4} style={{ color: "white" }}>About Us</Button>
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
            <Heading as="h1" size="2xl" mb={4} style={{ color: "black", fontFamily: "Poppins, sans-serif" }}>
              GYM EQUIPMENT MANAGEMENT AND BORROWING SYSTEM
            </Heading>
            <Text fontSize="xl" color="gray.600" mb={8} style={{ color: "black", fontFamily: "Poppins, sans-serif" }}>
              Welcome to your dashboard, {user.name}! Your email: {user.email}.
            </Text>

            {/* Skeleton Loader for Equipment Categories */}
            <Grid templateColumns={{ base: "1fr", sm: "repeat(3, 1fr)" }} gap={4}>
              <div>
                <img src={sportsImg} alt="" style={{ height: "12rem" }} />
              </div>

              <div>
                <img src={electronicsImg} alt="" style={{ height: "12rem" }} />
              </div>

              <div>
                <img src={furnitureImg} alt="" style={{ height: "12rem" }} />
              </div>


            </Grid>

            <Button mt={4} style={{ background: "#12203A", color: "white" }} size="lg" w="full" _hover={{ bg: "blue.600" }}>
              BORROW
            </Button>
          </Box>

          {/* Right Side: Welcome Image Placeholder */}
          <Box display={{ base: "none", md: "block" }}>
            <img src={welcomeImg} alt="" style={{ height: "60vh" }} />
          </Box>
        </Grid>
      </Container>
    </Box >
  );
}

export default UserDashboard;
