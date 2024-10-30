import express from "express"
import {getSportsEquipments, getSportsEquipment, postSportsEquipment, deleteSportsEquipment, updateSportsEquipment} from "../controllers/sportsEquipmentController.js"

const router = express.Router();

router.get("/", getSportsEquipments);

router.get("/:id", getSportsEquipment);

router.post("/", postSportsEquipment);

router.delete("/:id", deleteSportsEquipment);

router.put("/:id", updateSportsEquipment);

export default router;