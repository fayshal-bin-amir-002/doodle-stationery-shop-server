export type TProduct = {
  name: string;
  brand: string;
  price: number;
  category:
    | "Writing"
    | "Office Supplies"
    | "Art Supplies"
    | "Educational"
    | "Technology";
  description: string;
  quantity: number;
  inStock: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type TErrorResponse = {
  message: string;
  success: false;
  error: string | object;
  stack?: string;
};
