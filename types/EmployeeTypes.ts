export enum EmployeeRole {
  CASHIER = 'cashier',
  KITCHEN = 'kitchen',
  DISPLAY = 'display',
  MANAGER = 'manager'
}

export interface EmployeePerformance {
  employeeId: string;
  name: string;
  role: EmployeeRole;
  metrics: {
    // Cashier-specific
    ordersProcessed?: number;
    avgOrderTime?: number; // in minutes
    // Kitchen-specific
    itemsPrepared?: number;
    avgPrepTime?: number; // in minutes
    // Common
    breakDuration: number; // in minutes
    currentStatus: 'active' | 'on_break' | 'offline';
  };
}