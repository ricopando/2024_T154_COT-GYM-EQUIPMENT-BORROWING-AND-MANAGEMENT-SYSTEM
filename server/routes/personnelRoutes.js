import express from 'express';
import { getPersonnel, getPersonnelById, createPersonnel, updatePersonnel, deletePersonnel } from '../controllers/personnelController.js';

const router = express.Router();

// Get all personnel
router.get('/', getPersonnel);

// Get a single personnel by ID
router.get('/:id', getPersonnelById);

// Create a new personnel
router.post('/', createPersonnel);

// Update an existing personnel by ID
router.put('/:id', updatePersonnel);

// Delete a personnel by ID
router.delete('/:id', deletePersonnel);

export default router;