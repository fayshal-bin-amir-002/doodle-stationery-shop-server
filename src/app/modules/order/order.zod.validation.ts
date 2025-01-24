import { z } from "zod";

export const orderValidationSchema = z.object({
  body: z.object({
    products: z.array(
      z.object({
        product: z.string().min(1, "Product ID is required"),
        quantity: z.number().int().min(1, "Quantity must be at least 1"),
      })
    ),
  }),
});
