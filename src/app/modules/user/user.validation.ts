import { z } from "zod";

export const userValidationSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Name is required"),
    email: z
      .string()
      .trim()
      .email("Invalid email address")
      .min(1, "Email is required"),
    password: z.string().trim().min(1, "Password is required"),
    role: z
      .enum(["user", "admin"], {
        required_error: "Role is required",
        invalid_type_error: "Role must be either 'user' or 'admin'",
      })
      .default("user"),
    phone: z.string().trim().optional(),

    address: z.string().trim().optional(),
    city: z.string().trim().optional(),
  }),
});

export const loginUserValidationSchema = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .email("Invalid email address")
      .min(1, "Email is required"),
    password: z.string().trim().min(1, "Password is required"),
  }),
});
