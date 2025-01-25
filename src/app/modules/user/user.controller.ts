import config from "../../config";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.service";
import httpStatus from "http-status";

const createUser = catchAsync(async (req, res) => {
  await UserServices.createUser(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Registration successfully. Please login now.",
  });
});

const loginUser = catchAsync(async (req, res) => {
  const result = await UserServices.loginUser(req.body);
  const { refreshToken, accessToken } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: config.node_env === "production",
    httpOnly: true,
    sameSite: config.node_env === "production" ? "none" : "strict",
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged in successfully.",
    data: { accessToken },
  });
});

const getMe = catchAsync(async (req, res) => {
  const result = await UserServices.getMe(req?.user?.email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully retrived user",
    data: result,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const result = await UserServices.updateUser(req?.user?.email, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User updated successfully",
    data: result,
  });
});

const getAllUser = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUser(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Retrived all users",
    data: result,
  });
});

const blockUser = catchAsync(async (req, res) => {
  const result = await UserServices.blockUser(req.params.email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User is blocked now",
    data: result,
  });
});

export const UserControllers = {
  createUser,
  loginUser,
  getMe,
  updateUser,
  getAllUser,
  blockUser,
};
