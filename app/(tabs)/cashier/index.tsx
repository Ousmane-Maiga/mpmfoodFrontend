// import React, { useState, useEffect } from 'react';
// import { View, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
// import { Button, Snackbar } from 'react-native-paper';
// import { useAuth } from '@/contexts/AuthContext';
// import AddOrderModal from '@/components/cashier/AddOrdersModal';
// import OrderSummary from '@/components/cashier/OrderSummary';
// import AllOrdersModal from '@/components/cashier/AllOrdersModal';
// import { getProducts, createOrder, getOrders, getEmployeeDetails } from '@/services/api';
// import { FormValues, OrderItem, Product } from '@/types/cashierTypes';

// const CashierScreen: React.FC = () => {
//  const { user: employee, loading: authLoading } = useAuth();
//   const [addOrderModalVisible, setAddOrderModalVisible] = useState(false);
//   const [allOrdersModalVisible, setAllOrdersModalVisible] = useState(false);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [currentOrder, setCurrentOrder] = useState<{
//     values: FormValues;
//     items: OrderItem[];
//   } | null>(null);
//   const [orders, setOrders] = useState<any[]>([]);

//   // Fetch products on mount
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const productsData = await getProducts();
//         setProducts(productsData);
//         console.log('Employee ID type:', typeof employee?.id);
//         console.log('Employee ID value:', employee?.id);
//       } catch (err) {
//         setError('Failed to load products');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);


//   // Handle order submission
//   const handleSubmitOrder = async (values: FormValues, orderItems: OrderItem[]) => {
//   try {
//     if (!employee || !employee.id) {
//       throw new Error('Employee not authenticated');
//     }

//     const orderData = {
//       employee_id: employee.id, // Use the authenticated user's ID
//       store_id: 1, // Replace with actual store ID or get from context if available
//       orderData: {
//         customer_id: null, // Or implement customer lookup
//         order_type: values.orderType,
//         order_source: values.orderSource,
//         subtotal: orderItems.reduce((sum, item) => sum + (item.total_price || item.total), 0),
//         total_amount: orderItems.reduce((sum, item) => sum + (item.total_price || item.total), 0),
//         address: values.address || null,
//         deliverer: values.deliverer || null,
//         notes: ''
//       },
//       items: orderItems.map(item => ({
//         product_id: item.product_id,
//         variant_id: item.variant_id,
//         quantity: item.quantity,
//         unit_price: item.unit_price,
//         total_price: item.total_price,
//         discount_amount: item.discount_amount || 0
//       }))
//     };

//     const createdOrder = await createOrder(orderData);
    
//     setCurrentOrder({
//       values,
//       items: orderItems
//     });
    
//     // Refresh orders list
//     const { orders: updatedOrders } = await getOrders({});
//     setOrders(updatedOrders);
    
//     setAddOrderModalVisible(false);
//   } catch (err) {
//     setError('Failed to create order');
//     console.error(err);
//   }
// };

//   const handleLoadOrders = async () => {
//     try {
//       setLoading(true);
//       const { orders: fetchedOrders } = await getOrders({});
//       setOrders(fetchedOrders);
//       setAllOrdersModalVisible(true);
//     } catch (err) {
//       setError('Failed to load orders');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.loadingContainer}>
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" />
//       </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.loadingContainer}>
//     <View style={styles.container}>
//       <View style={styles.buttonGroup}>
//         <Button 
//           mode="contained" 
//           onPress={() => setAddOrderModalVisible(true)}
//           style={styles.button}
//           disabled={loading}
//         >
//           New Order
//         </Button>
//         <Button 
//           mode="outlined" 
//           onPress={handleLoadOrders}
//           style={styles.button}
//           disabled={loading}
//         >
//           View All Orders
//         </Button>
//       </View>

//       {currentOrder && (
//         <View style={styles.currentOrderContainer}>
//           <OrderSummary 
//             values={currentOrder.values}
//             orderItems={currentOrder.items}
//             onAddProduct={() => setAddOrderModalVisible(true)}
//             onRemoveProduct={(id) => {
//               setCurrentOrder({
//                 ...currentOrder,
//                 items: currentOrder.items.filter(item => item.id !== id)
//               });
//             }}
//             onUpdateQuantity={(id, quantity) => {
//               setCurrentOrder({
//                 ...currentOrder,
//                 items: currentOrder.items.map(item => 
//                   item.id === id 
//                     ? { ...item, quantity, total_price: item.unit_price * quantity } 
//                     : item
//                 )
//               });
//             }}
//             onEditProduct={(item) => {
//               // Handle edit product logic
//             }}
//           />
//         </View>
//       )}

