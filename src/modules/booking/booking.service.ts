// booking.service.ts
import { Booked_Status } from "../../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";


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



// getting students own booking by id

const getOwnBooking = async(userId:string)=>{
    return  prisma.booking.findMany({
        where: {
      studentId: userId
    },
    include: { Tutor: true },
   
    })

}

export const bookingService = {
  createBooking,
  getOwnBooking
};
