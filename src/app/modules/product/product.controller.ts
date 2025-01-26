import { ProductServices } from "./product.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

// controller for creating a product to db
const createProduct = catchAsync(async (req, res) => {
  const result = await ProductServices.createProduct(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product created successfully",
    data: result,
  });
});

// controller for get all product from db
const getAllProduct = catchAsync(async (req, res) => {
  const result = await ProductServices.getAllProduct(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Products retrieved successfully",
    data: result,
  });
});

// controller for get a single product from db
const getASingleProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ProductServices.getASingleProduct(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product retrieved successfully",
    data: result,
  });
});

// controller for get a single product from db
const updateAProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  const result = await ProductServices.updateAProduct(id, updatedData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product updated successfully",
    data: result,
  });
});

// controller for delete single product from db
const deleteASingleProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  await ProductServices.deleteAProduct(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product deleted successfully",
  });
});

export const ProductControllers = {
  createProduct,
  getAllProduct,
  getASingleProduct,
  updateAProduct,
  deleteASingleProduct,
};
