import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { reviewService } from "./review.service.js";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const result = await reviewService.createReview(userId, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Review submitted successfully",
    data: result,
  });
});

export const reviewController = {
  createReview,
};