import { prisma } from "../../lib/prisma.js"


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





// ── Users ─────────────────────────────────────────────────

const getAllUser = async () => {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isBanned: true,
      image: true,
      createdAt: true,
    },
  })
}

// ── Bookings ──────────────────────────────────────────────

const getAllBookings = async () => {
  return prisma.booking.findMany({
    orderBy: { startTime: "desc" },
    include: {
      Student: {
        select: { id: true, name: true, email: true, image: true },
      },
      Tutor: {
        include: {
          Student: {
            select: { id: true, name: true, email: true },
          },
        },
      },
    },
  })
}

// ── Stats ─────────────────────────────────────────────────

const getStats = async () => {
  const [totalUsers, totalTutors, totalStudents, totalBookings, completedBookings, totalCategories] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "TUTOR" } }),
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "completed" } }),
      prisma.category.count(),
    ])

  const revenue = await prisma.booking.aggregate({
    _sum: { totalPrice: true },
    where: { status: "completed" },
  })

  return {
    totalUsers,
    totalTutors,
    totalStudents,
    totalBookings,
    completedBookings,
    totalCategories,
    totalRevenue: Number(revenue._sum.totalPrice ?? 0),
  }
}



export const adminService = {getAllUser,updateUserStatus,  getAllBookings,
  getStats};