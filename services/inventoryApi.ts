import { InventoryItem, InventoryItemUpdate, InventoryUsage, Supplier } from '@/types/admin';
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
  const ws = new WebSocket(`ws://172.20.10.7:3000/api/inventory/updates`);
  
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