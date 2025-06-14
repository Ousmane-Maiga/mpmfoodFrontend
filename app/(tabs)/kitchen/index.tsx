// kitchen/index.tsx
import React, { useState, useEffect } from 'react';
import { View, Alert, StyleSheet, ScrollView, ActivityIndicator } from 'react-native'; // Added ActivityIndicator
import { useAuth } from '@/contexts/AuthContext';
import { Button, Text, Avatar, Divider } from 'react-native-paper';
import KitchenModal from '@/components/kitchen/KitchenModal';
import { Order, OrderStatus } from '@/types/cashierTypes';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { TabParamList } from '@/app/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@/constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
    setupOrderUpdates,
    getKitchenOrders,
    updateKitchenOrderStatus,
    getEmployeePerformanceById,
    getEmployeePerformanceAll,
    EmployeePerformanceMetrics
} from '@/services/api';

type KitchenRouteProp = RouteProp<TabParamList, 'kitchen'>;

// Define local types to map from EmployeePerformanceMetrics for component state
interface KitchenPerformanceStats {
    itemsPrepared: number;
    avgPrepTime: number; // In seconds as received from backend, will be displayed in minutes
    breakDuration: number; // In minutes
}

interface KitchenTeamMember {
    id: string;
    name: string;
    role: string;
    isActive: boolean; // Derived from backend's login status
    itemsPreparedToday: number;
    breakDuration: number; // In minutes
    currentStatus: 'available' | 'on_break' | 'offline';
}

