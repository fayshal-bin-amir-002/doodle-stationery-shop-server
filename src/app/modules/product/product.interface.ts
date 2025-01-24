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
  inStock?: boolean;
};

// {
//   Writing: ["Pen", "Eraser", "Pencil", "Notebook", "Highlighter"],
//   "Office Supplies": ["Paper Clips", "Binder", "Stapler", "Notepads", "Scissors"],
//   "Art Supplies": ["Sketchbook", "Markers", "Colored Pencils", "Paintbrushes", "Canvas"],
//   Educational: ["Flashcards", "Workbooks", "Educational Games", "Abacus", "Puzzles"],
//   Technology: ["Wireless Mouse", "USB Flash Drive", "Power Bank", "Headphones", "Laptop Stand"],
//   "Cleaning Supplies": ["Dish Soap", "Wipes", "Mop", "Sponges", "Trash Bags"],
//   Furniture: ["Office Chair", "Desk Lamp", "Filing Cabinet", "Bookshelf", "Cushion"],
//   Packaging: ["Bubble Wrap", "Packaging Tape", "Cardboard Boxes", "Packing Peanuts", "Stretch Film"],
// }
