// hooks/useOrders.ts
import { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus } from '@/services/api';
import { Order, OrderStatus } from '@/types/cashierTypes'; // Make sure to import OrderStatus

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await getOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, status: OrderStatus) => {
    try {
      setLoading(true);
      await updateOrderStatus(orderId, status);
      await fetchOrders(); // Refresh orders after update
    } catch (error) {
      console.error('Failed to update order status:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return { 
    orders, 
    loading, 
    updateOrderStatus: handleStatusUpdate, 
    refreshOrders: fetchOrders 
  };
};