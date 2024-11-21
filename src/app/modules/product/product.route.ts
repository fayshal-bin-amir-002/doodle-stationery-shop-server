import express from "express";
import { ProductControllers } from "./product.controller";

// create a router for products
const router = express.Router();

// handle route for product create
router.post("/create-product", ProductControllers.createProduct);

export const ProductRoutes = router;
