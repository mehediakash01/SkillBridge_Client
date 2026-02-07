import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { adminService } from "./admin.service.js";

const getAllUser = catchAsync(async (req: Request, res: Response) => {
    const result = await adminService.getAllUser ();
    sendResponse(res,{
        statusCode:200,
        success:true,
        message:"Retrieve all user successfully",
        data:result
    })
})
export const adminController = {
    getAllUser
}