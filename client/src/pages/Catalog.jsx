import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
  MenuItem,
  Select,
  FormControl,
  Tab,
  Tabs,
  Skeleton,
  Chip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'; // Import DatePicker
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; // Date adapter
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'; // Localization provider
import axios from 'axios';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import { 
  CalendarMonth,
  Info,
  Search as SearchIcon,
  FilterList as FilterIcon
} from '@mui/icons-material'; // Add to imports
import { Close, Add } from '@mui/icons-material'; // Add to imports

// Add axios default config
axios.defaults.withCredentials = true;

const Catalog = () => {
  const [equipmentItems, setEquipmentItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [startDate, setStartDate] = useState(null); // State for start date
  const [endDate, setEndDate] = useState(null); // State for end date
  const [favorites, setFavorites] = useState(new Set());
  const [activeTab, setActiveTab] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [borrowListId, setBorrowListId] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null); // Add this for debugging
  const [borrowedItems, setBorrowedItems] = useState([]); // Add state for borrowed items
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false); // State for success dialog
  
  // Add function to check authentication
  const checkAuth = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/auth/check');
      console.log('Auth status:', response.data);
      return response.data.isAuthenticated;
    } catch (error) {
      console.error('Auth check failed:', error);
      return false;
    }
  };

  // Fetch equipment data from the API
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/equipment');
        console.log('Fetched data:', response.data); // Debugging
        setEquipmentItems(response.data);
        setFilteredItems(response.data);
      } catch (error) {
        console.error('Failed to fetch equipment data:', error);
        alert('Failed to fetch equipment data.');
      }
    };
    fetchEquipment();
  }, []);

  // Fetch borrowed items data
  useEffect(() => {
    const fetchBorrowedItems = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/borrow-items', {
                withCredentials: true,
            });
            console.log('Borrowed Items:', response.data);
            setBorrowedItems(response.data);
        } catch (error) {
            console.error('Failed to fetch borrowed items:', error);
        }
    };
    fetchBorrowedItems();
}, []);


