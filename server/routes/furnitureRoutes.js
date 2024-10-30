import express from "express";
import {getFurnitures,getFurniture,postFurniture,deleteFurniture,updateFurniture} from "../controllers/funitureController.js";

const router = express.Router();

router.get("/", getFurnitures);

router.get("/:id", getFurniture);

router.post("/", postFurniture);

router.delete("/:id", deleteFurniture);

router.put("/:id", updateFurniture);

export default router;
