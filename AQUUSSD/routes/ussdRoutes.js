import express from "express";
import { handleUSSD } from "../controllers/ussdController.js";

const router = express.Router();

// Africa’s Talking sends POST requests here
router.post("/", handleUSSD);

export default router;
