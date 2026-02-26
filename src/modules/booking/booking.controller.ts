
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
// getting  booking details
const getBookingDetails = catchAsync(async (req:Request,res:Response)=>{
   const bookingId = req.params!.id

    
    const result = await bookingService.getBookingDetails(bookingId as string);

    sendResponse(res,{
        success:true,
        message:"retrieving booking details successful",
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

// cancel booking

const cancelBooking = catchAsync(async (req: Request, res: Response) => {
  const bookingId = req.params.id;
  const userId = req.user!.id;
  const role = req.user!.role;
 

  const result = await bookingService.cancelBooking(
    bookingId as string,
    userId,
    role as any
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Booking cancelled successfully",
    data: result,
  });
});

// ── Meeting link (tutor only) ─────────────────────────────

const updateMeetingLink = catchAsync(async (req: Request, res: Response) => {
  const tutorUserId = req.user!.id;
  const { meetingLink } = req.body;

  if (!meetingLink) {
    return sendResponse(res, { success: false, message: "Meeting link is required", statusCode: 400, data: null });
  }

  const result = await bookingService.updateMeetingLink(
    req.params.id as string,
    tutorUserId,
    meetingLink
  );
  sendResponse(res, { success: true, message: "Meeting link updated", statusCode: 200, data: result });
});



export const bookingController = {
  createBooking,
  getOwnBooking,
  getTutorBooking,
  getBookingDetails,
  completeBooking,
  cancelBooking,
  updateMeetingLink
};