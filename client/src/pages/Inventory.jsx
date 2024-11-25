import * as React from 'react';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { TextField, Button, Box, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, InputLabel, FormControl, IconButton, useMediaQuery } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import DescriptionIcon from '@mui/icons-material/Description';
import { useTheme } from '@mui/material/styles';

const Inventory = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [equipmentItems, setEquipmentItems] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filteredData, setFilteredData] = React.useState([]);
  const [openModal, setOpenModal] = React.useState(false);
  const [newEquipment, setNewEquipment] = React.useState({
    name: '',
    description: '',
    image: '',
    category: '',
    serialNumber: '',
    model: '',
  });
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = React.useState(false);
  const [openSuccessDialog, setOpenSuccessDialog] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState('');
  const [openImageModal, setOpenImageModal] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState('');
  const [openDescriptionModal, setOpenDescriptionModal] = React.useState(false);
  const [selectedDescription, setSelectedDescription] = React.useState('');
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [openBorrowedDialog, setOpenBorrowedDialog] = React.useState(false);
  const [openErrorDialog, setOpenErrorDialog] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const fetchEquipment = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/equipment');
      const dataWithId = response.data.map((item, index) => ({
        ...item,
        id: index + 1,
      }));
      setEquipmentItems(dataWithId);
      setFilteredData(dataWithId);
    } catch {
      alert('Failed to fetch equipment data.');
    }
  };

  const handleAddOrEditEquipment = async () => {
    try {
      if (isEditMode) {
        await axios.put(`http://localhost:8000/api/equipment/${selectedItem._id}`, newEquipment);
        setEquipmentItems(equipmentItems.map(item => item._id === selectedItem._id ? { ...item, ...newEquipment } : item));
        setSuccessMessage('Equipment updated successfully!');
      } else {
        const response = await axios.post('http://localhost:8000/api/equipment', newEquipment);
        const newEquipmentWithId = { ...response.data, id: equipmentItems.length + 1 };
        setEquipmentItems([...equipmentItems, newEquipmentWithId]);
        setSuccessMessage('Equipment added successfully!');
      }
      setOpenModal(false);
      setOpenSuccessDialog(true);
    } catch (error) {
      setErrorMessage('Failed to save equipment.');
      setOpenErrorDialog(true);
    }
  };

  const handleDeleteEquipment = async () => {
    if (selectedItem.availabilityStatus === 'Borrowed') {
      setOpenBorrowedDialog(true);
      return;
    }
    try {
      await axios.delete(`http://localhost:8000/api/equipment/${selectedItem._id}`);
      const updatedEquipment = equipmentItems.filter(item => item._id !== selectedItem._id);
      const updatedEquipmentWithIds = updatedEquipment.map((item, index) => ({
        ...item,
        id: index + 1,
      }));
      setEquipmentItems(updatedEquipmentWithIds);
      setSuccessMessage('Equipment deleted successfully!');
      setOpenConfirmDeleteDialog(false);
      setOpenSuccessDialog(true);
    } catch {
      alert('Failed to delete equipment.');
    }
  };

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setOpenConfirmDeleteDialog(true);
  };

  const handleEditClick = (item) => {
    setIsEditMode(true);
    setSelectedItem(item);
    setNewEquipment({
      name: item.name,
      description: item.description,
      image: item.image,
      category: item.category,
      serialNumber: item.serialNumber,
      model: item.model,
    });
    setOpenModal(true);
  };

  const handleAddEquipment = () => {
    setIsEditMode(false);
    setNewEquipment({
      name: '',
      description: '',
      image: '',
      category: '',
      serialNumber: '',
      model: '',
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCloseConfirmDeleteDialog = () => {
    setOpenConfirmDeleteDialog(false);
  };

  const handleCloseSuccessDialog = () => {
    setOpenSuccessDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEquipment((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setOpenImageModal(true);
  };

  const handleCloseImageModal = () => {
    setOpenImageModal(false);
  };

  const handleOpenDescriptionModal = (description) => {
    setSelectedDescription(description);
    setOpenDescriptionModal(true);
  };

  const handleCloseDescriptionModal = () => {
    setOpenDescriptionModal(false);
  };

  const handleMenuOpen = (event, id) => {
    setMenuAnchorEl(event.currentTarget);
    setMenuRowId(id);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuRowId(null);
  };

  React.useEffect(() => {
    fetchEquipment();
  }, []);

  React.useEffect(() => {
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = equipmentItems.filter(item =>
        ['id', 'name', 'category', 'availabilityStatus', 'serialNumber', 'model'].some(field =>
          item[field]?.toString().toLowerCase().includes(lowercasedQuery)
        )
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(equipmentItems);
    }
  }, [searchQuery, equipmentItems]);

  const columns = [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 50,
      flex: 0.5,
      align: 'center',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center', width: '100%',height: '100%' }}>
          {params.row.id}
        </Box>
      ),
    },
    { 
      field: 'name', 
      headerName: 'Equipment Name', 
      width: 200,
      flex: 1,
      align: 'left',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center', width: '100%',height: '100%' }}>
          {params.row.name}
        </Box>
      ),
    },
    { 
      field: 'category', 
      headerName: 'Category', 
      width: 130,
      flex: 1,
      align: 'left',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center', width: '100%',height: '100%' }}>
          {params.row.category}
        </Box>
      ),
    },
    { 
      field: 'availabilityStatus', 
      headerName: 'Availability', 
      width: 130,
      flex: 1,
      align: 'left',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center', width: '100%',height: '100%' }}>
          {params.row.availabilityStatus}
        </Box>
      ),
    },
    { 
      field: 'serialNumber', 
      headerName: 'Serial Number', 
      width: 10,
      flex: 1,
      hide: isSmallScreen,
      align: 'left',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center', width: '100%',height: '100%' }}>
          {params.row.serialNumber}
        </Box>
      ),
    },
    { 
      field: 'model', 
      headerName: 'Model', 
      width: 100,
      flex: 1,
      hide: isSmallScreen,
      align: 'left',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center', width: '100%',height: '100%' }}>
          {params.row.model}
        </Box>
      ),
    },
    {
      field: 'descriptionAction',
      headerName: 'Description',
      width: 150,
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%',height: '100%' }}>
          <IconButton 
            color="primary" 
            onClick={() => handleOpenDescriptionModal(params.row.description)}
            aria-label="View description"
          >
            <DescriptionIcon />
          </IconButton>
        </Box>
      ),
    },
    {
      field: 'image',
      headerName: 'Image',
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
          <IconButton 
            color="primary" 
            onClick={() => handleOpenImageModal(params.row.image)}
            aria-label="View image"
          >
            <ImageIcon />
          </IconButton>
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%',height: '100%' }}>
          <IconButton 
            color="primary" 
            onClick={() => handleEditClick(params.row)}
            aria-label="Edit equipment"
          >
            <EditIcon />
          </IconButton>
          <IconButton 
            color="error" 
            onClick={() => handleDeleteClick(params.row)}
            aria-label="Delete equipment"
          >
            <DeleteIcon />
          </IconButton>
          
          
        </Box>
      ),
    },
  ];

  const paginationModel = { page: 0, pageSize: 10 };

  const modalStyles = {
    paper: {
      borderRadius: '12px',
      minWidth: isSmallScreen ? '300px' : '400px',
      maxWidth: '600px',
    },
    title: {
      backgroundColor: '#1976d2',
      color: 'white',
      padding: '16px 24px',
    },
    content: {
      padding: '24px',
    },
    actions: {
      padding: '16px 24px',
      borderTop: '1px solid #e0e0e0',
    },
    button: {
      textTransform: 'none',
      borderRadius: '8px',
      padding: '8px 24px',
      fontWeight: '600',
    }
  };

  const handleCloseErrorDialog = () => {
    setOpenErrorDialog(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper 
        sx={{ 
          p: 3, 
          mb: 3, 
          background: 'linear-gradient(to right, #1976d2, #64b5f6)',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 'bold',
            textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
          }}
        >
          Inventory Management
        </Typography>
        <TextField
          label="Search Equipment"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ 
            ml: 'auto',
            width: '100%',
            maxWidth: 400,
            backgroundColor: 'white',
            borderRadius: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: 1
            }
          }}
        />
        <Button 
          variant="contained" 
          onClick={handleAddEquipment}
          sx={{
            backgroundColor: 'white',
            color: '#1976d2',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.9)',
            }
          }}
        >
          Add Equipment
        </Button>
      </Paper>

      <Paper 
        elevation={0}
        sx={{ 
          mb: 3,
          p: 3,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider'
          
        }}
      >
        <DataGrid
          rows={filteredData}
          columns={columns}
          pageSize={rowsPerPage}
          onPageSizeChange={(newPageSize) => setRowsPerPage(newPageSize)}
          pageSizeOptions={[10, 25, 50, 100]}
          checkboxSelection
          disableRowSelectionOnClick
          sx={{ 
            height: '100%',
            border: '1px solid',
            borderColor: 'divider',
            '& .MuiDataGrid-main': { overflow: 'hidden' },
            '& .MuiDataGrid-columnHeaders': { 
              paddingRight: 0,
              backgroundColor: '#f0f0f0',
              fontWeight: 'bold',
              fontSize: '0.875rem',
            },
            '& .MuiDataGrid-virtualScroller': { paddingRight: 0 },
            '& .MuiDataGrid-cell': {
              whiteSpace: 'normal !important',
              wordWrap: 'break-word !important',
              lineHeight: 'normal !important',
              minHeight: '48px !important',
              alignItems: 'center',
              paddingTop: '12px',
              paddingBottom: '12px',
              paddingLeft: '16px',
              paddingRight: '16px',
              fontSize: '0.75rem',
              '&:hover': {
                backgroundColor: '#e0f7fa',
              },
            },
            '& .MuiDataGrid-row': {
              minHeight: '48px !important',
              '&:hover': {
                backgroundColor: '#e0f7fa',
              },
            },
            '@media (max-width: 600px)': {
              '& .MuiDataGrid-cell': {
                minHeight: '60px !important',
              },
              '& .MuiDataGrid-row': {
                minHeight: '60px !important',
              },
            },
            '& .MuiDataGrid-checkboxInput': {
              marginLeft: 'auto',
              marginRight: 'auto',
            },
          }}
        />
      </Paper>

      {/* Image Modal */}
      <Dialog 
        open={openImageModal} 
        onClose={handleCloseImageModal}
        PaperProps={{ sx: modalStyles.paper }}
      >
        <DialogTitle sx={modalStyles.title}>Equipment Image</DialogTitle>
        <DialogContent sx={modalStyles.content}>
          <Box
            sx={{
              width: '100%',
              height: '300px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            {selectedImage ? (
              <img 
                src={selectedImage} 
                alt="Equipment" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }} 
              />
            ) : (
              <Typography color="text.secondary">No image available</Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={modalStyles.actions}>
          <Button 
            onClick={handleCloseImageModal} 
            variant="contained"
            sx={modalStyles.button}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Description Modal */}
      <Dialog 
        open={openDescriptionModal} 
        onClose={handleCloseDescriptionModal}
        PaperProps={{ sx: modalStyles.paper }}
      >
        <DialogTitle sx={modalStyles.title}>Description</DialogTitle>
        <DialogContent sx={modalStyles.content}>
          <Typography>
            {selectedDescription || 'No description available'}
          </Typography>
        </DialogContent>
        <DialogActions sx={modalStyles.actions}>
          <Button 
            onClick={handleCloseDescriptionModal} 
            variant="contained"
            sx={modalStyles.button}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Modal */}
      <Dialog 
        open={openModal} 
        onClose={handleCloseModal}
        PaperProps={{ sx: modalStyles.paper }}
      >
        <DialogTitle sx={modalStyles.title}>
          {isEditMode ? 'Edit Equipment' : 'Add New Equipment'}
        </DialogTitle>
        <DialogContent sx={modalStyles.content}>
          <TextField
            label="Equipment Name"
            variant="outlined"
            name="name"
            value={newEquipment.name}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2, mt: 2 }}
          />
          <TextField
            label="Description"
            variant="outlined"
            name="description"
            value={newEquipment.description}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              name="category"
              value={newEquipment.category}
              onChange={handleInputChange}
            >
              <MenuItem value="Sports">Sports</MenuItem>
              <MenuItem value="Furniture">Furniture</MenuItem>
              <MenuItem value="Electronics">Electronics</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Image URL or Base64"
            variant="outlined"
            name="image"
            value={newEquipment.image}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Serial Number"
            variant="outlined"
            name="serialNumber"
            value={newEquipment.serialNumber}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Model"
            variant="outlined"
            name="model"
            value={newEquipment.model}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions sx={modalStyles.actions}>
          <Button 
            onClick={handleCloseModal} 
            variant="outlined"
            sx={modalStyles.button}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddOrEditEquipment} 
            variant="contained"
            sx={modalStyles.button}
          >
            {isEditMode ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={openConfirmDeleteDialog} onClose={handleCloseConfirmDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this equipment?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDeleteDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteEquipment} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={openSuccessDialog} onClose={handleCloseSuccessDialog}>
        <DialogTitle>Success</DialogTitle>
        <DialogContent>{successMessage}</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSuccessDialog} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {/* Borrowed Equipment Dialog */}
      <Dialog open={openBorrowedDialog} onClose={() => setOpenBorrowedDialog(false)}>
        <DialogTitle>Cannot Delete</DialogTitle>
        <DialogContent>
          This equipment is currently borrowed and cannot be deleted.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBorrowedDialog(false)} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Dialog */}
      <Dialog open={openErrorDialog} onClose={handleCloseErrorDialog}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          {errorMessage}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseErrorDialog} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Inventory;
