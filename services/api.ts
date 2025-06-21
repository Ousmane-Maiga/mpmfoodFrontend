// // // services/api.ts
// // import { InventoryItem, InventoryUsage, Supplier } from '@/types/admin'; // Assuming InventoryItemUpdate is not needed directly here
// // // Ensure all necessary types are imported from cashierTypes
// // import { Order, OrderItem, OrderSource, OrderStatus, OrderStatusFilter, OrderType, Product, TeamMember, TeamPerformanceData, CreateOrderRequest as FrontendCreateOrderRequest } from '@/types/cashierTypes';
// // import { CarouselItem, Customer } from '@/types/displayTypes';
// // import { KitchenItem, IngredientUsage, RestockRequest, KitchenTeamMember, KitchenPerformanceData } from '@/types/kitchenTypes';
// // import axios from 'axios';

// // // const API_BASE_URL = 'http://localhost:3000/api'; // Use this for local development

// // // my phone's id address
// // const API_BASE_URL = 'http://172.20.10.7:3000/api'; // Use this for device/emulator testing
// // const API_BASE_WEBSOCKET = 'ws://172.20.10.7:3000/api'; // Use this for device/emulator testing

// // // AGETIC ethernet 2 id address
// // // const API_BASE_URL = 'http://172.16.0.131:3000/api'; // Use this for device/emulator testing
// // // const API_BASE_WEBSOCKET = 'ws://172.16.0.131.7:3000/api'; // Use this for device/emulator testing

// // // S-Incubation's address
// // // const API_BASE_URL = 'http://192.168.0.111:3000/api'; // Use this for device/emulator testing
// // // const API_BASE_WEBSOCKET = 'ws://192.168.0.111:3000/api'; 

// // const IMAGE_SERVER_BASE_URL = 'http://172.20.10.7:3000'; // Adjust this to match your server's base (e.g., 'http://localhost:3000')

// // const api = axios.create({
// //     baseURL: API_BASE_URL,
// //     timeout: 10000,
// // });

// // export const loginEmployee = async (employee_name: string, pin: string) => {
// //     const response = await axios.post(`${API_BASE_URL}/auth/login`, { employee_name, pin });
// //     return response.data; // should be { id, role }
// // };

// // export const getEmployees = async () => {
// //     const response = await axios.get(`${API_BASE_URL}/employees`);
// //     return response.data;
// // };

// // export const getEmployeeDetails = async (employeeId: string) => {
// //     const response = await axios.get(`${API_BASE_URL}/employees/${employeeId}`);
// //     return response.data;
// // };

// // export const updateEmployee = async (employeeId: string, employeeData: any) => {
// //     const response = await axios.put(`${API_BASE_URL}/employees/${employeeId}`, employeeData);
// //     return response.data;
// // };

// // export const getEmployeeSchedule = async (employeeId: string) => {
// //     const response = await axios.get(`${API_BASE_URL}/employees/${employeeId}/schedule`);
// //     return response.data;
// // };

// // export const updateEmployeeSchedule = async (employeeId: string, scheduleData: any) => {
// //     const response = await axios.put(`${API_BASE_URL}/employees/${employeeId}/schedule`, scheduleData);
// //     return response.data;
// // };

// // export const deleteEmployee = async (employeeId: string) => {
// //     const response = await axios.delete(`${API_BASE_URL}/employees/${employeeId}`);

// //     if (response.status === 403) {
// //         throw new Error('Admin employees cannot be deleted');
// //     }

// //     return response.data;
// // };

// // export const createEmployee = async (employeeData: {
// //     employee_name: string;
// //     employee_role: string;
// //     pin: string;
// //     employee_email?: string;
// //     employee_phone?: string;
// // }) => {
// //     try {
// //         const response = await axios.post(`${API_BASE_URL}/employees`, employeeData);
// //         return response.data;
// //     } catch (error) {
// //         if (axios.isAxiosError(error)) {
// //             // Handle specific error cases
// //             if (error.response?.status === 400) {
// //                 throw new Error('Invalid employee data');
// //             }
// //             if (error.response?.status === 409) {
// //                 throw new Error('Employee already exists');
// //             }
// //             throw new Error(error.response?.data?.message || 'Failed to create employee');
// //         }
// //         throw new Error('Failed to create employee');
// //     }
// // };


// // // Cashier Endpoints
// // // FIX: Use FrontendCreateOrderRequest type for orderData parameter
// // export const createOrder = async (orderData: FrontendCreateOrderRequest): Promise<Order> => { // Return type is Order
// //     try {
// //         // Validate created_by (formerly employee_id) is a UUID
// //         if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(orderData.created_by)) {
// //             throw new Error('Invalid created_by ID format - must be UUID');
// //         }

// //         const response = await axios.post(`${API_BASE_URL}/cashier/orders`, orderData, {
// //             headers: {
// //                 'Content-Type': 'application/json'
// //             }
// //         });
// //         return response.data; // Backend should return the full Order object
// //     } catch (error) {
// //         if (axios.isAxiosError(error)) {
// //             console.error('Order creation failed:', error.response?.data);
// //             throw new Error(error.response?.data?.message || 'Failed to create order');
// //         }
// //         throw new Error('Failed to create order');
// //     }
// // };

// // export const getOrders = async ({
// //     status,
// //     page,
// //     limit,
// //     fromDate,
// //     toDate,
// //     signal
// // }: {
// //     status?: OrderStatusFilter;
// //     page?: number;
// //     limit?: number;
// //     fromDate?: Date;
// //     toDate?: Date;
// //     signal?: AbortSignal;
// // }): Promise<{ orders: Order[]; total: number }> => {
// //     try {
// //         const params = new URLSearchParams();
// //         if (status) params.append('status', status);
// //         if (page) params.append('page', page.toString());
// //         if (limit) params.append('limit', limit.toString());
// //         if (fromDate) params.append('from', fromDate.toISOString());
// //         if (toDate) params.append('to', toDate.toISOString());

// //         const response = await axios.get(`${API_BASE_URL}/cashier/orders`, {
// //             params,
// //             signal,
// //             timeout: 10000
// //         });

// //         if (!response.data?.success || !response.data?.data?.orders) {
// //             throw new Error('Invalid response structure from server');
// //         }

// //         return {
// //             orders: response.data.data.orders,
// //             total: parseInt(response.data.data.total, 10) || response.data.data.orders.length
// //         };
// //     } catch (error) {
// //         console.error('API Error in getOrders:', error);
// //         if (axios.isAxiosError(error)) {
// //             const serverMessage = error.response?.data?.message;
// //             const statusCode = error.response?.status;
// //             let errorMessage = serverMessage || error.message;

// //             if (statusCode === 404) {
// //                 errorMessage = 'Orders endpoint not found';
// //             } else if (statusCode === 500) {
// //                 errorMessage = 'Server error occurred while fetching orders';
// //             }

// //             throw new Error(errorMessage);
// //         }
// //         throw new Error('Failed to fetch orders');
// //     }
// // };


// // export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<Order> => { // Return type is Order
// //     try {
// //         const response = await axios.patch(
// //             `${API_BASE_URL}/cashier/orders/${orderId}/status`,
// //             { status },
// //             {
// //                 headers: {
// //                     'Content-Type': 'application/json'
// //                 },
// //                 timeout: 5000
// //             }
// //         );
// //         return response.data; // Backend should return the updated Order object
// //     } catch (error) {
// //         if (axios.isAxiosError(error)) {
// //             // Enhanced error messages
// //             if (error.response) {
// //                 switch (error.response.status) {
// //                     case 400:
// //                         throw new Error(error.response.data.message || 'Invalid request');
// //                     case 404:
// //                         throw new Error(`Order ${orderId} not found`);
// //                     case 500:
// //                         throw new Error('Server error - please try again later');
// //                     default:
// //                         throw new Error(error.response.data?.message || 'Request failed');
// //                 }
// //             } else {
// //                 throw new Error('Network error - check your connection');
// //             }
// //         }
// //         throw new Error('Unknown error occurred');
// //     }
// // };



// // export const getProducts = async (): Promise<Product[]> => {
// //     try {
// //         console.log('Attempting to fetch products from:', `${API_BASE_URL}/cashier/products`);
// //         const response = await axios.get(`${API_BASE_URL}/cashier/products`);
// //         console.log('Raw API response:', response);

// //         // Validate response structure (assuming backend wraps data in a 'data' property)
// //         if (!response.data || typeof response.data !== 'object' || !Array.isArray(response.data.data)) {
// //             console.error('Invalid products data structure:', response.data);
// //             throw new Error('Invalid products data structure');
// //         }

// //         return response.data.data; // Return the data array from the response
// //     } catch (error) {
// //         console.error('API Error:', error);
// //         if (axios.isAxiosError(error)) {
// //             console.error('Axios error details:', {
// //                 message: error.message,
// //                 code: error.code,
// //                 response: error.response?.data
// //             });
// //         }
// //         throw error; // Re-throw the error for component to handle
// //     }
// // };

// // export const setupProductUpdates = (callback: (products: Product[]) => void) => {
// //     // FIX: WebSocket endpoint for products might be different, assuming it's /products/updates
// //     const ws = new WebSocket(`${API_BASE_WEBSOCKET}/products/updates`);

// //     ws.onmessage = (event) => {
// //         const data = JSON.parse(event.data);
// //         // Assuming the WebSocket message sends an object like { type: 'product_update', data: Product[] }
// //         if (data.type === 'product_update' && Array.isArray(data.data)) {
// //             callback(data.data as Product[]);
// //         } else {
// //             console.warn('Unexpected WebSocket product update format:', data);
// //         }
// //     };

// //     ws.onerror = (event) => {
// //         console.error('WebSocket error for products:', event);
// //     };
// //     ws.onclose = () => {
// //         console.log('WebSocket for products closed.');
// //     };
// //     ws.onopen = () => {
// //         console.log('WebSocket for products connected.');
// //     };

// //     return () => ws.close();
// // };

// // export const testConnection = async () => {
// //     try {
// //         const response = await axios.get(`${API_BASE_URL}/health`);
// //         return response.status === 200;
// //     } catch (error) {
// //         console.error('Connection test failed:', error);
// //         return false;
// //     }
// // };

// // export const getCashierTeamPerformance = async (employeeId: string): Promise<TeamPerformanceData> => {
// //     try {
// //         if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(employeeId)) {
// //             throw new Error('Invalid employee ID format');
// //         }

// //         const response = await axios.get(`${API_BASE_URL}/cashier/performance/${employeeId}`);

// //         if (!response.data?.data) {
// //             throw new Error('Invalid response format'); // FIX: Corrected new Error syntax
// //         }

