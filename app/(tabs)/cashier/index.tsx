// // cashier/index.tsx
// import React, { useState, useEffect } from 'react';
// import { View, Alert, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
// import { useAuth } from '@/contexts/AuthContext';
// import { Button, Text, Avatar, Snackbar, Divider } from 'react-native-paper';
// import AddOrderModal from '@/components/cashier/AddOrdersModal';
// import OrderSummary from '@/components/cashier/OrderSummary';
// import AllOrdersModal from '@/components/cashier/AllOrdersModal';
// import {
//     getProducts,
//     createOrder,
//     getOrders,
//     getEmployeePerformanceAll,
//     getEmployeePerformanceById,
//     EmployeePerformanceMetrics,
//     cancelOrder
// } from '@/services/api';
// import {
//     FormValues,
//     OrderItem,
//     Product,
//     Order,
//     CreateOrderRequest
// } from '@/types/cashierTypes';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { theme } from '@/constants/theme';

// // Define local types to map from EmployeePerformanceMetrics for component state
// interface CashierPerformanceStats {
//     ordersHandled: number;
//     averageProcessingTime: number; // In seconds as received from backend
//     breakDuration: string; // Display format, e.g., "60m"
// }

// interface CashierTeamMember {
//     id: string;
//     name: string;
//     role: string;
//     isActive: boolean;
//     ordersToday: number;
//     breakDuration: number; // In minutes, for calculation
//     currentStatus: 'available' | 'on_break' | 'offline'; // Simplified status
// }

// const CashierScreen: React.FC = () => {
//     const { user: employee, loading: authLoading, onBreak, logout, toggleBreak } = useAuth();
//     const userName = employee?.name || 'Unknown';
//     const userRole = employee?.role || 'Employee';
//     const [modalVisible, setModalVisible] = useState<'add' | 'all' | null>(null);
//     const [products, setProducts] = useState<Product[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [currentOrder, setCurrentOrder] = useState<{
//         values: FormValues;
//         items: OrderItem[];
//     } | null>(null);
//     const [orders, setOrders] = useState<Order[]>([]);
//     const [localLoading, setLocalLoading] = useState(false);
//     const [totalOrders, setTotalOrders] = useState<number>(0);
//     const [teamMembers, setTeamMembers] = useState<CashierTeamMember[]>([]);
//     const [performanceStats, setPerformanceStats] = useState<CashierPerformanceStats>({
//         ordersHandled: 0,
//         averageProcessingTime: 0,
//         breakDuration: '0m',
//     });

//     /**
//      * Fetches and updates the performance data for the current employee and the cashier team.
//      */
//     const fetchPerformanceData = async () => {
//         if (!employee?.id) {
//             console.warn('Employee ID not available for fetching performance data.');
//             return;
//         }

//         try {
//             // Fetch performance for the current employee
//             const currentEmployeeMetrics: EmployeePerformanceMetrics | null = await getEmployeePerformanceById(employee.id);

//             // Fetch performance for all cashier team members
//             const allCashierMetrics: EmployeePerformanceMetrics[] = await getEmployeePerformanceAll('cashier');
            
//             console.log('Raw API response:',allCashierMetrics);

//             // --- NEW DEDUPLICATION LOGIC ---
//             // Use a Map to store the most recent performance record for each unique employeeId
//             const uniqueTeamMembersMap = new Map<string, EmployeePerformanceMetrics>();

//             allCashierMetrics.forEach(member => {
//                 const existing = uniqueTeamMembersMap.get(member.employeeId);
//                 // If no entry exists, or if the current member's lastActivityAt is more recent,
//                 // store or update the entry in the map.
//                 if (!existing || (member.lastActivityAt && existing.lastActivityAt && member.lastActivityAt > existing.lastActivityAt)) {
//                     uniqueTeamMembersMap.set(member.employeeId, member);
//                 }
//             });

//             // Convert the Map values back to an array
//             const deduplicatedMetrics = Array.from(uniqueTeamMembersMap.values());
//             // --- END NEW DEDUPLICATION LOGIC ---


//             // Update performance stats for the current employee
//             if (currentEmployeeMetrics) {
//                 setPerformanceStats({
//                     ordersHandled: currentEmployeeMetrics.ordersHandled || 0,
//                     averageProcessingTime: currentEmployeeMetrics.averageOrderProcessingTimeSeconds || 0,
//                     breakDuration: `${currentEmployeeMetrics.breakDurationMinutes || 0}m`,
//                 });
//             } else {
//                 // Reset if no performance data found for current employee (e.g., brand new employee)
//                 setPerformanceStats({ ordersHandled: 0, averageProcessingTime: 0, breakDuration: '0m' });
//             }

