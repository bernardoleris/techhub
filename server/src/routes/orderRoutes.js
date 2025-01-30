import { Router } from "express";
import orderController from "../controllers/orderController.js";
import { verifyToken, isCliente } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/", verifyToken, isCliente, orderController.createOrder);
router.get("/:userId", verifyToken, orderController.getOrdersByUser);

export default router;
