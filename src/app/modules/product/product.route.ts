import express from "express";
import { ProductControllers } from "./product.controller";
import validateRequest from "../../middlewares/validateRequest";
import {
  productUpdateValidationSchema,
  productValidationSchema,
} from "./product.zod.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

// create a router for products
const router = express.Router();

// handle route for product create
router.post(
  "/",
  auth(USER_ROLE.admin),
  validateRequest(productValidationSchema),
  ProductControllers.createProduct
);

// handle route for get all product
router.get("/", ProductControllers.getAllProduct);

// handle route for update a product data
router.patch(
  "/:id",
  auth(USER_ROLE.admin),
  validateRequest(productUpdateValidationSchema),
  ProductControllers.updateAProduct
);

// handle route for get a single product
router.get("/:id", ProductControllers.getASingleProduct);

// handle route for delete a product data
router.delete(
  "/:id",
  auth(USER_ROLE.admin),
  ProductControllers.deleteASingleProduct
);

export const ProductRoutes = router;
