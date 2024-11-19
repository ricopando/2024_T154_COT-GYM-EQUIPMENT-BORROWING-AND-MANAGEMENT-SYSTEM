import React from 'react';
import { Box, Button, Container, Flex, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { FaRegUserCircle } from 'react-icons/fa';
import BuksuLogo from '../assets/buksuTransparent.png';  // Assuming the path to the logo

const NavbarUser = () => {
  return (
    <Box as="nav" py={4} boxShadow="md" style={{ background: "#12203A" }}>
      <Container maxW="container.lg" display="flex" alignItems="center" justifyContent="space-between">
        <div>
          <img src={BuksuLogo} alt="Logo" style={{ width: "3rem" }} />
        </div>
        <Flex align="center">
          <Button variant="link" mr={4} style={{ color: "white" }}>Home</Button>
          <Button variant="link" mr={4} style={{ color: "white" }}>Borrows</Button>
          <Button variant="link" mr={4} style={{ color: "white" }}>About Us</Button>

          {/* User Dropdown */}
          <Menu>
            <MenuButton as={Button} variant="link" color="white" fontSize="xl" icon={<FaRegUserCircle />}/>
            <MenuList>
              <MenuItem>Profile</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuItem>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Container>
    </Box>
  );
};

export default NavbarUser;
