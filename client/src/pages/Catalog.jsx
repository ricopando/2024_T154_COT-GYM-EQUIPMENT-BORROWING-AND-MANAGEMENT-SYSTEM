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
  InputLabel,
  FormControl,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'; // Import DatePicker
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; // Date adapter
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'; // Localization provider
import axios from 'axios';

const Catalog = () => {
  const [equipmentItems, setEquipmentItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [startDate, setStartDate] = useState(null); // State for start date
  const [endDate, setEndDate] = useState(null); // State for end date

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

  // Handle adding an item to the list
  const handleAddToList = () => {
    alert(`${selectedItem.name} added to the list!`);
    setIsModalOpen(false); // Optionally close the modal after adding
  };

  return (
    <Box sx={{ padding: 2, width: '60%', marginLeft: '20%', marginRight: '20%' }}>
      {/* Filters Section (Fixed Position) */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          marginBottom: '5%',
          position: 'sticky',
          top: 0,
          backgroundColor: 'white',
          zIndex: 1,
          padding: 2,
        }}
      >
        <TextField
          label="Search"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            label="Category"
          >
            <MenuItem value="">All Categories</MenuItem>
            <MenuItem value="Sports">Sports</MenuItem>
            <MenuItem value="Furniture">Furniture</MenuItem>
            <MenuItem value="Electronics">Electronics</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Scrollable Equipment List */}
      <Box
        sx={{
          maxHeight: '70vh', // Limit the height of the grid container
          overflowY: 'auto', // Enable scrolling
        }}
      >
        <Grid container spacing={3}>
          {filteredItems.map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item._id}>
              <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={item.image || 'https://via.placeholder.com/200'}
                  alt={item.name}
                  onClick={() => handleImageClick(item)}
                  sx={{ cursor: 'pointer' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Modal for Image and Additional Details */}
      {selectedItem && (
        <Dialog open={isModalOpen} onClose={handleCloseModal}>
          <DialogTitle>{selectedItem.name}</DialogTitle>
          <DialogContent>
            <img
              src={selectedItem.image || 'https://via.placeholder.com/400'}
              alt={selectedItem.name}
              style={{ width: '100%', height: 'auto', marginBottom: '16px' }}
            />
            <Typography variant="h6" sx={{ mb: 2 }}>
              Select a Date Range
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newDate) => setStartDate(newDate)} // Update start date
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newDate) => setEndDate(newDate)} // Update end date
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
            <Typography variant="h6" sx={{ mt: 4 }}>
              Item Details
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary={`Category: ${selectedItem.category || 'N/A'}`} />
              </ListItem>
              <ListItem>
                <ListItemText primary={`Description: ${selectedItem.description || 'N/A'}`} />
              </ListItem>
              <ListItem>
                {/* Availability check */}
                <ListItemText
                  primary={`availabilityStatus: ${
                    selectedItem.availabilityStatus !== undefined
                      ? selectedItem.availabilityStatus
                        ? 'Available'
                        : 'Unavailable'
                      : 'N/A'
                  }`}
                />
              </ListItem>
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAddToList} color="primary">
              Add to List
            </Button>
            <Button onClick={handleCloseModal} color="secondary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default Catalog;