//             // Map the deduplicated metrics to local CashierTeamMember array
//             const mappedTeamMembers: CashierTeamMember[] = deduplicatedMetrics
//                 .map(member => ({
//                     id: member.employeeId,
//                     name: member.employeeName,
//                     role: member.employeeRole,
//                     // Determine isActive based on login duration or current break status
//                     isActive: (member.loginDurationMinutes || 0) > 0 || (member.breakDurationMinutes || 0) > 0,
//                     ordersToday: member.ordersHandled || 0,
//                     breakDuration: member.breakDurationMinutes || 0,
//                     currentStatus: member.breakDurationMinutes > 0 ? 'on_break' : (member.loginDurationMinutes > 0 ? 'available' : 'offline'),
//                 }));
//             setTeamMembers(mappedTeamMembers);

//         } catch (err) {
//             setError('Failed to load performance data');
//             console.error('Performance data fetch error:', err);
//         }
//     };


//     /**
//      * Fetches initial data including products and performance metrics.
//      */
//     const fetchInitialData = async () => {
//         try {
//             setLoading(true);
//             const productsData = await getProducts();
//             setProducts(productsData);

//             await fetchPerformanceData(); // Call the new performance fetcher

//         } catch (err) {
//             setError('Failed to load initial data');
//             console.error('Initial data fetch error:', err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Effect to fetch initial data when the employee ID becomes available
//     useEffect(() => {
//         if (employee?.id) {
//             fetchInitialData();
//         }
//     }, [employee?.id]);

//     /**
//      * Handles the submission of a new order.
//      * @param values Form values from the AddOrderModal.
//      * @param orderItems Items included in the order.
//      */
//     const handleSubmitOrder = async (values: FormValues, orderItems: OrderItem[]) => {
//         try {
//             if (!employee?.id) {
//                 throw new Error('Employee not authenticated');
//             }

//             const orderRequestData: CreateOrderRequest = {
//                 created_by: employee.id,
//                 store_id: 1, // Assuming a fixed store ID for now
//                 orderData: {
//                     customer_id: values.customerId || null,
//                     name: values.customerName,
//                     phone: values.customerPhone,
//                     order_type: values.orderType,
//                     order_source: values.orderSource,
//                     subtotal: orderItems.reduce((sum, item) => sum + (item.total_price || 0), 0),
//                     discount_amount: values.discountAmount || 0,
//                     total_amount: orderItems.reduce((sum, item) => sum + (item.total_price || 0), 0) - (values.discountAmount || 0),
//                     address: values.address || null,
//                     deliverer: values.deliverer || null,
//                     notes: values.notes || '',
//                     payment_status: values.paymentStatus || 'pending',
//                     prepared_by: values.preparedBy || null, // Ensure null if undefined
//                 },
//                 items: orderItems.map(item => ({
//                     product_id: item.product_id,
//                     variant_id: item.variant_id,
//                     quantity: item.quantity,
//                     unit_price: item.unit_price,
//                     total_price: item.total_price,
//                     discount_amount: item.discount_amount || 0
//                 }))
//             };

//             console.log('Submitting order:', orderRequestData);

//             await createOrder(orderRequestData);
//             console.log('Order created successfully');

//             // Refresh orders list and performance stats after a successful order
//             await handleLoadOrders();
//             await fetchPerformanceData(); // Refresh performance stats for accuracy

//             setCurrentOrder(null); // Clear current order form
//             Alert.alert('Success', 'Order created successfully');
//             setModalVisible(null); // Close the add order modal
//         } catch (err) {
//             console.error('Order creation error:', err);
//             setError(err instanceof Error ? err.message : 'Failed to create order');
//         }
//     };

//     /**
//      * Loads the list of all orders from the backend.
//      */
//     const handleLoadOrders = async () => {
//         try {
//             setLocalLoading(true);
//             const { orders: fetchedOrders, total } = await getOrders({});

//             console.log('Fetched orders:', fetchedOrders);
//             console.log('Total orders:', total);

//             setOrders(fetchedOrders);
//             setTotalOrders(total);
//         } catch (error) {
//             console.error('Failed to load orders:', error);
//             Alert.alert('Error', 'Failed to load orders. Please try again.');
//         } finally {
//             setLocalLoading(false);
//         }
//     };

