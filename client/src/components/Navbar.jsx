import React from 'react';
import { Button, HStack, Text, IconButton, useBreakpointValue } from '@chakra-ui/react';
import { MdLogout } from 'react-icons/md';
import { CiMenuFries } from 'react-icons/ci';

const Navbar = ({ userdata, onSidebarToggle, onLogout }) => {
  // Define the Navbar layout for different screen sizes
  const showMenuIcon = useBreakpointValue({ base: true, md: false });

  return (
    <HStack
      as="header"
      bg="#12203A"
      color="white"
      p={{ base: '4', md: '6' }}
      justify="space-between"
      align="center"
      spacing={{ base: '4', md: '6' }}
    >
      {/* Menu Icon for mobile */}
      {showMenuIcon && (
        <IconButton
          icon={<CiMenuFries />}
          aria-label="Toggle Sidebar"
          variant="outline"
          color="black"
          onClick={onSidebarToggle}
        />
      )}

      {/* Dashboard Title */}
      <Button variant="link" color="white" fontSize={{ base: 'lg', md: 'xl' }}>
        Admin Dashboard
      </Button>

      {/* User Info and Logout */}
      <HStack spacing="4">
        <Text>{userdata?.name}</Text>
        <Button variant="link" color="white" onClick={onLogout}>
          <MdLogout size={24} />
        </Button>
      </HStack>
    </HStack>
  );
};

export default Navbar;
