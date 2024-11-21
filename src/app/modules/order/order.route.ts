import express from "express";
import { OrderControllers } from "./order.controller";

// create a router for orders
const router = express.Router();

// route for creating a order
router.post("/", OrderControllers.createOrder);

// route for get orders revenue
router.get("/revenue", OrderControllers.getRevenue);

export const OrderRoutes = router;
