import express from "express";
import { OrderControllers } from "./order.controller";

// create a router for orders
const router = express.Router();

// route for creating a order
router.post("/", OrderControllers.createOrder);

export const OrderRoutes = router;
