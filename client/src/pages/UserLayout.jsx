import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom'; // Import Outlet here
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import PropTypes from 'prop-types';
import axios from 'axios';
import BuksuLogo from '../assets/buksuTransparent.png';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';

// Add navigation items constant
const navigationItems = [
  { path: '/catalog', label: 'Catalog' },
  { path: '/catalog/borrow', label: 'Borrow' },
  { path: '/favorites', label: 'Favorites' },
  { path: '/developer', label: 'Developer' },
  { path: '/about', label: 'About' },
  { path: '/catalog/borrowlist', label: 'List' }
];

const UserLayout = (props) => {
  const { window } = props;
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selected, setSelected] = useState('/catalog'); // Set Catalog as the default selected path
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false); // State for modal visibility
  const [newPassword, setNewPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:8000/api/auth/logout', { 
        withCredentials: true 
      });
      setUser(null);  // Reset the user state to null
      navigate('/');  // Navigate to home/login page
    } catch (error) {
      console.error('Error during logout:', error);
      alert('Failed to log out. Please try again.');
    } finally {
      handleMenuClose();
    }
  };

  const handleOpenChangePassword = () => {
    setIsChangePasswordOpen(true); // Open modal
    handleMenuClose(); // Close menu
  };

  const handleCloseChangePassword = () => {
    setIsChangePasswordOpen(false); // Close modal
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== verifyPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      await axios.post(
        'http://localhost:8000/api/auth/change-password',
        { newPassword },
        { withCredentials: true }
      );
      alert('Password changed successfully');
      setNewPassword('');
      setVerifyPassword('');
      setIsChangePasswordOpen(false); // Close modal
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Error changing password. Please try again later.');
    }
  };

  const handleMenuItemClick = (path) => {
    setSelected(path); // Set the selected menu item
    navigate(path); // Navigate to the selected route
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Add drawer content component
  const drawerContent = (
    <Box sx={{ width: 240, pt: 8 }}>
      {navigationItems.map((item) => (
        <Button
          key={item.path}
          fullWidth
          onClick={() => {
            handleMenuItemClick(item.path);
            handleDrawerToggle();
          }}
          sx={{
            py: 2,
            justifyContent: 'flex-start',
            pl: 3,
            backgroundColor: selected === item.path ? 'action.selected' : 'transparent',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          {item.label}
        </Button>
      ))}
    </Box>
  );

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/auth/status', { withCredentials: true });
        if (response.data.user) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUser();
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar 
        position="fixed" 
        sx={{ 
          backgroundColor: '#1976d2',
          color: 'white',
          boxShadow: 1
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: { xs: 2, sm: 4 } }}>
          {/* Logo Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { sm: 'none' }, mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
            <img 
              src={BuksuLogo} 
              alt="BUKSU Logo" 
              style={{ 
                width: 40, 
                height: 40,
                display: 'block'
              }} 
            />
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 'bold', 
                color: 'primary.main',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              GEMS
            </Typography>
          </Box>

          {/* Navigation Menu - Desktop */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                onClick={() => handleMenuItemClick(item.path)}
                sx={{
                  px: 2,
                  py: 1,
                  color: 'white',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: 2,
                    backgroundColor: 'white',
                    transform: selected === item.path ? 'scaleX(1)' : 'scaleX(0)',
                    transition: 'transform 0.2s ease-in-out'
                  },
                  '&:hover::after': {
                    transform: 'scaleX(1)'
                  }
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* User Menu */}
          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                alt={user.givenName}
                src={user.image || '/default-avatar.png'}
                sx={{
                  cursor: 'pointer',
                  width: { xs: 32, sm: 40 },
                  height: { xs: 32, sm: 40 },
                  border: 1,
                  borderColor: 'primary.main'
                }}
                onClick={handleAvatarClick}
              />
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  elevation: 3,
                  sx: { mt: 1, minWidth: 200 }
                }}
              >
                <MenuItem disabled sx={{ opacity: 0.7 }}>
                  <Typography variant="body2">{user.email}</Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleOpenChangePassword}>
                  <Typography>Change Password</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Typography color="error">Log Out</Typography>
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <CircularProgress size={24} />
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Updated Dialog styling */}
      <Dialog 
        open={isChangePasswordOpen} 
        onClose={handleCloseChangePassword}
        PaperProps={{
          elevation: 3,
          sx: { p: 2, minWidth: 400 }
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>Change Password</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            Please enter your new password and confirm it to proceed.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Confirm Password"
            type="password"
            fullWidth
            value={verifyPassword}
            onChange={(e) => setVerifyPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ pt: 3 }}>
          <Button onClick={handleCloseChangePassword} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleChangePassword} 
            variant="contained"
            color="primary"
          >
            Change Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* Main content area */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, sm: 3 }, 
          pt: { xs: 8, sm: 12 }, 
          backgroundColor: 'grey.50'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

UserLayout.propTypes = {
  window: PropTypes.func,
};

export default UserLayout;
