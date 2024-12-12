import { model, Schema } from "mongoose";
import { TProduct } from "./product.interface";

const productSchema = new Schema<TProduct>(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    category: {
      type: String,
      required: true,
      enum: [
        "Writing",
        "Office Supplies",
        "Art Supplies",
        "Educational",
        "Technology",
      ],
    },
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    inStock: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: false, // Include virtuals if any
      transform: (_doc, ret) => {
        delete ret.__v; // Exclude __v
        return ret; // Return the transformed object
      },
    },
    toObject: {
      virtuals: false, // Include virtuals if any
      transform: (_doc, ret) => {
        delete ret.__v; // Exclude __v
        return ret; // Return the transformed object
      },
    },
  },
);

export const Product = model<TProduct>("product", productSchema);
