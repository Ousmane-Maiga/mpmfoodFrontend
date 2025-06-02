// cashier/index.tsx
import React, { useState, useEffect } from 'react';
import { View, Alert, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Button, Text, Avatar, SegmentedButtons, Snackbar, Divider } from 'react-native-paper';
import AddOrderModal from '@/components/cashier/AddOrdersModal';
import OrderSummary from '@/components/cashier/OrderSummary';
import AllOrdersModal from '@/components/cashier/AllOrdersModal';
import { getProducts, createOrder, getOrders, getCashierTeamPerformance } from '@/services/api';
import {
    FormValues,
    OrderItem,
    Product,
    Order,
    TeamMember,
    PerformanceStats,
    CreateOrderRequest // Import the new type for the API request body
} from '@/types/cashierTypes';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../../../services/api'
import { theme } from '@/constants/theme';

const CashierScreen: React.FC = () => {
    const { user: employee, loading: authLoading, onBreak, logout, toggleBreak } = useAuth();
    const [modalVisible, setModalVisible] = useState<'add' | 'all' | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentOrder, setCurrentOrder] = useState<{
        values: FormValues;
        items: OrderItem[];
    } | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [localLoading, setLocalLoading] = useState(false);
    const [totalOrders, setTotalOrders] = useState<number>(0); // State to hold total orders for pagination info
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [performanceStats, setPerformanceStats] = useState<PerformanceStats>({
        ordersHandled: 0,
        averageProcessingTime: 0,
        breakDuration: '0m',
    });

    const fetchInitialData = async () => {
        try {
            // Fetch products and team performance concurrently
            const [productsData, teamData] = await Promise.all([
                getProducts(),
                getCashierTeamPerformance(employee?.id || '')
            ]);

            setProducts(productsData);
            setTeamMembers(teamData.teamMembers);
            setPerformanceStats({
                ordersHandled: teamData.currentEmployee.ordersHandled,
                averageProcessingTime: teamData.currentEmployee.averageProcessingTime,
                breakDuration: `${teamData.currentEmployee.breakDuration}m`,
            });
        } catch (err) {
            setError('Failed to load initial data');
            console.error('Initial data fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (employee?.id) {
            fetchInitialData();
        }
    }, [employee?.id]); // Re-fetch data if employee ID changes

    const handleSubmitOrder = async (values: FormValues, orderItems: OrderItem[]) => {
        try {
            if (!employee?.id) {
                throw new Error('Employee not authenticated');
            }

            // Prepare order data with proper typing for the API request
            const orderRequestData: CreateOrderRequest = {
                created_by: employee.id, // FIX: Renamed from employee_id to created_by
                store_id: 1, // Make sure this matches your backend expectations
                orderData: {
                    customer_id: values.customerId || null, // Assuming customerId might come from form values
                    name: values.customerName, // Assuming customerName is available in form values
                    phone: values.customerPhone, // Assuming customerPhone is available in form values
                    order_type: values.orderType,
                    order_source: values.orderSource,
                    subtotal: orderItems.reduce((sum, item) => sum + (item.total_price || 0), 0),
                    discount_amount: values.discountAmount || 0, // Assuming discountAmount can come from form values
                    total_amount: orderItems.reduce((sum, item) => sum + (item.total_price || 0), 0) - (values.discountAmount || 0), // Calculate total with discount
                    address: values.address || null,
                    deliverer: values.deliverer || null,
                    notes: values.notes || '',
                    payment_status: values.paymentStatus || 'pending', // Assuming paymentStatus can come from form values
                    prepared_by: values.preparedBy, // NEW: Add prepared_by
                },
                items: orderItems.map(item => ({
                    product_id: item.product_id,
                    variant_id: item.variant_id,
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                    total_price: item.total_price,
                    discount_amount: item.discount_amount || 0
                }))
            };

            console.log('Submitting order:', orderRequestData); // Debug log

            const createdOrder = await createOrder(orderRequestData);
            console.log('Order created:', createdOrder); // Debug log

            // Refresh orders list and performance stats
            await handleLoadOrders();
            if (employee?.id) {
                const teamData = await getCashierTeamPerformance(employee.id);
                setTeamMembers(teamData.teamMembers);
                setPerformanceStats({
                    ordersHandled: teamData.currentEmployee.ordersHandled,
                    averageProcessingTime: teamData.currentEmployee.averageProcessingTime,
                    breakDuration: `${teamData.currentEmployee.breakDuration}m`,
                });
            }

            // Reset current order
            setCurrentOrder(null);

            // Show success message
            Alert.alert('Success', 'Order created successfully');

            setModalVisible(null);
        } catch (err) {
            console.error('Order creation error:', err);
            setError(err instanceof Error ? err.message : 'Failed to create order');
        }
    };


