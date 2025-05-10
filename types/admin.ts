// types/admin.ts
export interface OrderItem {
    name: string;
    price: number;
    quantity: number;
  }
  
  export interface Order {
    id: string;
    customer: string;
    items: OrderItem[];
    total: number;
    status: 'pending' | 'preparing' | 'delivered' | 'cancelled';
    date: string;
    paymentMethod?: string;
  }
  
  export interface Employee {
    id: string;
    name: string;
    role: string;
    email?: string;
    phone?: string;
    schedule: Array<{
      day: string;
      shift: string;
    }>;
    efficiency?: number;
    attendance?: number;
  }
  
  export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    threshold: number;
    supplier: {
      name: string;
      contact: string;
      leadTime?: number;
    };
    status?: 'in-stock' | 'low-stock' | 'out-of-stock';
  }
  
  export interface SalesReport {
    period: string;
    total: number;
    orders: number;
    averageOrderValue: number; // Make this required
    topProduct: string;
    worstProduct?: string; // Keep this optional
  }
  
  export interface InventoryReport {
    category: string;
    totalItems: number;
    lowStockCount: number;
    bestSeller: string;
    worstSeller?: string;
  }
  
  export interface EmployeeReport {
    id: string;
    name: string;
    role: string;
    hoursWorked: number;
    sales: number;
    efficiency: number;
    attendance: number;
    lastEvaluation?: string;
  }