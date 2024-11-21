import express from "express";
import { ProductControllers } from "./product.controller";

// create a router for products
const router = express.Router();

// handle route for product create
router.post("/", ProductControllers.createProduct);

// handle route for get all product
router.get("/", ProductControllers.getAllProduct);

// handle route for get a single product
router.get("/:_id", ProductControllers.getASingleProduct);

// handle route for update a product data
router.put("/:_id", ProductControllers.updateAProduct);

export const ProductRoutes = router;