const handleLoadOrders = async () => {
    try {
        setLocalLoading(true);
        const { orders: fetchedOrders, total } = await getOrders({});
        
        console.log('Fetched orders:', fetchedOrders);
        console.log('Total orders:', total);

        setOrders(fetchedOrders);
        setTotalOrders(total);
    } catch (error) {
        console.error('Failed to load orders:', error);
        Alert.alert('Error', 'Failed to load orders. Please try again.');
    } finally {
        setLocalLoading(false);
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
            // Refresh team performance after toggling break
            if (employee?.id) {
                const teamData = await getCashierTeamPerformance(employee.id);
                setTeamMembers(teamData.teamMembers);
                setPerformanceStats({
                    ordersHandled: teamData.currentEmployee.ordersHandled,
                    averageProcessingTime: teamData.currentEmployee.averageProcessingTime,
                    breakDuration: `${teamData.currentEmployee.breakDuration}m`,
                });
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to update break status');
        } finally {
            setLocalLoading(false);
        }
    };

    const closeAllModals = () => {
        setModalVisible(null);
    };


    if (loading || authLoading) { // Also consider authLoading
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            </SafeAreaView>
        );
    }


    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container}>
                {/* User Status Bar */}
                <View style={styles.userContainer}>
                    <View style={styles.userInfo}>
                        <Avatar.Text
                            size={40}
                            label={employee?.name?.split(' ').map((n) => n[0]).join('') || ''}
                            style={{ backgroundColor: theme.colors.primary }}
                        />
                        <View style={styles.userText}>
                            <Text style={styles.userName}>{employee?.name || 'Cashier'}</Text>
                            <Text style={styles.userRole}>{employee?.role || 'Cashier'}</Text>
                        </View>
                        <View style={[styles.statusDot, {
                            backgroundColor: !onBreak ? '#4CAF50' : '#F44336'
                        }]}>
                            <Text style={{ fontSize: 0 }}> </Text>
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
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <View style={{ flexDirection: 'column', gap: 10, alignItems: 'center' }}>
                            <Icon name="clipboard-list" size={24} color={theme.colors.primary} />
                            <Text style={styles.statValue}> {performanceStats.ordersHandled}</Text>
                        </View>
                        <Text style={styles.statLabel}>Today's Orders</Text>
                    </View>
                    <View style={styles.statItem}>
                        <View style={{ flexDirection: 'column', gap: 10, alignItems: 'center' }}>
                            <Icon name="clock-outline" size={24} color={theme.colors.primary} />
                            <Text style={styles.statValue}> {performanceStats.averageProcessingTime}m</Text>
                        </View>
                        <Text style={styles.statLabel}>Avg Time</Text>
                    </View>
                    <View style={styles.statItem}>
                        <View style={{ flexDirection: 'column', gap: 10, alignItems: 'center' }}>
                            <Icon name="coffee" size={24} color={theme.colors.primary} />
                            <Text style={styles.statValue}> {performanceStats.breakDuration}</Text>
                        </View>
                        <Text style={styles.statLabel}>Break Time</Text>
                    </View>
                </View>

                {/* Team Members Section */}
                {teamMembers.length > 0 && (
                    <View style={styles.teamSection}>
                        <Text style={styles.sectionTitle}>
                            Cashier Team ({teamMembers.filter(m => m.isActive).length}/{teamMembers.length} active)
                        </Text>
                        <Divider style={styles.divider} />
                        {teamMembers.map((member) => (
                            <View key={member.id} style={styles.teamMember}>
                                <View style={styles.memberInfo}>
                                    <View style={styles.memberStatus}>
                                        <View style={[
                                            styles.memberDot,
                                            {
                                                backgroundColor: member.isActive ?
                                                    (member.currentStatus === 'on_break' ? '#FFA000' : '#4CAF50') :
                                                    '#F44336'
                                            }
                                        ]}>
                                            <Text style={{ fontSize: 0 }}> </Text>
                                        </View>
                                        <Text style={styles.memberName}>{member.name}</Text>
                                    </View>
                                    <Text style={styles.memberRole}>Cashier</Text>
                                </View>
                                <View style={styles.memberStats}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Icon name="clipboard-list" size={14} color="#666" />
                                        <Text style={styles.memberStat}> {member.ordersToday}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Icon name="coffee" size={14} color="#666" />
                                        <Text style={styles.memberStat}> {member.breakDuration}m</Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {onBreak && (
                    <Text style={[styles.breakText, { color: theme.colors.danger }]}>
                        You are currently on break - order processing paused
                    </Text>
                )}

                <View style={styles.buttonGroup}>
                    <Button
                        mode="contained"
                        onPress={() => {
                            if (!onBreak) setModalVisible('add');
                        }}
                        disabled={onBreak}
                        labelStyle={{ color: '#fff' }}
                        style={[styles.button, { backgroundColor: theme.colors.primary }]}
                        icon="plus-circle-outline"
                    >
                        Add Orders
                    </Button>

                    <Button
                        mode="outlined"
                        onPress={() => {
                            if (!onBreak) {
                                handleLoadOrders(); // Ensure orders are fresh before opening modal
                                setModalVisible('all');
                            }
                        }}
                        disabled={onBreak}
                        style={[styles.button, { backgroundColor: '#ffffff' }]}
                        labelStyle={{ color: theme.colors.primary }}
                        icon="format-list-bulleted"
                    >
                        All Orders
                    </Button>
                </View>

                {currentOrder && (
                    <View style={styles.currentOrderContainer}>
                        <OrderSummary
                            values={currentOrder.values}
                            orderItems={currentOrder.items}
                            onAddProduct={() => setModalVisible('add')}
                            onRemoveProduct={(id) => {
                                setCurrentOrder({
                                    ...currentOrder,
                                    items: currentOrder.items.filter(item => item.id !== id)
                                });
                            }}
                            onUpdateQuantity={(id, quantity) => {
                                setCurrentOrder({
                                    ...currentOrder,
                                    items: currentOrder.items.map(item =>
                                        item.id === id
                                            ? { ...item, quantity, total_price: item.unit_price * quantity }
                                            : item
                                    )
                                });
                            }}
                            onEditProduct={(item) => {
                                // Handle edit product logic if needed, e.g., open a modal to edit item details
                            }}
                        />
                    </View>
                )}

                <AddOrderModal
                    visible={modalVisible === 'add' && !onBreak}
                    onClose={closeAllModals}
                    onSubmit={handleSubmitOrder}
                    products={products}
                    // Pass current employee ID for default 'preparedBy' if applicable
                    // defaultPreparedBy={employee?.id || null}
                />

                <AllOrdersModal
                visible={modalVisible === 'all'}
                onClose={closeAllModals}
                orders={Array.isArray(orders) ? orders : []}
                totalOrders={totalOrders}
                onPrint={(orderId: string) => {
                    Alert.alert('Print Order', `Implement printing for Order ID: ${orderId}`);
                }}
/>

                <Snackbar
                    visible={!!error}
                    onDismiss={() => setError(null)}
                    action={{
                        label: 'Dismiss',
                        onPress: () => setError(null),
                    }}
                    style={{ backgroundColor: theme.colors.danger }}
                >
                    {error}
                </Snackbar>
            </ScrollView>
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
  buttonGroup: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 16,
    },
    currentOrderContainer: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#ffffff',
  },
});

export default CashierScreen;