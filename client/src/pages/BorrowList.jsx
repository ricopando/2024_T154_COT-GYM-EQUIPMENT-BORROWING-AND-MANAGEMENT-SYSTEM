import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Grid, Button,
  CircularProgress, Chip, CardMedia, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText
} from '@mui/material';
import { CalendarMonth, Delete, Send } from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Separate component for loading state
const LoadingState = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 64px)', bgcolor: '#f8fafc' }}>
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, p: 4, borderRadius: 2, bgcolor: 'white', boxShadow: 1 }}>
      <CircularProgress size={40} />
      <Typography variant="h6" color="text.secondary">Loading your borrow list...</Typography>
    </Box>
  </Box>
);

// Separate component for empty state
const EmptyState = () => (
  <Box sx={{ minHeight: 'calc(100vh - 64px)', bgcolor: '#f8fafc', p: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Card sx={{ p: 6, textAlign: 'center', maxWidth: 400, boxShadow: 1 }}>
      <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: '50%', display: 'inline-flex', margin: '0 auto' }}>
        <Send sx={{ fontSize: 48, color: 'primary.main' }} />
      </Box>
      <Typography variant="h5" gutterBottom fontWeight={600}>No Active Borrow List</Typography>
      <Typography color="text.secondary">Start by adding items to your borrow list</Typography>
    </Card>
  </Box>
);

