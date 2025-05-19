import { KitchenItem, IngredientUsage, RestockRequest } from '@/types/kitchenTypes';
import axios from 'axios';

const API_BASE_URL = 'http://192.168.129.1:3000/api';

export const loginEmployee = async (employee_name: string, pin: string) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, { employee_name, pin });
  return response.data; // should be { id, role }
};

export const getEmployees = async () => {
  const response = await axios.get(`${API_BASE_URL}/employees`);
  return response.data;
};

export const getEmployeeDetails = async (employeeId: string) => {
  const response = await axios.get(`${API_BASE_URL}/employees/${employeeId}`);
  return response.data;
};

export const updateEmployee = async (employeeId: string, employeeData: any) => {
  const response = await axios.put(`${API_BASE_URL}/employees/${employeeId}`, employeeData);
  return response.data;
};

export const getEmployeeSchedule = async (employeeId: string) => {
  const response = await axios.get(`${API_BASE_URL}/employees/${employeeId}/schedule`);
  return response.data;
};

export const updateEmployeeSchedule = async (employeeId: string, scheduleData: any) => {
  const response = await axios.put(`${API_BASE_URL}/employees/${employeeId}/schedule`, scheduleData);
  return response.data;
};

export const deleteEmployee = async (employeeId: string) => {
  const response = await axios.delete(`${API_BASE_URL}/employees/${employeeId}`);
  
  if (response.status === 403) {
    throw new Error('Admin employees cannot be deleted');
  }
  
  return response.data;
};

export const createEmployee = async (employeeData: {
  employee_name: string;
  employee_role: string;
  pin: string;
  employee_email?: string;
  employee_phone?: string;
}) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/employees`, employeeData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle specific error cases
      if (error.response?.status === 400) {
        throw new Error('Invalid employee data');
      }
      if (error.response?.status === 409) {
        throw new Error('Employee already exists');
      }
      throw new Error(error.response?.data?.message || 'Failed to create employee');
    }
    throw new Error('Failed to create employee');
  }
};


// export const createOrder = async (orderData: {
//   employee_id: string;
//   store_id: number;
//   orderData: {
//     customer_id?: number | null;
//     order_type: 'delivery' | 'pickup';
//     order_source: 'phone' | 'in_person' | 'online' | 'third_party';
//     subtotal: number;
//     discount_amount?: number;
//     total_amount: number;
//     notes?: string | null;
//     address?: string;
//     deliverer?: string;
//   };
//   items: Array<{
//     product_id: number;
//     variant_id: number;
//     quantity: number;
//     unit_price: number;
//     discount_amount?: number;
//     total_price: number;
//   }>;
// }) => {
//   const response = await axios.post(`${API_BASE_URL}/cashier/orders`, orderData);
//   return response.data;
// };

// export const getOrders = async (status?: 'pending' | 'in_progress' | 'ready' | 'completed' | 'cancelled') => {
//   const url = status 
//     ? `${API_BASE_URL}/cashier/orders?status=${status}`
//     : `${API_BASE_URL}/cashier/orders`;
//   const response = await axios.get(url);
//   return response.data;
// };

// export const updateOrderStatus = async (orderId: string, status: 'pending' | 'in_progress' | 'ready' | 'completed' | 'cancelled') => {
//   const response = await axios.patch(`${API_BASE_URL}/cashier/orders/${orderId}/status`, { status });
//   return response.data;
// };

// export const getProducts = async () => {
//   const response = await axios.get(`${API_BASE_URL}/cashier/products`);
//   return response.data;
// };


// export const getKitchenInventory = async (): Promise<KitchenItem[]> => {
//   const response = await axios.get(`${API_BASE_URL}/kitchen/inventory`);
//   return response.data;
// };

// export const createKitchenItem = async (itemData: Omit<KitchenItem, '_id' | 'lastRestocked'>): Promise<KitchenItem> => {
//   const response = await axios.post(`${API_BASE_URL}/kitchen/inventory`, itemData);
//   return response.data;
// };

// export const updateKitchenItem = async (id: string, itemData: Partial<KitchenItem>): Promise<KitchenItem> => {
//   const response = await axios.put(`${API_BASE_URL}/kitchen/inventory/${id}`, itemData);
//   return response.data;
// };

// // Ingredient Usage
// export const recordIngredientUsage = async (
//   orderId: string,
//   items: Array<{
//     ingredient: string;
//     quantityUsed: number;
//   }>
// ): Promise<IngredientUsage> => {
//   const response = await axios.post(`${API_BASE_URL}/kitchen/usage`, {
//     order: orderId,
//     items
//   });
//   return response.data;
// };

// export const getIngredientUsageHistory = async (days?: number): Promise<IngredientUsage[]> => {
//   const url = `${API_BASE_URL}/kitchen/usage/history`;
//   const params = days ? { days } : {};
//   const response = await axios.get(url, { params });
//   return response.data;
// };

// // Inventory Alerts
// export const getLowStockItems = async (): Promise<KitchenItem[]> => {
//   const response = await axios.get(`${API_BASE_URL}/kitchen/inventory/low-stock`);
//   return response.data;
// };

// // Restock
// export const restockInventory = async (items: RestockRequest[]): Promise<KitchenItem[]> => {
//   const response = await axios.post(`${API_BASE_URL}/kitchen/inventory/restock`, { items });
//   return response.data;
// };

// Cashier Endpoints
export const createOrder = async (orderData: any) => {
  const response = await axios.post(`${API_BASE_URL}/cashier/orders`, orderData);
  return response.data;
};

export const getOrders = async (status?: string) => {
  const url = status 
    ? `${API_BASE_URL}/cashier/orders?status=${status}`
    : `${API_BASE_URL}/cashier/orders`;
  const response = await axios.get(url);
  return response.data;
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const response = await axios.patch(
    `${API_BASE_URL}/cashier/orders/${orderId}/status`, 
    { status }
  );
  return response.data;
};

export const getProducts = async () => {
  const response = await axios.get(`${API_BASE_URL}/cashier/products`);
  return response.data;
};

// Kitchen Endpoints
export const getKitchenOrders = async (status?: string) => {
  const url = status
    ? `${API_BASE_URL}/kitchen/orders?status=${status}`
    : `${API_BASE_URL}/kitchen/orders`;
  const response = await axios.get(url);
  return response.data;
};

export const updateKitchenOrder = async (orderId: string, updates: any) => {
  const response = await axios.patch(
    `${API_BASE_URL}/kitchen/orders/${orderId}`,
    updates
  );
  return response.data;
};

// Real-time updates with WebSocket
export const setupOrderUpdates = (callback: (order: any) => void) => {
  const ws = new WebSocket(`ws://192.168.129.1:3000/api/orders/updates`);
  
  ws.onmessage = (event) => {
    const order = JSON.parse(event.data);
    callback(order);
  };

  return () => ws.close();
};