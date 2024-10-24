import express from 'express';
import { getEquipment, getEquipmentById, createEquipment, updateEquipment, deleteEquipment } from '../controllers/equipmentController.js';

const router = express.Router();

// Get all equipment
router.get('/', getEquipment);

// Get a single equipment by ID
router.get('/:id', getEquipmentById);

// Create a new equipment
router.post('/', createEquipment);

// Update an existing equipment by ID
router.put('/:id', updateEquipment);

// Delete an equipment by ID
router.delete('/:id', deleteEquipment);

export default router;
