import * as React from 'react';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { TextField, Button, Box, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, InputLabel, FormControl, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image'; // Add this import

const Inventory = () => {
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
    additionalInfo: '',
  });
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = React.useState(false);
  const [openSuccessDialog, setOpenSuccessDialog] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState('');
  const [openImageModal, setOpenImageModal] = React.useState(false);  // State for image modal
  const [selectedImage, setSelectedImage] = React.useState('');  // State to store selected image URL

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
    } catch {
      alert('Failed to save equipment.');
    }
  };

  const handleDeleteEquipment = async () => {
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
      additionalInfo: item.additionalInfo,
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
      additionalInfo: '',
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

  React.useEffect(() => {
    fetchEquipment();
  }, []);

  React.useEffect(() => {
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = equipmentItems.filter(item =>
        item.name.toLowerCase().includes(lowercasedQuery) ||
        item.description.toLowerCase().includes(lowercasedQuery) ||
        item.category.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(equipmentItems);
    }
  }, [searchQuery, equipmentItems]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Equipment Name', width: 150 },
    { field: 'description', headerName: 'Description', width: 250 },
    { field: 'category', headerName: 'Category', width: 150 },
    { field: 'availabilityStatus', headerName: 'Availability', width: 130 },
    { field: 'serialNumber', headerName: 'Serial Number', width: 200 },
    { field: 'model', headerName: 'Model', width: 180 },
    { field: 'additionalInfo', headerName: 'Additional Info', width: 250 },
    {
      field: 'image',
      headerName: 'Image',
      width: 100,
      renderCell: (params) => (
        <IconButton color="primary" onClick={() => handleOpenImageModal(params.row.image)}>
          <ImageIcon />
        </IconButton>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 110,
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => handleEditClick(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDeleteClick(params.row)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Inventory Page
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2, justifyContent: 'flex-end' }}>
        <TextField
          label="Search"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: '20%' }}
        />
        <Button variant="contained" color="primary" onClick={handleAddEquipment}>
          Add Equipment
        </Button>
      </Box>

      <Paper sx={{ height: 690, width: '100%' }}>
        <DataGrid
          rows={filteredData}
          columns={columns}
          pageSize={paginationModel.pageSize}
          pagination
          sx={{ border: 0 }}
          selectionModel={selectedRows}
          onSelectionModelChange={(newSelection) => setSelectedRows(newSelection.selectionModel)}
          checkboxSelection
        />
      </Paper>

      {/* Image Modal */}
      <Dialog open={openImageModal} onClose={handleCloseImageModal}>
        <DialogTitle>Equipment Image</DialogTitle>
        <DialogContent>
          <img src={selectedImage} alt="Equipment" style={{ width: '100%' }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseImageModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Modal */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>{isEditMode ? 'Edit Equipment' : 'Add New Equipment'}</DialogTitle>
        <DialogContent>
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
          <TextField
            label="Additional Info"
            variant="outlined"
            name="additionalInfo"
            value={newEquipment.additionalInfo}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddOrEditEquipment} color="primary">
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
    </div>
  );
};

export default Inventory;
