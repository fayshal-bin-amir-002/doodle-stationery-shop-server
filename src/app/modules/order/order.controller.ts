import { Request, Response } from "express";
import { sendErrorResponse } from "../product/product.controller";
import { orderValidationSchema } from "./order.zod.validation";
import { OrderServices } from "./order.service";

const createOrder = async (req: Request, res: Response) => {
  try {
    const zodParseData = orderValidationSchema.parse(req.body);
    const result = await OrderServices.createOrder(zodParseData);
    res.status(200).json({
      success: true,
      message: "Order created successfully",
      data: result,
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      sendErrorResponse(
        res,
        error?.issues[0]?.message || "Validation failed",
        error,
        400,
        error?.stack,
      );
    } else {
      sendErrorResponse(
        res,
        error?.message || "Something went wrong",
        error,
        500,
        error?.stack,
      );
    }
  }
};

const getRevenue = async (req: Request, res: Response) => {
  try {
    const result = await OrderServices.calculateRevenue();
    res.status(200).json({
      success: true,
      message: "Revenue calculated successfully",
      data: result,
    });
  } catch (error: any) {
    sendErrorResponse(
      res,
      error?.message || "Something went wrong",
      error,
      500,
      error?.stack,
    );
  }
};

export const OrderControllers = {
  createOrder,
  getRevenue,
};
