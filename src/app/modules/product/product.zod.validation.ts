import { z } from "zod";

export const productValidationSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, { message: "Name is required" }),
    brand: z.string().trim().min(1, { message: "Brand is required" }),
    price: z.number().min(0, "Price must be a positive number"),
    category: z.enum(
      [
        "Writing",
        "Office Supplies",
        "Art Supplies",
        "Educational",
        "Technology",
        "Cleaning Supplies",
        "Furniture",
        "Packaging",
      ],
      { errorMap: () => ({ message: "Invalid category" }) }
    ),
    description: z
      .string()
      .trim()
      .min(1, { message: "Description is required" }),
    quantity: z.number().int().min(1, "Minimum quantity will be 1."),
    image_url: z.string().optional().default(""),
    inStock: z.boolean().default(true).optional(),
  }),
});

export const productUpdateValidationSchema = z.object({
  body: z.object({
    price: z.number().min(0, "Price must be a positive number").optional(),
    quantity: z.number().int().optional(),
  }),
});
