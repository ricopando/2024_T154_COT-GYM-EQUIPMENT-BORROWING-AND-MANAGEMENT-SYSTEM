import express from 'express';
import { 
    getEquipments, 
    getEquipment, 
    postEquipment, 
    deleteEquipment, 
    updateEquipment 
} from '../controllers/EquipmentController.js';

const router = express.Router();

// Get all equipment
router.get('/equipment', getEquipments);

// Get a single equipment by ID
router.get('/equipment/:equipment_id', getEquipment);

// Create new equipment
router.post('/equipment', postEquipment);

// Delete equipment by ID
router.delete('/equipment/:equipment_id', deleteEquipment);

// Update equipment by ID
router.put('/equipment/:equipment_id', updateEquipment);

export default router;
