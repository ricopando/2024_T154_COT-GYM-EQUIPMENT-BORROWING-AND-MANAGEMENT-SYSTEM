import express from 'express';
import {
    getBorrowedItems,
    getBorrowedItem,
    returnBorrowedItem,
    createBorrowedItem,
    updateBorrowedItemStatus,
    getBorrowedItemsByUser,
    deleteBorrowedItem,
    deleteBorrowedItemFromArray,
    updateItemStatusInArray,
    returnItemInArray,
    getEquipmentHistory,
    updateItemDates,
    createBorrowedItemForUser
} from '../controllers/borrowedItemController.js';

const router = express.Router();

router.get('/', getBorrowedItems);
router.get('/:id', getBorrowedItem);
router.patch('/:id/return', returnBorrowedItem);
router.post('/', createBorrowedItem);
router.patch('/:id', updateBorrowedItemStatus);
router.get('/user/:userId', getBorrowedItemsByUser);
router.delete('/:id', deleteBorrowedItem);
router.delete('/:borrowedItemId/item/:itemId', deleteBorrowedItemFromArray);
router.patch('/:borrowedItemId/item/:itemId/status', updateItemStatusInArray);
router.patch('/:borrowedItemId/item/:itemId/return', returnItemInArray);
router.get('/equipment/:equipmentId/history', getEquipmentHistory);
router.patch('/:borrowedItemId/item/:itemId/dates', updateItemDates);
router.post('/user', createBorrowedItemForUser);
export default router;