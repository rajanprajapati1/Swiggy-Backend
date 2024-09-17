import { Router } from "express";
import AuthController from "../controllers/AuthController.js";
import TokenVerfier from "../middlewares/TokenVerfier.js";
const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/verify-email",AuthController.verifyEmail)
router.get("/verify-user", TokenVerfier, AuthController.GetUser);

export default router;
