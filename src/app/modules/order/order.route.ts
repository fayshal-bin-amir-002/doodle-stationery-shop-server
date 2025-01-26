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
  "/place-order",
  auth(USER_ROLE.user),
  validateRequest(orderValidationSchema),
  OrderControllers.createOrder,
);

router.get("/", auth(USER_ROLE.admin), OrderControllers.getOrders);

router.get("/my-orders", auth(USER_ROLE.user), OrderControllers.getMyOrders);

router.patch("/:id", auth(USER_ROLE.admin), OrderControllers.updateOrder);

router.get("/revenue", OrderControllers.getRevenue);

export const OrderRoutes = router;
