import { KitchenItem, IngredientUsage, RestockRequest } from '@/types/kitchenTypes';
import axios from 'axios';

const API_BASE_URL = 'http://172.20.10.7:3000/api';



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
  const ws = new WebSocket(`ws://172.20.10.7:3000/api/orders/updates`);
  
  ws.onmessage = (event) => {
    const order = JSON.parse(event.data);
    callback(order);
  };

  return () => ws.close();
};