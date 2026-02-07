import { prisma } from "../../lib/prisma.js"

const getAllUser = async ()=>{
    return prisma.user.findMany(
       
    );
}
const updateUserStatus = async (
  userId: string,
  isBanned: boolean
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return prisma.user.update({
    where: { id: userId },
    data: {
      isBanned,
    },
  });
};


export const adminService = {getAllUser,updateUserStatus};