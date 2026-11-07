import express from "express";
import { sendMessageController } from "../controllers/contactController.js";

const router = express.Router();

router.post("/send", sendMessageController);

export default router;
