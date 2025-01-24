import mongoose from "mongoose";
import { TErrorSources, TGenericErrorResponse } from "../interface/error";

const handleDuplicateError = (err: any): TGenericErrorResponse => {
  const statusCode = 400;
  const regex = /(?<=\{ name: ")(.*?)(?=" \})/;
  const match = err?.message.match(regex);
  const message = match && match[0];

  const errorSources: TErrorSources = [
    {
      path: "",
      message: `${message} is already exists!`,
    },
  ];

  return {
    statusCode,
    message: "Duplicate value!",
    errorSources,
  };
};
export default handleDuplicateError;
