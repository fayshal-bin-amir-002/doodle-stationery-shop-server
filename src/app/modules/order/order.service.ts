import { Product } from "../product/product.model";
import { TOrder } from "./order.interface";
import { Order } from "./order.model";

// create a order to db
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
  const orderObj = result.toObject(); // Converts Mongoose document to plain object
  const { _id, ...rest } = orderObj;
  const formattedOrder = { _id, ...rest };
  return formattedOrder;
};

// calculate revenue of oders from db
const calculateRevenue = async () => {
  const result = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: "$totalPrice",
        },
      },
    },
    {
      $project: {
        totalRevenue: 1,
        _id: 0,
      },
    },
  ]);
  return result[0] || { totalRevenue: 0 };
};

export const OrderServices = {
  createOrder,
  calculateRevenue,
};
