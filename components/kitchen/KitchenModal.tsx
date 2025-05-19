import React from 'react';
import { Modal, View, ScrollView, Text } from 'react-native';
import { Button } from 'react-native-paper';
import OrderCard from './OrderCard';
import OrderStatusTabs from './OrderStatusTabs';
import { Order, OrderStatus, OrderStatusFilter } from '@/types/cashierTypes';
import { styles } from './styles';

interface KitchenModalProps {
  visible: boolean;
  onClose: () => void;
  orders: Order[];
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  initialTab?: OrderStatusFilter;
}

const KitchenModal: React.FC<KitchenModalProps> = ({
  visible,
  onClose,
  orders,
  onStatusChange,
  initialTab = 'all'
}) => {
  const [activeTab, setActiveTab] = React.useState<OrderStatusFilter>(initialTab);

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeTab);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Button icon="close" onPress={onClose}>
            {null}
          </Button>
          <Text style={styles.headerText}>Kitchen Orders</Text>
          <View style={{ width: 60 }} />
        </View>

        <OrderStatusTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <OrderCard 
                key={`${order.id}-${order.created_at}`}
                order={order}
                onStatusChange={onStatusChange}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No {activeTab === 'all' ? '' : `${activeTab} `}orders</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

export default KitchenModal;