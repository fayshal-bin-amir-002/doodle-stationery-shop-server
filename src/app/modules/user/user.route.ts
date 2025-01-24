import express from "express";
import { UserControllers } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import {
  loginUserValidationSchema,
  userValidationSchema,
} from "./user.validation";

const router = express.Router();

router.post(
  "/create-user",
  validateRequest(userValidationSchema),
  UserControllers.createUser
);

router.post(
  "/login-user",
  validateRequest(loginUserValidationSchema),
  UserControllers.loginUser
);

export const UserRoutes = router;
