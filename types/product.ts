export type Category = {
  id: string;
  name: string;
  description?: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string; // Category ID
  stock: number; // Number of items available
  availability?: "in_stock" | "low_stock" | "out_of_stock"; // Computed from stock
};

