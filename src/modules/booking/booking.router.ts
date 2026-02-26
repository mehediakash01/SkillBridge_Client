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
// getting booking details
router.get("/:id",bookingController.getBookingDetails)
router.patch("/:id/meeting-link", sessionAuth(UserRole.TUTOR), bookingController.updateMeetingLink); 

// update booking status
router.patch(
  "/:id/complete",
  sessionAuth(UserRole.TUTOR),
  bookingController.completeBooking
);
// cancel booking

router.patch("/:id/cancel", sessionAuth(UserRole.STUDENT, UserRole.TUTOR),
  bookingController.cancelBooking)
export const bookingRouter:Router = router;