import { Router } from "express";
import {
  cancelOrder,
  getOrders,
  getUserOrder,
  placeOrder,
} from "../controller/order.controller";
import { authMiddleware } from "../middleware/auth.middleware";
const router = Router(); 
router.post("/",authMiddleware ,placeOrder);
router.get("/",authMiddleware, getOrders);
router.get("/user",authMiddleware, getUserOrder);
router.delete("/:orderId",authMiddleware, cancelOrder);
export default router;