// //         // Return the data in the expected format
// //         return {
// //             teamMembers: response.data.data.teamMembers as TeamMember[],
// //             currentEmployee: response.data.data.currentEmployee
// //         };
// //     } catch (error) {
// //         console.error('Failed to fetch team performance:', error);
// //         // Provide a default/empty structure on error
// //         return {
// //             teamMembers: [],
// //             currentEmployee: {
// //                 ordersHandled: 0,
// //                 averageProcessingTime: 0,
// //                 breakDuration: 0
// //             }
// //         };
// //     }
// // };

// // function calculatePerformance(orders: number, avgTime: number, breakMinutes: number): number {
// //     const orderScore = Math.min(orders / 20, 1);
// //     const timeScore = Math.max(0, 1 - (avgTime / 10));
// //     const breakScore = Math.max(0, 1 - (breakMinutes / 90));
// //     return Math.round((orderScore * 0.5 + timeScore * 0.3 + breakScore * 0.2) * 100);
// // }

// // // Kitchen Endpoints
// // export const getKitchenOrders = async (status?: string): Promise<Order[]> => {
// //     const url = status
// //         ? `${API_BASE_URL}/kitchen/orders?status=${status}`
// //         : `${API_BASE_URL}/kitchen/orders`;

// //     try {
// //         const response = await axios.get(url);

// //         // Assuming kitchen backend returns an array of orders,
// //         // which might need transformation to match Frontend Order interface.
// //         // This mapping ensures consistency with your `cashierTypes.ts` Order interface.
// //         return response.data.map((order: any) => ({
// //             id: order.id,
// //             store_id: order.store_id,
// //             created_by: order.created_by, // FIX: Use created_by
// //             prepared_by: order.prepared_by, // FIX: Use prepared_by
// //             customer_id: order.customer_id,
// //             customer_name: order.customer_name,
// //             customer_phone: order.customer_phone,
// //             order_type: order.order_type,
// //             order_source: order.order_source,
// //             status: order.status,
// //             subtotal: order.subtotal,
// //             discount_amount: order.discount_amount,
// //             total_amount: order.total_amount,
// //             notes: order.notes,
// //             payment_status: order.payment_status,
// //             address: order.address,
// //             deliverer: order.deliverer,
// //             started_at: order.started_at,
// //             completed_at: order.completed_at,
// //             preparation_notes: order.preparation_notes,
// //             created_at: order.created_at,
// //             updated_at: order.updated_at,
// //             store_name: order.store_name, // Assuming kitchen API also provides store details
// //             store_phone: order.store_phone,
// //             store_location: order.store_location,
// //             created_by_name: order.created_by_name, // Assuming kitchen API provides creator name
// //             prepared_by_name: order.prepared_by_name, // Assuming kitchen API provides preparer name
// //             order_items: order.order_items ? order.order_items.map((item: any) => ({
// //                 id: item.id,
// //                 order_id: item.order_id,
// //                 product_id: item.product_id,
// //                 variant_id: item.variant_id,
// //                 product: item.product,
// //                 variant: item.variant,
// //                 quantity: item.quantity,
// //                 unit_price: item.unit_price,
// //                 discount_amount: item.discount_amount || 0,
// //                 total_price: item.total_price,
// //                 created_at: item.created_at || order.created_at // Fallback
// //             })) : []
// //         }));
// //     } catch (error) {
// //         if (axios.isAxiosError(error)) {
// //             if (error.response?.status === 404) {
// //                 throw new Error('Kitchen orders endpoint not found - please check server configuration');
// //             }
// //             console.error('Failed to fetch kitchen orders:', error.response?.data || error.message);
// //             throw new Error(error.response?.data?.message || 'Failed to fetch kitchen orders');
// //         }
// //         throw new Error('Unexpected error fetching kitchen orders');
// //     }
// // };



// // export const updateKitchenOrderStatus = async (
// //     orderId: string,
// //     status: OrderStatus,
// //     preparedById?: string
// // ): Promise<Order> => {
// //     try {
// //         const payload: { status: OrderStatus; prepared_by?: string } = { status };

// //         // Always include prepared_by if available
// //         if (preparedById) {
// //             payload.prepared_by = preparedById;
// //         }
// //         console.log('API call payload:', payload);

// //         const response = await axios.patch(
// //             `${API_BASE_URL}/kitchen/orders/${orderId}/status`,
// //             payload
// //         );
// //         return response.data.data;
// //     } catch (error) {
// //         if (axios.isAxiosError(error)) {
// //             console.error('Failed to update kitchen order status:', error.response?.data || error.message);
// //             throw new Error(error.response?.data?.message || 'Failed to update kitchen order status');
// //         }
// //         throw new Error('Unknown error updating kitchen order status');
// //     }
// // };

// // export const updateKitchenOrder = async (orderId: string, updates: any): Promise<Order> => { // Return type is Order
// //     try {
// //         const response = await axios.patch(
// //             `${API_BASE_URL}/kitchen/orders/${orderId}`,
// //             updates
// //         );
// //         return response.data.data; // Assuming backend returns { success: true, data: Order }
// //     } catch (error) {
// //         if (axios.isAxiosError(error)) {
// //             console.error('Failed to update kitchen order:', error.response?.data || error.message);
// //             throw new Error(error.response?.data?.message || 'Failed to update kitchen order');
// //         }
// //         throw new Error('Unknown error updating kitchen order');
// //     }
// // };

// // // Real-time updates with WebSocket
// // export const setupOrderUpdates = (callback: (order: Order) => void) => { // FIX: Type callback to Order
// //     const ws = new WebSocket(`${API_BASE_WEBSOCKET}/orders/updates`);

// //     ws.onmessage = (event) => {
// //         try {
// //             const data = JSON.parse(event.data);
// //             // Assuming WebSocket sends a message like { type: 'order_update', data: Order }
// //             if (data.type === 'order_update' && data.data) {
// //                 callback(data.data as Order); // Cast to Order
// //             } else {
// //                 console.warn('Unexpected WebSocket order update format:', data);
// //             }
// //         } catch (error) {
// //             console.error('Error parsing WebSocket message for order updates:', error);
// //         }
// //     };

// //     ws.onerror = (event) => {
// //         console.error('WebSocket error for order updates:', event);
// //     };
// //     ws.onclose = () => {
// //         console.log('WebSocket for order updates closed.');
// //     };
// //     ws.onopen = () => {
// //         console.log('WebSocket for order updates connected.');
// //     };

// //     return () => ws.close();
// // };



// // export const getKitchenEmployeePerformance = async (employeeId: string): Promise<KitchenPerformanceData> => {
// //     try {
// //         if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(employeeId)) {
// //             throw new Error('Invalid employee ID format');
// //         }

// //         const response = await axios.get(`${API_BASE_URL}/kitchen/performance/${employeeId}`);

// //         if (!response.data?.data) {
// //             throw new Error('Invalid response format');
// //         }

// //         // Ensure currentEmployee properties are numbers, defaulting to 0 if missing or null
// //         const currentEmployeeData = response.data.data.currentEmployee;

// //         return {
// //             teamMembers: response.data.data.teamMembers as KitchenTeamMember[],
// //             currentEmployee: {
// //                 itemsPrepared: currentEmployeeData?.itemsPrepared ?? 0, // Use nullish coalescing
// //                 avgPrepTime: currentEmployeeData?.avgPrepTime ?? 0,     // Use nullish coalescing
// //                 breakDuration: currentEmployeeData?.breakDuration ?? 0
// //             }
// //         };
// //     } catch (error) {
// //         console.error('Failed to fetch kitchen performance:', error);
// //         // Always return a valid structure with default numerical values on error
// //         return {
// //             teamMembers: [],
// //             currentEmployee: {
// //                 itemsPrepared: 0,
// //                 avgPrepTime: 0, // Ensure it's 0, not undefined
// //                 breakDuration: 0
// //             }
// //         };
// //     }
// // };

// // export const testApiConnection = async (): Promise<boolean> => {
// //     const testEndpoints = [
// //         '/health',        // Root health endpoint
// //         '/api/health',    // API health endpoint
// //         '/api/cashier/products' // Existing endpoint that definitely works
// //     ];

// //     for (const endpoint of testEndpoints) {
// //         try {
// //             const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
// //                 timeout: 3000,
// //             });
// //             if (response.status === 200) return true;
// //         } catch (error) {
// //             console.warn(`Failed to reach ${endpoint}:`, error);
// //         }
// //     }

// //     return false;
// // };

// // // Inventory functions
// // export const getInventoryItems = async (): Promise<InventoryItem[]> => {
// //     const response = await axios.get(`${API_BASE_URL}/inventory/items`);
// //     return response.data.map((item: any) => ({
// //         ...item,
// //         quantity: Number(item.quantity),
// //         min_threshold: Number(item.min_threshold),
// //         cost_per_unit: item.cost_per_unit !== null ? Number(item.cost_per_unit) : null,
// //         last_restocked: item.last_restocked ? new Date(item.last_restocked) : undefined,
// //         // created_at: new Date(item.created_at), // REMOVE this line
// //         updated_at: new Date(item.updated_at),
// //         supplier: item.supplier ? {
// //             ...item.supplier,
// //             created_at: new Date(item.supplier.created_at), // Correctly parse supplier's created_at
// //             updated_at: new Date(item.supplier.updated_at), // Correctly parse supplier's updated_at
// //         } : undefined,
// //     }));
// // };

// // export const createInventoryItem = async (
// //     itemData: Omit<InventoryItem, 'id' | 'updated_at' | 'last_restocked' | 'supplier'>
// // ): Promise<InventoryItem> => {
// //     const payload = {
// //         name: itemData.name,
// //         type: itemData.type,
// //         quantity: itemData.quantity,
// //         unit: itemData.unit,
// //         min_threshold: itemData.min_threshold,
// //         supplier_id: itemData.supplier_id === undefined ? null : itemData.supplier_id,
// //         cost_per_unit: itemData.cost_per_unit === undefined ? null : itemData.cost_per_unit,
// //     };
// //     const response = await axios.post(`${API_BASE_URL}/inventory/items`, payload);
// //     return {
// //         ...response.data,
// //         last_restocked: response.data.last_restocked ? new Date(response.data.last_restocked) : undefined,
// //         // created_at: new Date(response.data.created_at), // REMOVE this line
// //         updated_at: new Date(response.data.updated_at),
// //         supplier: response.data.supplier ? {
// //             ...response.data.supplier,
// //             created_at: new Date(response.data.supplier.created_at), // Correctly parse supplier's created_at
// //             updated_at: new Date(response.data.supplier.updated_at), // Correctly parse supplier's updated_at
// //         } : undefined,
// //     };
// // };

// // // Changed to Partial<InventoryItem> and removed { id: number } as it's part of Partial for update
// // export const updateInventoryItem = async (
// //     itemData: Partial<InventoryItem> & { id: number }
// // ): Promise<InventoryItem> => {
// //     const payload: Partial<InventoryItem> = {};

