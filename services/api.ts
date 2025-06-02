// services/api.ts
import { InventoryItem, InventoryItemUpdate, InventoryUsage, Supplier } from '@/types/admin';
// Ensure all necessary types are imported from cashierTypes
import { Order, OrderItem, OrderSource, OrderStatus, OrderStatusFilter, OrderType, Product, TeamMember, TeamPerformanceData, CreateOrderRequest as FrontendCreateOrderRequest } from '@/types/cashierTypes';
import { KitchenItem, IngredientUsage, RestockRequest, KitchenTeamMember, KitchenPerformanceData } from '@/types/kitchenTypes';
import axios from 'axios';

// const API_BASE_URL = 'http://localhost:3000/api'; // Use this for local development
const API_BASE_URL = 'http://172.20.10.7:3000/api'; // Use this for device/emulator testing
const API_BASE_WEBSOCKET = 'ws://172.20.10.7:3000/api'; // Use this for device/emulator testing

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
});

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
// FIX: Use FrontendCreateOrderRequest type for orderData parameter
export const createOrder = async (orderData: FrontendCreateOrderRequest): Promise<Order> => { // Return type is Order
    try {
        // Validate created_by (formerly employee_id) is a UUID
        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(orderData.created_by)) {
            throw new Error('Invalid created_by ID format - must be UUID');
        }

        const response = await axios.post(`${API_BASE_URL}/cashier/orders`, orderData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data; // Backend should return the full Order object
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Order creation failed:', error.response?.data);
            throw new Error(error.response?.data?.message || 'Failed to create order');
        }
        throw new Error('Failed to create order');
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
    status?: OrderStatusFilter;
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

        const response = await axios.get(`${API_BASE_URL}/cashier/orders`, {
            params,
            signal,
            timeout: 10000
        });

        if (!response.data?.success || !response.data?.data?.orders) {
            throw new Error('Invalid response structure from server');
        }

        return {
            orders: response.data.data.orders,
            total: parseInt(response.data.data.total, 10) || response.data.data.orders.length
        };
    } catch (error) {
        console.error('API Error in getOrders:', error);
        if (axios.isAxiosError(error)) {
            const serverMessage = error.response?.data?.message;
            const statusCode = error.response?.status;
            let errorMessage = serverMessage || error.message;

            if (statusCode === 404) {
                errorMessage = 'Orders endpoint not found';
            } else if (statusCode === 500) {
                errorMessage = 'Server error occurred while fetching orders';
            }

            throw new Error(errorMessage);
        }
        throw new Error('Failed to fetch orders');
    }
};


export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<Order> => { // Return type is Order
    try {
        const response = await axios.patch(
            `${API_BASE_URL}/cashier/orders/${orderId}/status`,
            { status },
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 5000
            }
        );
        return response.data; // Backend should return the updated Order object
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // Enhanced error messages
            if (error.response) {
                switch (error.response.status) {
                    case 400:
                        throw new Error(error.response.data.message || 'Invalid request');
                    case 404:
                        throw new Error(`Order ${orderId} not found`);
                    case 500:
                        throw new Error('Server error - please try again later');
                    default:
                        throw new Error(error.response.data?.message || 'Request failed');
                }
            } else {
                throw new Error('Network error - check your connection');
            }
        }
        throw new Error('Unknown error occurred');
    }
};



export const getProducts = async (): Promise<Product[]> => {
    try {
        console.log('Attempting to fetch products from:', `${API_BASE_URL}/cashier/products`);
        const response = await axios.get(`${API_BASE_URL}/cashier/products`);
        console.log('Raw API response:', response);

        // Validate response structure (assuming backend wraps data in a 'data' property)
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
        throw error; // Re-throw the error for component to handle
    }
};

export const setupProductUpdates = (callback: (products: Product[]) => void) => {
    // FIX: WebSocket endpoint for products might be different, assuming it's /products/updates
    const ws = new WebSocket(`${API_BASE_WEBSOCKET}/products/updates`);

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // Assuming the WebSocket message sends an object like { type: 'product_update', data: Product[] }
        if (data.type === 'product_update' && Array.isArray(data.data)) {
            callback(data.data as Product[]);
        } else {
            console.warn('Unexpected WebSocket product update format:', data);
        }
    };

    ws.onerror = (event) => {
        console.error('WebSocket error for products:', event);
    };
    ws.onclose = () => {
        console.log('WebSocket for products closed.');
    };
    ws.onopen = () => {
        console.log('WebSocket for products connected.');
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

export const getCashierTeamPerformance = async (employeeId: string): Promise<TeamPerformanceData> => {
    try {
        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(employeeId)) {
            throw new Error('Invalid employee ID format');
        }

        const response = await axios.get(`${API_BASE_URL}/cashier/performance/${employeeId}`);

        if (!response.data?.data) {
            throw new  Error('Invalid response format'); // FIX: Corrected new Error syntax
        }

        // Return the data in the expected format
        return {
            teamMembers: response.data.data.teamMembers as TeamMember[],
            currentEmployee: response.data.data.currentEmployee
        };
    } catch (error) {
        console.error('Failed to fetch team performance:', error);
        // Provide a default/empty structure on error
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

// Kitchen Endpoints
export const getKitchenOrders = async (status?: string): Promise<Order[]> => {
    const url = status
        ? `${API_BASE_URL}/kitchen/orders?status=${status}`
        : `${API_BASE_URL}/kitchen/orders`;

    try {
        const response = await axios.get(url);

        // Assuming kitchen backend returns an array of orders,
        // which might need transformation to match Frontend Order interface.
        // This mapping ensures consistency with your `cashierTypes.ts` Order interface.
        return response.data.map((order: any) => ({
            id: order.id,
            store_id: order.store_id,
            created_by: order.created_by, // FIX: Use created_by
            prepared_by: order.prepared_by, // FIX: Use prepared_by
            customer_id: order.customer_id,
            customer_name: order.customer_name,
            customer_phone: order.customer_phone,
            order_type: order.order_type,
            order_source: order.order_source,
            status: order.status,
            subtotal: order.subtotal,
            discount_amount: order.discount_amount,
            total_amount: order.total_amount,
            notes: order.notes,
            payment_status: order.payment_status,
            address: order.address,
            deliverer: order.deliverer,
            started_at: order.started_at,
            completed_at: order.completed_at,
            preparation_notes: order.preparation_notes,
            created_at: order.created_at,
            updated_at: order.updated_at,
            store_name: order.store_name, // Assuming kitchen API also provides store details
            store_phone: order.store_phone,
            store_location: order.store_location,
            created_by_name: order.created_by_name, // Assuming kitchen API provides creator name
            prepared_by_name: order.prepared_by_name, // Assuming kitchen API provides preparer name
            order_items: order.order_items ? order.order_items.map((item: any) => ({
                id: item.id,
                order_id: item.order_id,
                product_id: item.product_id,
                variant_id: item.variant_id,
                product: item.product,
                variant: item.variant,
                quantity: item.quantity,
                unit_price: item.unit_price,
                discount_amount: item.discount_amount || 0,
                total_price: item.total_price,
                created_at: item.created_at || order.created_at // Fallback
            })) : []
        }));
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 404) {
                throw new Error('Kitchen orders endpoint not found - please check server configuration');
            }
            console.error('Failed to fetch kitchen orders:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Failed to fetch kitchen orders');
        }
        throw new Error('Unexpected error fetching kitchen orders');
    }
};



