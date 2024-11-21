import { TProduct } from "./product.interface";
import { Product } from "./product.model";

// service for creating a stationery product
const createProduct = async (productData: TProduct) => {
  const result = await Product.create(productData);
  return result;
};

export const ProductServices = {
  createProduct,
};
