import express from "express"
import sessionAuth, { UserRole } from "../../middlewares/authMiddleware.js";
import { adminController } from "./admin.controller.js";
const router = express.Router();

router.get("/", sessionAuth(UserRole.ADMIN),adminController.getAllUser)
router.patch("/:id", sessionAuth(UserRole.ADMIN),adminController.updateUserStatus)
// ── Stats ─────────────────────────────────────────────────
router.get("/stats", sessionAuth(UserRole.ADMIN), adminController.getStats)


// ── Bookings ──────────────────────────────────────────────
router.get("/bookings", sessionAuth(UserRole.ADMIN), adminController.getAllBookings)

export const adminRouter = router;