//       <AddOrderModal
//         visible={addOrderModalVisible}
//         onClose={() => setAddOrderModalVisible(false)}
//         onSubmit={handleSubmitOrder}
//         products={products}
//       />

//       <AllOrdersModal
//         visible={allOrdersModalVisible}
//         onClose={() => setAllOrdersModalVisible(false)}
//         orders={orders} onPrint={function (orderId: string): void {
//           throw new Error('Function not implemented.');
//         } }      />

//       <Snackbar
//         visible={!!error}
//         onDismiss={() => setError(null)}
//         action={{
//           label: 'Dismiss',
//           onPress: () => setError(null),
//         }}
//       >
//         {error}
//       </Snackbar>
//     </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//    safeArea: {
//     flex: 1,
//     backgroundColor: 'white',
//   },
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: 'white',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     // alignItems: 'center',
//     backgroundColor: 'white',
//   },
//   buttonGroup: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 20,
//   },
//   button: {
//     marginHorizontal: 8,
//     borderColor: '#1E88E5',
//   },
//   buttonLabel: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   outlinedButtonLabel: {
//     color: '#1E88E5',
//     fontWeight: 'bold',
//   },
//   currentOrderContainer: {
//     marginTop: 20,
//     backgroundColor: 'white',
//     borderRadius: 8,
//     padding: 16,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     borderWidth: 1,
//     borderColor: '#E3F2FD',
//   },
//   snackbar: {
//     backgroundColor: '#1E88E5',
//     color: 'white',
//   },
// });

// export default CashierScreen;