//      /**
//      * Handles the cancellation of an order.
//      * @param orderId The ID of the order to cancel.
//      */
//     const handleCancelOrder = async (orderId: string) => {
//         setLocalLoading(true); // Indicate loading while canceling
//         try {
//             const canceledOrder = await cancelOrder(orderId);
//             Alert.alert('Success', `Order ${orderId} has been canceled.`);
//             await handleLoadOrders(); // Refresh the order list to show the updated status
//             await fetchPerformanceData(); // Also refresh performance as cancellation is an activity
//         } catch (error) {
//             console.error('Order cancellation failed:', error);
//             Alert.alert('Error', error instanceof Error ? error.message : 'Failed to cancel order.');
//         } finally {
//             setLocalLoading(false);
//         }
//     };

//     /**
//      * Handles the user logout process.
//      */
//     const handleLogout = () => {
//         Alert.alert(
//             'Confirm Logout',
//             'Are you sure you want to logout?',
//             [
//                 { text: 'Cancel', style: 'cancel' },
//                 {
//                     text: 'Logout',
//                     onPress: async () => {
//                         setLocalLoading(true);
//                         try {
//                             await logout();
//                         } catch (error) {
//                             Alert.alert('Error', 'Failed to logout');
//                         } finally {
//                             setLocalLoading(false);
//                         }
//                     }
//                 }
//             ]
//         );
//     };

//     /**
//      * Toggles the employee's break status and refreshes performance data.
//      */
//     const handleToggleBreak = async () => {
//         setLocalLoading(true);
//         try {
//             await toggleBreak();
//             await fetchPerformanceData(); // Refresh team performance after toggling break
//         } catch (error) {
//             Alert.alert('Error', 'Failed to update break status');
//         } finally {
//             setLocalLoading(false);
//         }
//     };

//     /**
//      * Closes all active modals.
//      */
//     const closeAllModals = () => {
//         setModalVisible(null);
//     };

//     // Show loading indicator while initial data is being fetched or authentication is in progress
//     if (loading || authLoading) {
//         return (
//             <SafeAreaView style={styles.safeArea}>
//                 <View style={styles.loadingContainer}>
//                     <ActivityIndicator size="large" color={theme.colors.primary} />
//                 </View>
//             </SafeAreaView>
//         );
//     }

//     return (
//         <SafeAreaView style={styles.safeArea}>
//             <ScrollView style={styles.container}>
//                 {/* User Status Bar */}
//                 <View style={styles.userContainer}>
//                     <View style={styles.userInfo}>
//                                             <Avatar.Text
//                                                 size={40}
//                                                 label={userName.split(' ').map((n) => n[0]).join('')}
//                                                 style={{ backgroundColor: theme.colors.primary }}
//                                             />
//                                             <View style={styles.userText}>
//                                                 <Text style={styles.userName}>{userName}</Text>
//                                                 <Text style={styles.userRole}>{userRole}</Text>
//                                                 {/* Status dot based on onBreak state from AuthContext */}
//                                                 <View style={[styles.statusDot, { backgroundColor: !onBreak ? '#4CAF50' : '#F44336' }]} />
//                                             </View>
//                                         </View>
//                     <View style={styles.actions}>
//                         <Button
//                             mode="outlined"
//                             onPress={handleToggleBreak}
//                             loading={localLoading}
//                             disabled={authLoading || localLoading}
//                             labelStyle={{
//                                 color: onBreak ? theme.colors.danger : theme.colors.primary
//                             }}
//                         >
//                             {onBreak ? 'End Break' : 'Take Break'}
//                         </Button>
//                         <Button
//                             mode="contained"
//                             onPress={handleLogout}
//                             loading={localLoading}
//                             disabled={authLoading || localLoading}
//                             labelStyle={{ color: 'white' }}
//                             style={{ backgroundColor: theme.colors.primary }}
//                         >
//                             Logout
//                         </Button>
//                     </View>
//                 </View>

