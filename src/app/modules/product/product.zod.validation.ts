import { z } from "zod";

export const productValidationSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  brand: z.string().min(1, { message: "Brand is required" }),
  price: z.number().min(0, "Price must be a positive number"),
  category: z.enum(
    ["Writing", "Office Supplies", "Art Supplies", "Educational", "Technology"],
    {
      errorMap: () => ({
        message: "Category must be one of the specified values",
      }),
    }
  ),
  description: z.string().min(1, { message: "Description is required" }),
  quantity: z.number().int().min(1, "Minimum quantity will be 1."),
  inStock: z.boolean().default(true),
});
