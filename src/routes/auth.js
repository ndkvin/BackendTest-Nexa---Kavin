import { Router } from "express";
import AuthController from "../controller/auth.controller.js";

const router = Router();

const authController = new AuthController(); 

router.post("/register", authController.register);
router.post("/login", authController.login);

export default router;
