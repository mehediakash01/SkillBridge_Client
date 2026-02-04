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

export const tutorService = {
    createOrUpdateUser,
    getTutorProfileById
}