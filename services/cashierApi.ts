import { Order, OrderItem, OrderStatus, Customer } from '@/types/cashierTypes';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

export const createOrder = async (orderData: {
  employee_id: string; 
  store_id: number;
  orderData: {
    customer_id: number | null;
    order_type: string;
    order_source: string;
    subtotal: number;
    total_amount: number;
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

export const getOrderById = async (
  orderId: string,
  options?: {
    includeItems?: boolean;
    includeCustomer?: boolean;
    signal?: AbortSignal;
  }
): Promise<Order & {
  items?: OrderItem[];
  customer?: Customer;
}> => {
  try {
    const params = new URLSearchParams();
    if (options?.includeItems) params.append('includeItems', 'true');
    if (options?.includeCustomer) params.append('includeCustomer', 'true');

    const response = await axios.get(
      `${API_BASE_URL}/cashier/orders/${orderId}?${params.toString()}`,
      { signal: options?.signal }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ERR_CANCELED') {
        console.log('Request canceled');
        throw new Error('Request canceled');
      }
      if (error.response?.status === 404) {
        throw new Error('Order not found');
      }
      console.error('Failed to fetch order:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to fetch order');
    }
    console.error('Unexpected error fetching order:', error);
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

export const getProducts = async () => {
  const response = await axios.get(`${API_BASE_URL}/cashier/products`);
  return response.data;
};