// //     if (itemData.name !== undefined) payload.name = itemData.name;
// //     if (itemData.type !== undefined) payload.type = itemData.type;
// //     if (itemData.quantity !== undefined) payload.quantity = Number(itemData.quantity);
// //     if (itemData.unit !== undefined) payload.unit = itemData.unit;
// //     if (itemData.min_threshold !== undefined) payload.min_threshold = Number(itemData.min_threshold);
// //     if (itemData.supplier_id !== undefined) {
// //         payload.supplier_id = itemData.supplier_id === null ? null : Number(itemData.supplier_id);
// //     }
// //     if (itemData.cost_per_unit !== undefined) {
// //         payload.cost_per_unit = itemData.cost_per_unit === null ? null : Number(itemData.cost_per_unit);
// //     }

// //     const response = await axios.patch(
// //         `<span class="math-inline">\{API\_BASE\_URL\}/inventory/items/</span>{itemData.id}`,
// //         payload
// //     );
// //     return {
// //         ...response.data,
// //         last_restocked: response.data.last_restocked ? new Date(response.data.last_restocked) : undefined,
// //         // created_at: new Date(response.data.created_at), // REMOVE this line
// //         updated_at: new Date(response.data.updated_at),
// //         supplier: response.data.supplier ? {
// //             ...response.data.supplier,
// //             created_at: new Date(response.data.supplier.created_at), // Correctly parse supplier's created_at
// //             updated_at: new Date(response.data.supplier.updated_at), // Correctly parse supplier's updated_at
// //         } : undefined,
// //     };
// // };

// // export const deleteInventoryItem = async (id: number): Promise<void> => {
// //     await axios.delete(`${API_BASE_URL}/inventory/items/${id}`);
// // };

// // export const getInventoryUsage = async (itemId: number): Promise<InventoryUsage[]> => {
// //     const response = await axios.get(`${API_BASE_URL}/inventory/items/${itemId}/usage`);
// //     return response.data;
// // };
// // export const setupInventoryUpdates = (callback: (updatedItems: InventoryItem[]) => void) => {
// //     const ws = new WebSocket(`${API_BASE_WEBSOCKET}/inventory/updates`);

// //     ws.onmessage = (event) => {
// //         const data = JSON.parse(event.data);
// //         if (data.type === 'inventory_update' && Array.isArray(data.updatedItems)) {
// //             const mappedItems = data.updatedItems.map((item: any) => ({
// //                 ...item,
// //                 last_restocked: item.last_restocked ? new Date(item.last_restocked) : undefined,
// //                 // created_at: new Date(item.created_at), // REMOVE this line
// //                 updated_at: new Date(item.updated_at),
// //                 supplier: item.supplier ? {
// //                     ...item.supplier,
// //                     created_at: new Date(item.supplier.created_at), // Correctly parse supplier's created_at
// //                     updated_at: new Date(item.supplier.updated_at), // Correctly parse supplier's updated_at
// //                 } : undefined,
// //             }));
// //             callback(mappedItems);
// //         }
// //     };

// //     // ... rest of the websocket setup
// // };

// // export const getSuppliers = async (): Promise<Supplier[]> => {
// //     const response = await axios.get(`${API_BASE_URL}/inventory/suppliers`);
// //     // Ensure created_at and updated_at are Date objects
// //     return response.data.map((supplier: any) => ({
// //         ...supplier,
// //         created_at: new Date(supplier.created_at),
// //         updated_at: new Date(supplier.updated_at),
// //     }));
// // };

// // export const createSupplier = async (supplierData: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>): Promise<Supplier> => {
// //     const response = await axios.post(`${API_BASE_URL}/inventory/suppliers`, supplierData);
// //     // Ensure created_at and updated_at are Date objects for the returned supplier
// //     return {
// //         ...response.data,
// //         created_at: new Date(response.data.created_at),
// //         updated_at: new Date(response.data.updated_at),
// //     };
// // };

// // // New API calls for Display Screen (add these at the end or in a dedicated section)
// // // Helper function to construct the full image URL
// // const getFullImageUrl = (filename: string): string => {
// //     // If the filename is already a full URL (e.g., from external storage like S3), return as is.
// //     // Otherwise, prepend your server's image base URL.
// //     if (filename.startsWith('http://') || filename.startsWith('https://')) {
// //         return filename;
// //     }
// //     return `${IMAGE_SERVER_BASE_URL}/images/${filename}`;
// // };


// // export const getDisplayImages = async (): Promise<CarouselItem[]> => {
// //     try {
// //         // MODIFIED: Use the 'api' instance
// //         const response = await api.get('/display/images');
// //         // The backend returns CarouselItem with 'url' as just the filename (e.g., 'image-12345.jpg').
// //         // We need to construct the full public URL for the frontend to display it.
// //         return response.data.map((item: CarouselItem) => ({
// //             ...item,
// //             url: getFullImageUrl(item.url), // Construct full URL
// //         }));
// //     } catch (error) {
// //         console.error('Error fetching display images:', error);
// //         throw error;
// //     }
// // };

// // // MODIFIED: Frontend function to add a display image
// // // Now accepts FormData for file uploads, not raw strings.
// // export const addDisplayImage = async (formData: FormData): Promise<CarouselItem> => {
// //   try {
// //     const response = await api.post('/display/images', formData, {
// //       headers: {
// //         'Content-Type': 'multipart/form-data',
// //       },
// //     });
// //     const addedImage: CarouselItem = response.data.image;
// //     return {
// //       ...addedImage,
// //       url: getFullImageUrl(addedImage.url),
// //     };
// //   } catch (error) {
// //     console.error('Error adding display image:', error);
// //     throw error;
// //   }
// // };

// // // MODIFIED: Frontend function to delete a display image
// // // Now uses the 'api' instance.
// // export const deleteDisplayImage = async (imageId: number): Promise<void> => {
// //     try {
// //         await api.delete(`/display/images/${imageId}`);
// //     } catch (error) {
// //         console.error(`Error deleting display image with ID ${imageId}:`, error);
// //         throw error;
// //     }
// // };



// // export default api;



// // services/api.ts
// import { InventoryItem, InventoryUsage, Supplier } from '@/types/admin';
// import { Order, OrderItem, OrderSource, OrderStatus, OrderStatusFilter, OrderType, Product, TeamMember, TeamPerformanceData, CreateOrderRequest as FrontendCreateOrderRequest } from '@/types/cashierTypes';
// import { CarouselItem, Customer } from '@/types/displayTypes';
// import { KitchenItem, IngredientUsage, RestockRequest, KitchenTeamMember, KitchenPerformanceData } from '@/types/kitchenTypes';
// import axios from 'axios';

// // Define a new, unified type for employee performance data
// // This type should encompass metrics relevant to all roles.
// export interface EmployeePerformanceMetrics {
//     employeeId: string;
//     employeeName: string;
//     employeeRole: string; // 'cashier', 'kitchen', 'display', 'admin', etc.
//     // Core metrics applicable to all
//     loginDurationMinutes: number; // Total time logged in/active during a period
//     breakDurationMinutes: number; // Total time on breaks
//     daysOffCount: number; // Number of days off within the queried period
//     lastActivityAt?: Date; // Timestamp of the last recorded activity (mapped from last_aggregated_at)

//     // Role-specific metrics
//     ordersHandled?: number; // For cashiers
//     averageOrderProcessingTimeSeconds?: number; // For cashiers
//     itemsPrepared?: number; // For kitchen staff
//     averageItemPreparationTimeSeconds?: number; // For kitchen staff
//     imagesUploaded?: number; // For display staff
//     adsManaged?: number; // For display staff (if they manage ads)
//     gifsUploaded?: number; // For display staff (if they upload gifs)
//     customImagesUploaded?: number; // For display staff (if they upload custom images)
//     // Add any other metrics relevant to "good functioning"
//     customerInteractionScore?: number; // For cashiers, if trackable
//     inventoryRequestsHandled?: number; // For kitchen/admin, if applicable
// }

// // Define a type for detailed employee activity logs
// // These would be the raw events that build up the performance metrics
// export interface EmployeeActivityLog {
//     employeeId: string;
//     logType: 'login' | 'logout' | 'break_start' | 'break_end' | 'order_completed' | 'item_prepared' | 'image_uploaded' | 'ad_uploaded' | 'gif_uploaded' | 'day_off_request' | 'shift_start' | 'shift_end' | 'order_created' | 'image_delete';
//     timestamp?: Date; // Frontend sends Date objects, backend might expect ISO string
//     startTime?: Date;
//     endTime?: Date;
//     details?: { [key: string]: any }; // e.g., { orderId: '...', processingTime: 120 }
// }


// // --- API Configuration ---
// const API_BASE_URL = 'http://172.20.10.7:3000/api'; // Use this for device/emulator testing
// const API_BASE_WEBSOCKET = 'ws://172.20.10.7:3000/api'; // Use this for device/emulator testing
// const IMAGE_SERVER_BASE_URL = 'http://172.20.10.7:3000'; // Adjust this to match your server's base

// const api = axios.create({
//     baseURL: API_BASE_URL,
//     timeout: 10000,
// });

// // Helper function to construct the full image URL
// const getFullImageUrl = (filename: string): string => {
//     // If the filename is already a full URL (e.g., from external storage like S3), return as is.
//     // Otherwise, prepend your server's image base URL.
//     if (filename.startsWith('http://') || filename.startsWith('https://')) {
//         return filename;
//     }
//     return `${IMAGE_SERVER_BASE_URL}/images/${filename}`;
// };


// // --- Authentication & Employee Management ---

// export const loginEmployee = async (employee_name: string, pin: string) => {
//     const response = await axios.post(`${API_BASE_URL}/auth/login`, { employee_name, pin });
//     return response.data; // should be { id, role }
// };

// export const getEmployees = async () => {
//     const response = await axios.get(`${API_BASE_URL}/employees`);
//     return response.data;
// };

// export const getEmployeeDetails = async (employeeId: string) => {
//     const response = await axios.get(`${API_BASE_URL}/employees/${employeeId}`);
//     return response.data;
// };

// export const updateEmployee = async (employeeId: string, employeeData: any) => {
//     const response = await axios.put(`${API_BASE_URL}/employees/${employeeId}`, employeeData);
//     return response.data;
// };

// export const getEmployeeSchedule = async (employeeId: string) => {
//     const response = await axios.get(`${API_BASE_URL}/employees/${employeeId}/schedule`);
//     return response.data;
// };

// export const updateEmployeeSchedule = async (employeeId: string, scheduleData: any) => {
//     const response = await axios.put(`${API_BASE_URL}/employees/${employeeId}/schedule`, scheduleData);
//     return response.data;
// };

// export const deleteEmployee = async (employeeId: string) => {
//     const response = await axios.delete(`${API_BASE_URL}/employees/${employeeId}`);

