import { Booked_Status } from "../../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";
interface ReviewPayload {
  bookingId: string;
  rating: number;
  comment: string;
}
const createReview = async (studentId: string, payload: ReviewPayload) => {
  const { bookingId, rating, comment } = payload;

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) throw new Error("Booking not found");

  if (booking.studentId !== studentId)
    throw new Error("You cannot review this booking");


  const canReview =
    booking.status === Booked_Status.completed ||
    (booking.status === Booked_Status.confirmed && !!booking.meetingLink);

  if (!canReview)
    throw new Error("You can only review after attending the session");

  const existingReview = await prisma.reviews.findFirst({ where: { bookingId } });
  if (existingReview) throw new Error("Review already submitted");

  const review = await prisma.reviews.create({
    data: { bookingId, rating, comment },
  });

  // Update tutor average rating
  const allReviews = await prisma.reviews.findMany({
    where: { booking: { tutorId: booking.tutorId } },
  });

  const avg =
    allReviews.reduce((sum, r) => sum + Number(r.rating), 0) / allReviews.length;

  await prisma.tutorProfile.update({
    where: { id: booking.tutorId },
    data: { averageRate: avg },
  });

  return review;
};

// ── Get review by bookingId ───────────────────────────────

const getReviewByBookingId = async (bookingId: string) => {
  return prisma.reviews.findFirst({ where: { bookingId } });
};

export const reviewService = {
  createReview,
  getReviewByBookingId,
};












