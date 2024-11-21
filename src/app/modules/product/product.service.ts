import { TProduct } from "./product.interface";
import { Product } from "./product.model";

// service for creating a stationery product
const createProduct = async (productData: TProduct) => {
  const result = await Product.create(productData);
  return result;
};

// service for get all stationery product
const getAllProduct = async (query: string | undefined) => {
  let result = [];
  if (query) {
    // make a regex with case insensetive for query
    const searchRegex = new RegExp(query, "i");
    result = await Product.find({
      $or: [
        {
          name: { $regex: searchRegex },
        },
        {
          brand: { $regex: searchRegex },
        },
        {
          category: { $regex: searchRegex },
        },
      ],
    });
  } else {
    result = await Product.find({});
  }
  return result;
};

export const ProductServices = {
  createProduct,
  getAllProduct,
};
