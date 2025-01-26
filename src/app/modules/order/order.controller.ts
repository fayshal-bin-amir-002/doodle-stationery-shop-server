import { Request, Response } from "express";
import { OrderServices } from "./order.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { Types } from "mongoose";

const createOrder = catchAsync(async (req, res) => {
  const email = req?.user?.email;
  const order = await OrderServices.createOrder(email, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Order placed successfully",
    data: order,
  });
});

const getOrders = catchAsync(async (req, res) => {
  const order = await OrderServices.getOrders(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order retrieved successfully",
    data: order,
  });
});

const getMyOrders = catchAsync(async (req, res) => {
  const email = req?.user?.email;
  const order = await OrderServices.getMyOrders(email, req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order retrieved successfully",
    data: order,
  });
});

const updateOrder = catchAsync(async (req, res) => {
  const { id } = req.params;

  const order = await OrderServices.updateOrder(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order updated successfully",
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
  getRevenue,
  getOrders,
  updateOrder,
  getMyOrders,
};
