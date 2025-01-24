import { ZodError, ZodIssue } from "zod";
import { TErrorSources, TGenericErrorResponse } from "../interface/error";

// zod error handler
export const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const statusCode = 400;
  const errorSources: TErrorSources = err?.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue?.path.length - 1],
      message: issue?.message || "Something went wrong!",
    };
  });

  return {
    statusCode,
    message: "Validation error!",
    errorSources,
  };
};
