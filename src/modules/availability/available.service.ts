import { Booked_Status } from "../../../generated/prisma/enums.js"
import { prisma } from "../../lib/prisma.js"

const toMinutes = (date: Date) =>
  date.getUTCHours() * 60 + date.getUTCMinutes()

const normalizeTime = (t: string | Date): string => {
  if (t instanceof Date) return t.toISOString().substring(11, 16)
  return t.substring(0, 5)
}

const parseTimeToMinutes = (t: string | Date): number => {
  const str = normalizeTime(t)
  const [hours = 0, minutes = 0] = str.split(":").map(Number)
  return hours * 60 + minutes
}

const getAvailabilityByDateFromDB = async (tutorId: string, date: string) => {
  if (!date) throw new Error("Date is required")

  const selectedDate = new Date(date)
  if (isNaN(selectedDate.getTime())) throw new Error("Invalid date format")

  const weekMap = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
  const weekday = weekMap[selectedDate.getUTCDay()]

  const availabilities = await prisma.availability.findMany({
    where: { tutorId, dayOfWeek: weekday as any },
  })

  if (!availabilities.length) return []

  const startOfDay = new Date(selectedDate)
  startOfDay.setUTCHours(0, 0, 0, 0)

  const endOfDay = new Date(selectedDate)
  endOfDay.setUTCHours(23, 59, 59, 999)

  const bookings = await prisma.booking.findMany({
    where: {
      tutorId,
      status: { not: Booked_Status.cancelled },
      startTime: { gte: startOfDay, lte: endOfDay },
    },
  })

  const result = availabilities.map((slot) => {
    const startTimeStr = normalizeTime(slot.startTime)
    const endTimeStr = normalizeTime(slot.endTime)

    const slotStart = parseTimeToMinutes(slot.startTime)
    const slotEnd = parseTimeToMinutes(slot.endTime)

    const isBooked = bookings.some((booking) => {
      const bookingStart = toMinutes(booking.startTime)
      const bookingEnd = toMinutes(booking.endTime)
      return bookingStart < slotEnd && bookingEnd > slotStart
    })

    const startDateTime = new Date(`${date}T${startTimeStr}:00.000Z`)
    const endDateTime = new Date(`${date}T${endTimeStr}:00.000Z`)

    return {
      id: slot.id,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      available: !isBooked,
    }
  })

  return result
}

export const availabilityService = {
  getAvailabilityByDateFromDB,
}