const isDateDisabled = (date, itemId) => {
  const currentDate = date.getTime();

  // Check if the date is within any approved borrow period
  const isWithinBorrowedPeriod = borrowedItems.some((borrowedItem) => {
      console.log('Checking borrowed item:', {
          equipmentId: borrowedItem.equipment?._id,
          itemId,
          status: borrowedItem.status
      });

      if (
          borrowedItem.equipment?._id === itemId && 
          borrowedItem.status === "Approved"
      ) {
          const borrowDate = new Date(borrowedItem.borrowDate).getTime();
          const returnDate = new Date(borrowedItem.returnDate).getTime();
          return currentDate >= borrowDate && currentDate <= returnDate;
      }
      return false;
  });

  console.log({
      currentDate: date.toISOString(),
      itemId,
      isWithinBorrowedPeriod
  });

  return isWithinBorrowedPeriod;
};
  // Handle search and category filtering
  const handleFilter = () => {
    let filtered = equipmentItems;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by selected category
    if (selectedCategory) {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    setFilteredItems(filtered);
  };

  useEffect(() => {
    handleFilter(); // Reapply filtering whenever searchQuery or selectedCategory changes
  }, [searchQuery, selectedCategory, equipmentItems]);

  // Handle image click to open modal
  const handleImageClick = (item) => {
    console.log('Opening modal for:', item); // Debugging
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setStartDate(null); // Reset start date
    setEndDate(null); // Reset end date
  };

  // Update getOrCreateBorrowList
  const getOrCreateBorrowList = async () => {
    try {
      // Check authentication first
      const isAuthenticated = await checkAuth();
      if (!isAuthenticated) {
        throw new Error('User not authenticated');
      }

      console.log('Fetching active borrow lists...');
      const response = await axios.get('http://localhost:8000/api/borrow-lists', {
        withCredentials: true
      });
      console.log('Received borrow lists:', response.data);
      
      const activeLists = response.data.filter(list => list.status === 'Draft');
      console.log('Active (Draft) lists:', activeLists);
      
      if (activeLists.length > 0) {
        console.log('Using existing list:', activeLists[0]._id);
        return activeLists[0]._id;
      }

      console.log('Creating new borrow list...');
      const newListResponse = await axios.post('http://localhost:8000/api/borrow-lists', {
        items: []
      }, {
        withCredentials: true
      });
      console.log('New list created:', newListResponse.data);
      
      return newListResponse.data._id;
    } catch (error) {
      console.error('Error in getOrCreateBorrowList:', error);
      if (error.response?.status === 401) {
        alert('Please log in to create a borrow list');
      }
      throw error;
    }
  };

  // Update handleAddToList
  const handleAddToList = async () => {
    try {
      // Check authentication first
      const isAuthenticated = await checkAuth();
      if (!isAuthenticated) {
        alert('Please log in to add items to your borrow list');
        return;
      }

      if (!selectedItem || !startDate || !endDate) {
        console.log('Missing required fields:', { selectedItem, startDate, endDate });
        return;
      }

      if (startDate > endDate) {
        console.log('Invalid date range:', { startDate, endDate });
        alert('End date must be after start date');
        return;
      }

      console.log('Getting/creating borrow list...');
      const listId = borrowListId || await getOrCreateBorrowList();
      console.log('Using borrow list ID:', listId);
      setBorrowListId(listId);

      // First, get the current list to append the new item
      const currentList = await axios.get(`http://localhost:8000/api/borrow-lists/${listId}`);
      const currentItems = currentList.data.items || [];

      const newItem = {
        equipment: selectedItem._id,
        borrowDate: startDate.toISOString(),
        returnDate: endDate.toISOString()
      };
      console.log('New item to add:', newItem);

      // Combine existing items with the new item
      const updatedItems = [...currentItems, newItem];

      console.log('Updating borrow list...');
      const updateResponse = await axios.put(`http://localhost:8000/api/borrow-lists/${listId}`, {
        items: updatedItems
      });
      console.log('Update response:', updateResponse.data);

      setDebugInfo({
        listId,
        newItem,
        response: updateResponse.data
      });

      handleCloseModal();
      setIsSuccessDialogOpen(true); // Open success dialog
    } catch (error) {
      console.error('Error in handleAddToList:', error);
      setDebugInfo({
        error: error.response?.data || error.message,
        auth: await checkAuth()
      });
      alert('Failed to add item to borrow list. Please try again.');
    }
  };

  const handleToggleFavorite = (itemId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(itemId)) {
        newFavorites.delete(itemId);
      } else {
        newFavorites.add(itemId);
      }
      return newFavorites;
    });
  };

  // Add this debug panel to the JSX (you can remove it later)
  

  return (
    <Box sx={{ 
      padding: 3,
      width: '100%',
      maxWidth: '1400px', // Increased max width
      margin: '0 auto',
      backgroundColor: '#f8fafc'
    }}>
      {/* Enhanced Filters Section */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          marginBottom: 4,
          position: 'sticky',
          top: 64, // Adjusted for AppBar height
          backgroundColor: 'white',
          zIndex: 1000,
          padding: 2.5,
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          borderRadius: 2,
          flexDirection: { xs: 'column', md: 'row' }
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          width: '100%',
          flexDirection: { xs: 'column', sm: 'row' }
        }}>
          <TextField
            placeholder="Search equipment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
              ),
            }}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#f8fafc',
                '&:hover': {
                  backgroundColor: '#f1f5f9'
                }
              }
            }}
          />
          <FormControl sx={{ minWidth: { xs: '100%', sm: 200 } }}>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              displayEmpty
              startAdornment={<FilterIcon sx={{ color: 'text.secondary', mr: 1 }} />}
              sx={{ 
                backgroundColor: '#f8fafc',
                '&:hover': {
                  backgroundColor: '#f1f5f9'
                }
              }}
            >
              <MenuItem value="">All Categories</MenuItem>
              <MenuItem value="Sports">Sports Equipment</MenuItem>
              <MenuItem value="Furniture">Furniture</MenuItem>
              <MenuItem value="Electronics">Electronics</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Enhanced Equipment Grid */}
      <Box sx={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
        <Grid container spacing={3}>
          {filteredItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  backgroundColor: 'white',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  }
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.image || 'https://via.placeholder.com/400'}
                    alt={item.name}
                    onClick={() => handleImageClick(item)}
                    sx={{ 
                      cursor: 'pointer',
                      objectFit: 'contain',
                      width: '100%',
                      height: '200px',
                      borderRadius: '8px'
                    }}
                  />
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(item._id);
                    }}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'white',
                      boxShadow: 2,
                      '&:hover': {
                        backgroundColor: 'white',
                        transform: 'scale(1.1)'
                      }
                    }}
                  >
                    {favorites.has(item._id) ? (
                      <Favorite sx={{ color: '#ef4444' }} />
                    ) : (
                      <FavoriteBorder />
                    )}
                  </IconButton>
                </Box>
                <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ 
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      color: '#1e293b'
                    }}
                  >
                    {item.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Improved Modal */}
      <Dialog 
        open={isModalOpen} 
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: '80vh',
          }
        }}
      >
        {selectedItem && (
          <>
            <DialogTitle 
              sx={{ 
                pb: 0,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Typography variant="h5" component="div">
                {selectedItem.name}
              </Typography>
            </DialogTitle>

            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{ px: 2, borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab icon={<CalendarMonth />} label="Book Item" />
              <Tab icon={<Info />} label="Details" />
            </Tabs>

            <DialogContent sx={{ p: 0 }}>
              <Box sx={{ display: activeTab === 0 ? 'block' : 'none', p: 3 }}>
                <Box sx={{ position: 'relative', mb: 3 }}>
                  {imageLoading && (
                    <Skeleton 
                      variant="rectangular" 
                      width="100%" 
                      height={250}
                      animation="wave" 
                    />
                  )}
                  <img
                    src={selectedItem.image || 'https://via.placeholder.com/400'}
                    alt={selectedItem.name}
                    style={{ 
                      width: '100%', 
                      height: '250px',
                      objectFit: 'contain',
                      borderRadius: '8px',
                      display: imageLoading ? 'none' : 'block'
                    }}
                    onLoad={() => setImageLoading(false)}
                  />
                </Box>

                <Typography variant="h6" sx={{ mb: 2 }}>
                  Select Rental Period
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box
    sx={{
      display: "flex",
      gap: 2,
      mb: 3,
      flexDirection: { xs: "column", sm: "row" },
    }}
  >
  <DatePicker
    label="Start Date"
    value={startDate}
    onChange={setStartDate}
    minDate={new Date()} // Prevent dates in the past
    shouldDisableDate={(date) => isDateDisabled(date, selectedItem._id)} // Use isDateDisabled here
    slotProps={{
        textField: {
            fullWidth: true,
            error: startDate > endDate && endDate !== null,
            helperText:
                startDate > endDate && endDate !== null
                    ? "Start date must be before end date"
                    : "",
        },
    }}
/>

<DatePicker
  label="End Date"
  value={endDate}
  onChange={setEndDate}
  minDate={startDate || new Date()}
  shouldDisableDate={(date) => isDateDisabled(date, selectedItem._id)}
  slotProps={{
    textField: {
      fullWidth: true,
      error: startDate > endDate && endDate !== null,
      helperText:
        startDate > endDate && endDate !== null
          ? "End date must be after start date"
          : "",
    },
  }}
/>

  </Box>
                </LocalizationProvider>
              </Box>

              <Box sx={{ display: activeTab === 1 ? 'block' : 'none', p: 3 }}>
                <List>
                  <ListItem>
                    <ListItemText 
                      primary="Category"
                      secondary={
                        <Chip 
                          label={selectedItem.category || 'N/A'} 
                          size="small" 
                          sx={{ mt: 0.5 }}
                        />
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Description"
                      secondary={selectedItem.description || 'N/A'}
                      secondaryTypographyProps={{
                        sx: { whiteSpace: 'pre-wrap' }
                      }}
                    />
                  </ListItem>
                </List>
              </Box>
            </DialogContent>

            <DialogActions 
              sx={{ 
                p: 3, 
                borderTop: 1, 
                borderColor: 'divider',
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <Button 
                onClick={handleCloseModal} 
                color="inherit"
                startIcon={<Close />}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddToList} 
                variant="contained"
                disabled={!selectedItem.availabilityStatus || !startDate || !endDate}
                startIcon={<Add />}
              >
                Add to List
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Success Dialog */}
      <Dialog
        open={isSuccessDialogOpen}
        onClose={() => setIsSuccessDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Success</DialogTitle>
        <DialogContent>
          <Typography>
            Item added to your borrow list successfully!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsSuccessDialogOpen(false)} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Catalog;
