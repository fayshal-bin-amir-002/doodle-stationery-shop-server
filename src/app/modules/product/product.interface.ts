export type TCategories =
  | "Writing"
  | "Office Supplies"
  | "Art Supplies"
  | "Educational"
  | "Technology"
  | "Cleaning Supplies"
  | "Furniture"
  | "Packaging";

export type TProduct = {
  name: string;
  brand: string;
  price: number;
  category: TCategories;
  description: string;
  quantity: number;
  image_url?: string;
  inStock?: boolean;
};
