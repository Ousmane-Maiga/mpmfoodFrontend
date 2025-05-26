import { InventoryItem, InventoryItemUpdate, InventoryUsage, Supplier } from '@/types/admin';
import { Order, OrderItem, OrderStatus, Product, TeamMember, TeamPerformanceData } from '@/types/cashierTypes';
import { KitchenItem, IngredientUsage, RestockRequest } from '@/types/kitchenTypes';
import axios from 'axios';

// const API_BASE_URL = 'http://localhost:3000/api';
const API_BASE_URL = 'http://172.20.10.7:3000/api';
const API_BASE_WEBSOCKET = 'ws://172.20.10.7:3000/api';


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


// Cashier Endpoints
export const createOrder = async (orderData: {
  employee_id: string; // Ensure this is UUID string
  store_id: number;
  orderData: {
    customer_id: number | null;
    order_type: string;
    order_source: string;
    subtotal: number;
    total_amount: number;
    address?: string | null;
    deliverer?: string | null;
    notes?: string;
  };
  items: Array<{
    product_id: number;
    variant_id: number;
    quantity: number;
    unit_price: number;
    total_price: number;
    discount_amount?: number;
  }>;
}) => {
  try {
    // Validate employee_id is a UUID
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(orderData.employee_id)) {
      throw new Error('Invalid employee ID format - must be UUID');
    }

    const response = await axios.post(`${API_BASE_URL}/cashier/orders`, orderData);
    return response.data;
  } catch (error) {
    console.error('Order creation failed:', error);
    throw error; // Re-throw for handling in the component
  }
};

export const getOrders = async ({
  status,
  page,
  limit,
  fromDate,
  toDate,
  signal
}: {
  status?: OrderStatus;
  page?: number;
  limit?: number;
  fromDate?: Date;
  toDate?: Date;
  signal?: AbortSignal;
}): Promise<{ orders: Order[]; total: number }> => {
  try {
    const params = new URLSearchParams();
    
    if (status) params.append('status', status);
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    if (fromDate) params.append('from', fromDate.toISOString());
    if (toDate) params.append('to', toDate.toISOString());

    const response = await axios.get(`${API_BASE_URL}/cashier/orders?${params.toString()}`, {
      signal
    });

    return {
      orders: response.data,
      total: parseInt(response.headers['x-total-count'] || '0', 10)
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ERR_CANCELED') {
        console.log('Request canceled');
        throw new Error('Request canceled');
      }
      console.error('Failed to fetch orders:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to fetch orders');
    }
    console.error('Unexpected error fetching orders:', error);
    throw new Error('Unexpected error occurred');
  }
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const response = await axios.patch(
    `${API_BASE_URL}/cashier/orders/${orderId}/status`, 
    { status }
  );
  return response.data;
};



export const getProducts = async (): Promise<Product[]> => {
  try {
    console.log('Attempting to fetch products from:', `${API_BASE_URL}/cashier/products`);
    const response = await axios.get(`${API_BASE_URL}/cashier/products`);
    console.log('Raw API response:', response);
    
    // Validate response structure
    if (!response.data || typeof response.data !== 'object' || !Array.isArray(response.data.data)) {
      console.error('Invalid products data structure:', response.data);
      throw new Error('Invalid products data structure');
    }
    
    return response.data.data; // Return the data array from the response
  } catch (error) {
    console.error('API Error:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.data
      });
    }
    return [];
  }
};

export const setupProductUpdates = (callback: (products: Product[]) => void) => {
  const ws = new WebSocket(`${API_BASE_WEBSOCKET}/products/updates`);

  ws.onmessage = (event) => {
    const updatedProducts = JSON.parse(event.data);
    callback(updatedProducts);
  };

  return () => ws.close();
};

export const testConnection = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`);
    return response.status === 200;
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
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
  const ws = new WebSocket(`${API_BASE_WEBSOCKET}/orders/updates`);
  
  ws.onmessage = (event) => {
    const order = JSON.parse(event.data);
    callback(order);
  };

  return () => ws.close();
};

// Inventory functions
export const getInventoryItems = async (): Promise<InventoryItem[]> => {
  const response = await axios.get(`${API_BASE_URL}/inventory/items`);
  return response.data.map((item: any) => ({
    ...item,
    quantity: Number(item.quantity),
    min_threshold: Number(item.min_threshold),
    cost_per_unit: item.cost_per_unit ? Number(item.cost_per_unit) : null,
    last_restocked: new Date(item.last_restocked).toISOString()
  }));
};

export const createInventoryItem = async (itemData: Omit<InventoryItem, 'id'>): Promise<InventoryItem> => {
  const response = await axios.post(`${API_BASE_URL}/inventory/items`, itemData); // Added /items
  return response.data;
};

export const updateInventoryItem = async (
  itemData: InventoryItemUpdate & { id: number }
): Promise<InventoryItem> => {
  // Clean the payload before sending
  const payload = {
    name: itemData.name,
    type: itemData.type,
    quantity: Number(itemData.quantity),
    unit: itemData.unit,
    min_threshold: Number(itemData.min_threshold),
    supplier_id: itemData.supplier_id === null ? undefined : itemData.supplier_id,
    cost_per_unit: itemData.cost_per_unit === null ? undefined : itemData.cost_per_unit
  };

  const response = await axios.put(
    `${API_BASE_URL}/inventory/items/${itemData.id}`,
    payload
  );
  return response.data;
};

export const getInventoryUsage = async (itemId: number): Promise<InventoryUsage[]> => {
  const response = await axios.get(`${API_BASE_URL}/inventory/items/${itemId}/usage`); // Added /items
  return response.data;
};
export const setupInventoryUpdates = (callback: (updatedItems: InventoryItem[]) => void) => {
  const ws = new WebSocket(`${API_BASE_WEBSOCKET}/inventory/updates`);
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'inventory_update') {
      callback(data.updatedItems);
    }
  };

  return () => ws.close();
};

export const getSuppliers = async (): Promise<Supplier[]> => {
  const response = await axios.get(`${API_BASE_URL}/inventory/suppliers`);
  return response.data;
};

export const createSupplier = async (supplierData: Omit<Supplier, 'id'>): Promise<Supplier> => {
  const response = await axios.post(`${API_BASE_URL}/inventory/suppliers`, supplierData);
  return response.data;
};




export const getTeamPerformance = async (employeeId: string): Promise<TeamPerformanceData> => {
    try {
        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(employeeId)) {
            throw new Error('Invalid employee ID format');
        }

        const response = await axios.get(`${API_BASE_URL}/cashier/team-performance/${employeeId}`);
        
        if (!response.data?.data) {
            throw new Error('Invalid response format');
        }

        // Return the data in the expected format
        return {
            teamMembers: response.data.data.teamMembers,
            currentEmployee: response.data.data.currentEmployee
        };
        } catch (error) {
            console.error('Failed to fetch team performance:', error);
            return {
                teamMembers: [],
                currentEmployee: {
                    ordersHandled: 0,
                    averageProcessingTime: 0,
                    breakDuration: 0
                }
            };
        }
};

function calculatePerformance(orders: number, avgTime: number, breakMinutes: number): number {
    const orderScore = Math.min(orders / 20, 1);
    const timeScore = Math.max(0, 1 - (avgTime / 10));
    const breakScore = Math.max(0, 1 - (breakMinutes / 90));
    return Math.round((orderScore * 0.5 + timeScore * 0.3 + breakScore * 0.2) * 100);
}