import AppError from "../../errors/AppError";
import { Product } from "../product/product.model";
import Order from "./order.model";
import httpStatus from "http-status";
import { orderUtils } from "./order.utils";
import { User } from "../user/user.model";

const createOrder = async (
  email: string,
  payload: { products: { product: string; quantity: number }[] },
  client_ip: string
) => {
  if (!payload?.products?.length) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, "Order is not specified");
  }
  const products = payload?.products;

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
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
      product.quantity -= item.quantity;
      if (product.quantity === 0) {
        product.inStock = false;
      }
      await product.save();

      totalPrice += product.price * item.quantity;
      return item;
    })
  );

  let order = await Order.create({
    user: user._id,
    products: productDetails,
    totalPrice,
  });

  // payment integration
  const shurjopayPayload = {
    amount: totalPrice,
    order_id: order._id,
    currency: "BDT",
    customer_name: user.name,
    customer_address: user?.address || "unknown",
    customer_email: user.email,
    customer_phone: user?.phone || "unknown",
    customer_city: user?.city || "unknown",
    client_ip,
  };

  const payment = await orderUtils.makePaymentAsync(shurjopayPayload);

  if (payment?.transactionStatus) {
    order = await order.updateOne({
      transaction: {
        id: payment.sp_order_id,
        transactionStatus: payment.transactionStatus,
      },
    });
  }

  return payment.checkout_url;
};

const verifyPayment = async (order_id: string) => {
  const verifiedPayment = await orderUtils.verifyPaymentAsync(order_id);

  if (verifiedPayment.length) {
    const bank_status = verifiedPayment[0].bank_status;

    const order = await Order.findOneAndUpdate(
      {
        "transaction.id": order_id,
      },
      {
        "transaction.bank_status": verifiedPayment[0].bank_status,
        "transaction.sp_code": verifiedPayment[0].sp_code,
        "transaction.sp_message": verifiedPayment[0].sp_message,
        "transaction.transactionStatus": verifiedPayment[0].transaction_status,
        "transaction.method": verifiedPayment[0].method,
        "transaction.date_time": verifiedPayment[0].date_time,
        status:
          bank_status == "Success"
            ? "Paid"
            : bank_status == "Failed"
              ? "Pending"
              : bank_status == "Cancel"
                ? "Cancelled"
                : "",
      }
    );
    if (!order) {
      throw new AppError(httpStatus.NOT_FOUND, "Order not found");
    }

    if (bank_status === "Cancel") {
      await Promise.all(
        order.products.map(async (item) => {
          const product = await Product.findById(item.product);

          if (product) {
            product.quantity += item.quantity;
            product.inStock = product.quantity > 0;

            await product.save();
          }
        })
      );
    }
  }

  return verifiedPayment;
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
  verifyPayment,
  calculateRevenue,
};