import React, { useState, useEffect } from 'react';
import { View, Alert, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Button, Text, Avatar, useTheme, SegmentedButtons, Snackbar, Divider } from 'react-native-paper';
import AddOrderModal from '@/components/cashier/AddOrdersModal';
import OrderSummary from '@/components/cashier/OrderSummary';
import AllOrdersModal from '@/components/cashier/AllOrdersModal';
import { getProducts, createOrder, getOrders, getTeamPerformance } from '@/services/api';
import { 
  FormValues, 
  OrderItem, 
  Product, 
  Order,
  TeamMember,
  PerformanceStats
} from '@/types/cashierTypes';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CashierScreen: React.FC = () => {
  const { user: employee, loading: authLoading, onBreak, logout, toggleBreak } = useAuth();
  const [value, setValue] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentOrder, setCurrentOrder] = useState<{
    values: FormValues;
    items: OrderItem[];
  } | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [localLoading, setLocalLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [performanceStats, setPerformanceStats] = useState<PerformanceStats>({
    ordersHandled: 0,
    averageProcessingTime: 0,
    breakDuration: '0m',
  });

  const theme = useTheme();

  // Fetch products and team data on mount
  // In your useEffect hook, modify the team performance call:
 
  const fetchInitialData = async () => {
  try {
    const [productsData, teamData] = await Promise.all([
      getProducts(),
      getTeamPerformance(employee?.id || '')
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
    console.error(err);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  if (employee?.id) {
    fetchInitialData();
  }
}, [employee?.id]);

  const handleSubmitOrder = async (values: FormValues, orderItems: OrderItem[]) => {
    try {
      if (!employee || !employee.id) {
        throw new Error('Employee not authenticated');
      }

      const orderData = {
        employee_id: employee.id,
        store_id: 1,
        orderData: {
          customer_id: null,
          order_type: values.orderType,
          order_source: values.orderSource,
          subtotal: orderItems.reduce((sum, item) => sum + (item.total_price || item.total), 0),
          total_amount: orderItems.reduce((sum, item) => sum + (item.total_price || item.total), 0),
          address: values.address || null,
          deliverer: values.deliverer || null,
          notes: ''
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

      const createdOrder = await createOrder(orderData);
      
      setCurrentOrder({
        values,
        items: orderItems
      });
      
      const { orders: updatedOrders } = await getOrders({});
      setOrders(updatedOrders);
      
      // Update performance stats after new order
      const teamData = await getTeamPerformance(employee.id);
      setPerformanceStats({
      ordersHandled: teamData.currentEmployee.ordersHandled,
      averageProcessingTime: teamData.currentEmployee.averageProcessingTime,
      breakDuration: `${teamData.currentEmployee.breakDuration}m`,
    });
      
      setValue('');
    } catch (err) {
      setError('Failed to create order');
      console.error(err);
    }
  };

  const handleLoadOrders = async () => {
    try {
      setLoading(true);
      const { orders: fetchedOrders } = await getOrders({});
      setOrders(fetchedOrders);
    } catch (err) {
      setError('Failed to load orders');
      console.error(err);
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
      // Refresh team data after break status change
      if (employee?.id) {
        const teamData = await getTeamPerformance(employee.id);
        setTeamMembers(teamData.teamMembers);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update break status');
    } finally {
      setLocalLoading(false);
    }
  };

  const closeAllModals = () => {
    setValue('');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* User Status Bar - Fixed */}
        <View style={styles.userContainer}>
          <View style={styles.userInfo}>
            <Avatar.Text 
              size={40} 
              label={employee?.name?.split(' ').map((n) => n[0]).join('') || ''} 
              color={theme.colors.onPrimary}
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
              style={styles.actionButton}
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
              style={styles.actionButton}
              labelStyle={{ color: theme.colors.onPrimary }}
            >
              Logout
            </Button>
          </View>
        </View>

        {/* Performance Stats - Fixed */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="clipboard-list" size={24} color={theme.colors.primary} />
              <Text style={styles.statValue}> {performanceStats.ordersHandled}</Text>
            </View>
            <Text style={styles.statLabel}>Today's Orders</Text>
          </View>
          <View style={styles.statItem}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="clock-outline" size={24} color={theme.colors.primary} />
              <Text style={styles.statValue}> {performanceStats.averageProcessingTime}m</Text>
            </View>
            <Text style={styles.statLabel}>Avg Time</Text>
          </View>
          <View style={styles.statItem}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="coffee" size={24} color={theme.colors.primary} />
              <Text style={styles.statValue}> {performanceStats.breakDuration}</Text>
            </View>
            <Text style={styles.statLabel}>Break Time</Text>
          </View>
        </View>

        {/* Team Members Section - Fixed */}
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
          <Text style={[styles.breakText, { color: theme.colors.error }]}>
            You are currently on break - order processing paused
          </Text>
        )}

        <SegmentedButtons
          value={value}
          onValueChange={(newValue) => {
            setValue(newValue);
            if (newValue === 'all') {
              handleLoadOrders();
            }
          }}
          buttons={[
            {
              value: 'add',
              label: 'Add Orders',
              disabled: onBreak,
              icon: 'plus-circle-outline'
            },
            {
              value: 'all',
              label: 'All Orders',
              disabled: onBreak,
              icon: 'format-list-bulleted'
            },
          ]}
          style={styles.segmentedButtons}
        />

        {currentOrder && (
          <View style={styles.currentOrderContainer}>
            <OrderSummary 
              values={currentOrder.values}
              orderItems={currentOrder.items}
              onAddProduct={() => setValue('add')}
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
                // Handle edit product logic
              }}
            />
          </View>
        )}

        <AddOrderModal
          visible={value === 'add' && !onBreak}
          onClose={closeAllModals}
          onSubmit={handleSubmitOrder}
          products={products}
        />

        <AllOrdersModal
          visible={value === 'all'}
          onClose={closeAllModals}
          orders={orders}
          onPrint={(orderId: string) => {
            // Implement print functionality
          }}
        />

        <Snackbar
          visible={!!error}
          onDismiss={() => setError(null)}
          action={{
            label: 'Dismiss',
            onPress: () => setError(null),
          }}
          style={{ backgroundColor: theme.colors.error }}
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
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  userContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userText: {
    marginLeft: 12,
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
    gap: 8,
  },
  actionButton: {
    minWidth: 100,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    elevation: 1,
  },
  statItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  teamSection: {
    marginVertical: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  divider: {
    marginVertical: 8,
    backgroundColor: '#e0e0e0',
    height: 1,
  },
  teamMember: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  memberDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  memberName: {
    fontWeight: '500',
    fontSize: 15,
  },
  memberRole: {
    fontSize: 12,
    color: '#666',
    marginLeft: 18, // Align with name text
  },
  memberStats: {
    alignItems: 'flex-end',
  },
  memberStat: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  segmentedButtons: {
    marginBottom: 20,
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
    borderColor: '#e0e0e0',
  },
  breakText: {
    textAlign: 'center',
    marginVertical: 16,
    fontStyle: 'italic',
  },
});

export default CashierScreen;