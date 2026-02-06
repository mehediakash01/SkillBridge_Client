import { Week } from "../../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";

const createOrUpdateUser = async (userId:string,

   payload: {
    bio: string;
    hourlyRate: number;
    experience: number;
  }
)=>{

    return prisma.tutorProfile.upsert({
        where:{
            studentId:userId
        },
        update:{
            
            bio:payload.bio,
            hourlyRate:payload.hourlyRate,
            experience:payload.experience
        },
        create:{
            studentId:userId,
            bio:payload.bio,
            hourlyRate:payload.hourlyRate,
            experience:payload.experience
        }
    })



}
const getTutorProfileById = async (userId:string)=>{
    return  prisma.tutorProfile.findUnique({
        where:{
            studentId:userId
        },
        include: {
      tutorSubjects: {
        include: { category: true },
      },
      bookings: true,
    },
    })

}
// update tutor availability
type AvailabilitySlotInput = {
  dayOfWeek: Week;
  startTime: string;
  endTime: string;
};
// convert time to minute
const timeToMinutes = (time: string): number => {
  const parts = time.split(":");

  if (parts.length !== 2) {
    throw new Error("Invalid time format. Expected HH:MM");
  }

  const h = Number(parts[0]);
  const m = Number(parts[1]);

  if (Number.isNaN(h) || Number.isNaN(m)) {
    throw new Error("Invalid time format. Expected HH:MM");
  }

  return h * 60 + m;
};

// validating overlap logic
const hasOverlap = (slots: AvailabilitySlotInput[]) => {
  const sorted = slots
    .map(s => ({
      ...s,
      start: timeToMinutes(s.startTime),
      end: timeToMinutes(s.endTime),
    }))
    .sort((a, b) => a.start - b.start);

  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i]!.end > sorted[i + 1]!.start) {
      return true;
    }
  }
  return false;
};


const updateTutorAvailability = async(tutorUserId:string, slots:AvailabilitySlotInput[])=>{
     if (!Array.isArray(slots) || slots.length === 0) {
    throw new Error( "Availability slots are required");
  }
    const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { studentId: tutorUserId },
  });

  if (!tutorProfile) {
    throw new Error( "Create tutor profile first");
  }

  for (const slot of slots) {
    if (timeToMinutes(slot.startTime) >= timeToMinutes(slot.endTime)) {
      throw new Error(
     
        `Invalid time range on ${slot.dayOfWeek}`
      );
    }
  }

// group by day
  const grouped: Record<string, AvailabilitySlotInput[]> = {};
  for (const slot of slots) {
    if (!grouped[slot.dayOfWeek]) {
      grouped[slot.dayOfWeek] = [];
    }
    grouped[slot.dayOfWeek]!.push(slot);
  }
// checking overlap
    for (const day in grouped) {
    if (hasOverlap(grouped[day]!)) {
      throw new Error(
        
        `Overlapping availability detected on ${day}`
      );
    }
  }


   //  availability (transaction-safe)
  await prisma.$transaction([
    prisma.availability.deleteMany({
      where: { tutorId: tutorProfile.id },
    }),
    prisma.availability.createMany({
      data: slots.map(slot => ({
        tutorId: tutorProfile.id,
        dayOfWeek: slot.dayOfWeek,
        startTime: new Date(`1970-01-01T${slot.startTime}:00Z`),
        endTime: new Date(`1970-01-01T${slot.endTime}:00Z`),
      })),
    }),
  ]);

  return grouped;

}

export const tutorService = {
    createOrUpdateUser,
    getTutorProfileById,
    updateTutorAvailability
}