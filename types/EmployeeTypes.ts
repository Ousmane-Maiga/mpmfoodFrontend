// // src/types/employeeTypes.ts

// export enum EmployeeRole {
//   CASHIER = 'cashier',
//   KITCHEN = 'kitchen',
//   DISPLAY = 'display',
//   MANAGER = 'manager'
// }

// export interface EmployeePerformance {
//   employeeId: string;
//   name: string;
//   role: EmployeeRole;
//   metrics: {
//     // Cashier-specific
//     ordersProcessed?: number;
//     avgOrderTime?: number; // in minutes
//     // Kitchen-specific
//     itemsPrepared?: number;
//     avgPrepTime?: number; // in minutes
//     // Common
//     breakDuration: number; // in minutes
//     currentStatus: 'active' | 'on_break' | 'offline';
//   };
// }

// export interface Employee {
//   employee_id: string;
//   employee_name: string;
//   employee_role: string;
//   employee_email: string | null; // Allow string or null
//   employee_phone: string | null; // Allow string or null
//   is_active: boolean;
//   pin: string; // The backend returns the PIN, though it shouldn't be used on the frontend
//   created_at: string; // ISO string
//   updated_at: string; // ISO string
//   // Add any other properties if your database schema or API response includes them
// }

// // Define a new, unified type for employee performance data
// export interface EmployeePerformanceMetrics {
//   employeeId: string;
//   employeeName: string;
//   employeeRole: string; // 'cashier', 'kitchen', 'display', 'admin', etc.
//   // Core metrics applicable to all
//   loginDurationMinutes: number; // Total time logged in/active during a period
//   breakDurationMinutes: number; // Total time on breaks
//   daysOffCount: number; // Number of days off within the queried period
//   // frontend will likely receive ISO strings and convert to Date if needed for display
//   lastActivityAt?: string; // or Date, depending on your parsing logic
//   aggregationDate?: string; // or Date, depending on your parsing logic

//   // Role-specific metrics
//   ordersHandled?: number; // For cashiers
//   averageOrderProcessingTimeSeconds?: number; // For cashiers
//   itemsPrepared?: number; // For kitchen staff
//   averageItemPreparationTimeSeconds?: number; // For kitchen staff
//   imagesUploaded?: number; // For display staff
//   adsManaged?: number; // For display staff (if they manage ads)
//   gifsUploaded?: number; // For display staff (if they upload gifs)
//   customImagesUploaded?: number; // For display staff (if they upload custom images)
//   // Add any other metrics relevant to "good functioning"
//   customerInteractionScore?: number; // For cashiers, if trackable
//   inventoryRequestsHandled?: number; // For kitchen/admin, if applicable
//    totalSales?: number;
// }

// // Define a type for detailed employee activity logs
// export interface EmployeeActivityLog {
//   logId?: number;
//   employeeId: string;
//   logType: 'login' | 'logout' | 'break_start' | 'break_end' | 'order_completed' | 'item_prepared' | 'image_uploaded' | 'ad_uploaded' | 'gif_uploaded' | 'day_off_request' | 'shift_start' | 'shift_end' | 'order_created' | 'image_deleted' | 'display_viewed' | 'display_accessed';
//   timestamp?: string;
//   startTime?: string;
//   endTime?: string;
//   details?: { [key: string]: any };
//   createdAt?: string;
// }

// // New type for schedule items from the backend
// export interface EmployeeScheduleItemBackend {
//   schedule_id: number;
//   employee_id: string;
//   schedule_date: string; // YYYY-MM-DD
//   is_day_off: boolean;
//   start_time: string | null; // HH:MM string from DB
//   end_time: string | null; // HH:MM string from DB
//   created_at: string;
//   updated_at: string;
// }

// // Assuming Employee type from backend for login response
// export interface LoginResponseEmployee {
//   employee_id: string;
//   employee_name: string;
//   employee_role: string;
// }

// // NEW INTERFACE: For the response when ending a break
// export interface BreakEndResponse {
//   breakId: number;
//   startTime: string; // Assuming ISO string from backend
//   durationMinutes: number;
// }



// src/types/employeeTypes.ts

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

export interface Employee {
  employee_id: string;
  employee_name: string;
  employee_role: string;
  employee_email: string | null; // Allow string or null
  employee_phone: string | null; // Allow string or null
  is_active: boolean;
  pin: string; // The backend returns the PIN, though it shouldn't be used on the frontend
  created_at: string; // ISO string
  updated_at: string; // ISO string
  // FIX: Added lastActivityAt to the Employee interface
  lastActivityAt?: string; // ISO string, represents last recorded activity time
  // Add any other properties if your database schema or API response includes them
}

// Define a new, unified type for employee performance data
export interface EmployeePerformanceMetrics {
  employeeId: string;
  employeeName: string;
  employeeRole: string; // 'cashier', 'kitchen', 'display', 'admin', etc.
  // Core metrics applicable to all
  loginDurationMinutes: number; // Total time logged in/active during a period
  breakDurationMinutes: number; // Total time on breaks
  daysOffCount: number; // Number of days off within the queried period
  // frontend will likely receive ISO strings and convert to Date if needed for display
  lastActivityAt?: string; // or Date, depending on your parsing logic - keeping as string for consistency with API
  aggregationDate?: string; // or Date, depending on your parsing logic

  // Role-specific metrics
  ordersHandled?: number; // For cashiers
  averageOrderProcessingTimeSeconds?: number; // For cashiers
  itemsPrepared?: number; // For kitchen staff
  averageItemPreparationTimeSeconds?: number; // For kitchen staff
  imagesUploaded?: number; // For display staff
  adsManaged?: number; // For display staff (if they manage ads)
  gifsUploaded?: number; // For display staff (if they upload gifs)
  customImagesUploaded?: number; // For display staff (if they upload custom images)
  // Add any other metrics relevant to "good functioning"
  customerInteractionScore?: number; // For cashiers, if trackable
  inventoryRequestsHandled?: number; // For kitchen/admin, if applicable
  totalSales?: number; // Total sales attributed to this employee
}

// Define a type for detailed employee activity logs
export interface EmployeeActivityLog {
  logId?: number;
  employeeId: string;
  logType: 'login' | 'logout' | 'break_start' | 'break_end' | 'order_completed' | 'item_prepared' | 'image_uploaded' | 'ad_uploaded' | 'gif_uploaded' | 'day_off_request' | 'shift_start' | 'shift_end' | 'order_created' | 'image_deleted' | 'display_viewed' | 'display_accessed';
  timestamp?: string;
  startTime?: string;
  endTime?: string;
  details?: { [key: string]: any };
  createdAt?: string;
}

// New type for schedule items from the backend
export interface EmployeeScheduleItemBackend {
  schedule_id: number;
  employee_id: string;
  schedule_date: string; // YYYY-MM-DD
  is_day_off: boolean;
  start_time: string | null; // HH:MM string from DB
  end_time: string | null; // HH:MM string from DB
  created_at: string;
  updated_at: string;
}

// Assuming Employee type from backend for login response
export interface LoginResponseEmployee {
  employee_id: string;
  employee_name: string;
  employee_role: string;
}

// NEW INTERFACE: For the response when ending a break
export interface BreakEndResponse {
  breakId: number;
  startTime: string; // Assuming ISO string from backend
  durationMinutes: number;
}
