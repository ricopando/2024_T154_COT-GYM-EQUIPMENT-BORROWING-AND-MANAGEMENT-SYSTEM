import express from 'express';
import { getAdmins, getAdminById, createAdmin, updateAdmin, deleteAdmin } from '../controllers/adminController.js';

const router = express.Router();

// Route for getting all admins
router.get('/', getAdmins);

// Route for getting a single admin by personnelId
router.get('/:id', getAdminById);

// Route for creating a new admin
router.post('/', createAdmin);

// Route for updating an existing admin
router.put('/:id', updateAdmin);

// Route for deleting an admin
router.delete('/:id', deleteAdmin);

export default router;