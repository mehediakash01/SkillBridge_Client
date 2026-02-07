// booking.service.ts
import { Booked_Status } from "../../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";
import { UserRole } from "../../middlewares/authMiddleware.js";


interface BookingPayload {
  tutorId: string;
  startTime: string; 
  endTime: string;   
}

// Helper: convert Date to minutes (UTC)
const toMinutes = (date: Date) => date.getUTCHours() * 60 + date.getUTCMinutes();

// booking creation
const createBooking = async (studentId: string, payload: BookingPayload) => {
  const { tutorId, startTime, endTime } = payload;

  const bookingStart = new Date(startTime);
  const bookingEnd = new Date(endTime);

  if (bookingStart >= bookingEnd) {
    throw new Error( "Invalid booking time range");
  }

  // 1️ Check availability 
  const weekday = bookingStart
    .toLocaleDateString("en-US", { weekday: "short" })
    .toLowerCase(); 

  const availabilities = await prisma.availability.findMany({
    where: {
      tutorId,
      dayOfWeek: weekday as any,
    },
  });

  if (!availabilities || availabilities.length === 0) {
    throw new Error( "Tutor has no availability on this day");
  }

  const bookingStartMinutes = toMinutes(bookingStart);
  const bookingEndMinutes = toMinutes(bookingEnd);

  const matchedAvailability = availabilities.find((slot) => {
    const slotStart = toMinutes(slot.startTime);
    const slotEnd = toMinutes(slot.endTime);

    return slotStart <= bookingStartMinutes && slotEnd >= bookingEndMinutes;
  });

  if (!matchedAvailability) {
    throw new Error( "Tutor not available at this time");
  }

  // 2️ Check booking conflicts 
  const conflict = await prisma.booking.findFirst({
    where: {
      tutorId,
      status: { not: Booked_Status.cancelled },
      AND: [
        { startTime: { lt: bookingEnd } },
        { endTime: { gt: bookingStart } },
      ],
    },
  });

  if (conflict) {
    throw new Error( "This time slot is already booked");
  }

  // 3️ Calculate total price
  const tutor = await prisma.tutorProfile.findUnique({
    where: { id: tutorId },
  });

  if (!tutor) {
    throw new Error("Tutor not found");
  }

  const hours = (bookingEnd.getTime() - bookingStart.getTime()) / (1000 * 60 * 60);
  const totalPrice = Number(tutor.hourlyRate) * hours;

  // 4️ Create booking
  const booking = await prisma.booking.create({
    data: {
      studentId,
      tutorId,
      startTime: bookingStart,
      endTime: bookingEnd,
      totalPrice,
      status: Booked_Status.confirmed,
    },
  });

  return booking;
};


 // getting booking details

const getBookingDetails = async(bookingId:string)=>{
    return  prisma.booking.findUnique({
        where: {
      id:bookingId
      
    },

    include: { Tutor: true },
   
    })

}


// getting students own booking by id

const getOwnBooking = async(userId:string)=>{
    return  prisma.booking.findMany({
        where: {
      studentId: userId
      
    },
     orderBy: { startTime: "desc" },

    include: { Tutor: true },
   
    })

}
// getting students own booking by id

const getTutorBooking = async(tutorId:string)=>{
    return  prisma.booking.findMany({
        where: {
      tutorId
      
    },
     orderBy: { startTime: "asc" },

    include: { Student: true },
   
    })

}


// update booking status
const completeBooking = async (bookingId: string, tutorUserId: string) => {
  // 1 Find tutor profile
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { id: tutorUserId },
  });
  

  if (!tutorProfile) {
    throw new Error("Tutor profile not found");
  }

  // 2. Find booking
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  // 3. Ownership check
  if (booking.tutorId !== tutorProfile.id) {
    throw new Error("You are not allowed to update this booking");
  }
  

  // 4. Status validation
  if (booking.status !== Booked_Status.confirmed) {
    throw new Error("Only confirmed bookings can be completed");
  }

  // 5. Update status
  return prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: Booked_Status.completed,
    },
  });
};

// cancel booking
const cancelBooking = async (
  bookingId: string,
  userId: string,
  role: UserRole
) => {
  // 1. Find booking
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    throw new Error("Booking not found");
  }

  // 2. Status validation
  if (
    booking.status === Booked_Status.completed ||
    booking.status === Booked_Status.cancelled
  ) {
    throw new Error("This booking cannot be cancelled");
  }

  // 3. Role-based ownership check
  if (role === UserRole.STUDENT) {
    if (booking.studentId !== userId) {
      throw new Error("You are not allowed to cancel this booking");
    }
  }

  if (role === UserRole.TUTOR) {
    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { id: userId },
    });

    if (!tutorProfile || booking.tutorId !== tutorProfile.id) {
      throw new Error("You are not allowed to cancel this booking");
    }
  }

  // 4. Cancel booking
  return prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: Booked_Status.cancelled,
    },
  });
};


export const bookingService = {
  createBooking,
  getOwnBooking,
  getTutorBooking,
  getBookingDetails,
  completeBooking,
  cancelBooking
};
