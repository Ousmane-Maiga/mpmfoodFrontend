import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Order, OrderStatus } from '@/types/cashierTypes';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const statusColors: Record<OrderStatus, string> = {
  pending: '#FFA500',
  in_progress: '#1E90FF',
  ready: '#32CD32',
  completed: '#808080',
  cancelled: '#FF0000'
};

const statusIcons: Record<OrderStatus, string> = {
  pending: 'timer-sand',
  in_progress: 'chef-hat',
  ready: 'check-circle',
  completed: 'clipboard-check',
  cancelled: 'cancel'
};

interface OrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onStatusChange }) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    return `${minutes} min ago`;
  };

  const getActionButton = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'Start Cooking';
      case 'in_progress': return 'Mark as Ready';
      case 'ready': return 'Complete Order';
      default: return null;
    }
  };

  const getNextStatus = (status: OrderStatus): OrderStatus | null => {
    switch (status) {
      case 'pending': return 'in_progress';
      case 'in_progress': return 'ready';
      case 'ready': return 'completed';
      default: return null;
    }
  };

  const nextStatus = getNextStatus(order.status);
  const actionButtonText = getActionButton(order.status);

  return (
    <View style={[styles.orderCard, { borderLeftColor: statusColors[order.status] }]}>
      <View style={styles.cardHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>Order #{order.id}</Text>
          <Text style={styles.orderTime}>{formatTime(order.created_at)}</Text>
        </View>
        <View style={styles.statusBadge}>
          <Icon 
            name={statusIcons[order.status]} 
            size={20} 
            color={statusColors[order.status]} 
          />
          <Text style={[styles.statusText, { color: statusColors[order.status] }]}>
            {order.status.replace('_', ' ')}
          </Text>
        </View>
      </View>

      <View style={styles.orderDetails}>
        <Text style={styles.orderType}>
          {order.order_type === 'delivery' ? '🚚 Delivery' : '🏠 Pickup'}
        </Text>
        {order.order_source && (
          <Text style={styles.orderSource}>
            Source: {order.order_source.replace('_', ' ')}
          </Text>
        )}
      </View>

      {order.order_items && order.order_items.length > 0 && (
        <View style={styles.itemsContainer}>
          {order.order_items.map((item, index) => (
            <View key={`${item.id}-${index}`} style={styles.itemRow}>
              <Text style={styles.itemQuantity}>×{item.quantity}</Text>
              <Text style={styles.itemName}>
                {item.product} - {item.variant}
              </Text>
              <Text style={styles.itemPrice}>{item.total} XOF</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.orderTotal}>
        <Text style={styles.totalText}>Total: {order.total_amount} XOF</Text>
      </View>

      {actionButtonText && nextStatus && (
        <TouchableOpacity 
          style={[
            styles.actionButton,
            { backgroundColor: statusColors[order.status] }
          ]}
          onPress={() => onStatusChange(order.id.toString(), nextStatus)}
        >
          <Text style={styles.actionButtonText}>
            {actionButtonText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  orderTime: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
  },
  statusText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderType: {
    fontSize: 14,
    fontWeight: '500',
  },
  orderSource: {
    fontSize: 14,
    color: '#666',
  },
  itemsContainer: {
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemQuantity: {
    width: 30,
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemName: {
    flex: 1,
    fontSize: 14,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '500',
  },
  orderTotal: {
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButton: {
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default OrderCard;