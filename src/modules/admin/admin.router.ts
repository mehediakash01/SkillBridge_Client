import express from "express"
import sessionAuth, { UserRole } from "../../middlewares/authMiddleware.js";
import { adminController } from "./admin.controller.js";
const router = express.Router();

router.get("/users", sessionAuth(UserRole.ADMIN),adminController.getAllUser)
export const adminRouter = router;