//                 {/* Performance Stats */}
//                 <View style={styles.statsContainer}>
//                     <View style={styles.statItem}>
//                         <View style={{ flexDirection: 'column', gap: 10, alignItems: 'center' }}>
//                             <Icon name="clipboard-list" size={24} color={theme.colors.primary} />
//                             <Text style={styles.statValue}> {performanceStats.ordersHandled}</Text>
//                         </View>
//                         <Text style={styles.statLabel}>Today's Orders</Text>
//                     </View>
//                     <View style={styles.statItem}>
//                         <View style={{ flexDirection: 'column', gap: 10, alignItems: 'center' }}>
//                             <Icon name="clock-outline" size={24} color={theme.colors.primary} />
//                             <Text style={styles.statValue}> {performanceStats.averageProcessingTime}s</Text>
//                         </View>
//                         <Text style={styles.statLabel}>Avg Time</Text>
//                     </View>
//                     <View style={styles.statItem}>
//                         <View style={{ flexDirection: 'column', gap: 10, alignItems: 'center' }}>
//                             <Icon name="coffee" size={24} color={theme.colors.primary} />
//                             <Text style={styles.statValue}> {performanceStats.breakDuration}</Text>
//                         </View>
//                         <Text style={styles.statLabel}>Break Time</Text>
//                     </View>
//                 </View>

//                 {/* Team Members Section */}
//                 {teamMembers.length > 0 && (
//                     <View style={styles.teamSection}>
//                         <Text style={styles.sectionTitle}>
//                             Cashier Team ({teamMembers.filter(m => m.currentStatus !== 'offline').length}/{teamMembers.length} active)
//                         </Text>
//                         <Divider style={styles.divider} />
//                         {teamMembers.map((member) => (
//                             <View key={member.id} style={styles.teamMember}>
//                                 <View style={styles.memberInfo}>
//                                     <View style={styles.memberStatus}>
//                                         <View style={[
//                                             styles.memberDot,
//                                             {
//                                                 backgroundColor: member.currentStatus === 'on_break' ? '#FFA000' :
//                                                                  member.currentStatus === 'available' ? '#4CAF50' :
//                                                                  '#F44336' // Offline
//                                             }
//                                         ]}>
//                                             <Text style={{ fontSize: 0 }}> </Text>
//                                         </View>
//                                         <Text style={styles.memberName}>{member.name}</Text>
//                                     </View>
//                                     <Text style={styles.memberRole}>{member.role}</Text>
//                                 </View>
//                                 <View style={styles.memberStats}>
//                                     <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                                         <Icon name="clipboard-list" size={14} color="#666" />
//                                         <Text style={styles.memberStat}> {member.ordersToday}</Text>
//                                     </View>
//                                     <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                                         <Icon name="coffee" size={14} color="#666" />
//                                         <Text style={styles.memberStat}> {member.breakDuration}m</Text>
//                                     </View>
//                                 </View>
//                             </View>
//                         ))}
//                     </View>
//                 )}

//                 {onBreak && (
//                     <Text style={[styles.breakText, { color: theme.colors.danger }]}>
//                         You are currently on break - order processing paused
//                     </Text>
//                 )}

//                 <View style={styles.buttonGroup}>
//                     <Button
//                         mode="contained"
//                         onPress={() => {
//                             if (!onBreak) setModalVisible('add');
//                         }}
//                         disabled={onBreak}
//                         labelStyle={{ color: '#fff' }}
//                         style={[styles.button, { backgroundColor: theme.colors.primary }]}
//                         icon="plus-circle-outline"
//                     >
//                         Add Orders
//                     </Button>

//                     <Button
//                         mode="outlined"
//                         onPress={() => {
//                             if (!onBreak) {
//                                 handleLoadOrders(); // Ensure orders are fresh before opening modal
//                                 setModalVisible('all');
//                             }
//                         }}
//                         disabled={onBreak}
//                         style={[styles.button, { backgroundColor: '#ffffff' }]}
//                         labelStyle={{ color: theme.colors.primary }}
//                         icon="format-list-bulleted"
//                     >
//                         All Orders
//                     </Button>
//                 </View>

//                 {currentOrder && (
//                     <View style={styles.currentOrderContainer}>
//                         <OrderSummary
//                             values={currentOrder.values}
//                             orderItems={currentOrder.items}
//                             onAddProduct={() => setModalVisible('add')}
//                             onRemoveProduct={(id) => {
//                                 setCurrentOrder({
//                                     ...currentOrder,
//                                     items: currentOrder.items.filter(item => item.id !== id)
//                                 });
//                             }}
//                             onUpdateQuantity={(id, quantity) => {
//                                 setCurrentOrder({
//                                     ...currentOrder,
//                                     items: currentOrder.items.map(item =>
//                                         item.id === id
//                                             ? { ...item, quantity, total_price: item.unit_price * quantity }
//                                             : item
//                                     )
//                                 });
//                             }}
//                             onEditProduct={(item) => {
//                                 // Handle edit product logic if needed, e.g., open a modal to edit item details
//                             }}
//                         />
//                     </View>
//                 )}

