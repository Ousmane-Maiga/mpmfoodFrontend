// constants/sampleData.ts
import { Order, Employee, Product, SalesReport, InventoryReport, EmployeeReport } from "../types/admin";

export const sampleOrders: Order[] = [
  {
    id: "1001",
    customer: "John Doe",
    items: [
      { name: "Cheeseburger", price: 8.99, quantity: 2 },
      { name: "Fries", price: 3.99, quantity: 1 },
      { name: "Soda", price: 1.99, quantity: 2 }
    ],
    total: 8.99 * 2 + 3.99 + 1.99 * 2,
    status: "delivered",
    date: "2023-05-15"
  },
  {
    id: "1002",
    customer: "Jane Smith",
    items: [
      { name: "Veggie Burger", price: 9.99, quantity: 1 },
      { name: "Onion Rings", price: 4.99, quantity: 1 }
    ],
    total: 9.99 + 4.99,
    status: "preparing",
    date: "2023-05-15"
  },
  {
    id: "1003",
    customer: "Robert Johnson",
    items: [
      { name: "Chicken Sandwich", price: 7.99, quantity: 3 },
      { name: "Salad", price: 5.99, quantity: 1 }
    ],
    total: 7.99 * 3 + 5.99,
    status: "pending",
    date: "2023-05-14"
  }
];

export const sampleEmployees: Employee[] = [
  {
    id: "1",
    name: "Alex Johnson",
    role: "admin",
    email: "alex@mpmfood.com",
    phone: "(555) 123-4567",
    schedule: [
      { day: "Monday", shift: "9am-5pm" },
      { day: "Wednesday", shift: "9am-5pm" },
      { day: "Friday", shift: "11am-7pm" }
    ]
  },
  {
    id: "2",
    name: "Sam Wilson",
    role: "admin",
    email: "sam@mpmfood.com",
    phone: "(555) 234-5678",
    schedule: [
      { day: "Tuesday", shift: "10am-6pm" },
      { day: "Thursday", shift: "10am-6pm" },
      { day: "Saturday", shift: "12pm-8pm" }
    ]
  },
  {
    id: "3",
    name: "Taylor Swift",
    role: "admin",
    email: "taylor@mpmfood.com",
    phone: "(555) 345-6789",
    schedule: [
      { day: "Monday", shift: "8am-4pm" },
      { day: "Wednesday", shift: "8am-4pm" },
      { day: "Friday", shift: "8am-4pm" }
    ]
  }
];

export const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Cheeseburger",
    category: "Burgers",
    price: 8.99,
    stock: 24,
    threshold: 10,
    supplier: {
      name: "Beef Suppliers Inc.",
      contact: "contact@beefsuppliers.com"
    }
  },
  {
    id: "2",
    name: "Veggie Burger",
    category: "Burgers",
    price: 9.99,
    stock: 15,
    threshold: 8,
    supplier: {
      name: "Veggie Foods Co.",
      contact: "sales@veggiefoods.com"
    }
  },
  {
    id: "3",
    name: "Fries",
    category: "Sides",
    price: 3.99,
    stock: 42,
    threshold: 20,
    supplier: {
      name: "Potato Distributors",
      contact: "info@potatodist.com"
    }
  },
  {
    id: "4",
    name: "Soda",
    category: "Drinks",
    price: 1.99,
    stock: 56,
    threshold: 24,
    supplier: {
      name: "Beverage Company",
      contact: "orders@beverageco.com"
    }
  },
  {
    id: "5",
    name: "Chicken Sandwich",
    category: "Sandwiches",
    price: 7.99,
    stock: 8,
    threshold: 10,
    supplier: {
      name: "Poultry Distributors",
      contact: "sales@poultrydist.com"
    }
  }
];

export const sampleSalesReports: SalesReport[] = [
  {
    period: "Today",
    total: 245.67,
    orders: 18,
    averageOrderValue: 13.65, // Add this
    topProduct: "Cheeseburger"
  },
  {
    period: "This Week",
    total: 1289.43,
    orders: 94,
    averageOrderValue: 13.72, // Add this
    topProduct: "Chicken Sandwich"
  },
  {
    period: "This Month",
    total: 5421.89,
    orders: 412,
    averageOrderValue: 13.16, // Add this
    topProduct: "Veggie Burger"
  }
];

export const sampleInventoryReports: InventoryReport[] = [
  {
    category: "Burgers",
    totalItems: 39,
    lowStockCount: 1,
    bestSeller: "Cheeseburger"
  },
  {
    category: "Sides",
    totalItems: 42,
    lowStockCount: 0,
    bestSeller: "Fries"
  },
  {
    category: "Drinks",
    totalItems: 56,
    lowStockCount: 0,
    bestSeller: "Soda"
  },
  {
    category: "Sandwiches",
    totalItems: 8,
    lowStockCount: 1,
    bestSeller: "Chicken Sandwich"
  }
];

export const sampleSalesData = {
  daily: {
    totalRevenue: 245.67,
    orders: sampleOrders,
    trendingProducts: ["Cheeseburger", "Fries", "Soda"]
  },
  weekly: {
    totalRevenue: 1289.43,
    orders: [...sampleOrders, ...sampleOrders, ...sampleOrders], // Just for demo
    trendingProducts: ["Chicken Sandwich", "Veggie Burger", "Onion Rings"]
  },
  monthly: {
    totalRevenue: 5421.89,
    orders: Array(10).fill(sampleOrders).flat(), // Just for demo
    trendingProducts: ["Veggie Burger", "Cheeseburger", "Salad"]
  }
};

export const sampleEmployeeReports: EmployeeReport[] = [
  {
    id: "1",
    name: "Alex Johnson",
    role: "Chef",
    hoursWorked: 38,
    sales: 1250.75,
    efficiency: 92,
    attendance: 100,
    lastEvaluation: "2023-04-15"
  },
  {
    id: "2",
    name: "Sam Wilson",
    role: "Waiter",
    hoursWorked: 32,
    sales: 980.50,
    efficiency: 88,
    attendance: 95,
    lastEvaluation: "2023-05-01"
  },
  {
    id: "3",
    name: "Taylor Swift",
    role: "Manager",
    hoursWorked: 45,
    sales: 2100.25,
    efficiency: 95,
    attendance: 100,
    lastEvaluation: "2023-03-20"
  },
  {
    id: "4",
    name: "Jamie Lee",
    role: "Waiter",
    hoursWorked: 28,
    sales: 750.30,
    efficiency: 82,
    attendance: 90,
    lastEvaluation: "2023-05-10"
  },
  {
    id: "5",
    name: "Chris Evans",
    role: "Chef",
    hoursWorked: 40,
    sales: 1450.60,
    efficiency: 90,
    attendance: 98,
    lastEvaluation: "2023-04-28"
  },
];
export const recentOrders = sampleOrders.slice(0, 3);
export const inventoryAlerts = sampleProducts.filter(p => p.stock < p.threshold);
export const employeesOnShift = sampleEmployees
  .filter(employee => {
    try {
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      return employee.schedule?.some(s => s.day === today) ?? false;
    } catch {
      return false;
    }
  })
  .map(employee => ({
    id: employee.id,
    name: employee.name,
    role: employee.role
  }));
