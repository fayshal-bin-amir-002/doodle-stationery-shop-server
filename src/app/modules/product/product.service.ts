import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { ProductSearchableFields } from "./product.constant";
import { TProduct } from "./product.interface";
import { Product } from "./product.model";
import httpStatus from "http-status";

// service for creating a stationery product
const createProduct = async (productData: TProduct) => {
  const result = await Product.create(productData);
  return result;
};

// service for get all stationery product
const getAllProduct = async (query: Record<string, unknown>) => {
  const productQuery = new QueryBuilder(Product.find(), query)
    .search(ProductSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await productQuery.modelQuery;
  const meta = await productQuery.countTotal();

  return {
    data: result,
    meta,
  };
};

// service for get a single stationery product
const getASingleProduct = async (id: string) => {
  if (!(await Product.findOne({ _id: id }))) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }
  const result = await Product.findOne({ _id: id });
  return result;
};

// service for get a single stationery product
const updateAProduct = async (
  id: string,
  updatedData: { price?: number; quantity?: number; inStock?: boolean },
) => {
  if (!(await Product.findById({ _id: id }))) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  if (updatedData.quantity !== undefined) {
    updatedData.inStock = updatedData.quantity > 0;
  }

  const result = await Product.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        ...updatedData,
      },
    },
    {
      new: true,
    },
  );
  return result;
};

// service for delete a stationery product
const deleteAProduct = async (id: string) => {
  if (!(await Product.findOne({ _id: id }))) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }
  await Product.findOneAndDelete({ _id: id });
};

export const ProductServices = {
  createProduct,
  getAllProduct,
  getASingleProduct,
  updateAProduct,
  deleteAProduct,
};
