import express from "express";
import { UserControllers } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import {
  loginUserValidationSchema,
  userValidationSchema,
} from "./user.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "./user.constant";

const router = express.Router();

router.post(
  "/create-user",
  validateRequest(userValidationSchema),
  UserControllers.createUser,
);

router.post(
  "/login-user",
  validateRequest(loginUserValidationSchema),
  UserControllers.loginUser,
);

router.get(
  "/get-me",
  auth(USER_ROLE.admin, USER_ROLE.user),
  UserControllers.getMe,
);

router.patch("/update-user", auth(USER_ROLE.user), UserControllers.updateUser);

router.get("/get-all-users", auth(USER_ROLE.admin), UserControllers.getAllUser);

router.patch(
  "/block-user/:email",
  auth(USER_ROLE.admin),
  UserControllers.blockUser,
);

export const UserRoutes = router;
