import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import axios from 'axios';
import BuksuLogo from '../assets/buksuTransparent.png';

const drawerWidth = 240;

const Layout = (props) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null); // State to store user data
  const [anchorEl, setAnchorEl] = useState(null); // State for menu anchor
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false); // State for modal visibility
  const [newPassword, setNewPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const location = useLocation();
  const navigate = useNavigate(); // To handle navigation after logout

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget); // Open dropdown menu
  };

  const handleMenuClose = () => {
    setAnchorEl(null); // Close dropdown menu
  };

  const handleOpenChangePassword = () => {
    setIsChangePasswordOpen(true); // Open modal
    handleMenuClose(); // Close dropdown
  };

  const handleCloseChangePassword = () => {
    setIsChangePasswordOpen(false); // Close modal
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

  const container = window !== undefined ? () => window().document.body : undefined;

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/auth/status', { withCredentials: true });
        if (response.data.user) {
          setUser(response.data.user); // Store user data
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUser();
  }, []);

  const drawer = (
    <List>
      <ListItemButton
        component={Link}
        to="/dashboard"
        sx={{
          backgroundColor: location.pathname === '/dashboard' ? 'primary.main' : 'inherit',
          color: location.pathname === '/dashboard' ? 'white' : 'inherit',
          '&:hover': {
            backgroundColor: location.pathname === '/dashboard' ? 'primary.dark' : 'action.hover',
          },
        }}
      >
        <ListItemIcon sx={{ color: location.pathname === '/dashboard' ? 'white' : 'inherit' }}>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
      <ListItemButton
        component={Link}
        to="/dashboard/inventory"
        sx={{
          backgroundColor: location.pathname === '/dashboard/inventory' ? 'primary.main' : 'inherit',
          color: location.pathname === '/dashboard/inventory' ? 'white' : 'inherit',
          '&:hover': {
            backgroundColor: location.pathname === '/dashboard/inventory' ? 'primary.dark' : 'action.hover',
          },
        }}
      >
        <ListItemIcon sx={{ color: location.pathname === '/dashboard/inventory' ? 'white' : 'inherit' }}>
          <InventoryIcon />
        </ListItemIcon>
        <ListItemText primary="Inventory" />
      </ListItemButton>
    </List>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <img
              src={BuksuLogo}
              alt="BUKSU Logo"
              style={{ width: 40, height: 40, marginRight: 8 }}
            />
            <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'inline' }}>
              GEMS
            </Typography>
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

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 1,
          pt: { xs: 11, sm: 11 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Outlet />
      </Box>

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

Layout.propTypes = {
  window: PropTypes.func,
};

export default Layout;
