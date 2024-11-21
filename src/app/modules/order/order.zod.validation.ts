import { z } from "zod";

// Zod schema for validating TOrder data
export const orderValidationSchema = z.object({
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  product: z.string().min(1, "Product ID is required"),
  quantity: z
    .number()
    .positive("Quantity must be a positive integer")
    .min(1, "Quantity must be at least 1"),
  totalPrice: z
    .number()
    .positive("Total price must be a positive number")
    .min(0.01, "Total price must be greater than zero"),
});
