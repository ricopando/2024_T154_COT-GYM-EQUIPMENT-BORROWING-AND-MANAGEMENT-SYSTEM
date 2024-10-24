import express from 'express';
import { getBorrows, getBorrowById, createBorrow, updateBorrow, deleteBorrow } from '../controllers/borrowController.js';

const router = express.Router();

// Get all borrow records
router.get('/', getBorrows);

// Get a single borrow record by ID
router.get('/:id', getBorrowById);

// Create a new borrow record
router.post('/', createBorrow);

// Update an existing borrow record by ID
router.put('/:id', updateBorrow);

// Delete a borrow record by ID
router.delete('/:id', deleteBorrow);

export default router;
