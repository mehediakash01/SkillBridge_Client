import express from "express"
import sessionAuth, { UserRole } from "../../middlewares/authMiddleware.js";
import { reviewController } from "./review.controller.js";
const router = express.Router();
router.post("/" , sessionAuth(UserRole.STUDENT),reviewController.createReview)
router.get("/:bookingId", reviewController.getReviewByBookingId); 



export const userReview = router;