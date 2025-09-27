import express from "express";
import { calculateController } from "../controllers/calculateController.js";

const router = express.Router();

router.get("/calculate", calculateController);

export default router;