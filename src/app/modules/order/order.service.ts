import { Product } from "../product/product.model";
import { TOrder } from "./order.interface";
import { Order } from "./order.model";

const createOrder = async (orderData: TOrder) => {
  // find out the product into products collection
  const product = await Product.findOne({ _id: orderData.product });
  if (!product) {
    throw new Error("Product not found!");
  }

  if (product.quantity < orderData.quantity) {
    throw new Error(`Can't order ${orderData.quantity} items.`);
  }

  product.quantity -= orderData.quantity;

  if (product.quantity === 0) {
    product.inStock = false;
  }
  // save the product data decreasing the quantity
  await product.save();

  const result = await Order.create(orderData);
  return result;
};

export const OrderServices = {
  createOrder,
};
