import { Request, Response } from "express"
import { availabilityService } from "./available.service.js"


const getAvailabilityByDate = async (req: Request, res: Response) => {
  try {
    const { tutorId } = req.params
    const { date } = req.query

    const result =
      await availabilityService.getAvailabilityByDateFromDB(
        tutorId as string,
        date as string
      )

    res.status(200).json({
      success: true,
      message: "Availability retrieved successfully",
      data: result,
    })
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to retrieve availability",
    })
  }
}

export const availabilityController = {
  getAvailabilityByDate,
}
