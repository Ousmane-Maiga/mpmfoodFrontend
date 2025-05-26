import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Button, SegmentedButtons, Modal } from 'react-native-paper';
import { Order, OrderStatus } from '../../types/cashierTypes';

export interface AllOrdersModalProps {
  visible: boolean;
  onClose: () => void;
  orders: Order[];
  onPrint: (orderId: string) => void;
  // Removed onUpdateStatus since cashier won't be changing statuses
}

const AllOrdersModal: React.FC<AllOrdersModalProps> = ({ 
  visible, 
  onClose, 
  orders,
  onPrint
}) => {
  const [filter, setFilter] = useState<'all' | OrderStatus>('all');

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'in_progress': return 'In Progress (Kitchen)';
      case 'ready': return 'Ready for Pickup';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FFA500'; // Orange
      case 'in_progress': return '#1E90FF'; // DodgerBlue
      case 'ready': return '#32CD32'; // LimeGreen
      case 'completed': return '#808080'; // Gray
      case 'cancelled': return '#FF0000'; // Red
      default: return '#000000'; // Black
    }
  };

  return (
    <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.modalContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Button icon="close" onPress={onClose} children={undefined} />
          <Text style={styles.title}>Order Status</Text>
          <View style={{ width: 60 }} />
        </View>

        <SegmentedButtons
          value={filter}
          onValueChange={(value) => setFilter(value as 'all' | OrderStatus)}
          buttons={[
            { value: 'all', label: 'All' },
            { value: 'pending', label: 'Pending' },
            { value: 'in_progress', label: 'In Kitchen' },
            { value: 'ready', label: 'Ready' },
            { value: 'completed', label: 'Completed' },
          ]}
          style={styles.filter}
        />

        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.orderItem}>
              <Text style={styles.orderId}>Order #{item.id}</Text>
              {item.customer_name && (
                <Text style={styles.customerName}>
                  Customer: {item.customer_name} {item.customer_phone ? `(${item.customer_phone})` : ''}
                </Text>
              )}
              
              <View style={styles.statusContainer}>
                <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                  Status: {getStatusLabel(item.status)}
                </Text>
                <Text style={styles.dateText}>
                  {new Date(item.created_at).toLocaleDateString()} - {new Date(item.created_at).toLocaleTimeString()}
                </Text>
              </View>

              <Text style={styles.totalText}>Total: {item.total_amount} XOF</Text>

              {item.status === 'ready' && (
                <Button 
                  mode="contained" 
                  onPress={() => onPrint(item.id.toString())}
                  style={styles.printButton}
                >
                  Print Receipt
                </Button>
              )}
            </View>
          )}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%'
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  filter: {
    marginBottom: 16,
  },
  orderItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  customerName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  dateText: {
    fontSize: 12,
    color: '#666',
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  printButton: {
    alignSelf: 'flex-end',
  },
  listContent: {
    paddingBottom: 16,
  },
});

export default AllOrdersModal;