//     if (response.status === 403) {
//         throw new Error('Admin employees cannot be deleted');
//     }

//     return response.data;
// };

// export const createEmployee = async (employeeData: {
//     employee_name: string;
//     employee_role: string;
//     pin: string;
//     employee_email?: string;
//     employee_phone?: string;
// }) => {
//     try {
//         const response = await axios.post(`${API_BASE_URL}/employees`, employeeData);
//         return response.data;
//     } catch (error) {
//         if (axios.isAxiosError(error)) {
//             if (error.response?.status === 400) {
//                 throw new Error('Invalid employee data');
//             }
//             if (error.response?.status === 409) {
//                 throw new Error('Employee already exists');
//             }
//             throw new Error(error.response?.data?.message || 'Failed to create employee');
//         }
//         throw new Error('Failed to create employee');
//     }
// };


// // --- Cashier Endpoints ---

// export const createOrder = async (orderData: FrontendCreateOrderRequest): Promise<Order> => {
//     try {
//         if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(orderData.created_by)) {
//             throw new Error('Invalid created_by ID format - must be UUID');
//         }

//         const response = await axios.post(`${API_BASE_URL}/cashier/orders`, orderData, {
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         });
//         return response.data;
//     } catch (error) {
//         if (axios.isAxiosError(error)) {
//             console.error('Order creation failed:', error.response?.data);
//             throw new Error(error.response?.data?.message || 'Failed to create order');
//         }
//         throw new Error('Failed to create order');
//     }
// };

// export const getOrders = async ({
//     status,
//     page,
//     limit,
//     fromDate,
//     toDate,
//     signal
// }: {
//     status?: OrderStatusFilter;
//     page?: number;
//     limit?: number;
//     fromDate?: Date;
//     toDate?: Date;
//     signal?: AbortSignal;
// }): Promise<{ orders: Order[]; total: number }> => {
//     try {
//         const params = new URLSearchParams();
//         if (status) params.append('status', status);
//         if (page) params.append('page', page.toString());
//         if (limit) params.append('limit', limit.toString());
//         if (fromDate) params.append('from', fromDate.toISOString());
//         if (toDate) params.append('to', toDate.toISOString());

//         const response = await axios.get(`${API_BASE_URL}/cashier/orders`, {
//             params,
//             signal,
//             timeout: 10000
//         });

//         if (!response.data?.success || !response.data?.data?.orders) {
//             throw new Error('Invalid response structure from server');
//         }

//         return {
//             orders: response.data.data.orders,
//             total: parseInt(response.data.data.total, 10) || response.data.data.orders.length
//         };
//     } catch (error) {
//         console.error('API Error in getOrders:', error);
//         if (axios.isAxiosError(error)) {
//             const serverMessage = error.response?.data?.message;
//             const statusCode = error.response?.status;
//             let errorMessage = serverMessage || error.message;

//             if (statusCode === 404) {
//                 errorMessage = 'Orders endpoint not found';
//             } else if (statusCode === 500) {
//                 errorMessage = 'Server error occurred while fetching orders';
//             }

//             throw new Error(errorMessage);
//         }
//         throw new Error('Failed to fetch orders');
//     }
// };


// export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<Order> => {
//     try {
//         const response = await axios.patch(
//             `${API_BASE_URL}/cashier/orders/${orderId}/status`,
//             { status },
//             {
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 timeout: 5000
//             }
//         );
//         return response.data;
//     } catch (error) {
//         if (axios.isAxiosError(error)) {
//             if (error.response) {
//                 switch (error.response.status) {
//                     case 400:
//                         throw new Error(error.response.data.message || 'Invalid request');
//                     case 404:
//                         throw new Error(`Order ${orderId} not found`);
//                     case 500:
//                         throw new Error('Server error - please try again later');
//                     default:
//                         throw new Error(error.response.data?.message || 'Request failed');
//                 }
//             } else {
//                 throw new Error('Network error - check your connection');
//             }
//         }
//         throw new Error('Unknown error occurred');
//     }
// };



// export const getProducts = async (): Promise<Product[]> => {
//     try {
//         console.log('Attempting to fetch products from:', `${API_BASE_URL}/cashier/products`);
//         const response = await axios.get(`${API_BASE_URL}/cashier/products`);
//         console.log('Raw API response:', response);

//         if (!response.data || typeof response.data !== 'object' || !Array.isArray(response.data.data)) {
//             console.error('Invalid products data structure:', response.data);
//             throw new Error('Invalid products data structure');
//         }

//         return response.data.data;
//     } catch (error) {
//         console.error('API Error:', error);
//         if (axios.isAxiosError(error)) {
//             console.error('Axios error details:', {
//                 message: error.message,
//                 code: error.code,
//                 response: error.response?.data
//             });
//         }
//         throw error;
//     }
// };

// export const setupProductUpdates = (callback: (products: Product[]) => void) => {
//     const ws = new WebSocket(`${API_BASE_WEBSOCKET}/products/updates`);

//     ws.onmessage = (event) => {
//         const data = JSON.parse(event.data);
//         if (data.type === 'product_update' && Array.isArray(data.data)) {
//             callback(data.data as Product[]);
//         } else {
//             console.warn('Unexpected WebSocket product update format:', data);
//         }
//     };

//     ws.onerror = (event) => {
//         console.error('WebSocket error for products:', event);
//     };
//     ws.onclose = () => {
//         console.log('WebSocket for products closed.');
//     };
//     ws.onopen = () => {
//         console.log('WebSocket for products connected.');
//     };

//     return () => ws.close();
// };


// // --- Kitchen Endpoints ---
// export const getKitchenOrders = async (status?: string): Promise<Order[]> => {
//     const url = status
//         ? `${API_BASE_URL}/kitchen/orders?status=${status}`
//         : `${API_BASE_URL}/kitchen/orders`;

//     try {
//         const response = await axios.get(url);

//         return response.data.map((order: any) => ({
//             id: order.id,
//             store_id: order.store_id,
//             created_by: order.created_by,
//             prepared_by: order.prepared_by,
//             customer_id: order.customer_id,
//             customer_name: order.customer_name,
//             customer_phone: order.customer_phone,
//             order_type: order.order_type,
//             order_source: order.order_source,
//             status: order.status,
//             subtotal: order.subtotal,
//             discount_amount: order.discount_amount,
//             total_amount: order.total_amount,
//             notes: order.notes,
//             payment_status: order.payment_status,
//             address: order.address,
//             deliverer: order.deliverer,
//             started_at: order.started_at,
//             completed_at: order.completed_at,
//             preparation_notes: order.preparation_notes,
//             created_at: order.created_at,
//             updated_at: order.updated_at,
//             store_name: order.store_name,
//             store_phone: order.store_phone,
//             store_location: order.store_location,
//             created_by_name: order.created_by_name,
//             prepared_by_name: order.prepared_by_name,
//             order_items: order.order_items ? order.order_items.map((item: any) => ({
//                 id: item.id,
//                 order_id: item.order_id,
//                 product_id: item.product_id,
//                 variant_id: item.variant_id,
//                 product: item.product,
//                 variant: item.variant,
//                 quantity: item.quantity,
//                 unit_price: item.unit_price,
//                 discount_amount: item.discount_amount || 0,
//                 total_price: item.total_price,
//                 created_at: item.created_at || order.created_at
//             })) : []
//         }));
//     } catch (error) {
//         if (axios.isAxiosError(error)) {
//             if (error.response?.status === 404) {
//                 throw new Error('Kitchen orders endpoint not found - please check server configuration');
//             }
//             console.error('Failed to fetch kitchen orders:', error.response?.data || error.message);
//             throw new Error(error.response?.data?.message || 'Failed to fetch kitchen orders');
//         }
//         throw new Error('Unexpected error fetching kitchen orders');
//     }
// };



// export const updateKitchenOrderStatus = async (
//     orderId: string,
//     status: OrderStatus,
//     preparedById?: string
// ): Promise<Order> => {
//     try {
//         const payload: { status: OrderStatus; prepared_by?: string } = { status };

//         if (preparedById) {
//             payload.prepared_by = preparedById;
//         }
//         console.log('API call payload:', payload);

//         const response = await axios.patch(
//             `${API_BASE_URL}/kitchen/orders/${orderId}/status`,
//             payload
//         );
//         return response.data.data;
//     } catch (error) {
//         if (axios.isAxiosError(error)) {
//             console.error('Failed to update kitchen order status:', error.response?.data || error.message);
//             throw new Error(error.response?.data?.message || 'Failed to update kitchen order status');
//         }
//         throw new Error('Unknown error updating kitchen order status');
//     }
// };

// export const updateKitchenOrder = async (orderId: string, updates: any): Promise<Order> => {
//     try {
//         const response = await axios.patch(
//             `${API_BASE_URL}/kitchen/orders/${orderId}`,
//             updates
//         );
//         return response.data.data;
//     } catch (error) {
//         if (axios.isAxiosError(error)) {
//             console.error('Failed to update kitchen order:', error.response?.data || error.message);
//             throw new Error(error.response?.data?.message || 'Failed to update kitchen order');
//         }
//         throw new Error('Unknown error updating kitchen order');
//     }
// };


// // Inventory functions
// export const getInventoryItems = async (): Promise<InventoryItem[]> => {
//     const response = await axios.get(`${API_BASE_URL}/inventory/items`);
//     return response.data.map((item: any) => ({
//         ...item,
//         quantity: Number(item.quantity),
//         min_threshold: Number(item.min_threshold),
//         cost_per_unit: item.cost_per_unit !== null ? Number(item.cost_per_unit) : null,
//         last_restocked: item.last_restocked ? new Date(item.last_restocked) : undefined,
//         // created_at: new Date(item.created_at), // REMOVE this line
//         updated_at: new Date(item.updated_at),
//         supplier: item.supplier ? {
//             ...item.supplier,
//             created_at: new Date(item.supplier.created_at), // Correctly parse supplier's created_at
//             updated_at: new Date(item.supplier.updated_at), // Correctly parse supplier's updated_at
//         } : undefined,
//     }));
// };

// export const createInventoryItem = async (
//     itemData: Omit<InventoryItem, 'id' | 'updated_at' | 'last_restocked' | 'supplier'>
// ): Promise<InventoryItem> => {
//     const payload = {
//         name: itemData.name,
//         type: itemData.type,
//         quantity: itemData.quantity,
//         unit: itemData.unit,
//         min_threshold: itemData.min_threshold,
//         supplier_id: itemData.supplier_id === undefined ? null : itemData.supplier_id,
//         cost_per_unit: itemData.cost_per_unit === undefined ? null : itemData.cost_per_unit,
//     };
//     const response = await axios.post(`${API_BASE_URL}/inventory/items`, payload);
//     return {
//         ...response.data,
//         last_restocked: response.data.last_restocked ? new Date(response.data.last_restocked) : undefined,
//         // created_at: new Date(response.data.created_at), // REMOVE this line
//         updated_at: new Date(response.data.updated_at),
//         supplier: response.data.supplier ? {
//             ...response.data.supplier,
//             created_at: new Date(response.data.supplier.created_at), // Correctly parse supplier's created_at
//             updated_at: new Date(response.data.supplier.updated_at), // Correctly parse supplier's updated_at
//         } : undefined,
//     };
// };

