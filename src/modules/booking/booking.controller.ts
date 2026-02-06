
import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse.js";
import catchAsync from "../../utils/catchAsync.js";
import { bookingService } from "./booking.service.js";
//booking creation
const createBooking = catchAsync(async (req: Request, res: Response) => {
  const studentId = req.user!.id;
  const result = await bookingService.createBooking(studentId, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Booking created successfully",
    data: result,
  });
});

// getting students booking
const getOwnBooking = catchAsync(async (req:Request,res:Response)=>{
   const studentId = req.user!.id;
    
    const result = await bookingService.getOwnBooking(studentId);

    sendResponse(res,{
        success:true,
        message:"retrieving booking successful",
        statusCode:200,
        data:result
    })
})
// getting tutor booking
const getTutorBooking = catchAsync(async (req:Request,res:Response)=>{
   const tutorId = req.user!.id;

    
    const result = await bookingService.getTutorBooking(tutorId);

    sendResponse(res,{
        success:true,
        message:"retrieving booking successful",
        statusCode:200,
        data:result
    })
})

// update booking status

const completeBooking = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params 

  const userId = req.user!.id;

  const result = await bookingService.completeBooking(id as string, userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Booking marked as completed",
    data: result,
  });
});


export const bookingController = {
  createBooking,
  getOwnBooking,
  getTutorBooking,
  completeBooking
};