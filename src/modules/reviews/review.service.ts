import { Booked_Status } from "../../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";


interface ReviewPayload {
  bookingId: string;
  rating: number;
  comment: string;
}

const createReview = async (studentId: string, payload: ReviewPayload) => {
  const { bookingId, rating, comment } = payload;

  // 1. Find booking
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) throw new Error("Booking not found");

  // 2. Ownership check
  if (booking.studentId !== studentId) {
    throw new Error("You cannot review this booking");
  }

  // 3. Status check
  if (booking.status !== Booked_Status.completed) {
    throw new Error("Only completed bookings can be reviewed");
  }

  // 4. Prevent duplicate review
  const existingReview = await prisma.reviews.findFirst({
    where: { bookingId },
  });

  if (existingReview) {
    throw new Error("Review already submitted");
  }

  // 5. Create review
  const review = await prisma.reviews.create({
    data: {
      bookingId,
      rating,
      comment,
    },
  });

  // 6. Update tutor average rating
  const reviews = await prisma.reviews.findMany({
    where: {
      booking: { tutorId: booking.tutorId },
    },
  });

  const avg =
    reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length;

  await prisma.tutorProfile.update({
    where: { id: booking.tutorId },
    data: {
      averageRate: avg,
    },
  });

  return review;
};

export const reviewService = {
  createReview,
};