// // Changed to Partial<InventoryItem> and removed { id: number } as it's part of Partial for update
// export const updateInventoryItem = async (
//     itemData: Partial<InventoryItem> & { id: number }
// ): Promise<InventoryItem> => {
//     const payload: Partial<InventoryItem> = {};

//     if (itemData.name !== undefined) payload.name = itemData.name;
//     if (itemData.type !== undefined) payload.type = itemData.type;
//     if (itemData.quantity !== undefined) payload.quantity = Number(itemData.quantity);
//     if (itemData.unit !== undefined) payload.unit = itemData.unit;
//     if (itemData.min_threshold !== undefined) payload.min_threshold = Number(itemData.min_threshold);
//     if (itemData.supplier_id !== undefined) {
//         payload.supplier_id = itemData.supplier_id === null ? null : Number(itemData.supplier_id);
//     }
//     if (itemData.cost_per_unit !== undefined) {
//         payload.cost_per_unit = itemData.cost_per_unit === null ? null : Number(itemData.cost_per_unit);
//     }

//     const response = await axios.patch(
//         `<span class="math-inline">\{API\_BASE\_URL\}/inventory/items/</span>{itemData.id}`,
//         payload
//     );
//     return {
//         ...response.data,
//         last_restocked: response.data.last_restocked ? new Date(response.data.last_restocked) : undefined,
//         // created_at: new Date(response.data.created_at), // REMOVE this line
//         updated_at: new Date(response.data.updated_at),
//         supplier: response.data.supplier ? {
//             ...response.data.supplier,
//             created_at: new Date(response.data.supplier.created_at), // Correctly parse supplier's created_at
//             updated_at: new Date(response.data.supplier.updated_at), // Correctly parse supplier's updated_at
//         } : undefined,
//     };
// };

// export const deleteInventoryItem = async (id: number): Promise<void> => {
//     await axios.delete(`${API_BASE_URL}/inventory/items/${id}`);
// };

// export const getInventoryUsage = async (itemId: number): Promise<InventoryUsage[]> => {
//     const response = await axios.get(`${API_BASE_URL}/inventory/items/${itemId}/usage`);
//     return response.data;
// };


// export const getSuppliers = async (): Promise<Supplier[]> => {
//     const response = await axios.get(`${API_BASE_URL}/inventory/suppliers`);
//     // Ensure created_at and updated_at are Date objects
//     return response.data.map((supplier: any) => ({
//         ...supplier,
//         created_at: new Date(supplier.created_at),
//         updated_at: new Date(supplier.updated_at),
//     }));
// };

// export const createSupplier = async (supplierData: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>): Promise<Supplier> => {
//     const response = await axios.post(`${API_BASE_URL}/inventory/suppliers`, supplierData);
//     // Ensure created_at and updated_at are Date objects for the returned supplier
//     return {
//         ...response.data,
//         created_at: new Date(response.data.created_at),
//         updated_at: new Date(response.data.updated_at),
//     };
// };


// // --- Display Endpoints ---
// export const getDisplayImages = async (): Promise<CarouselItem[]> => {
//     try {
//         const response = await api.get('/display/images');
//         return response.data.map((item: CarouselItem) => ({
//             ...item,
//             url: getFullImageUrl(item.url),
//         }));
//     } catch (error) {
//         console.error('Error fetching display images:', error);
//         throw error;
//     }
// };

// export const addDisplayImage = async (formData: FormData): Promise<CarouselItem> => {
//     try {
//         const response = await api.post('/display/images', formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//             },
//         });
//         const addedImage: CarouselItem = response.data.image;
//         return {
//             ...addedImage,
//             url: getFullImageUrl(addedImage.url),
//         };
//     } catch (error) {
//         console.error('Error adding display image:', error);
//         throw error;
//     }
// };

// export const deleteDisplayImage = async (imageId: number): Promise<void> => {
//     try {
//         await api.delete(`/display/images/${imageId}`);
//     } catch (error) {
//         console.error(`Error deleting display image with ID ${imageId}:`, error);
//         throw error;
//     }
// };


// // --- Real-time Updates (WebSockets) ---
// export const setupOrderUpdates = (callback: (order: Order) => void) => {
//     const ws = new WebSocket(`${API_BASE_WEBSOCKET}/orders/updates`);

//     ws.onmessage = (event) => {
//         try {
//             const data = JSON.parse(event.data);
//             if (data.type === 'order_update' && data.data) {
//                 callback(data.data as Order);
//             } else {
//                 console.warn('Unexpected WebSocket order update format:', data);
//             }
//         } catch (error) {
//             console.error('Error parsing WebSocket message for order updates:', error);
//         }
//     };

//     ws.onerror = (event) => {
//         console.error('WebSocket error for order updates:', event);
//     };
//     ws.onclose = () => {
//         console.log('WebSocket for order updates closed.');
//     };
//     ws.onopen = () => {
//         console.log('WebSocket for order updates connected.');
//     };

//     return () => ws.close();
// };

// export const setupInventoryUpdates = (callback: (updatedItems: InventoryItem[]) => void) => {
//     const ws = new WebSocket(`${API_BASE_WEBSOCKET}/inventory/updates`);

//     ws.onmessage = (event) => {
//         const data = JSON.parse(event.data);
//         if (data.type === 'inventory_update' && Array.isArray(data.updatedItems)) {
//             const mappedItems = data.updatedItems.map((item: any) => ({
//                 ...item,
//                 last_restocked: item.last_restocked ? new Date(item.last_restocked) : undefined,
//                 updated_at: new Date(item.updated_at),
//                 supplier: item.supplier ? {
//                     ...item.supplier,
//                     created_at: new Date(item.supplier.created_at),
//                     updated_at: new Date(item.supplier.updated_at),
//                 } : undefined,
//             }));
//             callback(mappedItems);
//         }
//     };

//     ws.onerror = (event) => {
//         console.error('WebSocket error for inventory updates:', event);
//     };
//     ws.onclose = () => {
//         console.log('WebSocket for inventory closed.');
//     };
//     ws.onopen = () => {
//         console.log('WebSocket for inventory connected.');
//     };

//     return () => ws.close();
// };


// // --- Unified Employee Performance Tracking ---

// /**
//  * Fetches performance data for a specific employee.
//  * @param employeeId The ID of the employee to fetch performance for.
//  * @param fromDate Optional. Start date for the performance period.
//  * @param toDate Optional. End date for the performance period.
//  * @returns A Promise that resolves to a single EmployeePerformanceMetrics object.
//  */
// export const getEmployeePerformanceById = async (
//     employeeId: string,
//     fromDate?: Date,
//     toDate?: Date
// ): Promise<EmployeePerformanceMetrics | null> => {
//     try {
//         const params = new URLSearchParams();
//         if (fromDate) params.append('from', fromDate.toISOString());
//         if (toDate) params.append('to', toDate.toISOString());

//         // Validate UUID format
//         if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(employeeId)) {
//             throw new Error('Invalid employee ID format');
//         }

//         const url = `${API_BASE_URL}/performance/employees/${employeeId}`;
//         const response = await axios.get(url, { params });

//         if (!response.data || response.data.data === null) {
//             return null; // Return null if specific employee not found/no data
//         }

//         const performanceData = response.data.data;

//         // Ensure date fields are parsed correctly if present
//         if (performanceData.lastActivityAt) {
//             performanceData.lastActivityAt = new Date(performanceData.lastActivityAt);
//         }
//         return performanceData as EmployeePerformanceMetrics;
//     } catch (error) {
//         console.error(`Failed to fetch performance for employee ${employeeId}:`, error);
//         if (axios.isAxiosError(error)) {
//             if (error.response?.status === 404) {
//                 return null; // Explicitly return null on 404 for specific employee
//             }
//             throw new Error(error.response?.data?.message || 'Failed to fetch employee performance');
//         }
//         throw new Error('Unknown error fetching employee performance');
//     }
// };

// /**
//  * Fetches performance data for all employees.
//  * @param role Optional. Filter performance by employee role (e.g., 'cashier', 'kitchen', 'display').
//  * @param fromDate Optional. Start date for the performance period.
//  * @param toDate Optional. End date for the performance period.
//  * @returns A Promise that resolves to an array of EmployeePerformanceMetrics.
//  */
// export const getEmployeePerformanceAll = async (
//     role?: string,
//     fromDate?: Date,
//     toDate?: Date
// ): Promise<EmployeePerformanceMetrics[]> => {
//     try {
//         const params = new URLSearchParams();
//         if (role) params.append('role', role);
//         if (fromDate) params.append('from', fromDate.toISOString());
//         if (toDate) params.append('to', toDate.toISOString());

//         const url = `${API_BASE_URL}/performance/employees`;
//         const response = await axios.get(url, { params });

//         if (!response.data || !Array.isArray(response.data.data)) {
//             throw new Error('Invalid response structure from server: Expected an array for all employees performance.');
//         }

//         const performanceData = response.data.data;

//         return performanceData.map((item: any) => {
//             if (item.lastActivityAt) {
//                 item.lastActivityAt = new Date(item.lastActivityAt);
//             }
//             return item as EmployeePerformanceMetrics;
//         });
//     } catch (error) {
//         console.error('Failed to fetch all employee performance:', error);
//         if (axios.isAxiosError(error)) {
//             throw new Error(error.response?.data?.message || 'Failed to fetch all employee performance');
//         }
//         throw new Error('Unknown error fetching all employee performance');
//     }
// };

// /**
//  * Sends an activity log for an employee.
//  * This function would be called by the frontend when specific manual events occur
//  * (e.g., break start/end triggered by a button).
//  * Ideally, many performance metrics (like order completions, item preparations)
//  * should be logged automatically by the backend when the relevant actions are processed.
//  * @param activity The EmployeeActivityLog object containing the event details.
//  */
// export const logEmployeeActivity = async (activity: EmployeeActivityLog): Promise<void> => {
//     try {
//         // Convert Date objects in activity to ISO strings for the backend
//         const payload = {
//             ...activity,
//             timestamp: activity.timestamp?.toISOString(),
//             startTime: activity.startTime?.toISOString(),
//             endTime: activity.endTime?.toISOString(),
//         };
//         await axios.post(`${API_BASE_URL}/performance/log`, payload);
//     } catch (error) {
//         console.error('Failed to log employee activity:', error);
//         if (axios.isAxiosError(error)) {
//             throw new Error(error.response?.data?.message || 'Failed to log activity');
//         }
//         throw new Error('Unknown error logging employee activity');
//     }
// };

