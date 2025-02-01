import { Router } from "express";
import { register, login, getAllUsers } from "../controllers/userController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/", verifyToken, getAllUsers);
router.get("/me", verifyToken, (req, res) => {  
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role
  });
});

export default router;