export default function KitchenScreen() {
    const route = useRoute<KitchenRouteProp>();
    const { user: employee, loading: authLoading, onBreak, logout, toggleBreak } = useAuth();
    const userName = employee?.name || 'Unknown';
    const userRole = employee?.role || 'Employee';

    const [showKitchen, setShowKitchen] = useState(false);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false); // Used for general loading states (orders, initial data)

    const navigation = useNavigation();

    const [localLoading, setLocalLoading] = useState(false); // For local button/action loading states
    const [performance, setPerformance] = useState<KitchenPerformanceStats | null>(null);
    const [teamMembers, setTeamMembers] = useState<KitchenTeamMember[]>([]);
    const [performanceLoading, setPerformanceLoading] = useState(false); // For performance specific loading

    /**
     * Fetches current orders for the kitchen view.
     */
    const fetchOrders = async () => {
        try {
            setLoading(true); // Set general loading for orders
            const fetchedOrders = await getKitchenOrders();

            if (!Array.isArray(fetchedOrders)) {
                throw new Error('Invalid orders data received');
            }

            // Ensure order items have necessary fallback values for display
            const validatedOrders = fetchedOrders.map(order => ({
                ...order,
                order_items: order.order_items?.map(item => ({
                    ...item,
                    product: item.product || 'Unknown Product',
                    variant: item.variant || 'Unknown Variant',
                    product_id: item.product_id || 0, // Ensure numeric ID
                    variant_id: item.variant_id || 0, // Ensure numeric ID
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
            setLoading(false); // Reset general loading
        }
    };

    /**
     * Fetches and updates the performance data for the current employee and the kitchen team.
     */
    const fetchPerformance = async () => {
        if (!employee?.id) {
            console.warn('Employee ID is not available for fetching performance.');
            setPerformance(null);
            setTeamMembers([]);
            return;
        }
        try {
            setPerformanceLoading(true);

            // Fetch performance for the current kitchen employee
            const currentEmployeeMetrics: EmployeePerformanceMetrics | null = await getEmployeePerformanceById(employee.id);

            // Fetch performance for all kitchen team members
            const allKitchenMetrics: EmployeePerformanceMetrics[] = await getEmployeePerformanceAll('kitchen');
            
            // DEBUG: Log the raw API response
            console.log('Raw API response:', allKitchenMetrics);

            // --- NEW DEDUPLICATION LOGIC ---
            // Use a Map to store the most recent performance record for each unique employeeId
            const uniqueTeamMembersMap = new Map<string, EmployeePerformanceMetrics>();

            allKitchenMetrics.forEach(member => {
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
                setPerformance({
                    itemsPrepared: currentEmployeeMetrics.itemsPrepared || 0,
                    avgPrepTime: currentEmployeeMetrics.averageItemPreparationTimeSeconds || 0, // In seconds
                    breakDuration: currentEmployeeMetrics.breakDurationMinutes || 0,
                });
            } else {
                // Reset if no performance data found for current employee
                setPerformance({ itemsPrepared: 0, avgPrepTime: 0, breakDuration: 0 });
            }

            // Map the deduplicated metrics to local KitchenTeamMember array
           const mappedTeamMembers: KitchenTeamMember[] = allKitchenMetrics // Use allKitchenMetrics directly if confident in backend's single-day aggregate
                .map(member => ({
                    id: member.employeeId,
                    name: member.employeeName,
                    role: member.employeeRole,
                    isActive: (member.loginDurationMinutes || 0) > 0 || (member.breakDurationMinutes || 0) > 0,
                    itemsPreparedToday: member.itemsPrepared || 0,
                    breakDuration: member.breakDurationMinutes || 0,
                    currentStatus: (member.breakDurationMinutes || 0) > 0 ? 'on_break' :
                                   ((member.loginDurationMinutes || 0) > 0 ? 'available' : 'offline'),
                }));
            setTeamMembers(mappedTeamMembers);

        } catch (error) {
            console.error('Failed to fetch performance:', error);
            Alert.alert('Error', 'Failed to fetch performance data.');
            setPerformance(null);
            setTeamMembers([]);
        } finally {
            setPerformanceLoading(false);
        }
    };

    // Initial data fetch and WebSocket setup
    useEffect(() => {
        if (employee?.id) {
            fetchOrders();
            fetchPerformance();

            const cleanup = setupOrderUpdates((updatedOrder) => {
                console.log('Order update received via WebSocket:', updatedOrder);
                setOrders(prev => {
                    const orderExists = prev.some(o => o.id === updatedOrder.id);
                    if (orderExists) {
                        return prev.map(o => o.id === updatedOrder.id ? updatedOrder : o);
                    } else {
                        // Only add if it's a pending/in_progress/ready order
                        if (['pending', 'in_progress', 'ready'].includes(updatedOrder.status)) {
                             return [updatedOrder, ...prev];
                        }
                        return prev; // If status is not relevant for kitchen, don't add
                    }
                });
                // Re-fetch performance if an order completion comes via WebSocket
                if (updatedOrder.status === 'completed') {
                    fetchPerformance();
                }
            });

            return cleanup; // Cleanup WebSocket on component unmount
        }
    }, [employee?.id]); // Depend on employee.id for initial fetches and WebSocket setup

    // This effect is likely redundant if the main useEffect already handles it
    // useEffect(() => {
    //     if (showKitchen) {
    //         fetchOrders();
    //         fetchPerformance();
    //     }
    // }, [showKitchen]);

    /**
     * Handles updating an order's status.
     * @param orderId The ID of the order to update.
     * @param status The new status for the order.
     */
    const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
        let originalStatus: OrderStatus | undefined;

        console.log('handleUpdateOrderStatus called for Order ID:', orderId, 'New Status:', status);
        console.log('Current employee ID:', employee?.id);
        console.log('Current employee Name:', employee?.name);

        try {
            setLoading(true); // Set general loading for this action

            const originalOrder = orders.find(o => o.id === Number(orderId) || o.id.toString() === orderId);
            originalStatus = originalOrder?.status;

            let preparedById: string | undefined = undefined;
            let preparedByName: string | undefined = undefined;

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

            // Optimistic update to UI
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

            // Call backend API
            await updateKitchenOrderStatus(orderId, status, preparedById);

            // Re-fetch all orders to ensure consistency and remove completed orders from list if needed
            await fetchOrders();
            // Also re-fetch performance data if an order was completed
            if (status === 'completed') {
                await fetchPerformance();
            }
        } catch (error) {
            // Revert optimistic update on error
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
            setLoading(false); // Reset general loading
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
                        setLocalLoading(true); // For logout button
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

    /**
     * Toggles the employee's break status.
     * After toggling, performance data is re-fetched to reflect the change.
     */
    const handleToggleBreak = async () => {
        setLocalLoading(true); // For break button
        try {
            await toggleBreak();
            await fetchPerformance(); // Re-fetch performance to update break duration/status
        } catch (error) {
            Alert.alert('Error', 'Failed to update break status');
        } finally {
            setLocalLoading(false);
        }
    };

    // Show loading indicator while initial data is being fetched or authentication is in progress
    if (loading || authLoading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text style={{ marginTop: 10 }}>Loading kitchen data...</Text>
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
                {(performanceLoading || performance) && (
                    <View style={styles.statsContainer}>
                        {performanceLoading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="small" color={theme.colors.primary} />
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
                                        {/* Display avgPrepTime in minutes, assuming it's in seconds */}
                                        <Text style={styles.statValue}> {Math.round((performance?.avgPrepTime || 0) / 60)}m</Text>
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
                                `Kitchen Team (${teamMembers.filter(m => m.isActive).length}/${teamMembers.length} active)`}
                        </Text>
                        <Divider style={styles.divider} />
                        {performanceLoading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="small" color={theme.colors.primary} />
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
                                                    backgroundColor: member.currentStatus === 'on_break' ? '#FFA000' :
                                                                     member.currentStatus === 'available' ? '#4CAF50' :
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
                    <Text style={[styles.breakText, { color: theme.colors.danger }]}>
                        You are currently on break - kitchen updates paused
                    </Text>
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
        flex: 1, // Ensure it takes full space for centering
        // justifyContent: 'center',
    },
});
