import { model, Schema } from "mongoose";
import { TOrder } from "./order.interface";

const orderSchema = new Schema<TOrder>(
  {
    email: { type: String, required: true },
    product: { type: String, required: true },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
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

export const Order = model<TOrder>("order", orderSchema);
