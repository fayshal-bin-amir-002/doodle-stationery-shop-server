import express from "express";
import { OrderControllers } from "./order.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import validateRequest from "../../middlewares/validateRequest";
import { orderValidationSchema } from "./order.zod.validation";

// create a router for orders
const router = express.Router();

// route for creating a order
router.post(
  "/",
  auth(USER_ROLE.user),
  validateRequest(orderValidationSchema),
  OrderControllers.createOrder
);

router.get("/verify", auth(USER_ROLE.user), OrderControllers.verifyPayment);

// route for get orders revenue
router.get("/revenue", OrderControllers.getRevenue);

export const OrderRoutes = router;
