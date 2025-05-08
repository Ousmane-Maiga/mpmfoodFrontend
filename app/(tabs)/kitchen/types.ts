// export type OrderStatus = 'all' | 'pending' | 'in-progress' | 'ready';

// export interface OrderItem {
//   product: string;
//   variant: string;
//   quantity: number;
// }

// export interface Order {
//   id: string;
//   customerName: string;
//   status: OrderStatus;
//   items: OrderItem[];
//   createdAt: Date;
//   notes?: string;
// }


// app/(tabs)/kitchen/types.ts
export type OrderStatus = 'all' | 'pending' | 'in-progress' | 'ready';

export interface OrderItem {
  product: string;
  variant: string;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  status: OrderStatus;
  items: OrderItem[];
  createdAt: Date;
  notes?: string;
}

// Add status color mapping
export const statusColors: Record<OrderStatus, string> = {
  'all': '#666', // gray
  'pending': '#3498db', // blue
  'in-progress': '#2ecc71', // green
  'ready': '#f39c12' // yellow
};