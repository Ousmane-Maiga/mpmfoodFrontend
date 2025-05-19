import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Text, Avatar, useTheme } from 'react-native-paper';
import { useAuth } from '@/contexts/AuthContext';
import AddOrderModal from '@/components/cashier/AddOrdersModal';
import AllOrdersModal from '@/components/cashier/AllOrdersModal';
import { createOrder, getOrders, getProducts, updateOrderStatus, setupOrderUpdates } from '@/services/api';
import { Order, Product, OrderStatus } from '@/types/cashierTypes';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { TabParamList } from '@/app/types';

type CashierRouteProp = RouteProp<TabParamList, 'cashier'>;

export default function CashierScreen() {
  const route = useRoute<CashierRouteProp>();
  const { name, role } = route.params.user;
  const [showAddOrder, setShowAddOrder] = useState(false);
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const theme = useTheme();
  const navigation = useNavigation();
  
  const { 
    user: authUser, 
    loading: authLoading, 
    onBreak, 
    logout, 
    toggleBreak 
  } = useAuth();
  
  const [localLoading, setLocalLoading] = useState(false);

  // Fetch products on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const productsData = await getProducts();
        setProducts(productsData);
      } catch (error) {
        Alert.alert('Error', 'Failed to load products');
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // Fetch orders when modal is shown and setup WebSocket
  useEffect(() => {
    if (showAllOrders) {
      const loadOrders = async () => {
        try {
          setLoading(true);
          const ordersData = await getOrders();
          setOrders(ordersData);
        } catch (error) {
          Alert.alert('Error', 'Failed to load orders');
          console.error('Failed to load orders:', error);
        } finally {
          setLoading(false);
        }
      };
      loadOrders();
    }

    // WebSocket setup
    const cleanup = setupOrderUpdates((updatedOrder) => {
      setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
      if (showAllOrders) {
        setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
      }
    });

    return cleanup;
  }, [showAllOrders]);


  const handleLogout = async () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          onPress: async () => {
            setLocalLoading(true);
            try {
              await logout();
              navigation.navigate('(auth)', { screen: '(auth)/login' });
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            } finally {
              setLocalLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleToggleBreak = async () => {
    setLocalLoading(true);
    try {
      await toggleBreak();
    } catch (error) {
      Alert.alert('Error', 'Failed to update break status');
    } finally {
      setLocalLoading(false);
    }
  };

const handleSubmitOrder = async (order: { values: any; orderItems: any }) => {
  try {
    setLoading(true);

    const { values, orderItems } = order;

    const backendItems = orderItems.map((item: any) => {
      const product = products.find(p => p.name === item.product);
      const variant = product?.variants.find((v: any) => v.name === item.variant);

      return {
        product_id: product?.id || 0,
        variant_id: variant?.id || 0,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.total,
        discount_amount: 0
      };
    });

    const subtotal = orderItems.reduce((sum: number, item: any) => sum + item.total, 0);

    const orderData = {
      employee_id: '4d40e877-3752-4cde-b304-c2d3e23e4337',
      store_id: 1,
      orderData: {
        customer_id: null,
        order_type: values.orderType.toLowerCase(),
        order_source: values.orderSource.toLowerCase().replace(' ', '_'),
        subtotal,
        total_amount: subtotal,
        address: values.orderType === 'delivery' ? values.address : null,
        deliverer: values.orderType === 'delivery' ? values.deliverer : null,
        notes: ''
      },
      items: backendItems
    };

    await createOrder(orderData);
    setShowAddOrder(false);

    const updatedOrders = await getOrders();
    setOrders(updatedOrders);

    Alert.alert('Success', 'Order created successfully');
  } catch (error) {
    Alert.alert('Error', 'Failed to create order');
    console.error('Failed to create order:', error);
  } finally {
    setLoading(false);
  }
};


  const handlePrintOrder = (orderId: string) => {
    console.log('Print order:', orderId);
    Alert.alert('Print', `Printing order #${orderId}`);
  };

const handleUpdateOrderStatus = async (orderId: string, status: Exclude<OrderStatus, 'all'>) => {
  try {
    setLoading(true);
    await updateOrderStatus(orderId, status);
    
    const updatedOrders = await getOrders();
    setOrders(updatedOrders);
  } catch (error) {
    Alert.alert('Error', 'Failed to update order status');
    console.error('Failed to update order status:', error);
  } finally {
    setLoading(false);
  }
};

return (
    <View style={styles.container}>
      {/* User Status Bar */}
      <View style={styles.userContainer}>
        <View style={styles.userInfo}>
          <Avatar.Text size={40} label={name.split(' ').map(n => n[0]).join('')} />
          <View style={styles.userText}>
            <Text style={styles.userName}>{name}</Text>
            <Text style={styles.userRole}>{role}</Text>
          </View>
          <View style={[styles.statusDot, { backgroundColor: isActive ? '#4CAF50' : '#F44336' }]} />
        </View>
        <View style={styles.actions}>
          <Button 
          mode="outlined"
          onPress={handleToggleBreak}
          loading={localLoading}
          disabled={authLoading || localLoading}
          labelStyle={{ 
            color: onBreak ? theme.colors.error : theme.colors.primary 
          }}
        >
          {onBreak ? 'End Break' : 'Take Break'}
          </Button>
          <Button 
          mode="contained"
          onPress={handleLogout}
          loading={localLoading}
          disabled={authLoading || localLoading}
          labelStyle={{ color: 'white' }}
        >
          Logout
        </Button>
        </View>
      </View>

      {/* Main Buttons */}
      <Button 
        mode="contained" 
        onPress={() => setShowAddOrder(true)}
        style={styles.button}
        loading={loading}
        disabled={loading || !isActive || onBreak}
      >
        Add New Order
      </Button>

      <Button 
        mode="outlined" 
        onPress={() => setShowAllOrders(true)}
        style={styles.button}
        loading={loading}
        disabled={loading || !isActive}
      >
        View All Orders
      </Button>

      {/* Status Indicator */}
      {onBreak && (
        <Text style={styles.breakText}>You are currently on break</Text>
      )}

      {/* Modals */}
      <AddOrderModal
        visible={showAddOrder}
        onClose={() => setShowAddOrder(false)}
        onSubmit={handleSubmitOrder}
        products={products}
      />

      <AllOrdersModal
        visible={showAllOrders}
        onClose={() => setShowAllOrders(false)}
        orders={orders}
        onPrint={handlePrintOrder}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  userContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userText: {
    marginLeft: 10,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  userRole: {
    fontSize: 14,
    color: '#666',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 10,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 8,
  },
  button: {
    marginVertical: 8,
  },
  breakText: {
    textAlign: 'center',
    color: '#FF9800',
    marginTop: 8,
    fontStyle: 'italic',
  },
});

