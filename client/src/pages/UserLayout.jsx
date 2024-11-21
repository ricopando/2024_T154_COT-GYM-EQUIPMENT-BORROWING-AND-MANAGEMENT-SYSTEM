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

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/auth/logout', {}, { withCredentials: true });
      console.log('Logged out successfully', response);
      setUser(null);  // Reset the user state to null
      navigate('/'); // Redirect to the login page
    } catch (error) {
      console.error('Error during logout:', error);
      alert('Failed to log out. Please try again.');
    }
    handleMenuClose();
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
      <AppBar position="fixed">
        <Toolbar sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <img src={BuksuLogo} alt="BUKSU Logo" style={{ width: 40, height: 40 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              GEMS
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1, justifyContent: 'center' }}>
          <MenuItem
              onClick={() => handleMenuItemClick('/catalog')}
              sx={{
                backgroundColor: selected === '/catalog' ? 'rgba(0, 0, 0, 0.1)' : 'transparent', // Highlight when selected
                '&:hover': {
                  backgroundColor: selected === '/catalog' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.08)', // Highlight on hover
                },
                borderBottom: selected === '/catalog' ? '2px solid #1976d2' : 'none', // Underline for selected
              }}
            >
          
              Catalog
            </MenuItem>
            <MenuItem
              onClick={() => handleMenuItemClick('/borrow')}
              sx={{
                backgroundColor: selected === '/borrow' ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: selected === '/borrow' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.08)',
                },
                borderBottom: selected === '/borrow' ? '2px solid #1976d2' : 'none',
              }}
            >
            
              Borrow
            </MenuItem>
            <MenuItem
              onClick={() => handleMenuItemClick('/favorites')}
              sx={{
                backgroundColor: selected === '/favorites' ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: selected === '/favorites' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.08)',
                },
                borderBottom: selected === '/favorites' ? '2px solid #1976d2' : 'none',
              }}
            >
             
              Favorites
            </MenuItem>
            <MenuItem
              onClick={() => handleMenuItemClick('/developer')}
              sx={{
                backgroundColor: selected === '/developer' ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: selected === '/developer' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.08)',
                },
                borderBottom: selected === '/developer' ? '2px solid #1976d2' : 'none',
              }}
            >
             
              Developer
            </MenuItem>
            <MenuItem
              onClick={() => handleMenuItemClick('/about')}
              sx={{
                backgroundColor: selected === '/about' ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: selected === '/about' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.08)',
                },
                borderBottom: selected === '/about' ? '2px solid #1976d2' : 'none',
              }}
            >
            
              About
            </MenuItem>
            <MenuItem
              onClick={() => handleMenuItemClick('/list')}
              sx={{
                backgroundColor: selected === '/list' ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: selected === '/list' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.08)',
                },
                borderBottom: selected === '/list' ? '2px solid #1976d2' : 'none',
              }}
            >
            
              List
            </MenuItem>
          </Box>
          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                alt={user.givenName}
                src={user.image || '/default-avatar.png'}
                sx={{ cursor: 'pointer' }}
                onClick={handleAvatarClick}
              />
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={{ mt: 1 }}
              >
                <MenuItem disabled>
                  <Typography variant="body2">{user.email}</Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleOpenChangePassword}>Change Password</MenuItem>
                <MenuItem onClick={handleLogout}>Log Out</MenuItem>
              </Menu>
            </Box>
          ) : (
            <Typography variant="body1">Loading...</Typography>
          )}
        </Toolbar>
      </AppBar>

      {/* Main content area */}
      <Box component="main" sx={{ flexGrow: 1, p: 1, pt: { xs: 11, sm: 11 }, width: '100%' }}>
        <Outlet /> {/* This will render child components like Catalog, Borrow, etc. */}
      </Box>

      {/* Password Change Dialog */}
      <Dialog open={isChangePasswordOpen} onClose={handleCloseChangePassword}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
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
        <DialogActions>
          <Button onClick={handleCloseChangePassword} color="primary">
            Cancel
          </Button>
          <Button onClick={handleChangePassword} color="primary">
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

UserLayout.propTypes = {
  window: PropTypes.func,
};

export default UserLayout;