//                 <AddOrderModal
//                     visible={modalVisible === 'add' && !onBreak}
//                     onClose={closeAllModals}
//                     onSubmit={handleSubmitOrder}
//                     products={products}
//                 />

//                 <AllOrdersModal
//                     visible={modalVisible === 'all'}
//                     onClose={closeAllModals}
//                     orders={Array.isArray(orders) ? orders : []}
//                     totalOrders={totalOrders}
//                     onPrint={(orderId: string) => {
//                         Alert.alert('Print Order', `Implement printing for Order ID: ${orderId}`);
//                     }}
//                     onCancel={handleCancelOrder}
//                 /> 

//                 <Snackbar
//                     visible={!!error}
//                     onDismiss={() => setError(null)}
//                     action={{
//                         label: 'Dismiss',
//                         onPress: () => setError(null),
//                     }}
//                     style={{ backgroundColor: theme.colors.danger }}
//                 >
//                     {error}
//                 </Snackbar>
//             </ScrollView>
//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     safeArea: {
//         flex: 1,
//     },
//     container: {
//         flex: 1,
//         padding: 16,
//     },
//     userContainer: {
//         flex: 1,
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 20,
//         paddingBottom: 10,
//         borderBottomWidth: 1,
//         borderBottomColor: '#e0e0e0',
//     },
//     userInfo: {

//         flexDirection: 'row',
//         alignItems: 'flex-start',
//         justifyContent: 'flex-start'
//     },
//     userText: {
//         marginLeft: 10,
//     },
//     userName: {
//         fontWeight: 'bold',
//         fontSize: 16,
//         color: '#666',
//     },
//     userRole: {
//         fontSize: 14,
//         color: '#666',
//     },
//     statusDot: {
//         width: 12,
//         height: 12,
//         borderRadius: 6,
//         marginLeft: 10,
//     },
//     actions: {
//         flexDirection: 'column',
//         gap: 4,
//     },
//     button: {
//         marginTop: 16,
//     },
//     breakText: {
//         textAlign: 'center',
//         color: '#FF9800',
//         marginTop: 16,
//         fontStyle: 'italic',
//     },
//     statsContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-around',
//         marginVertical: 16,
//         padding: 16,
//         backgroundColor: '#fff',
//         borderRadius: 8,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.2,
//         shadowRadius: 2,
//         elevation: 2,
//     },
//     statItem: {
//         alignItems: 'center',
//         justifyContent: 'center',
//         flexShrink: 1,
//     },
//     statValueContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     statValue: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginLeft: 4,
//         textAlign: 'center',
//         color: '#666',
//     },
//     statLabel: {
//         fontSize: 12,
//         color: '#666',
//         marginTop: 4,
//         textAlign: 'center',
//     },
//     teamSection: {
//         marginTop: 16,
//         backgroundColor: '#fff',
//         borderRadius: 8,
//         padding: 16,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.2,
//         shadowRadius: 2,
//         elevation: 2,
//     },
//     sectionTitle: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         marginBottom: 8,
//         color: '#666',
//     },
//     divider: {
//         marginVertical: 8,
//         backgroundColor: '#e0e0e0',
//     },
//     teamMember: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingVertical: 8,
//         color: '#666',
//     },
//     memberInfo: {
//         flex: 1,

//     },
//     memberStatus: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     memberDot: {
//         width: 10,
//         height: 10,
//         borderRadius: 5,
//         marginRight: 8,
//     },
//     memberName: {
//         fontWeight: '500',
//         color: '#666',
//     },
//     memberRole: {
//         fontSize: 12,
//         color: '#666',
//         marginTop: 2,
//     },
//     memberStats: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 12,
//     },
//     memberStat: {
//         fontSize: 12,
//         color: '#666',
//         marginLeft: 4,
//     },
//     loadingContainer: {
//         padding: 16,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     buttonGroup: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginVertical: 16,
//     },
//     currentOrderContainer: {
//         marginTop: 20,
//         backgroundColor: '#fff',
//         borderRadius: 8,
//         padding: 16,
//         elevation: 2,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.1,
//         shadowRadius: 3,
//         borderWidth: 1,
//         borderColor: '#ffffff',
//     },
// });

