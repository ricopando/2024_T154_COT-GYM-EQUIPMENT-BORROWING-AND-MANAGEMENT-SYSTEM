import express from 'express';
import {
    getBorrowedItems,
    getBorrowedItem,
    returnBorrowedItem,
    createBorrowedItem,
    updateBorrowedItemStatus,
    getBorrowedItemsByUser,
    deleteBorrowedItem
} from '../controllers/borrowedItemController.js';

const router = express.Router();

router.get('/', getBorrowedItems);
router.get('/:id', getBorrowedItem);
router.post('/:id/return', returnBorrowedItem);
router.post('/', createBorrowedItem);
router.patch('/:id', updateBorrowedItemStatus);
router.get('/user/:userId', getBorrowedItemsByUser);
router.delete('/:id', deleteBorrowedItem);
export default router;