import { Request, Response } from "express";
import { productValidationSchema } from "./product.zod.validation";
import { ProductServices } from "./product.service";
import { TErrorResponse } from "./product.interface";

// Generic error response function
export const sendErrorResponse = (
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
    const zodParseData = productValidationSchema.parse(req.body);
    const result = await ProductServices.createProduct(zodParseData);
    res.status(200).json({
      success: true,
      message: "Product created successfully",
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

// controller for get all product from db
const getAllProduct = async (req: Request, res: Response) => {
  try {
    const searchTerm = req.query.searchTerm as string | undefined;
    const result = await ProductServices.getAllProduct(searchTerm);
    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
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

// controller for get a single product from db
const getASingleProduct = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const result = await ProductServices.getASingleProduct(_id);
    if (!result) {
      res.status(404).json({
        success: false,
        message: "Product not found!",
        data: {},
      });
    }
    res.status(200).json({
      success: true,
      message: "Product retrieved successfully",
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

// controller for get a single product from db
const updateAProduct = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const updatedData = req.body;
    const result = await ProductServices.updateAProduct(_id, updatedData);
    if (!result) {
      sendErrorResponse(res, "Product not found!", {}, 404);
    }
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
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

// controller for delete single product from db
const deleteASingleProduct = async (req: Request, res: Response) => {
  try {
    const { _id } = req.params;
    const result = await ProductServices.deleteAProduct(_id);
    if (!result) {
      sendErrorResponse(res, "Product not found!", {}, 404);
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: {},
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
  getASingleProduct,
  updateAProduct,
  deleteASingleProduct,
};
