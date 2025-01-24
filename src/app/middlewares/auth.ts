import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import { TUserRole } from "../modules/user/user.interface";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import { verifyToken } from "../modules/user/user.utils";
import { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { User } from "../modules/user/user.model";

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    // checking if the token is missing
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    // checking if the given token is valid
    const decoded = verifyToken(
      token,
      config.jwt_access_secret as string
    ) as JwtPayload;

    const { role, email, iat } = decoded;

    // checking if the user is exist
    const user = await User.isUserExists(email);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found!");
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
