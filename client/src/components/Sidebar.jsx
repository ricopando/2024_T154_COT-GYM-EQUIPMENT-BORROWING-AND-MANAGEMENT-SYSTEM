import React from 'react';
import { Box, Button, Text, VStack, Image, Icon, useBreakpointValue } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';  // Import useLocation
import { MdDashboard, MdSettings, MdInventory } from 'react-icons/md';
import { FaUserFriends } from 'react-icons/fa';

const Sidebar = ({ userdata, isSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();  // Get current location

  // Define the sidebar's width and display styles based on screen size
  const sidebarWidth = useBreakpointValue({ base: isSidebarOpen ? '100vw' : '0', md: isSidebarOpen ? '250px' : '0' });
  const displayStyle = useBreakpointValue({ base: isSidebarOpen ? 'block' : 'none', md: 'block' });
  const positionStyle = useBreakpointValue({ base: isSidebarOpen ? 'fixed' : 'relative', md: 'relative' });

  // Determine active link based on the current route
  const getActiveLink = (path) => location.pathname === path;

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
        <Text fontSize="lg" fontWeight="bold" color="white">
          {userdata?.displayName || 'Admin'}
        </Text>

        {/* Sidebar navigation links */}
        <SidebarLink 
          icon={MdDashboard} 
          label="Dashboard" 
          onClick={() => navigate('/admin-dashboard')} 
          isActive={getActiveLink('/admin-dashboard')}  // Use getActiveLink to check if this is the active route
        />
        <SidebarLink 
          icon={FaUserFriends} 
          label="User Management" 
          onClick={() => navigate('/user-management')} 
          isActive={getActiveLink('/user-management')} 
        />
        <SidebarLink 
          icon={MdInventory} 
          label="Inventory" 
          onClick={() => navigate('/admin-inventory')} 
          isActive={getActiveLink('/admin-inventory')}  // Use getActiveLink here as well
        />
        <SidebarLink 
          icon={MdSettings} 
          label="Borrow" 
          onClick={() => navigate('/borrow')} 
          isActive={getActiveLink('/borrow')} 
        />
        <SidebarLink 
          icon={MdSettings} 
          label="Settings" 
          onClick={() => navigate('/settings')} 
          isActive={getActiveLink('/settings')} 
        />
      </VStack>
    </Box>
  );
};

const SidebarLink = ({ icon, label, onClick, isActive }) => (
  <Button
    variant="ghost"
    color="white"
    width="100%"
    justifyContent="flex-start"
    leftIcon={<Icon as={icon} />}
    onClick={onClick}
    fontWeight={isActive ? 'bold' : 'medium'}
    bg={isActive ? 'blue.600' : 'transparent'}
    _hover={{
      bg: isActive ? 'blue.700' : '#2c3e50',
      transform: 'scale(1.05)',
    }}
    _active={{
      bg: 'blue.800',
      fontWeight: 'bold',
    }}
    _focus={{
      bg: isActive ? 'blue.700' : '#2c3e50',
      outline: 'none',
    }}
    transition="all 0.2s ease"
  >
    {label}
  </Button>
);

export default Sidebar;
