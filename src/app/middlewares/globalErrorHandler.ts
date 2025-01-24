import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import config from "../config";
import { handleZodError } from "../errors/handleZodError";
import handleValidationError from "../errors/handleValidationError";
import handleCastError from "../errors/handleCastError";
import handleDuplicateError from "../errors/handleDuplicateError";
import AppError from "../errors/AppError";
import { TErrorSources } from "../interface/error";

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  let statusCode = error?.statusCode || 500;
  let message = "Something went wrong!";

  let errorSources: TErrorSources = [
    {
      path: "",
      message: "Something went wrong!",
    },
  ];

  if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (error?.name === "ValidationError") {
    const simplifiedError = handleValidationError(error);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (error?.name === "CastError") {
    const simplifiedError = handleCastError(error);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (error?.code === 11000) {
    const simplifiedError = handleDuplicateError(error);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (error instanceof AppError) {
    statusCode = error?.statusCode;
    message = error?.message;
    errorSources = [
      {
        path: "",
        message: error?.message,
      },
    ];
  } else if (error.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Your session has expired. Please log in again.";
    errorSources = [
      {
        path: "token",
        message: "Token has expired.",
      },
    ];
  } else if (error.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please log in again.";
    errorSources = [
      {
        path: "token",
        message: "The provided token is invalid.",
      },
    ];
  } else if (error instanceof Error) {
    message = error?.message;
    errorSources = [
      {
        path: "",
        message: error?.message,
      },
    ];
  }
  // final response send
  res.status(statusCode).json({
    success: false,
    message: message,
    errorSources,
    // error,
    stack: config.node_env === "development" ? error?.stack : null,
  });
};

export default globalErrorHandler;
