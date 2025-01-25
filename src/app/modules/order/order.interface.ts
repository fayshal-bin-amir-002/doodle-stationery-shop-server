import { Document, Types } from "mongoose";

export interface TOrder extends Document {
  user: Types.ObjectId;
  products: {
    product: Types.ObjectId;
    quantity: number;
  }[];
  totalPrice: number;
  status: "Pending" | "Shipped" | "Cancelled";
}
