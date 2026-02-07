import express from "express"
import sessionAuth, { UserRole } from "../../middlewares/authMiddleware.js";
import { reviewController } from "./review.controller.js";
const router = express.Router();
router.post("/" , sessionAuth(UserRole.STUDENT),reviewController.createReview)


export const userReview = router;