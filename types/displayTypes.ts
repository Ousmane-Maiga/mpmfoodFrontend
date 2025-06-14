// types/displayTypes.ts

export interface Customer {
  id: number;
  name: string;
  image: string; // URL for customer image
  ordersThisWeek: number;
  totalOrders: number;
  favoriteItems?: string[]; // Array of strings for favorite items
}

export interface CarouselItem {
  id: number;
  url: string; // URL for the image
  text?: string; // Optional text to display with the image
}