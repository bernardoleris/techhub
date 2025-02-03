import { Router } from "express";
import productController from "../controllers/productController.js";
import { verifyToken, isFornecedor } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/", verifyToken, isFornecedor, productController.createProduct);

router.get("/", verifyToken, productController.getAllProducts);

router.patch("/:id", verifyToken, isFornecedor, productController.updateProduct);

router.delete("/:id", verifyToken, isFornecedor, productController.deleteProduct);

export default router;
