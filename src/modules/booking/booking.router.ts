import express, { Router } from "express"
import sessionAuth, { UserRole } from "../../middlewares/authMiddleware.js";
import { bookingController } from "./booking.controller.js";

const router = express.Router();

router.post(
  "/",
  sessionAuth(UserRole.STUDENT),
  bookingController.createBooking
);
export const bookingRouter:Router = router;