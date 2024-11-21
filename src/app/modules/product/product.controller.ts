import { Request, Response } from "express";
import { productValidationSchema } from "./product.zod.validation";
import { ProductServices } from "./product.service";
import { TErrorResponse } from "./product.interface";

// Generic error response function
const sendErrorResponse = (
  res: Response,
  message: string,
  error: string | object,
  status: number,
  stack?: string,
) => {
  const errorResponse: TErrorResponse = {
    success: false,
    message: message,
    error: error,
    stack: stack || undefined,
  };

  res.status(status).json(errorResponse);
};

// controller for creating a product to db
const createProduct = async (req: Request, res: Response) => {
  try {
    const { product } = req.body;
    const zodParseData = productValidationSchema.parse(product);
    const result = await ProductServices.createProduct(zodParseData);
    res.json({
      success: true,
      message: "Successfully created product",
      data: result,
    });
  } catch (error: any) {
    if (error instanceof Error && error.name === "ZodError") {
      sendErrorResponse(res, "Validation failed", error, 400, error?.stack);
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

// controller for get all product from db
const getAllProduct = async (req: Request, res: Response) => {
  try {
    const searchTerm = req.query.searchTerm as string | undefined;
    const result = await ProductServices.getAllProduct(searchTerm);
    res.json({
      success: true,
      message: "Successfully get all products.",
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

export const ProductControllers = {
  createProduct,
  getAllProduct,
};