// export default CashierScreen;



// cashier/index.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Alert, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Button, Text, Avatar, Snackbar, Divider } from 'react-native-paper';
import AddOrderModal from '@/components/cashier/AddOrdersModal';
import OrderSummary from '@/components/cashier/OrderSummary';
import AllOrdersModal from '@/components/cashier/AllOrdersModal';
import {
    getProducts,
    createOrder,
    getOrders,
    getEmployeePerformanceAll,
    getEmployeePerformanceById,
    cancelOrder,
    EmployeePerformanceMetrics
} from '@/services/api';
import {
    FormValues,
    OrderItem,
    Product,
    Order,
    CreateOrderRequest
} from '@/types/cashierTypes';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '@/constants/theme';

// Define local types to map from EmployeePerformanceMetrics for component state
interface CashierPerformanceStats {
    ordersHandled: number;
    averageProcessingTime: number; // In seconds as received from backend
    breakDuration: string; // Display format, e.g., "60m"
}

interface CashierTeamMember {
    id: string;
    name: string;
    role: string;
    isActive: boolean;
    ordersToday: number;
    breakDuration: number; // In minutes, for calculation
    currentStatus: 'available' | 'on_break' | 'offline'; // Simplified status
}

const CashierScreen: React.FC = () => {
    const { user: employee, loading: authLoading, onBreak, logout, toggleBreak } = useAuth();
    const userName = employee?.name || 'Unknown';
    const userRole = employee?.role || 'Employee';
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
    const [totalOrders, setTotalOrders] = useState<number>(0);
    const [teamMembers, setTeamMembers] = useState<CashierTeamMember[]>([]);
    const [performanceStats, setPerformanceStats] = useState<CashierPerformanceStats>({
        ordersHandled: 0,
        averageProcessingTime: 0,
        breakDuration: '0m',
    });

    /**
     * Fetches and updates the performance data for the current employee and the cashier team.
     */
    const fetchPerformanceData = async () => {
        if (!employee?.id) {
            console.warn('Employee ID not available for fetching performance data.');
            return;
        }

        try {
            // Fetch performance for the current employee
            const currentEmployeeMetrics: EmployeePerformanceMetrics | null = await getEmployeePerformanceById(employee.id);

            // Fetch performance for all cashier team members
            const allCashierMetrics: EmployeePerformanceMetrics[] = await getEmployeePerformanceAll('cashier');

            console.log('Raw API response:', allCashierMetrics);

            // --- NEW DEDUPLICATION LOGIC ---
            // Use a Map to store the most recent performance record for each unique employeeId
            const uniqueTeamMembersMap = new Map<string, EmployeePerformanceMetrics>();

            allCashierMetrics.forEach(member => {
                const existing = uniqueTeamMembersMap.get(member.employeeId);
                // If no entry exists, or if the current member's lastActivityAt is more recent,
                // store or update the entry in the map.
                if (!existing || (member.lastActivityAt && existing.lastActivityAt && new Date(member.lastActivityAt) > new Date(existing.lastActivityAt))) {
                    uniqueTeamMembersMap.set(member.employeeId, member);
                }
            });

            // Convert the Map values back to an array
            const deduplicatedMetrics = Array.from(uniqueTeamMembersMap.values());
            // --- END NEW DEDUPLICATION LOGIC ---


            // Update performance stats for the current employee
            if (currentEmployeeMetrics) {
                setPerformanceStats({
                    ordersHandled: currentEmployeeMetrics.ordersHandled || 0,
                    averageProcessingTime: currentEmployeeMetrics.averageOrderProcessingTimeSeconds || 0,
                    breakDuration: `${currentEmployeeMetrics.breakDurationMinutes || 0}m`,
                });
            } else {
                // Reset if no performance data found for current employee (e.g., brand new employee)
                setPerformanceStats({ ordersHandled: 0, averageProcessingTime: 0, breakDuration: '0m' });
            }

            // Map the deduplicated metrics to local CashierTeamMember array
            const mappedTeamMembers: CashierTeamMember[] = deduplicatedMetrics
                .map(member => ({
                    id: member.employeeId,
                    name: member.employeeName,
                    role: member.employeeRole,
                    // Determine isActive based on login duration or current break status
                    isActive: (member.loginDurationMinutes || 0) > 0 || (member.breakDurationMinutes || 0) > 0,
                    ordersToday: member.ordersHandled || 0,
                    breakDuration: member.breakDurationMinutes || 0,
                    currentStatus: member.breakDurationMinutes > 0 ? 'on_break' : (member.loginDurationMinutes > 0 ? 'available' : 'offline'),
                }));
            setTeamMembers(mappedTeamMembers);

        } catch (err) {
            setError('Failed to load performance data');
            console.error('Performance data fetch error:', err);
        }
    };


    /**
     * Fetches initial data including products and performance metrics.
     */
    const fetchInitialData = useCallback(async () => {
        try {
            setLoading(true);
            const productsData = await getProducts();
            setProducts(productsData);

            await fetchPerformanceData(); // Call the new performance fetcher

        } catch (err) {
            setError('Failed to load initial data');
            console.error('Initial data fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, [employee?.id]);

    // Effect to fetch initial data when the employee ID becomes available
    useEffect(() => {
        if (employee?.id) {
            fetchInitialData();
        }
    }, [employee?.id, fetchInitialData]);

    /**
     * Handles the submission of a new order.
     * @param values Form values from the AddOrderModal.
     * @param orderItems Items included in the order.
     */
    const handleSubmitOrder = async (values: FormValues, orderItems: OrderItem[]) => {
        try {
            if (!employee?.id) {
                throw new Error('Employee not authenticated');
            }

            const orderRequestData: CreateOrderRequest = {
                created_by: employee.id,
                store_id: 1, // Assuming a fixed store ID for now
                orderData: {
                    customer_id: values.customerId || null,
                    name: values.customerName,
                    phone: values.customerPhone,
                    order_type: values.orderType,
                    order_source: values.orderSource,
                    subtotal: orderItems.reduce((sum, item) => sum + (item.total_price || 0), 0),
                    discount_amount: values.discountAmount || 0,
                    total_amount: orderItems.reduce((sum, item) => sum + (item.total_price || 0), 0) - (values.discountAmount || 0),
                    address: values.address || null,
                    deliverer: values.deliverer || null,
                    notes: values.notes || '',
                    payment_status: values.paymentStatus || 'pending',
                    prepared_by: values.preparedBy || null, // Ensure null if undefined
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

            console.log('Submitting order:', orderRequestData);

            await createOrder(orderRequestData);
            console.log('Order created successfully');

            // Refresh orders list and performance stats after a successful order
            await handleLoadOrders();
            await fetchPerformanceData(); // Refresh performance stats for accuracy

            setCurrentOrder(null); // Clear current order form
            Alert.alert('Success', 'Order created successfully');
            setModalVisible(null); // Close the add order modal
        } catch (err) {
            console.error('Order creation error:', err);
            setError(err instanceof Error ? err.message : 'Failed to create order');
        }
    };

    /**
     * Loads the list of all orders from the backend.
     */
    const handleLoadOrders = useCallback(async () => {
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
    }, []);

    // Initial load for AllOrdersModal if it's opened first
    useEffect(() => {
        if (modalVisible === 'all' && orders.length === 0 && !localLoading) {
            handleLoadOrders();
        }
    }, [modalVisible, orders.length, localLoading, handleLoadOrders]);

    /**
     * Handles the cancellation of an order.
     * @param orderId The ID of the order to cancel.
     */
    const handleCancelOrder = async (orderId: string) => {
        setLocalLoading(true); // Indicate loading while canceling
        try {
            await cancelOrder(orderId); // No need to capture the response if it just indicates success
            Alert.alert('Success', `Order #${orderId} has been cancelled.`); // Corrected string and variable
            await handleLoadOrders(); // Refresh the order list to show the updated status
            await fetchPerformanceData(); // Also refresh performance as cancellation is an activity
        } catch (error) {
            console.error('Order cancellation failed:', error);
            Alert.alert('Error', error instanceof Error ? error.message : 'Failed to cancel order.');
        } finally {
            setLocalLoading(false);
        }
    };


    /**
     * Handles the user logout process.
     */
    const handleLogout = () => {
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

    /**
     * Toggles the employee's break status and refreshes performance data.
     */
    const handleToggleBreak = async () => {
        setLocalLoading(true);
        try {
            await toggleBreak();
            await fetchPerformanceData(); // Refresh team performance after toggling break
        } catch (error) {
            Alert.alert('Error', 'Failed to update break status');
        } finally {
            setLocalLoading(false);
        }
    };

    /**
     * Closes all active modals.
     */
    const closeAllModals = () => {
        setModalVisible(null);
    };

    // Show loading indicator while initial data is being fetched or authentication is in progress
    if (loading || authLoading) {
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
                            label={userName.split(' ').map((n) => n[0]).join('')}
                            style={{ backgroundColor: theme.colors.primary }}
                    />
                    <View style={styles.userText}>
                            <Text style={styles.userName}>{userName}</Text>
                            <Text style={styles.userRole}>{userRole}</Text>
                            {/* Status dot based on onBreak state from AuthContext */}
                            <View style={[styles.statusDot, { backgroundColor: !onBreak ? '#4CAF50' : '#F44336' }]} />
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
                            <Text style={styles.statValue}> {performanceStats.averageProcessingTime}s</Text>
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
                            Cashier Team ({teamMembers.filter(m => m.currentStatus !== 'offline').length}/{teamMembers.length} active)
                        </Text>
                        <Divider style={styles.divider} />
                        {teamMembers.map((member) => (
                            <View key={member.id} style={styles.teamMember}>
                                <View style={styles.memberInfo}>
                                    <View style={styles.memberStatus}>
                                        <View style={[
                                            styles.memberDot,
                                            {
                                                backgroundColor: member.currentStatus === 'on_break' ? '#FFA000' :
                                                    member.currentStatus === 'available' ? '#4CAF50' :
                                                    '#F44336' // Offline
                                            }
                                        ]}>
                                            <Text style={{ fontSize: 0 }}> </Text>
                                        </View>
                                        <Text style={styles.memberName}>{member.name}</Text>
                                    </View>
                                    <Text style={styles.memberRole}>{member.role}</Text>
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
                />

                <AllOrdersModal
                    visible={modalVisible === 'all'}
                    onClose={closeAllModals}
                    orders={Array.isArray(orders) ? orders : []}
                    totalOrders={totalOrders}
                    onPrint={(orderId: string) => {
                        Alert.alert('Print Order', `Implement printing for Order ID: ${orderId}`);
                    }}
                    onCancel={handleCancelOrder}
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
        backgroundColor: theme.colors.background,
    },
    container: {
        flex: 1,
        padding: theme.spacing.md,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    },
    userContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        marginBottom: theme.spacing.lg,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userText: {
        marginLeft: theme.spacing.sm,
        flexDirection: 'column',
    },
    userName: {
        fontSize: theme.typography.fontSize.lg,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.text,
    },
    userRole: {
        fontSize: theme.typography.fontSize.md,
        color: theme.colors.textSecondary,
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: theme.colors.background, // Border to stand out on top of avatar background
    },
    actions: {
        flexDirection: 'column',
        gap: theme.spacing.sm, // Spacing between buttons
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: theme.colors.cardBackground,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.lg,
        ...theme.shadows.md,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: theme.typography.fontSize.xl,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.text,
    },
    statLabel: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.xs,
    },
    teamSection: {
        backgroundColor: theme.colors.cardBackground,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.lg,
        ...theme.shadows.md,
    },
    sectionTitle: {
        fontSize: theme.typography.fontSize.lg,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
    },
    divider: {
        backgroundColor: theme.colors.border,
        marginBottom: theme.spacing.md,
    },
    teamMember: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.borderLight,
    },
    memberInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    memberStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: theme.spacing.sm,
    },
    memberDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: theme.spacing.xs,
    },
    memberName: {
        fontSize: theme.typography.fontSize.md,
        fontWeight: theme.typography.fontWeight.semibold,
        color: theme.colors.text,
    },
    memberRole: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.textSecondary,
        marginLeft: theme.spacing.xs,
    },
    memberStats: {
        flexDirection: 'row',
        gap: theme.spacing.md,
    },
    memberStat: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.textSecondary,
    },
    breakText: {
        textAlign: 'center',
        fontSize: theme.typography.fontSize.md,
        fontWeight: theme.typography.fontWeight.semibold,
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.lg,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: theme.spacing.lg,
    },
    button: {
        flex: 1,
        marginHorizontal: theme.spacing.xs,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.xl,
    },
    currentOrderContainer: {
        marginTop: theme.spacing.lg,
        marginBottom: theme.spacing.xl,
        backgroundColor: theme.colors.cardBackground,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        ...theme.shadows.md,
    },
});

export default CashierScreen;
