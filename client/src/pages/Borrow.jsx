import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { CalendarMonth, Print } from "@mui/icons-material";
import axios from "axios";
import { toast } from "react-hot-toast";
import BorrowersSlip from "./borrowerSlip";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Borrow = () => {
  const [borrowedItems, setBorrowedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const printRef = useRef();

  const fetchBorrowedItemsByUser = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/borrow-items/user/actual-user-id", {
        withCredentials: true,
      });
      setBorrowedItems(response.data);
    } catch (error) {
      console.error("Failed to fetch borrowed items for user:", error);
      toast.error("Failed to load borrowed items for user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowedItemsByUser();
  }, []);

  const userDetails = borrowedItems.length > 0 ? {
    name: borrowedItems[0].user?.displayName || 'N/A',
    email: borrowedItems[0].user?.email || 'N/A'
  } : { name: 'N/A', email: 'N/A' };

  const handleItemSelection = (itemId) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId], // Toggle selection
    }));
  };

  const handleDelete = async (itemId) => {
    try {
      const response = await axios.delete(`http://localhost:8000/api/borrow-items/${itemId}`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setBorrowedItems((prevItems) => prevItems.filter(item => item._id !== itemId));
        toast.success("Item successfully deleted.");
      } else {
        toast.error("Failed to delete item.");
      }
    } catch (error) {
      console.error("Failed to delete item:", error);
      toast.error("Failed to delete item.");
    }
  };

  const handleCancel = (itemId) => {
    handleDelete(itemId);
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const selectedBorrowedItems = borrowedItems.filter((item) => selectedItems[item._id]);

  const handleDownload = async () => {
    const element = printRef.current;

    if (!element) {
      console.error("Could not find the element to render.");
      return;
    }

    try {
      // Hide the download button during PDF generation
      const downloadButton = element.querySelector('button');
      if (downloadButton) {
        downloadButton.style.display = 'none';
      }

      const canvas = await html2canvas(element, {
        scale: 1, // Adjust scale for higher resolution if needed
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const adjustedImgHeight = Math.min(imgHeight, pageHeight);

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, adjustedImgHeight);
      pdf.save("borrowers_slip.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF.");
    } finally {
      // Show the download button again
      if (downloadButton) {
        downloadButton.style.display = 'block';
      }
    }
  };

  return (
    <Box sx={{ maxWidth: "1400px", mx: "auto", p: 3, backgroundColor: '#f8fafc' }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 700 }}>
        Borrowed Items
      </Typography>

      {borrowedItems.length === 0 ? (
        <Typography>No borrowed items found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {borrowedItems.map((item) => {
            const borrowedDate = new Date(item.borrowDate);
            const returnDate = new Date(item.returnDate);
            const formattedBorrowedDate = borrowedDate.toLocaleDateString();
            const formattedReturnDate = returnDate.toLocaleDateString();

            return (
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
                      image={item.equipment?.image || "https://via.placeholder.com/400"}
                      alt={item.equipment?.name}
                      sx={{
                        objectFit: 'contain',
                        width: '100%',
                        height: '200px',
                        borderRadius: '8px'
                      }}
                    />
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
                      {item.equipment?.name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
                      <CalendarMonth color="primary" />
                      <Box>
                        <Typography variant="body2" fontWeight={500}>Borrowed on: {formattedBorrowedDate}</Typography>
                        <Typography variant="body2" fontWeight={500}>Return by: {formattedReturnDate}</Typography>
                      </Box>
                    </Box>
                    <Chip label={item.status} size="small" />
                    <Box sx={{ mt: 2 }}>
                      {item.status === "Approved" && (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectedItems[item._id] || false}
                              onChange={() => handleItemSelection(item._id)}
                              color="primary"
                            />
                          }
                          label="Select"
                        />
                      )}
                      {item.status === "Pending" && (
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() => handleCancel(item._id)}
                          sx={{ mt: 1 }}
                        >
                          Cancel
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Button
        variant="contained"
        color="primary"
        startIcon={<Print />}
        onClick={openModal}
        sx={{ mt: 4 }}
      >
        Show Borrow Slip
      </Button>

      {/* Modal */}
      <Dialog open={modalOpen} onClose={closeModal} maxWidth="md" fullWidth>
        <DialogTitle>Borrower's Slip</DialogTitle>
        <DialogContent>
          <div ref={printRef}>
            <BorrowersSlip selectedItems={selectedBorrowedItems} userDetails={userDetails} />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} variant="outlined">
            Close
          </Button>
          <Button onClick={handleDownload} variant="contained" color="primary">
            Download Slip
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Borrow;
