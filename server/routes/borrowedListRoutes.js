import express from 'express';
import {
    getBorrowLists,
    getBorrowList,
    createBorrowList,
    updateBorrowList,
    submitBorrowList,
    processBorrowList,
    deleteBorrowList
} from '../controllers/borrowListController.js';

const router = express.Router();

router.get('/', getBorrowLists);
router.get('/:id', getBorrowList);
router.post('/', createBorrowList);
router.put('/:id', updateBorrowList);
router.post('/:id/submit', submitBorrowList);
router.post('/:id/process', processBorrowList);
router.delete('/:id', deleteBorrowList);

export default router;
