
import express, { Router } from "express"
import { tutorController } from "./tutor.controller.js";
import sessionAuth, { UserRole } from "../../middlewares/authMiddleware.js";

const router = express.Router();
// create tutor profile
  router.post('/profile',
    sessionAuth(UserRole.TUTOR),
    tutorController.createTutor)
    // get tutor own profile
    router.get("/profile/me",
      sessionAuth(UserRole.TUTOR),
      tutorController.getMyProfile)
// update tutor availability
      router.put("/availability",
        sessionAuth(UserRole.TUTOR),
        tutorController.updateTutorAvailability)

        // get tutor own availability
        router.get(
  "/availability/me",
  sessionAuth(UserRole.TUTOR),
  tutorController.getMyAvailability
);

// get all tutors
router.get("/",tutorController.getAllTutors)
router.get("/:id",tutorController.getTutorById)

export  const createTutor:Router = router