import AppError from "../../errors/AppError";
import { TLoginUser, TUser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status";
import { createToken } from "./user.utils";
import config from "../../config";
import QueryBuilder from "../../builder/QueryBuilder";

const createUser = async (payload: TUser) => {
  if (await User.isUserExists(payload.email)) {
    throw new AppError(httpStatus.CONFLICT, "User already exists");
  }
  const result = await User.create(payload);
  return result;
};

const loginUser = async (payload: TLoginUser) => {
  const user = await User.isUserExists(payload.email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  if (user && user.isBlocked) {
    throw new AppError(httpStatus.FORBIDDEN, "User is blocked!");
  }

  const isPasswordMatched = await User.isPasswordMatched(
    payload.password,
    user.password
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid password!");
  }

  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const getMe = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }
  return user;
};

const updateUser = async (
  email: string,
  payload: { shippingAddress: string }
) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }
  const result = await User.findOneAndUpdate(
    { email },
    { $set: payload },
    { new: true }
  );
  return result;
};

const getAllUser = async (query: Record<string, unknown>) => {
  const usersQuery = new QueryBuilder(User.find(), query)
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const users = await usersQuery.modelQuery;
  const meta = await usersQuery.countTotal();
  return {
    data: users,
    meta,
  };
};

const blockUser = async (email: string) => {
  const user = await User.findOneAndUpdate(
    { email },
    { $set: { isBlocked: true } },
    { new: true }
  );
  return user;
};

export const UserServices = {
  createUser,
  loginUser,
  getMe,
  updateUser,
  getAllUser,
  blockUser,
};
