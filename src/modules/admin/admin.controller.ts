import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { adminService } from "./admin.service.js";
// getting all user
const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getAllUser()
  sendResponse(res, {
    success: true,
    message: "Users retrieved successfully",
    statusCode: 200,
    data: result,
  })
})
const updateUserStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isBanned } = req.body;

  if (typeof isBanned !== "boolean") {
    return res.status(400).json({
      success: false,
      message: "isBanned must be boolean",
    });
  }

  const user = await adminService.updateUserStatus(id as string, isBanned);

  res.status(200).json({
    success: true,
    message: isBanned
      ? "User banned successfully"
      : "User unbanned successfully",
    data: user,
  });
};


// ── Bookings ──────────────────────────────────────────────

const getAllBookings = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getAllBookings()
  sendResponse(res, {
    success: true,
    message: "Bookings retrieved successfully",
    statusCode: 200,
    data: result,
  })
})

// ── Stats ─────────────────────────────────────────────────

const getStats = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getStats()
  sendResponse(res, {
    success: true,
    message: "Stats retrieved successfully",
    statusCode: 200,
    data: result,
  })
})


export const adminController = {
    getAllUser,
    updateUserStatus,
    getStats,
    getAllBookings,
}