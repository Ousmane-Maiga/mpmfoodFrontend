// kitchen/index.tsx
import React, { useState, useEffect } from 'react';
import { View, Alert, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '@/contexts/AuthContext'; // Ensure this path is correct if moved
import { Button, Text, Avatar, useTheme, Divider } from 'react-native-paper';
import KitchenModal from '@/components/kitchen/KitchenModal';
import { Order, OrderStatus } from '@/types/cashierTypes';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { TabParamList } from '@/app/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@/constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { setupOrderUpdates, getKitchenOrders, getKitchenEmployeePerformance, updateKitchenOrderStatus } from '@/services/api';

type KitchenRouteProp = RouteProp<TabParamList, 'kitchen'>;

interface KitchenTeamMember {
  id: string;
  name: string;
  role: string;
  is_active: boolean;
  itemsPreparedToday: number;
  breakDuration: number;
  currentStatus: 'available' | 'on_break' | 'offline';
}

export default function KitchenScreen() {
  const route = useRoute<KitchenRouteProp>();
  // Use employee.name and employee.role directly from useAuth for display
  const { user: employee, loading: authLoading, onBreak, logout, toggleBreak } = useAuth();
  const userName = employee?.name || 'Unknown';
  const userRole = employee?.role || 'Employee';

  const [showKitchen, setShowKitchen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  // isActive can be derived from employee.is_active or similar from your auth context/backend
  const [isActive, setIsActive] = useState(true); // You might want to tie this to employee.is_active from your auth context
  const navigation = useNavigation();

  const [localLoading, setLocalLoading] = useState(false);
  const [performance, setPerformance] = useState<{
    itemsPrepared: number;
    avgPrepTime: number;
    breakDuration: number;
  } | null>(null);
  const [teamMembers, setTeamMembers] = useState<KitchenTeamMember[]>([]);
  const [performanceLoading, setPerformanceLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const fetchedOrders = await getKitchenOrders();

      if (!Array.isArray(fetchedOrders)) {
        throw new Error('Invalid orders data received');
      }

      const validatedOrders = fetchedOrders.map(order => ({
        ...order,
        order_items: order.order_items?.map(item => ({
          ...item,
          product: item.product || 'Unknown Product',
          variant: item.variant || 'Unknown Variant',
          product_id: item.product_id || 0,
          variant_id: item.variant_id || 0,
          discount_amount: item.discount_amount || 0
        })) || []
      }));

      setOrders(validatedOrders);
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'Failed to load kitchen orders';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchPerformance = async () => {
    if (!employee?.id) {
      console.warn('Employee ID is not available for fetching performance.');
      return;
    }
    try {
      setPerformanceLoading(true);
      const data = await getKitchenEmployeePerformance(employee.id);
      setPerformance(data.currentEmployee);
      setTeamMembers(data.teamMembers);
    } catch (error) {
      console.error('Failed to fetch performance:', error);
      Alert.alert('Error', 'Failed to fetch performance data.');
    } finally {
      setPerformanceLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchPerformance();

    const cleanup = setupOrderUpdates((updatedOrder) => {
      console.log('Order update received via WebSocket:', updatedOrder);
      setOrders(prev => {
        const orderExists = prev.some(o => o.id === updatedOrder.id);
        if (orderExists) {
          return prev.map(o => o.id === updatedOrder.id ? updatedOrder : o);
        } else {
          return [updatedOrder, ...prev];
        }
      });
      // Re-fetch performance if an order completion comes via WebSocket
      if (updatedOrder.status === 'completed') {
        fetchPerformance();
      }
    });

    return cleanup;
  }, [employee?.id]); // Depend on employee.id for initial fetches and WebSocket setup

  useEffect(() => {
    if (showKitchen) {
      fetchOrders();
      fetchPerformance();
    }
  }, [showKitchen]);

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    let originalStatus: OrderStatus | undefined;

    console.log('handleUpdateOrderStatus called for Order ID:', orderId, 'New Status:', status);
    console.log('Current employee ID:', employee?.id);
    console.log('Current employee Name:', employee?.name);

    try {
      setLoading(true);

      const originalOrder = orders.find(o => o.id === Number(orderId) || o.id.toString() === orderId);
      originalStatus = originalOrder?.status;

      let preparedById: string | undefined = undefined;
      let preparedByName: string | undefined = undefined;

      // --- MODIFICATION HERE: Include 'ready' status if you want prepared_by for it ---
      if (employee?.id) {
        // Assign preparedById for 'in_progress', 'ready', and 'completed'
        if (status === 'in_progress' || status === 'completed' || status === 'ready') {
          preparedById = employee.id;
          preparedByName = employee.name || 'Unknown Preparer';
        }
      } else {
        Alert.alert('Error', 'Cannot update order status: Employee information is missing. Please re-login.');
        setLoading(false);
        return;
      }

      console.log('preparedById being sent to API:', preparedById);

      setOrders(prev =>
        prev.map(o =>
          o.id === Number(orderId) || o.id.toString() === orderId
            ? {
                ...o,
                status,
                ...(preparedById && {
                  prepared_by: preparedById,
                  prepared_by_name: preparedByName
                }),
                started_at: status === 'in_progress' && !o.started_at ? new Date().toISOString() : o.started_at,
                completed_at: status === 'completed' && !o.completed_at ? new Date().toISOString() : o.completed_at,
              }
            : o
        )
      );

      await updateKitchenOrderStatus(orderId, status, preparedById);

      await fetchOrders();
      if (status === 'completed') {
        await fetchPerformance();
      }
    } catch (error) {
      setOrders(prev =>
        prev.map(o =>
          o.id === Number(orderId) || o.id.toString() === orderId
            ? { ...o, status: originalStatus || o.status }
            : o
        )
      );

      let errorMessage = 'Failed to update order status';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      Alert.alert('Error', errorMessage);
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
      <ScrollView style={styles.container}>
        {/* User Status Bar */}
        <View style={styles.userContainer}>
          <View style={styles.userInfo}>
            <Avatar.Text
              size={40}
              label={userName.split(' ').map((n) => n[0]).join('')}
              style={{ backgroundColor: theme.colors.primary }}
            />
            <View style={styles.userText}>
              <Text style={styles.userName}>{userName}</Text>
              <Text style={styles.userRole}>{userRole}</Text>
              <View style={[styles.statusDot, { backgroundColor: isActive ? '#4CAF50' : '#F44336' }]} />
            </View>
          </View>
          <View style={styles.actions}>
            <Button
              mode="outlined"
              onPress={handleToggleBreak}
              loading={localLoading}
              disabled={authLoading || localLoading}
              labelStyle={{
                color: onBreak ? theme.colors.danger : theme.colors.primary
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
              style={{ backgroundColor: theme.colors.primary }}
            >
              Logout
            </Button>
          </View>
        </View>

        {/* Performance Stats */}
        {(performanceLoading || performance) && (
          <View style={styles.statsContainer}>
            {performanceLoading ? (
              <View style={styles.loadingContainer}>
                <Text>Loading performance data...</Text>
              </View>
            ) : (
              <>
                <View style={styles.statItem}>
                  <View style={{ flexDirection: 'column', gap: 10, alignItems: 'center' }}>
                    <Icon name="food" size={24} color={theme.colors.primary} />
                    <Text style={styles.statValue}> {performance?.itemsPrepared || 0}</Text>
                  </View>
                  <Text style={styles.statLabel}>Items Prepared</Text>
                </View>
                <View style={styles.statItem}>
                  <View style={{ flexDirection: 'column', gap: 10, alignItems: 'center' }}>
                    <Icon name="clock-outline" size={24} color={theme.colors.primary} />
                    <Text style={styles.statValue}> {performance?.avgPrepTime || 0}m</Text>
                  </View>
                  <Text style={styles.statLabel}>Avg Prep Time</Text>
                </View>
                <View style={styles.statItem}>
                  <View style={{ flexDirection: 'column', gap: 10, alignItems: 'center' }}>
                    <Icon name="coffee" size={24} color={theme.colors.primary} />
                    <Text style={styles.statValue}> {performance?.breakDuration || 0}m</Text>
                  </View>
                  <Text style={styles.statLabel}>Break Time</Text>
                </View>
              </>
            )}
          </View>
        )}

        {/* Team Members Section */}
        {(performanceLoading || teamMembers.length > 0) && (
          <View style={styles.teamSection}>
            <Text style={styles.sectionTitle}>
              {performanceLoading ? 'Loading team data...' :
                `Kitchen Team (${teamMembers.filter(m => m.is_active).length}/${teamMembers.length} active)`}
            </Text>
            <Divider style={styles.divider} />
            {performanceLoading ? (
              <View style={styles.loadingContainer}>
                <Text>Loading team members...</Text>
              </View>
            ) : (
              teamMembers.map((member) => (
                <View key={member.id} style={styles.teamMember}>
                  <View style={styles.memberInfo}>
                    <View style={styles.memberStatus}>
                      <View style={[
                        styles.memberDot,
                        {
                          backgroundColor: member.is_active ?
                            (member.currentStatus === 'on_break' ? '#FFA000' : '#4CAF50') :
                            '#F44336'
                        }
                      ]} />
                      <Text style={styles.memberName}>{member.name}</Text>
                    </View>
                    <Text style={styles.memberRole}>{member.role}</Text>
                  </View>
                  <View style={styles.memberStats}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Icon name="food" size={14} color="#666" />
                      <Text style={styles.memberStat}> {member.itemsPreparedToday}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Icon name="coffee" size={14} color="#666" />
                      <Text style={styles.memberStat}> {member.breakDuration}m</Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        <Button
          mode="contained"
          onPress={() => setShowKitchen(true)}
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          loading={loading}
          disabled={loading || onBreak}
        >
          Open Kitchen View
        </Button>

        {onBreak && (
          <Text style={styles.breakText}>You are currently on break - kitchen updates paused</Text>
        )}

        <KitchenModal
          visible={showKitchen}
          onClose={() => setShowKitchen(false)}
          orders={orders || []}
          onStatusChange={handleUpdateOrderStatus}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  userContainer: {
    flex: 1,
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
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  userText: {
    marginLeft: 10,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#666',
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
    marginTop: 4, // Adjust as needed for alignment
  },
  actions: {
    flexDirection: 'column',
    gap: 4,
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', 
    marginVertical: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
    justifyContent: 'center', 
    flexShrink: 1,
  },
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 4,
    textAlign: 'center',
    color: '#666',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  teamSection: {
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#666',
  },
  divider: {
    marginVertical: 8,
    backgroundColor: '#e0e0e0',
  },
  teamMember: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    color: '#666',
  },
  memberInfo: {
    flex: 1,
    
  },
  memberStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  memberName: {
    fontWeight: '500',
    color: '#666',
  },
  memberRole: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  memberStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  memberStat: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});