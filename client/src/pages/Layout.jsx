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
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CircularProgress from '@mui/material/CircularProgress';
import PeopleIcon from '@mui/icons-material/People';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

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
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(false);

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
      const response = await axios.get('http://localhost:8000/api/auth/logout', {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data) {
        setUser(null);
        navigate('/');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      // If there's a network error, try a fallback logout
      setUser(null);
      navigate('/');
    } finally {
      handleMenuClose();
    }
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

  const handleDrawerCollapse = () => {
    setIsDrawerCollapsed(!isDrawerCollapsed);
  };

  const drawer = (
    <>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'primary.main',
          color: 'white'
        }}
      >
        {!isDrawerCollapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <img
              src={BuksuLogo}
              alt="BUKSU Logo"
              style={{ 
                width: 40, 
                height: 40,
                filter: 'brightness(0) invert(1)'
              }}
            />
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                color: 'white'
              }}
            >
              GEMS
            </Typography>
          </Box>
        )}
        <IconButton 
          onClick={handleDrawerCollapse}
          sx={{
            color: 'white',
            '&:hover': { 
              backgroundColor: 'primary.dark'
            }
          }}
        >
          {isDrawerCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>
      <List sx={{ px: 1, py: 2 }}>
        <ListItemButton
          component={Link}
          to="/dashboard"
          sx={{
            minHeight: 48,
            mb: 1,
            justifyContent: isDrawerCollapsed ? 'center' : 'initial',
            backgroundColor: location.pathname === '/dashboard' ? 'primary.main' : 'transparent',
            color: location.pathname === '/dashboard' ? 'white' : 'text.primary',
            borderRadius: 1,
            '&:hover': {
              backgroundColor: location.pathname === '/dashboard' 
                ? 'primary.dark' 
                : 'action.hover',
            },
          }}
        >
          <ListItemIcon 
            sx={{ 
              minWidth: 0, 
              mr: isDrawerCollapsed ? 0 : 3,
              justifyContent: 'center',
              color: location.pathname === '/dashboard' ? 'white' : 'inherit' 
            }}
          >
            <DashboardIcon />
          </ListItemIcon>
          {!isDrawerCollapsed && <ListItemText primary="Dashboard" />}
        </ListItemButton>
        <ListItemButton
          component={Link}
          to="/dashboard/users"
          sx={{
            minHeight: 48,
            mb: 1,
            justifyContent: isDrawerCollapsed ? 'center' : 'initial',
            backgroundColor: location.pathname === '/dashboard/users' ? 'primary.main' : 'transparent',
            color: location.pathname === '/dashboard/users' ? 'white' : 'text.primary',
            borderRadius: 1,
            '&:hover': {
              backgroundColor: location.pathname === '/dashboard/users' 
                ? 'primary.dark' 
                : 'action.hover',
            },
          }}
        >
          <ListItemIcon 
            sx={{ 
              minWidth: 0, 
              mr: isDrawerCollapsed ? 0 : 3,
              justifyContent: 'center',
              color: location.pathname === '/dashboard/users' ? 'white' : 'inherit' 
            }}
          >
            <PeopleIcon />
          </ListItemIcon>
          {!isDrawerCollapsed && <ListItemText primary="User Management" />}
        </ListItemButton>
        <ListItemButton
          component={Link}
          to="/dashboard/inventory"
          sx={{
            minHeight: 48,
            justifyContent: isDrawerCollapsed ? 'center' : 'initial',
            backgroundColor: location.pathname === '/dashboard/inventory' ? 'primary.main' : 'inherit',
            color: location.pathname === '/dashboard/inventory' ? 'white' : 'inherit',
            '&:hover': {
              backgroundColor: location.pathname === '/dashboard/inventory' ? 'primary.dark' : 'action.hover',
            },
          }}
        >
          <ListItemIcon 
            sx={{ 
              minWidth: 0, 
              mr: isDrawerCollapsed ? 0 : 3,
              justifyContent: 'center',
              color: location.pathname === '/dashboard/inventory' ? 'white' : 'inherit' 
            }}
          >
            <InventoryIcon />
          </ListItemIcon>
          {!isDrawerCollapsed && <ListItemText primary="Inventory" />}
        </ListItemButton>
       

        <ListItemButton
          component={Link}
          to="/dashboard/transactions"
          sx={{
            minHeight: 48,
            mb: 1,
            justifyContent: isDrawerCollapsed ? 'center' : 'initial',
            backgroundColor: location.pathname.includes('/dashboard/transactions') ? 'primary.main' : 'transparent',
            color: location.pathname.includes('/dashboard/transactions') ? 'white' : 'text.primary',
            borderRadius: 1,
            '&:hover': {
              backgroundColor: location.pathname.includes('/dashboard/transactions') 
                ? 'primary.dark' 
                : 'action.hover',
            },
          }}
        >
          <ListItemIcon 
            sx={{ 
              minWidth: 0, 
              mr: isDrawerCollapsed ? 0 : 3,
              justifyContent: 'center',
              color: location.pathname.includes('/dashboard/transactions') ? 'white' : 'inherit' 
            }}
          >
            <SwapHorizIcon />
          </ListItemIcon>
          {!isDrawerCollapsed && <ListItemText primary="Transactions" />}
        </ListItemButton>
      </List>
    </>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${isDrawerCollapsed ? 65 : drawerWidth}px)` },
          ml: { sm: `${isDrawerCollapsed ? 65 : drawerWidth}px` },
          transition: 'width 0.2s, margin-left 0.2s',
          backgroundColor: 'primary.main',
          color: 'white',
          borderBottom: '1px solid',
          borderColor: 'primary.dark',
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
          {user ? (
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                ml: 'auto'
              }}
            >
              <Typography 
                variant="subtitle2" 
                color="text.secondary"
                sx={{ display: { xs: 'none', sm: 'block' } }}
              >
                {user.givenName}
              </Typography>
              <Avatar
                alt={user.givenName}
                src={user.image || '/default-avatar.png'}
                sx={{ 
                  cursor: 'pointer',
                  width: 40,
                  height: 40,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
                onClick={handleAvatarClick}
              />
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={{ 
                  mt: 1,
                  '& .MuiPaper-root': {
                    minWidth: 200,
                    boxShadow: 'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px'
                  }
                }}
              >
                <MenuItem onClick={handleOpenChangePassword}>Change Password</MenuItem>
                <MenuItem onClick={handleLogout}>Log Out</MenuItem>
              </Menu>
            </Box>
          ) : (
            <CircularProgress size={24} sx={{ ml: 'auto' }} />
          )}
        </Toolbar>
      </AppBar>

      <Box 
        component="nav" 
        sx={{ 
          width: { sm: isDrawerCollapsed ? 65 : drawerWidth }, 
          flexShrink: { sm: 0 },
          transition: 'width 0.2s'
        }}
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: isDrawerCollapsed ? 65 : drawerWidth,
              transition: 'width 0.2s',
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
              width: isDrawerCollapsed ? 65 : drawerWidth,
              transition: 'width 0.2s',
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
          width: { sm: `calc(100% - ${isDrawerCollapsed ? 65 : drawerWidth}px)` },
          transition: 'width 0.2s',
          direction: 'ltr',
        }}
      >
        <Outlet />
      </Box>

      <Dialog 
        open={isChangePasswordOpen} 
        onClose={handleCloseChangePassword}
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxWidth: 400
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>Change Password</DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
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
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleCloseChangePassword} 
            variant="outlined"
            sx={{ borderRadius: 1 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleChangePassword} 
            variant="contained"
            sx={{ borderRadius: 1 }}
          >
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