// // services/api.ts
// import { InventoryItem, InventoryUsage, Supplier } from '@/types/admin';
// import { Order, OrderItem, OrderSource, OrderStatus, OrderStatusFilter, OrderType, Product, TeamMember, TeamPerformanceData, CreateOrderRequest as FrontendCreateOrderRequest } from '@/types/cashierTypes';
// import { CarouselItem, Customer } from '@/types/displayTypes';
// import { KitchenItem, IngredientUsage, RestockRequest, KitchenTeamMember, KitchenPerformanceData } from '@/types/kitchenTypes';
// import { Employee, EmployeePerformanceMetrics, EmployeeActivityLog, EmployeeScheduleItemBackend, LoginResponseEmployee, BreakEndResponse } from '@/types/EmployeeTypes';
// import axios from 'axios';


// // --- API Configuration ---
// const API_BASE_URL = 'http://172.20.10.7:3000/api'; // Use this for device/emulator testing
// const API_BASE_WEBSOCKET = 'ws://172.20.10.7:3000/api'; // Use this for device/emulator testing
// const IMAGE_SERVER_BASE_URL = 'http://172.20.10.7:3000'; // Adjust this to match your server's base

// const api = axios.create({
//     baseURL: API_BASE_URL,
//     timeout: 10000,
// });






// services/api.ts
import { InventoryItem, InventoryUsage, Supplier } from '@/types/admin';
import { Order, OrderItem, OrderSource, OrderStatus, OrderStatusFilter, OrderType, Product, TeamMember, TeamPerformanceData, CreateOrderRequest as FrontendCreateOrderRequest } from '@/types/cashierTypes';
import { CarouselItem, Customer } from '@/types/displayTypes';
import { KitchenItem, IngredientUsage, RestockRequest, KitchenTeamMember, KitchenPerformanceData } from '@/types/kitchenTypes';
import { Employee, EmployeePerformanceMetrics, EmployeeActivityLog, EmployeeScheduleItemBackend, LoginResponseEmployee, BreakEndResponse } from '@/types/EmployeeTypes';
import axios from 'axios';


// --- API Configuration ---
const API_BASE_URL = 'http://172.20.10.7:3000/api'; // Use this for device/emulator testing
// FIX: Corrected API_BASE_WEBSOCKET to not include '/api'
const API_BASE_WEBSOCKET = 'ws://172.20.10.7:3000'; // Corrected: WebSocket base URL for backend endpoint /api/ws
const IMAGE_SERVER_BASE_URL = 'http://172.20.10.7:3000'; // Adjust this to match your server's base

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
});



// Helper function to construct the full image URL
const getFullImageUrl = (filename: string): string => {
    if (filename.startsWith('http://') || filename.startsWith('https://')) {
        return filename;
    }
    return `${IMAGE_SERVER_BASE_URL}/images/${filename}`;
};


// --- Auth Endpoints ---
export const loginEmployee = async (employee_name: string, pin: string): Promise<LoginResponseEmployee> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, { employee_name, pin });
        console.log('Login API full response:', response.data);
        return response.data.data; // Assuming your login endpoint returns { success: true, data: { employee_id, employee_name, employee_role } }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Login failed:', error.response?.data);
            throw new Error(error.response?.data?.message || 'Login failed');
        }
        throw new Error('Login failed');
    }
};

export const logoutEmployee = async (): Promise<void> => {
    try {
        // In most cases, logout is client-side (clear token).
        // If your backend tracks sessions, you might have a POST /auth/logout endpoint.
        // For now, we'll simulate a success.
        // If you have a real logout API, uncomment this:
        // await axios.post(`${API_BASE_URL}/auth/logout`);
        console.log("Simulating backend logout (if applicable)");
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Logout API failed:', error.response?.data);
            throw new Error(error.response?.data?.message || 'Logout failed');
        }
        throw new Error('Logout failed');
    }
};

// NEW: API call for logging shift start
export const logShiftStart = async (employeeId: string, timestamp: string): Promise<void> => {
    try {
        await axios.post(`${API_BASE_URL}/employees/${employeeId}/log/shift-start`, { timestamp });
        console.log(`API: Logged shift start for ${employeeId}`);
    } catch (error) {
        console.error(`API: Failed to log shift start for ${employeeId}:`, error);
        throw error;
    }
};

// NEW: API call for logging shift end
export const logShiftEnd = async (employeeId: string, timestamp: string): Promise<void> => {
    try {
        await axios.post(`${API_BASE_URL}/employees/${employeeId}/log/shift-end`, { timestamp });
        console.log(`API: Logged shift end for ${employeeId}`);
    } catch (error) {
        console.error(`API: Failed to log shift end for ${employeeId}:`, error);
        throw error;
    }
};

// NEW: API call for starting a break
export const logBreakStart = async (employeeId: string, timestamp: string): Promise<void> => {
    try {
        await axios.post(`${API_BASE_URL}/employees/${employeeId}/log/break-start`, { timestamp });
        console.log(`API: Logged break start for ${employeeId}`);
    } catch (error) {
        console.error(`API: Failed to log break start for ${employeeId}:`, error);
        throw error;
    }
};

