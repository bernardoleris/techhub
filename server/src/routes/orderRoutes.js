import { Router } from "express";
import { createOrder, getOrdersByUser, updateOrderStatus, cancelOrder } from "../controllers/orderController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/", verifyToken, createOrder);
router.get("/user/:userId", verifyToken, getOrdersByUser);
router.patch("/:orderId", verifyToken, updateOrderStatus);
router.delete("/:orderId", verifyToken, cancelOrder); 

export default router;
