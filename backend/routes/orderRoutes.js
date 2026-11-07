import express from "express";
import {
  cancelOrderController,
  cancelRazorpayOrderController,
  codOrderController,
  createRazorpayOrderController,
  getAllOrdersController,
  getOrdersController,
  orderStatsController,
  orderStatusController,
  razorpayWebhookController,
  verifyRazorpayPaymentController,
} from "../controllers/orderController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

//checkout
router.post("/webhook", razorpayWebhookController);
router.post("/cod", requireSignIn, codOrderController);
router.post("/razorpay/create", requireSignIn, createRazorpayOrderController);
router.post("/razorpay/verify", requireSignIn, verifyRazorpayPaymentController);
router.delete("/razorpay/:orderId", requireSignIn, cancelRazorpayOrderController);

//user
router.get("/my-orders", requireSignIn, getOrdersController);
router.put("/cancel/:orderId", requireSignIn, cancelOrderController);

//admin
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);
router.put("/status/:orderId", requireSignIn, isAdmin, orderStatusController);
router.get("/stats", requireSignIn, isAdmin, orderStatsController);

export default router;