// Separate component for item card
const ItemCard = ({ item, onRemove, onOpenDeleteDialog }) => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'all 0.2s ease-in-out', '&:hover': { transform: 'translateY(-4px)', boxShadow: 3 } }}>
    <CardMedia
      component="img"
      height="240"
      image={item.equipment?.image || 'https://via.placeholder.com/400'}
      alt={item.equipment?.name}
      sx={{ objectFit: 'contain', bgcolor: 'grey.100' }}
    />
    <CardContent sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography variant="h6" fontWeight={600} gutterBottom>{item.equipment?.name}</Typography>
          <Chip label={item.equipment?.category} size="small" color="primary" variant="outlined" />
        </Box>
        <Button onClick={() => onOpenDeleteDialog(item._id)} color="error" sx={{ minWidth: 'auto', '&:hover': { bgcolor: 'error.lighter' } }}>
          <Delete />
        </Button>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
        <CalendarMonth color="primary" />
        <Box>
          <Typography variant="body2" fontWeight={500}>From: {new Date(item.startDate).toLocaleDateString()}</Typography>
          <Typography variant="body2" fontWeight={500}>To: {new Date(item.endDate).toLocaleDateString()}</Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const BorrowList = () => {
  const [borrowList, setBorrowList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const navigate = useNavigate();

  const fetchBorrowList = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/borrow-lists', {
        withCredentials: true
      });
      
      console.log('Borrow lists response:', response.data);
      
      const activeLists = response.data.filter(list => list.status === 'Draft');
      if (activeLists.length > 0) {
        const listWithEquipment = await Promise.all(activeLists[0].items.map(async (item) => {
          const equipmentResponse = await axios.get(
            `http://localhost:8000/api/equipment/${item.equipment._id}`,
            { withCredentials: true }
          );
          return {
            ...item,
            equipment: equipmentResponse.data,
            startDate: item.borrowDate,
            endDate: item.returnDate
          };
        }));
        
        setBorrowList({
          ...activeLists[0],
          items: listWithEquipment
        });
      }
    } catch (error) {
      console.error('Failed to fetch borrow list:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to load borrow list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowList();
  }, []);

  const handleRemoveItem = async (itemId) => {
    if (isRemoving) return;
    
    setIsRemoving(true);
    try {
      const updatedItems = borrowList.items.filter(item => item._id !== itemId);
      await axios.put(`http://localhost:8000/api/borrow-lists/${borrowList._id}`, {
        items: updatedItems
      }, { withCredentials: true });
      await fetchBorrowList();
    } catch (error) {
      console.error('Failed to remove item:', error);
      toast.error('Unable to remove item. Please try again.');
    } finally {
      setIsRemoving(false);
    }
  };

  const handleOpenConfirmDialog = () => setOpenConfirmDialog(true);
  const handleCloseConfirmDialog = () => setOpenConfirmDialog(false);

  const handleOpenDeleteDialog = (itemId) => {
    setItemToDelete(itemId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setItemToDelete(null);
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      handleRemoveItem(itemToDelete);
    }
    handleCloseDeleteDialog();
  };

  const handleSubmitList = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      // Submit the borrow list
      const submitResponse = await axios.post(
        `http://localhost:8000/api/borrow-lists/${borrowList._id}/submit`, 
        {}, 
        { withCredentials: true }
      );
      console.log('Submit response:', submitResponse.data);

      // Add each item to the borrowed items
      for (const item of borrowList.items) {
        await axios.post('http://localhost:8000/api/borrow-items', {
          equipmentId: item.equipment._id,
          borrowDate: item.startDate,
          returnDate: item.endDate,
          status: 'Pending'
        }, { withCredentials: true });
      }

      // After successful submission, delete the draft borrow list
      const deleteResponse = await axios.delete(
        `http://localhost:8000/api/borrow-lists/${borrowList._id}`,
        { withCredentials: true }
      );
      console.log('Delete response:', deleteResponse.data);

      toast.success('Borrow list submitted successfully');
      
      // Clear the borrow list state
      setBorrowList(null);

      // Redirect to the borrow page
      navigate('/catalog/borrowlist');
    } catch (error) {
      console.error('Failed to submit list:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to submit borrow list');
    } finally {
      setIsSubmitting(false);
      handleCloseConfirmDialog();
    }
  };

  if (loading) return <LoadingState />;
  if (!borrowList) return <EmptyState />;

  return (
    <Box sx={{ 
      maxWidth: '900px',
      mx: 'auto', 
      p: 2,
      minHeight: '100vh',
      bgcolor: '#f8fafc', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center' 
    }}>
      <Typography 
        variant="h4" 
        component="h1" 
        sx={{ 
          mb: 4,
          color: '#1e293b', 
          fontWeight: 700,
          textAlign: 'center',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -8,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60px',
            height: '3px',
            bgcolor: 'primary.main',
            borderRadius: '2px'
          }
        }}
      >
        My Borrow List
      </Typography>
      
      <Card sx={{ 
        width: '100%', 
        borderRadius: 2, 
        boxShadow: 1, 
        border: '1px solid #e2e8f0', 
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: 'white' 
      }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Chip label="Draft" color="primary" variant="outlined" size="small" sx={{ borderRadius: 1 }} />
        </Box>

        <Box sx={{ p: 2, overflowY: 'auto' }}>
          {borrowList.items.length === 0 ? (
            <EmptyState />
          ) : (
            <Grid container spacing={2}>
              {borrowList.items.map((item) => (
                <Grid item xs={12} sm={6} key={item._id}>
                  <ItemCard item={item} onRemove={handleRemoveItem} onOpenDeleteDialog={handleOpenDeleteDialog} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        <Box sx={{ p: 2, bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          
          <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
            <DialogTitle>Confirm Submission</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to submit this borrow list? This action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseConfirmDialog} color="primary">
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitList}
                color="primary"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              >
                {isSubmitting ? 'Submitting...' : 'Confirm'}
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete this item from your borrow list? This action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDeleteDialog} color="primary">
                Cancel
              </Button>
              <Button 
                onClick={handleConfirmDelete}
                color="error"
                disabled={isRemoving}
                startIcon={isRemoving ? <CircularProgress size={20} /> : null}
              >
                {isRemoving ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogActions>
          </Dialog>

          <Button
            onClick={handleOpenConfirmDialog}
            variant="contained"
            disabled={borrowList.items.length === 0 || isSubmitting}
            startIcon={<Send />}
            sx={{ borderRadius: '6px', textTransform: 'none', boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
          >
            Submit
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default BorrowList;