export const updateKitchenOrderStatus = async (
  orderId: string,
  status: OrderStatus,
  preparedById?: string
): Promise<Order> => {
  try {
    const payload: { status: OrderStatus; prepared_by?: string } = { status };
    
    // Always include prepared_by if available
    if (preparedById) {
      payload.prepared_by = preparedById;
    }
    console.log('API call payload:', payload);

    const response = await axios.patch(
      `${API_BASE_URL}/kitchen/orders/${orderId}/status`,
      payload
    );
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Failed to update kitchen order status:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to update kitchen order status');
    }
    throw new Error('Unknown error updating kitchen order status');
  }
};

export const updateKitchenOrder = async (orderId: string, updates: any): Promise<Order> => { // Return type is Order
    try {
        const response = await axios.patch(
            `${API_BASE_URL}/kitchen/orders/${orderId}`,
            updates
        );
        return response.data.data; // Assuming backend returns { success: true, data: Order }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Failed to update kitchen order:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Failed to update kitchen order');
        }
        throw new Error('Unknown error updating kitchen order');
    }
};

// Real-time updates with WebSocket
export const setupOrderUpdates = (callback: (order: Order) => void) => { // FIX: Type callback to Order
    const ws = new WebSocket(`${API_BASE_WEBSOCKET}/orders/updates`);

    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            // Assuming WebSocket sends a message like { type: 'order_update', data: Order }
            if (data.type === 'order_update' && data.data) {
                callback(data.data as Order); // Cast to Order
            } else {
                console.warn('Unexpected WebSocket order update format:', data);
            }
        } catch (error) {
            console.error('Error parsing WebSocket message for order updates:', error);
        }
    };

    ws.onerror = (event) => {
        console.error('WebSocket error for order updates:', event);
    };
    ws.onclose = () => {
        console.log('WebSocket for order updates closed.');
    };
    ws.onopen = () => {
        console.log('WebSocket for order updates connected.');
    };

    return () => ws.close();
};



export const getKitchenEmployeePerformance = async (employeeId: string): Promise<KitchenPerformanceData> => {
  try {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(employeeId)) {
      throw new Error('Invalid employee ID format');
    }

    const response = await axios.get(`${API_BASE_URL}/kitchen/performance/${employeeId}`);

    if (!response.data?.data) {
      throw new Error('Invalid response format');
    }

    // Ensure currentEmployee properties are numbers, defaulting to 0 if missing or null
    const currentEmployeeData = response.data.data.currentEmployee;

    return {
      teamMembers: response.data.data.teamMembers as KitchenTeamMember[],
      currentEmployee: {
        itemsPrepared: currentEmployeeData?.itemsPrepared ?? 0, // Use nullish coalescing
        avgPrepTime: currentEmployeeData?.avgPrepTime ?? 0,     // Use nullish coalescing
        breakDuration: currentEmployeeData?.breakDuration ?? 0
      }
    };
  } catch (error) {
    console.error('Failed to fetch kitchen performance:', error);
    // Always return a valid structure with default numerical values on error
    return {
      teamMembers: [],
      currentEmployee: {
        itemsPrepared: 0,
        avgPrepTime: 0, // Ensure it's 0, not undefined
        breakDuration: 0
      }
    };
  }
};

export const testApiConnection = async (): Promise<boolean> => {
  const testEndpoints = [
    '/health',        // Root health endpoint
    '/api/health',    // API health endpoint
    '/api/cashier/products' // Existing endpoint that definitely works
  ];
  
  for (const endpoint of testEndpoints) {
    try {
      const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
        timeout: 3000,
      });
      if (response.status === 200) return true;
    } catch (error) {
      console.warn(`Failed to reach ${endpoint}:`, error);
    }
  }
  
  return false;
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





export default api;