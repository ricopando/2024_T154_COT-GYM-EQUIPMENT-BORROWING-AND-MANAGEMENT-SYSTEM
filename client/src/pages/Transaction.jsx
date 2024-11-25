import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [displayIds, setDisplayIds] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [transactionToDecline, setTransactionToDecline] = useState(null);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [transactionToApprove, setTransactionToApprove] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setError(null);
        const response = await axios.get('http://localhost:8000/api/borrow-items', {
          withCredentials: true
        });
        console.log('Fetched data:', response.data);
        
        // Sort transactions by borrowDate in descending order
        const sortedTransactions = response.data.sort((a, b) => new Date(b.borrowDate) - new Date(a.borrowDate));
        
        const withDisplayIds = sortedTransactions.reduce((acc, transaction, index) => {
          acc[transaction._id] = index + 1;
          return acc;
        }, {});
        
        setDisplayIds(withDisplayIds);
        setTransactions(sortedTransactions);
        console.log('Transactions set:', sortedTransactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setError(error.response?.data?.message || 'Failed to fetch borrowed items');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(transaction => 
    transaction.equipment?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction._id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const updateTransactionStatus = async (id, status) => {
    try {
      const response = await axios.patch(`http://localhost:8000/api/borrow-items/${id}`, { status }, {
        withCredentials: true
      });
      if (response.status === 200) {
        setTransactions((prevTransactions) =>
          prevTransactions.map((transaction) =>
            transaction._id === id ? { ...transaction, status } : transaction
          )
        );
      } else {
        console.error('Failed to update transaction status:', response.data);
      }
    } catch (error) {
      console.error('Failed to update transaction status:', error);
    }
  };

  const handleApprove = (id) => {
    setTransactionToApprove(id);
    setOpenApproveDialog(true);
  };

  const confirmApprove = async () => {
    if (transactionToApprove) {
      await updateTransactionStatus(transactionToApprove, 'Approved');
      setOpenApproveDialog(false);
      setTransactionToApprove(null);
    }
  };

  const handleCloseApproveDialog = () => {
    setOpenApproveDialog(false);
    setTransactionToApprove(null);
  };

  const handleDecline = (id) => {
    setTransactionToDecline(id);
    setOpenDialog(true);
  };

  const confirmDecline = async () => {
    if (transactionToDecline) {
      await updateTransactionStatus(transactionToDecline, 'Rejected');
      setOpenDialog(false);
      setTransactionToDecline(null);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTransactionToDecline(null);
  };

  const columns = [
    { 
      field: 'id', 
      headerName: 'No', 
      width: 50,
      flex: 0.5,
      align: 'center',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center', width: '100%', height: '100%' }}>
          {params.row.id}
        </Box>
      ),
    },
    { 
      field: 'name', 
      headerName: 'Name', 
      width: 200,
      flex: 1,
      align: 'left',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center', width: '100%', height: '100%' }}>
          {params.row.name}
        </Box>
      ),
    },
    { 
      field: 'email', 
      headerName: 'Email', 
      width: 250,
      flex: 1,
      align: 'left',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center', width: '100%', height: '100%' }}>
          {params.row.email}
        </Box>
      ),
    },
    { 
      field: 'equipment', 
      headerName: 'Equipment', 
      width: 250,
      flex: 1,
      align: 'left',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center', width: '100%', height: '100%' }}>
          {params.row.equipment}
        </Box>
      ),
    },
    { 
      field: 'borrowDate', 
      headerName: 'Borrow Date', 
      width: 150,
      flex: 1,
      align: 'left',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center', width: '100%', height: '100%' }}>
          {params.row.borrowDate}
        </Box>
      ),
    },
    { 
      field: 'returnDate', 
      headerName: 'Return Date', 
      width: 150,
      flex: 1,
      align: 'left',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center', width: '100%', height: '100%' }}>
          {params.row.returnDate}
        </Box>
      ),
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 150,
      flex: 1,
      align: 'left',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center', width: '100%', height: '100%' }}>
          {params.row.status}
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
          {params.row.status === 'Pending' && (
            <>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => handleApprove(params.row._id)} 
                aria-label="approve"
                sx={{ mr: 2 }} // Add margin to the right
              >
                Approve
              </Button>
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={() => handleDecline(params.row._id)} 
                aria-label="decline"
              >
                Decline
              </Button>
            </>
          )}
        </Box>
      ),
    }
  ];

  const rows = filteredTransactions.map((transaction) => ({
    id: displayIds[transaction._id],
    _id: transaction._id,
    name: transaction.userName || 'N/A',
    email: transaction.user?.email || 'N/A',
    equipment: transaction.equipment?.name || 'N/A',
    borrowDate: new Date(transaction.borrowDate).toLocaleDateString(),
    returnDate: transaction.returnDate ? new Date(transaction.returnDate).toLocaleDateString() : 'Not returned',
    status: transaction.status
  }));

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center', color: 'error.main' }}>
        <Typography>{error}</Typography>
      </Box>
    );
  }

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
          Borrowed Items
        </Typography>
        <TextField
          label="Search Transactions"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ 
            width: '100%',
            maxWidth: 400,
            backgroundColor: 'white',
            borderRadius: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: 1
            }
          }}
        />
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
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 25]}
            autoHeight
            disableSelectionOnClick
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              '& .MuiDataGrid-cell': {
                whiteSpace: 'normal !important',
                wordWrap: 'break-word !important',
                lineHeight: 'normal !important',
                minHeight: '48px !important',
                alignItems: 'center',
                paddingTop: '8px',
                paddingBottom: '8px',
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
            }}
          />
        )}
      </Paper>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Decline"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to decline this transaction?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDecline} color="secondary" autoFocus>
            Decline
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openApproveDialog}
        onClose={handleCloseApproveDialog}
        aria-labelledby="approve-dialog-title"
        aria-describedby="approve-dialog-description"
      >
        <DialogTitle id="approve-dialog-title">{"Confirm Approval"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="approve-dialog-description">
            Are you sure you want to approve this transaction?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseApproveDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmApprove} color="primary" autoFocus>
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Transaction;
