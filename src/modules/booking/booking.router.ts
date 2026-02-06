import express, { Router } from "express"
import sessionAuth, { UserRole } from "../../middlewares/authMiddleware.js";
import { bookingController } from "./booking.controller.js";

const router = express.Router();
// creating booking
router.post(
  "/",
  sessionAuth(UserRole.STUDENT),
  bookingController.createBooking
);
// getting booking by student
router.get(
  "/me",
  sessionAuth(UserRole.STUDENT),
  bookingController.getOwnBooking
);
// getting booking by tutor
router.get(
  "/tutor",
  sessionAuth(UserRole.TUTOR),
  bookingController.getTutorBooking
);
export const bookingRouter:Router = router;