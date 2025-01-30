import { Router } from "express";
import productController from "../controllers/productController.js";
import { verifyToken, isFornecedor } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/", verifyToken, isFornecedor, productController.createProduct);
router.get("/", productController.getAllProducts);

export default router;
