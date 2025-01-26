import AppError from "../../errors/AppError";
import { Product } from "../product/product.model";
import Order from "./order.model";
import httpStatus from "http-status";
import { User } from "../user/user.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { OrderSearchableFields } from "./order.constant";

const createOrder = async (
  email: string,
  payload: { products: { product: string; quantity: number }[] },
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
          `${product.name} is not available this time.`,
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
    }),
  );

  const order = await Order.create({
    user: user._id,
    products: productDetails,
    totalPrice,
  });

  return order;
};

const getOrders = async (query: Record<string, unknown>) => {
  const orderQuery = new QueryBuilder(Order.find({}), query)
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

const updateOrder = async (id: string) => {
  const result = await Order.findByIdAndUpdate(
    id,
    {
      status: "Shipped",
    },
    { new: true },
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
      }),
    );
  }

  return result;
};

// calculate revenue of oders from db
const adminDashboardData = async () => {
  const aggregateResult = await Order.aggregate([
    {
      $facet: {
        orderSummary: [
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$totalPrice" },
              totalOrders: { $sum: 1 },
              pendingOrders: {
                $sum: {
                  $cond: {
                    if: { $eq: ["$status", "Pending"] },
                    then: 1,
                    else: 0,
                  },
                },
              },
              shippedOrders: {
                $sum: {
                  $cond: {
                    if: { $eq: ["$status", "Shipped"] },
                    then: 1,
                    else: 0,
                  },
                },
              },
            },
          },
          {
            $project: {
              totalRevenue: 1,
              totalOrders: 1,
              pendingOrders: 1,
              shippedOrders: 1,
              _id: 0,
            },
          },
        ],
        mostSoldItem: [
          {
            $unwind: "$products",
          },
          {
            $group: {
              _id: "$products.product",
              totalQuantity: { $sum: "$products.quantity" },
            },
          },
          { $sort: { totalQuantity: -1 } },
          { $limit: 5 },
        ],
      },
    },
  ]);

  const mostSoldProducts = aggregateResult[0].mostSoldItem.map((item: any) => ({
    productId: item._id,
    soldQuantity: item.totalQuantity,
  }));

  const populatedProducts = await Product.find({
    _id: { $in: mostSoldProducts.map((item: any) => item.productId) },
  }).select("name");

  const finalResults = populatedProducts.map((product: any) => {
    const soldQuantity = mostSoldProducts.find(
      (item: any) => item.productId.toString() === product._id.toString(),
    )?.soldQuantity;

    return {
      ...product.toObject(),
      soldQuantity: soldQuantity || 0,
    };
  });

  const result = {
    orderSummary: aggregateResult[0]?.orderSummary[0],
    mostSoldItem: finalResults,
  };

  return result;
};

export const OrderServices = {
  createOrder,
  adminDashboardData,
  getOrders,
  updateOrder,
  getMyOrders,
};
