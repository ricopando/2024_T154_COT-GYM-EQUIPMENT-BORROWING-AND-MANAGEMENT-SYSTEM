import React from 'react';
import { Box, Button, Text, VStack, Image, Icon, useBreakpointValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { MdDashboard, MdSettings, MdInventory } from 'react-icons/md';
import { FaUserFriends } from 'react-icons/fa';

const Sidebar = ({ userdata, isSidebarOpen }) => {
  const navigate = useNavigate();

  // Define the sidebar's width and display styles based on screen size
  const sidebarWidth = useBreakpointValue({ base: isSidebarOpen ? '100vw' : '0', md: isSidebarOpen ? '250px' : '0' });
  const displayStyle = useBreakpointValue({ base: isSidebarOpen ? 'block' : 'none', md: 'block' });
  const positionStyle = useBreakpointValue({ base: isSidebarOpen ? 'fixed' : 'relative', md: 'relative' });

  return (
    <Box
      as="nav"
      bg="#12203A"
      color="white"
      width={sidebarWidth}
      height="100vh"
      position={positionStyle}
      p={isSidebarOpen ? '4' : '0'}
      display={displayStyle}
      transition="width 0.3s ease, padding 0.3s ease"
      overflow="hidden"
      zIndex="overlay"
    >
      <VStack align="center" spacing="6" w="full">
        {/* User profile */}
        <Image
          src={userdata?.image || 'https://via.placeholder.com/100'}
          boxSize="70px"
          borderRadius="full"
          alt="Admin"
        />
        <Text fontSize="lg" fontWeight="bold">
          {userdata?.displayName || 'Admin'}
        </Text>

        {/* Sidebar navigation links */}
        <SidebarLink icon={MdDashboard} label="Dashboard" onClick={() => navigate('/admin-dashboard')} />
        <SidebarLink icon={FaUserFriends} label="User Management" onClick={() => navigate('/user-management')} />
        <SidebarLink icon={MdInventory} label="Inventory" onClick={() => navigate('/admin-inventory')} />
        <SidebarLink icon={MdSettings} label="Borrow" onClick={() => navigate('/borrow')} />
        <SidebarLink icon={MdSettings} label="Settings" onClick={() => navigate('/settings')} />
      </VStack>
    </Box>
  );
};

const SidebarLink = ({ icon, label, onClick }) => (
  <Button
    variant="ghost"
    colorScheme="whiteAlpha"
    width="100%"
    justifyContent="flex-start"
    leftIcon={<Icon as={icon} />}
    onClick={onClick}
    fontWeight="medium"
  // _hover={{ bg: '#12203A' }}
  // _active={{ fontWeight: 'bold', bg: 'teal.800' }}
  >
    {label}
  </Button>
);

export default Sidebar;
