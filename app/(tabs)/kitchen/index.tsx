import React, { useState, useEffect } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Button, Text, Avatar, useTheme } from 'react-native-paper';
import KitchenModal from '@/components/kitchen/KitchenModal';
import {  setupOrderUpdates } from '@/services/kitchenApi';
import { getOrders, updateOrderStatus } from'@/services/cashierApi'
import { Order, OrderStatus } from '@/types/cashierTypes';
import { useNavigation, useRoute } from '@react-navigation/native'; 
import { TabParamList, RouteProp } from '@/app/types'; 
import { SafeAreaView } from 'react-native-safe-area-context';

type KitchenRouteProp = RouteProp<TabParamList, 'kitchen'>;

export default function KitchenScreen() {
  const route = useRoute<KitchenRouteProp>();
  const { name, role } = route.params.user;
  const [showKitchen, setShowKitchen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(true);
  //const [onBreak, setOnBreak] = useState(false);
  const theme = useTheme();
  const navigation = useNavigation();
  const { 
    user, 
    loading: authLoading, 
    onBreak, 
    logout, 
    toggleBreak 
  } = useAuth();
  const [localLoading, setLocalLoading] = useState(false);




  const fetchOrders = async () => {
     try {
    setLoading(true);
    const { orders: ordersData } = await getOrders({});
    setOrders(ordersData);
  } catch (error) {
    Alert.alert('Error', 'Failed to load orders');
    console.error('Failed to load orders:', error);
  } finally {
    setLoading(false);
    }
  };

  useEffect(() => {
    if (showKitchen) {
      fetchOrders();
      
      // Setup WebSocket for real-time updates
      const cleanup = setupOrderUpdates((updatedOrder) => {
        setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
      });

      return cleanup;
    }
  }, [showKitchen]);

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      setLoading(true);
      await updateOrderStatus(orderId, status);
      await fetchOrders(); // Refresh orders after status update
    } catch (error) {
      Alert.alert('Error', 'Failed to update order status');
      console.error('Failed to update order status:', error);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <SafeAreaView style={styles.safeArea}>
    <View style={styles.container}>
      {/* User Status Bar */}
      <View style={styles.userContainer}>
        <View style={styles.userInfo}>
          <Avatar.Text size={40} label={name.split(' ').map((n) => n[0]).join('')} />
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

      <Button 
        mode="contained" 
        onPress={() => setShowKitchen(true)}
        style={styles.button}
        loading={loading}
        disabled={loading || !isActive || onBreak}
      >
        Open Kitchen View
      </Button>

      {/* Status Indicator */}
      {onBreak && (
        <Text style={styles.breakText}>You are currently on break - kitchen updates paused</Text>
      )}

      <KitchenModal
        visible={showKitchen}
        onClose={() => setShowKitchen(false)}
        orders={orders}
        onStatusChange={handleUpdateOrderStatus}
      />
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
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
    marginTop: 16,
  },
  breakText: {
    textAlign: 'center',
    color: '#FF9800',
    marginTop: 16,
    fontStyle: 'italic',
  },
});

// export default KitchenScreen;