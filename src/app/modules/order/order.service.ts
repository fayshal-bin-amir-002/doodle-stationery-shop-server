import AppError from "../../errors/AppError";
import { Product } from "../product/product.model";
import Order from "./order.model";
import httpStatus from "http-status";
import { orderUtils } from "./order.utils";
import { User } from "../user/user.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { OrderSearchableFields } from "./order.constant";

const createOrder = async (
  email: string,
  payload: { products: { product: string; quantity: number }[] }
) => {
  if (!payload?.products?.length) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, "Order is not specified");
  }
  const products = payload?.products;

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user && user?.isBlocked) {
    throw new AppError(httpStatus.FORBIDDEN, "User is blocked!");
  }

  let totalPrice = 0;

  const productDetails = await Promise.all(
    products.map(async (item) => {
      const product = await Product.findById(item.product);
      if (!product) {
        throw new AppError(httpStatus.NOT_FOUND, "Product not found");
      }
      if (item.quantity > product.quantity) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `${product.name} is not available this time.`
        );
      }

      const productQuantity = product.quantity - item.quantity;

      product.quantity = productQuantity;

      if (productQuantity === 0) {
        product.inStock = false;
      }

      await product.save();

      totalPrice += product.price * item.quantity;
      return item;
    })
  );

  const order = await Order.create({
    user: user._id,
    products: productDetails,
    totalPrice,
  });

  return order;
};

const getOrders = async (query: Record<string, unknown>) => {
  const orderQuery = new QueryBuilder(Order.find(), query)
    .search(OrderSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await orderQuery.modelQuery.populate("user").populate({
    path: "products.product",
  });
  const meta = await orderQuery.countTotal();

  return {
    data: result,
    meta,
  };
};

const getMyOrders = async (email: string, query: Record<string, unknown>) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  const orderQuery = new QueryBuilder(Order.find({ user: user?.id }), query)
    .search([])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await orderQuery.modelQuery.populate("user").populate({
    path: "products.product",
  });
  const meta = await orderQuery.countTotal();

  return {
    data: result,
    meta,
  };
};

const updateOrder = async (id: string, payload: { status: string }) => {
  const result = await Order.findByIdAndUpdate(
    id,
    {
      status: payload.status,
    },
    { new: true }
  );

  const order = await Order.findById(id);

  if (order && order.status === "Cancelled") {
    const products = order.products;
    await Promise.all(
      products.map(async (item) => {
        const product = await Product.findById(item.product);
        if (!product) {
          throw new AppError(httpStatus.NOT_FOUND, "Product not found");
        }

        const productQuantity = product.quantity + item.quantity;

        product.quantity = productQuantity;

        if (productQuantity === 0) {
          product.inStock = false;
        } else if (productQuantity > 0) {
          product.inStock = true;
        }

        await product.save();
      })
    );
  }

  return result;
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
  getOrders,
  updateOrder,
  getMyOrders,
};
