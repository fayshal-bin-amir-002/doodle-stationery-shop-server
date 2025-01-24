import { Request, Response } from "express";
import { OrderServices } from "./order.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

const createOrder = catchAsync(async (req, res) => {
  const email = req?.user?.email;
  const order = await OrderServices.createOrder(email, req.body, req.ip!);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Order placed successfully",
    data: order,
  });
});

const verifyPayment = catchAsync(async (req, res) => {
  const order = await OrderServices.verifyPayment(req.query.order_id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order verified successfully",
    data: order,
  });
});

const getRevenue = async (req: Request, res: Response) => {
  const result = await OrderServices.calculateRevenue();
  res.status(200).json({
    success: true,
    message: "Revenue calculated successfully",
    data: result,
  });
};

export const OrderControllers = {
  createOrder,
  verifyPayment,
  getRevenue,
};
