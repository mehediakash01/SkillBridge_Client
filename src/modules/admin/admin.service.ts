import { prisma } from "../../lib/prisma.js"

const getAllUser = async ()=>{
    return prisma.user.findMany(
       
    );
}

export const adminService = {getAllUser};