// NEW: API call for ending a break
export const logBreakEnd = async (employeeId: string, timestamp: string, startTime: string, durationMinutes: number): Promise<void> => {
    try {
        await axios.post(`${API_BASE_URL}/employees/${employeeId}/log/break-end`, { timestamp, startTime, durationMinutes });
        console.log(`API: Logged break end for ${employeeId}`);
    } catch (error) {
        console.error(`API: Failed to log break end for ${employeeId}:`, error);
        throw error;
    }
};

   // --- Employee Management ---

   // FIX: Update getEmployees to return the array directly from response.data.data
   export const getEmployees = async (): Promise<Employee[]> => {
       try {
           const response = await axios.get(`${API_BASE_URL}/employees`);
           // CRITICAL FIX: Return response.data.data
           if (response.data && Array.isArray(response.data.data)) {
               return response.data.data;
           }
           console.error('Invalid data structure for getEmployees:', response.data);
           return []; // Return an empty array on invalid structure
       } catch (error) {
           console.error('API Error in getEmployees:', error);
           throw error;
       }
   };

   export const getEmployeeDetails = async (employeeId: string): Promise<Employee> => { // Added return type
       const response = await axios.get(`${API_BASE_URL}/employees/${employeeId}`);
       // Assuming backend's /employees/:id endpoint also returns { success: true, data: EmployeeObject }
       if (response.data && response.data.data) {
           return response.data.data;
       }
       // Fallback for cases where backend might return non-standard responses
       console.error('Invalid data structure for getEmployeeDetails:', response.data);
       throw new Error('Invalid employee details response');
   };

   export const updateEmployee = async (employeeId: string, employeeData: any) => {
       const response = await axios.put(`${API_BASE_URL}/employees/${employeeId}`, employeeData);
       return response.data;
   };

   // FIX: Update return type to reflect new schedule item structure
   export const getEmployeeSchedule = async (employeeId: string): Promise<EmployeeScheduleItemBackend[]> => {
       try {
           const response = await axios.get(`${API_BASE_URL}/employees/${employeeId}/schedule`);
           // Assuming response.data is the array directly from schedule endpoint, or adjust if nested
           if (response.data && Array.isArray(response.data.data)) { // Check if schedule is also nested under 'data'
               return response.data.data;
           }
           return response.data; // Fallback if not nested, based on original code structure
       } catch (error) {
           console.error("Error fetching schedule:", error);
           throw error;
       }
   };

   // NEW: Function to update employee schedule
   export const updateEmployeeSchedule = async (employeeId: string, scheduleData: { schedule_date: string; is_day_off: boolean; start_time: string | null; end_time: string | null; }[]) => {
       try {
           const response = await axios.put(`${API_BASE_URL}/employees/${employeeId}/schedule`, { schedule: scheduleData });
           return response.data;
       } catch (error) {
           console.error("Error updating employee schedule:", error);
           throw error;
       }
   };

   export const deleteEmployee = async (employeeId: string) => {
       try {
           const response = await axios.delete(`${API_BASE_URL}/employees/${employeeId}`);
           return response.data;
       } catch (error) {
           if (axios.isAxiosError(error)) {
               if (error.response?.status === 403) {
                   throw new Error('Admin employees cannot be deleted');
               }
               throw new Error(error.response?.data?.message || 'Failed to delete employee');
           }
           throw new Error('Failed to delete employee');
       }
   };

   export const createEmployee = async (employeeData: {
       employee_name: string;
       employee_role: string;
       pin: string;
       employee_email?: string;
       employee_phone?: string;
       schedule: { schedule_date: string; is_day_off: boolean; start_time: string | null; end_time: string | null; }[]; // Added schedule
   }) => {
       try {
           const response = await axios.post(`${API_BASE_URL}/employees`, employeeData);
           return response.data;
       } catch (error) {
           if (axios.isAxiosError(error)) {
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

// --- Cashier Endpoints ---

export const createOrder = async (orderData: FrontendCreateOrderRequest): Promise<Order> => {
    try {
        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(orderData.created_by)) {
            throw new Error('Invalid created_by ID format - must be UUID');
        }

        const response = await api.post(`${API_BASE_URL}/cashier/orders`, orderData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        // Assuming your backend returns the full Order object including COGS
        // after creation if you've implemented that.
        return response.data;
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
    sortBy,
    sortDirection,
    signal
}: {
    status?: OrderStatusFilter;
    page?: number;
    limit?: number;
    fromDate?: string;
    toDate?: string;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    signal?: AbortSignal;
}): Promise<{ orders: Order[]; total: number }> => {
    try {
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        if (page) params.append('page', page.toString());
        if (limit) params.append('limit', limit.toString());
        if (fromDate) params.append('fromDate', fromDate);
        if (toDate) params.append('toDate', toDate);
        if (sortBy) params.append('sortBy', sortBy);
        if (sortDirection) params.append('sortDirection', sortDirection);

        const response = await api.get(`${API_BASE_URL}/cashier/orders`, {
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

export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<Order> => {
    try {
        const response = await api.patch(
            `${API_BASE_URL}/cashier/orders/${orderId}/status`,
            { status },
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 5000
            }
        );
        // Assuming your backend returns the full Order object including COGS
        // after status update if you've implemented that.
        return response.data.data; // Expecting data.data from handleApiResponse
    } catch (error) {
        if (axios.isAxiosError(error)) {
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
        const response = await api.get(`${API_BASE_URL}/cashier/products`);
        console.log('Raw API response:', response);

        // Adjusted to expect response.data.data to be an array directly
        if (!response.data || typeof response.data !== 'object' || !Array.isArray(response.data.data)) {
            console.error('Invalid products data structure:', response.data);
            throw new Error('Invalid products data structure');
        }

        return response.data.data;
    } catch (error) {
        console.error('API Error:', error);
        if (axios.isAxiosError(error)) {
            console.error('Axios error details:', {
                message: error.message,
                code: error.code,
                response: error.response?.data
            });
        }
        throw error;
    }
};

/**
 * Updates an order's status to 'canceled'.
 * @param orderId The ID of the order to cancel.
 * @returns The updated Order object.
 */
export const cancelOrder = async (orderId: string): Promise<Order> => {
    try {
        const response = await api.patch(
            `${API_BASE_URL}/cashier/orders/${orderId}/cancel`, // New endpoint specifically for cancellation
            {}, // No specific body needed for cancellation, just the action
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 5000
            }
        );
        // Assuming your backend returns the full Order object after status update
        return response.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                switch (error.response.status) {
                    case 400:
                        throw new Error(error.response.data.message || 'Cannot cancel order in its current state');
                    case 404:
                        throw new Error(`Order ${orderId} not found`);
                    case 500:
                        throw new Error('Server error - please try again later');
                    default:
                        throw new Error(error.response.data?.message || 'Failed to cancel order');
                }
            } else {
                throw new Error('Network error - check your connection');
            }
        }
        throw new Error('Unknown error occurred during order cancellation');
    }
};

export const setupProductUpdates = (callback: (products: Product[]) => void) => {
    const ws = new WebSocket(`${API_BASE_WEBSOCKET}/products/updates`);

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'product_update' && Array.isArray(data.data)) {
            // Ensure ProductVariant in product updates also has pieces_count
            const productsWithPiecesCount = data.data.map((product: any) => ({
                ...product,
                variants: product.variants.map((variant: any) => ({
                    ...variant,
                    pieces_count: variant.pieces_count // Make sure this property exists in the WS payload
                }))
            }));
            callback(productsWithPiecesCount as Product[]);
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

// --- New Sales (Orders) API Functions ---

/**
 * Fetches all orders, with optional date filtering.
 * @param fromDate Optional. Start date for the order period (YYYY-MM-DD string).
 * @param toDate Optional. End date for the order period (YYYY-MM-DD string).
 * @returns A Promise that resolves to an array of Order objects.
 */
export const getOrdersByDateRange = async (fromDate?: string, toDate?: string): Promise<Order[]> => {
    try {
        const params = new URLSearchParams();
        if (fromDate) params.append('from', fromDate);
        if (toDate) params.append('to', toDate);

        const url = `${API_BASE_URL}/orders`; // Assuming an '/orders' endpoint for all orders
        const response = await api.get(url, { params });

        if (!response.data || !Array.isArray(response.data.data)) {
            throw new Error('Invalid response structure from server: Expected an array for orders.');
        }

        // Map and parse dates if they are string representations from the backend
        return response.data.data.map((order: any) => ({
            ...order,
            orderDate: order.orderDate ? new Date(order.orderDate) : undefined,
            createdAt: order.createdAt ? new Date(order.createdAt) : undefined,
            updatedAt: order.updatedAt ? new Date(order.updatedAt) : undefined,
            // Ensure any other date fields are parsed
        })) as Order[];

    } catch (error) {
        console.error('Failed to fetch orders:', error);
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Failed to fetch orders');
        }
        throw new Error('Unknown error fetching orders');
    }
};



// --- Kitchen Endpoints ---


export const getKitchenOrders = async (status?: string): Promise<Order[]> => {
    const url = status
        ? `/kitchen/orders?status=${status}` // Use relative path with configured axios instance
        : '/kitchen/orders'; // Use relative path with configured axios instance

    try {
        const response = await api.get(url); // Using the configured 'api' instance

        if (!response.data || !Array.isArray(response.data.data)) {
            throw new Error('Invalid response structure from server: Expected an array for kitchen orders.');
        }

        return response.data.data.map((order: any) => ({
            id: order.id,
            store_id: order.store_id,
            created_by: order.created_by,
            prepared_by: order.prepared_by,
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
            store_name: order.store_name,
            store_phone: order.store_phone,
            store_location: order.store_location,
            created_by_name: order.created_by_name,
            prepared_by_name: order.prepared_by_name,
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
                created_at: item.created_at || order.created_at
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

        if (preparedById) {
            payload.prepared_by = preparedById;
        }
        console.log('API call payload:', payload);

        const response = await api.patch( // Using the configured 'api' instance
            `/kitchen/orders/${orderId}/status`, // Use relative path
            payload
        );
        return response.data.data; // Expecting data.data from handleApiResponse
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Failed to update kitchen order status:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Failed to update kitchen order status');
        }
        throw new Error('Unknown error updating kitchen order status');
    }
};

export const updateKitchenOrder = async (orderId: string, updates: any): Promise<Order> => {
    try {
        const response = await api.patch( // Using the configured 'api' instance
            `/kitchen/orders/${orderId}`, // Use relative path
            updates
        );
        return response.data.data; // Expecting data.data from handleApiResponse
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Failed to update kitchen order:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Failed to update kitchen order');
        }
        throw new Error('Unknown error updating kitchen order');
        }
};


// --- Inventory Endpoints ---


export const getInventoryItems = async (): Promise<InventoryItem[]> => {
    const response = await api.get('/inventory/items');
    if (!response.data || !Array.isArray(response.data.data)) {
        throw new Error('Invalid response structure from server: Expected an array for inventory items.');
    }
    return response.data.data.map((item: any) => ({
        ...item,
        quantity: Number(item.quantity),
        min_threshold: Number(item.min_threshold),
        cost_per_unit: item.cost_per_unit !== null ? Number(item.cost_per_unit) : null,
        last_restocked: item.last_restocked ? new Date(item.last_restocked) : undefined,
        updated_at: new Date(item.updated_at),
        supplier: item.supplier ? {
            ...item.supplier,
            created_at: new Date(item.supplier.created_at),
            updated_at: new Date(item.supplier.updated_at),
        } : undefined,
    }));
};

export const getInventoryItemById = async (id: number): Promise<InventoryItem> => {
    try {
        const response = await api.get(`/inventory/items/${id}`);
        if (!response.data || !response.data.data) {
            throw new Error('Invalid response structure from server: Expected data for inventory item.');
        }
        const item = response.data.data;
        return {
            ...item,
            quantity: Number(item.quantity),
            min_threshold: Number(item.min_threshold),
            cost_per_unit: item.cost_per_unit !== null ? Number(item.cost_per_unit) : null,
            last_restocked: item.last_restocked ? new Date(item.last_restocked) : undefined,
            updated_at: new Date(item.updated_at),
            supplier: item.supplier ? {
                ...item.supplier,
                created_at: new Date(item.supplier.created_at),
                updated_at: new Date(item.supplier.updated_at),
            } : undefined,
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response && error.response.status === 404) {
                throw new Error(error.response.data.message || `Inventory item with ID ${id} not found.`);
            }
            throw new Error(error.response?.data?.message || `Failed to fetch inventory item with ID ${id}`);
        }
        throw new Error('An unknown error occurred while fetching inventory item.');
    }
};

export const createInventoryItem = async (
    itemData: Omit<InventoryItem, 'id' | 'updated_at' | 'last_restocked' | 'supplier'>
): Promise<InventoryItem> => {
    const payload = {
        name: itemData.name,
        type: itemData.type,
        quantity: itemData.quantity,
        unit: itemData.unit,
        min_threshold: itemData.min_threshold,
        supplier_id: itemData.supplier_id === undefined ? null : itemData.supplier_id,
        cost_per_unit: itemData.cost_per_unit === undefined ? null : itemData.cost_per_unit,
    };
    const response = await api.post('/inventory/items', payload);
    return {
        ...response.data.data,
        last_restocked: response.data.data.last_restocked ? new Date(response.data.data.last_restocked) : undefined,
        updated_at: new Date(response.data.data.updated_at),
        supplier: response.data.data.supplier ? {
            ...response.data.data.supplier,
            created_at: new Date(response.data.data.supplier.created_at),
            updated_at: new Date(response.data.data.supplier.updated_at),
        } : undefined,
    };
};

export const updateInventoryItem = async (
    itemData: Partial<InventoryItem> & { id: number }
): Promise<InventoryItem> => {
    const payload: Partial<InventoryItem> = {};

    if (itemData.name !== undefined) payload.name = itemData.name;
    if (itemData.type !== undefined) payload.type = itemData.type;
    if (itemData.quantity !== undefined) payload.quantity = Number(itemData.quantity);
    if (itemData.unit !== undefined) payload.unit = itemData.unit;
    if (itemData.min_threshold !== undefined) payload.min_threshold = Number(itemData.min_threshold);
    if (itemData.supplier_id !== undefined) {
        payload.supplier_id = itemData.supplier_id === null ? null : Number(itemData.supplier_id);
    }
    if (itemData.cost_per_unit !== undefined) {
        payload.cost_per_unit = itemData.cost_per_unit === null ? null : Number(itemData.cost_per_unit);
    }

    const response = await api.patch(
        `/inventory/items/${itemData.id}`,
        payload
    );
    return {
        ...response.data.data,
        last_restocked: response.data.data.last_restocked ? new Date(response.data.data.last_restocked) : undefined,
        updated_at: new Date(response.data.data.updated_at),
        supplier: response.data.data.supplier ? {
            ...response.data.data.supplier,
            created_at: new Date(response.data.data.supplier.created_at),
            updated_at: new Date(response.data.data.supplier.updated_at),
        } : undefined,
    };
};

/**
 * Restocks an inventory item by increasing its quantity and updating the last_restocked date.
 * @param itemId The ID of the inventory item to restock.
 * @param quantityAdded The amount to add to the current quantity.
 * @param costPerUnit The new (or updated) cost per unit for this restock.
 * @returns A Promise that resolves to the updated InventoryItem object.
 */
export const restockInventoryItem = async (
    itemId: number,
    quantityAdded: number,
    costPerUnit: number | null
): Promise<InventoryItem> => {
    try {
        const payload = {
            quantityAdded: quantityAdded, // CHANGED: From quantity_added to quantityAdded (camelCase)
            costPerUnit: costPerUnit === null ? null : Number(costPerUnit),
        };
        const response = await api.patch(`/inventory/items/${itemId}/restock`, payload);
        if (!response.data || !response.data.data) {
            throw new Error('Invalid response structure from server: Expected data for restocked item.');
        }
        const item = response.data.data;
        return {
            ...item,
            quantity: Number(item.quantity),
            min_threshold: Number(item.min_threshold),
            cost_per_unit: item.cost_per_unit !== null ? Number(item.cost_per_unit) : null,
            last_restocked: item.last_restocked ? new Date(item.last_restocked) : undefined,
            updated_at: new Date(item.updated_at),
            supplier: item.supplier ? {
                ...item.supplier,
                created_at: new Date(item.supplier.created_at),
                updated_at: new Date(item.supplier.updated_at),
            } : undefined,
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || `Failed to restock item with ID ${itemId}`);
        }
        throw new Error('An unknown error occurred during restock.');
    }
};


export const deleteInventoryItem = async (id: number): Promise<void> => {
    try {
        await api.delete(`/inventory/items/${id}`);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Failed to delete inventory item');
        }
        throw new Error('Unknown error deleting inventory item');
    }
};

export const getInventoryUsage = async (itemId: number): Promise<InventoryUsage[]> => {
    const response = await api.get(`/inventory/items/${itemId}/usage`);
    // Assuming backend returns an array directly, or response.data.data as array
    if (!response.data || !Array.isArray(response.data.data)) {
        console.warn('Expected an array for inventory usage, but got:', response.data);
        return []; // Return empty array if unexpected structure
    }
    // Map to ensure any date strings are converted to Date objects if necessary
    return response.data.data.map((usage: any) => ({
        ...usage,
        // Assuming usage might have a 'timestamp' or 'date' field
        // If your backend returns dates as strings, convert them here:
        // timestamp: usage.timestamp ? new Date(usage.timestamp) : undefined,
    }));
};

export const getSuppliers = async (): Promise<Supplier[]> => {
    const response = await api.get('/inventory/suppliers');
    if (!response.data || !Array.isArray(response.data.data)) {
        throw new Error('Invalid response structure from server: Expected an array for suppliers.');
    }
    return response.data.data.map((supplier: any) => ({
        ...supplier,
        created_at: new Date(supplier.created_at),
        updated_at: new Date(supplier.updated_at),
    }));
};

export const createSupplier = async (supplierData: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>): Promise<Supplier> => {
    const response = await api.post('/inventory/suppliers', supplierData);
    return {
        ...response.data.data,
        created_at: new Date(response.data.data.created_at),
        updated_at: new Date(response.data.data.updated_at),
    };
};

// --- Unified Real-time Updates (WebSockets) ---

interface WebSocketCallbacks {
    onInventoryUpdate?: (updatedItems: InventoryItem[]) => void;
    onOrderUpdate?: (order: Order) => void;
    [key: string]: ((data: any) => void) | undefined;
}

export const setupWebSocketUpdates = (employeeId: string, callbacks: WebSocketCallbacks): () => void => {
    const wsUrl = `${API_BASE_WEBSOCKET}/api/ws?employeeId=${employeeId}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
        console.log(`WebSocket connected for employee ${employeeId}.`);
    };

    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data as string);
            if (data.type === 'INVENTORY_UPDATE' && Array.isArray(data.data)) {
                const parsedItems: InventoryItem[] = data.data.map((item: any) => ({
                    ...item,
                    quantity: Number(item.quantity),
                    min_threshold: Number(item.min_threshold),
                    cost_per_unit: item.cost_per_unit !== null ? Number(item.cost_per_unit) : null,
                    last_restocked: item.last_restocked ? new Date(item.last_restocked) : undefined,
                    updated_at: new Date(item.updated_at),
                    supplier: item.supplier ? {
                        ...item.supplier,
                        created_at: new Date(item.supplier.created_at),
                        updated_at: new Date(item.supplier.updated_at),
                    } : undefined,
                }));
                if (callbacks.onInventoryUpdate) {
                    callbacks.onInventoryUpdate(parsedItems);
                }
            } else if (data.type === 'order_update' && data.data) {
                if (callbacks.onOrderUpdate) {
                    callbacks.onOrderUpdate(data.data as Order);
                }
            } else if (callbacks[data.type]) {
                const specificCallback = callbacks[data.type];
                if (specificCallback) {
                    specificCallback(data.data);
                }
            } else {
                console.warn('Unknown or unhandled WebSocket message type:', data.type, data);
            }
        } catch (error) {
            console.error('Failed to parse or dispatch WebSocket message:', error);
        }
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
    };

    return () => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.close();
            console.log('WebSocket connection closed.');
        }
    };
};


export const getDisplayImages = async (): Promise<CarouselItem[]> => {
    try {
        const response = await api.get('/display/images');
        // Adjusted to expect response.data.data to be the array
        if (!response.data || !Array.isArray(response.data.data)) {
            throw new Error('Invalid response structure from server: Expected an array for display images.');
        }
        return response.data.data.map((item: CarouselItem) => ({
            ...item,
            url: getFullImageUrl(item.url),
        }));
    } catch (error) {
        console.error('Error fetching display images:', error);
        throw error;
    }
};

export const addDisplayImage = async (formData: FormData): Promise<CarouselItem> => {
    try {
        const response = await api.post('/display/images', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        // Adjusted to expect response.data.data from handleApiResponse
        const addedImage: CarouselItem = response.data.data;
        if (!addedImage) {
            throw new Error('Invalid response structure: No image data returned.');
        }
        return {
            ...addedImage,
            url: getFullImageUrl(addedImage.url),
        };
    } catch (error) {
        console.error('Error adding display image:', error);
        throw error;
    }
};

export const deleteDisplayImage = async (imageId: number, deleted_by_employeeId: string): Promise<void> => {
    try {
        await api.delete(`/display/images/${imageId}`, { data: { deleted_by: deleted_by_employeeId } });
    } catch (error) {
        console.error(`Error deleting display image with ID ${imageId}:`, error);
        throw error;
    }
};



// --- Unified Employee Performance Tracking ---

/**
 * Fetches performance data for a specific employee.
 * @param employeeId The ID of the employee to fetch performance for.
 * @param fromDate Optional. Start date for the performance period (YYYY-MM-DD string).
 * @param toDate Optional. End date for the performance period (YYYY-MM-DD string).
 * @returns A Promise that resolves to a single EmployeePerformanceMetrics object.
 */
export const getEmployeePerformanceById = async (
  employeeId: string,
  fromDate?: string,
  toDate?: string
): Promise<EmployeePerformanceMetrics | null> => {
  try {
    const params = new URLSearchParams();
    if (fromDate) params.append('from', fromDate);
    if (toDate) params.append('to', toDate);

    const url = `${API_BASE_URL}/performance/employees/${employeeId}`;
    const response = await axios.get(url, { params });

    if (!response.data || response.data.data === null) {
      return null;
    }

    const performanceData = response.data.data;

    // Convert date strings to Date objects if your EmployeePerformanceMetrics frontend interface
    // expects Date objects. If it expects strings, remove these conversions.
    if (performanceData.lastActivityAt) {
      performanceData.lastActivityAt = new Date(performanceData.lastActivityAt);
    }
    if (performanceData.aggregationDate) {
      performanceData.aggregationDate = new Date(performanceData.aggregationDate);
    }

    return performanceData as EmployeePerformanceMetrics;
  } catch (error) {
    console.error(`Failed to fetch performance for employee ${employeeId}:`, error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return null;
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch employee performance');
    }
    throw new Error('Unknown error fetching employee performance');
  }
};

/**
 * Fetches performance data for all employees.
 * @param role Optional. Filter performance by employee role.
 * @param fromDate Optional. Start date for the performance period (YYYY-MM-DD string).
 * @param toDate Optional. End date for the performance period (YYYY-MM-DD string).
 * @returns A Promise that resolves to an array of EmployeePerformanceMetrics.
 */
export const getEmployeePerformanceAll = async (
  role?: string,
  fromDate?: string,
  toDate?: string
): Promise<EmployeePerformanceMetrics[]> => {
  try {
    const params = new URLSearchParams();
    if (role) params.append('role', role);
    if (fromDate) params.append('from', fromDate);
    if (toDate) params.append('to', toDate);

    const url = `${API_BASE_URL}/performance/employees`;
    const response = await axios.get(url, { params });

    if (!response.data || !Array.isArray(response.data.data)) {
      throw new Error('Invalid response structure from server: Expected an array for all employees performance.');
    }

    const performanceData = response.data.data;

    return performanceData.map((item: any) => {
      // Convert date strings to Date objects if your EmployeePerformanceMetrics frontend interface
      // expects Date objects. If it expects strings, remove these conversions.
      if (item.lastActivityAt) {
        item.lastActivityAt = new Date(item.lastActivityAt);
      }
      if (item.aggregationDate) {
        item.aggregationDate = new Date(item.aggregationDate);
      }
      return item as EmployeePerformanceMetrics;
    });
  } catch (error) {
    console.error('Failed to fetch all employee performance:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch all employee performance');
    }
    throw new Error('Unknown error fetching all employee performance');
  }
};

/**
 * Sends an activity log for an employee.
 * @param activity The EmployeeActivityLog object containing the event details.
 * Its timestamp, startTime, and endTime fields are expected to be ISO strings.
 * @returns A Promise that resolves when the activity is logged.
 */
export const logEmployeeActivity = async (activity: EmployeeActivityLog): Promise<void> => {
  try {
    // The activity object's timestamp, startTime, endTime are already strings
    // as per the EmployeeActivityLog interface in employeeTypes.ts
    const payload = {
      ...activity,
      // The backend column is named 'timestamp', so map frontend's 'timestamp' to it.
      // No need for .toISOString() here, as they are already strings.
      timestamp: activity.timestamp, // <<-- CORRECTED: Use 'timestamp'
      start_time: activity.startTime,
      end_time: activity.endTime,
    };

    await axios.post(`${API_BASE_URL}/performance/log`, payload);
  } catch (error) {
    console.error('Failed to log employee activity:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to log activity');
    }
    throw new Error('Unknown error logging employee activity');
  }
};

export const startShift = async (employeeId: string): Promise<any> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/performance/shifts/start`, { employeeId });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to start shift');
    }
    throw new Error('Unknown error starting shift');
  }
};

export const endShift = async (employeeId: string): Promise<any> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/performance/shifts/end`, { employeeId });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to end shift');
    }
    throw new Error('Unknown error ending shift');
  }
};

/**
 * Starts an employee break.
 * @param employeeId The ID of the employee.
 * @returns A Promise that resolves to the break ID (number).
 */
export const startBreak = async (employeeId: string): Promise<number> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/performance/breaks/start`, { employeeId });
    return response.data.break_id;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to start break');
    }
    throw new Error('Unknown error starting break');
  }
};

/**
 * Ends an employee break.
 * @param employeeId The ID of the employee.
 * @returns A Promise that resolves to BreakEndResponse or null if no active break found.
 */
export const endBreak = async (employeeId: string): Promise<BreakEndResponse | null> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/performance/breaks/end`, { employeeId });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return null;
      }
      throw new Error(error.response?.data?.message || 'Failed to end break');
    }
    throw new Error('Unknown error ending break');
  }
};

export type { EmployeePerformanceMetrics };