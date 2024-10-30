import express from "express";
import { getElectronics, getElectronic, postElectronic, deleteElectronic, updateElectronic } from "../controllers/electronicController.js";

const router = express.Router();

router.get("/", getElectronics);

router.get("/:id", getElectronic);

router.post("/", postElectronic);

router.delete("/:id", deleteElectronic);

router.put("/:id", updateElectronic);

export default router;
