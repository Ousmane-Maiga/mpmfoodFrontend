// // components/admin/QuickStats.tsx
// import React, { useState, useEffect, useCallback } from "react";
// import { View, StyleSheet, ActivityIndicator } from "react-native";
// import { Text } from "../ui/Text";
// import { theme } from "../../constants/theme";
// import { getOrders, getInventoryItems, getEmployees } from "../../services/api"; // Import API calls
// import { Order } from '@/types/cashierTypes'; // Import Order type
// import { InventoryItem } from '@/types/admin'; // Import InventoryItem type
// import { Employee } from '@/types/EmployeeTypes'; // Import Employee type
// import moment from "moment"; // For date calculations and formatting
// import { Button as PaperButton } from 'react-native-paper'; // For retry button

// interface Stat {
//     label: string;
//     value: string;
//     change: string | null;
//     isNegative?: boolean; // Indicates if the change is negative (for coloring)
// }

// /**
//  * QuickStats component displays a summary of key operational metrics for the admin dashboard.
//  * It fetches real-time data for sales, new orders, inventory alerts, and staff on duty,
//  * calculating relevant figures and changes over time.
//  */
// export default function QuickStats() {
//     const [stats, setStats] = useState<Stat[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     /**
//      * Fetches and calculates the latest quick statistics for the dashboard.
//      * This function combines data from orders, inventory, and employee records.
//      */
//     const fetchStats = useCallback(async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             const today = moment().startOf('day');
//             const yesterday = moment().subtract(1, 'day').startOf('day');
//             const twoHoursAgo = moment().subtract(2, 'hours');

//             // --- 1. Fetch Orders Data for Sales & New Orders ---
//             const { orders: allOrders } = await getOrders({});

//             // Filter out 'cancelled' orders for sales and new order calculations
//             const nonCancelledOrders = allOrders.filter(order => order.status !== 'cancelled');

//             const todayNonCancelledOrders = nonCancelledOrders.filter(order =>
//                 moment(order.created_at).isSameOrAfter(today)
//             );
//             const yesterdayNonCancelledOrders = nonCancelledOrders.filter(order =>
//                 moment(order.created_at).isBetween(yesterday, today, null, '[)')
//             );

//             const todaySales = todayNonCancelledOrders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
//             const yesterdaySales = yesterdayNonCancelledOrders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
//             const todayNewOrders = todayNonCancelledOrders.length;
//             const yesterdayNewOrders = yesterdayNonCancelledOrders.length;

//             // Calculate sales change percentage
//             let salesChange: string | null = null;
//             let isSalesNegative = false;
//             if (yesterdaySales > 0) {
//                 const changePercent = ((todaySales - yesterdaySales) / yesterdaySales) * 100;
//                 salesChange = `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(1)}%`;
//                 isSalesNegative = changePercent < 0;
//             } else if (todaySales > 0) {
//                 salesChange = '+100%';
//             }

//             // Calculate new orders change percentage
//             let ordersChange: string | null = null;
//             let isOrdersNegative = false;
//             if (yesterdayNewOrders > 0) {
//                 const changePercent = ((todayNewOrders - yesterdayNewOrders) / yesterdayNewOrders) * 100;
//                 ordersChange = `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(1)}%`;
//                 isOrdersNegative = changePercent < 0;
//             } else if (todayNewOrders > 0) {
//                 ordersChange = '+100%';
//             }

//             // --- Count Today's Cancelled Orders ---
//             const cancelledOrdersToday = allOrders.filter(order =>
//                 order.status === 'cancelled' && moment(order.created_at).isSameOrAfter(today)
//             ).length;

//             // --- 2. Fetch Inventory Data for Inventory Alerts ---
//             const inventoryItems = await getInventoryItems();
//             const lowStockItemsCount = inventoryItems.filter(item => item.quantity <= item.min_threshold).length;

//             // --- 3. Fetch Employee Data for Staff On Duty ---
//             const employees = await getEmployees();
//             const staffOnDutyCount = employees.filter(employee =>
//                 employee.lastActivityAt && moment(employee.lastActivityAt).isAfter(twoHoursAgo)
//             ).length;
//             const totalStaff = employees.length;

//             // Compile all fetched and calculated stats
//             const newStats: Stat[] = [
//                 { label: "Today's Sales", value: `${todaySales.toFixed(2)} FCFA`, change: salesChange, isNegative: isSalesNegative },
//                 { label: "New Orders", value: String(todayNewOrders), change: ordersChange, isNegative: isOrdersNegative },
//                 { label: "Cancelled Orders", value: String(cancelledOrdersToday), change: null, isNegative: cancelledOrdersToday > 0 }, // NEW STAT
//                 { label: "Inventory Alerts", value: String(lowStockItemsCount), change: lowStockItemsCount > 0 ? 'Urgent!' : null, isNegative: lowStockItemsCount > 0 },
//                 { label: "Staff On Duty", value: `${staffOnDutyCount}/${totalStaff}`, change: null },
//             ];
//             setStats(newStats);

//         } catch (err: any) {
//             console.error("Failed to fetch quick stats:", err);
//             setError("Failed to load dashboard data. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     // Effect to fetch data on component mount and set up periodic refresh
//     useEffect(() => {
//         fetchStats(); // Initial fetch
//         const interval = setInterval(fetchStats, 5 * 60 * 1000); // Refresh stats every 5 minutes
//         return () => clearInterval(interval); // Clear interval on unmount
//     }, [fetchStats]);

//     if (loading) {
//         return (
//             <View style={styles.loadingContainer}>
//                 <ActivityIndicator size="large" color={theme.colors.primary} />
//                 <Text style={styles.loadingText}>Loading dashboard stats...</Text>
//             </View>
//         );
//     }

//     if (error) {
//         return (
//             <View style={styles.errorContainer}>
//                 <Text style={styles.errorText}>{error}</Text>
//                 <PaperButton mode="outlined" onPress={fetchStats} labelStyle={{ color: theme.colors.primary }}>
//                     Retry
//                 </PaperButton>
//             </View>
//         );
//     }

//     return (
//         <View style={styles.container}>
//             {stats.map((stat, index) => (
//                 <View
//                     key={stat.label}
//                     style={[
//                         styles.statCard,
//                         // Apply right border to all but the last column in each row
//                         index % 2 === 0 ? styles.statCardWithRightBorder : null,
//                         // Apply bottom border to all but the last row (now adjusted for 5 items)
//                         // For 5 items (0, 1, 2, 3, 4) in 2 columns:
//                         // Item 0: row 1, col 1 -> has right & bottom
//                         // Item 1: row 1, col 2 -> has bottom
//                         // Item 2: row 2, col 1 -> has right & bottom
//                         // Item 3: row 2, col 2 -> has bottom
//                         // Item 4: row 3, col 1 -> no borders
//                         index < stats.length - (stats.length % 2 === 0 ? 2 : 1) ? styles.statCardWithBottomBorder : null,
//                         // No need for lastRowOddCase explicitly, the above logic covers it
//                     ]}
//                 >
//                     <Text style={styles.statLabel}>{stat.label}</Text>
//                     <Text style={styles.statValue}>{stat.value}</Text>
//                     {stat.change && (
//                         <Text style={[
//                             styles.statChange,
//                             stat.isNegative ? styles.negativeChange : styles.positiveChange
//                         ]}>
//                             {stat.change}
//                         </Text>
//                     )}
//                 </View>
//             ))}
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flexDirection: 'row',
//         flexWrap: 'wrap',
//         backgroundColor: theme.colors.cardBackground,
//         borderRadius: theme.borderRadius.md,
//         ...theme.shadows.sm,
//         borderWidth: 1,
//         borderColor: theme.colors.border,
//     },
//     loadingContainer: {
//         alignItems: 'center',
//         justifyContent: 'center',
//         padding: theme.spacing.xl,
//         minHeight: 150,
//     },
//     loadingText: {
//         marginTop: theme.spacing.sm,
//         color: theme.colors.textSecondary,
//         fontSize: theme.typography.fontSize.md,
//     },
//     errorContainer: {
//         alignItems: 'center',
//         justifyContent: 'center',
//         padding: theme.spacing.xl,
//         minHeight: 150,
//     },
//     errorText: {
//         color: theme.colors.danger,
//         textAlign: 'center',
//         marginBottom: theme.spacing.md,
//         fontSize: theme.typography.fontSize.md,
//     },
//     statCard: {
//         width: '50%', // Two columns
//         padding: theme.spacing.lg,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     statCardWithRightBorder: {
//         borderRightWidth: 1,
//         borderRightColor: theme.colors.borderLight,
//     },
//     statCardWithBottomBorder: {
//         borderBottomWidth: 1,
//         borderBottomColor: theme.colors.borderLight,
//     },
//     statLabel: {
//         fontSize: theme.typography.fontSize.sm,
//         color: theme.colors.textSecondary,
//         marginBottom: theme.spacing.xs,
//         textAlign: 'center',
//     },
//     statValue: {
//         fontSize: theme.typography.fontSize.xl,
//         fontWeight: theme.typography.fontWeight.bold,
//         color: theme.colors.text,
//         marginBottom: theme.spacing.xs,
//         textAlign: 'center',
//     },
//     statChange: {
//         fontSize: theme.typography.fontSize.sm,
//         fontWeight: theme.typography.fontWeight.semibold,
//         textAlign: 'center',
//     },
//     positiveChange: {
//         color: theme.colors.success,
//     },
//     negativeChange: {
//         color: theme.colors.danger,
//     },
// });




// components/admin/QuickStats.tsx
import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Modal, ScrollView, Dimensions } from "react-native";
import { Text } from "../ui/Text";
import { theme } from "../../constants/theme";
import { getOrders, getInventoryItems, getEmployees } from "../../services/api";
import { Order } from '@/types/cashierTypes';
import { InventoryItem } from '@/types/admin';
import { Employee } from '@/types/EmployeeTypes';
import moment from "moment";
import { Button as PaperButton, IconButton } from 'react-native-paper';

// Define a fixed dimension for the stat cards
const CARD_DIMENSION = 170; // Fixed size in pixels for width and height

interface Stat {
    label: string;
    value: string;
    change: string | null;
    isNegative?: boolean;
    onPress?: () => void; // Optional onPress handler for clickable stats
}

/**
 * QuickStats component displays a summary of key operational metrics for the admin dashboard.
 * It fetches real-time data for sales, new orders, inventory alerts, and staff on duty,
 * calculating relevant figures and changes over time.
 */
export default function QuickStats() {
    const [stats, setStats] = useState<Stat[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State for managing the detail modal
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [modalContentType, setModalContentType] = useState<'cancelledOrders' | 'inventoryAlerts' | 'staffOnDuty' | null>(null);

    // State to hold the detailed data for each category
    const [cancelledOrdersList, setCancelledOrdersList] = useState<Order[]>([]);
    const [lowStockItemsList, setLowStockItemsList] = useState<InventoryItem[]>([]);
    const [staffOnDutyList, setStaffOnDutyList] = useState<Employee[]>([]);

    /**
     * Fetches and calculates the latest quick statistics for the dashboard.
     * This function combines data from orders, inventory, and employee records.
     */
    const fetchStats = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const today = moment().startOf('day');
            const yesterday = moment().subtract(1, 'day').startOf('day');
            const twoHoursAgo = moment().subtract(2, 'hours');

            // --- 1. Fetch Orders Data for Sales & New Orders ---
            const { orders: allOrders } = await getOrders({});

            // Filter out 'cancelled' orders for sales and new order calculations
            const nonCancelledOrders = allOrders.filter(order => order.status !== 'cancelled');

            const todayNonCancelledOrders = nonCancelledOrders.filter(order =>
                moment(order.created_at).isSameOrAfter(today)
            );
            const yesterdayNonCancelledOrders = nonCancelledOrders.filter(order =>
                moment(order.created_at).isBetween(yesterday, today, null, '[)')
            );

            const todaySales = todayNonCancelledOrders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
            const yesterdaySales = yesterdayNonCancelledOrders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
            const todayNewOrders = todayNonCancelledOrders.length;
            const yesterdayNewOrders = yesterdayNonCancelledOrders.length;

            // Calculate sales change percentage
            let salesChange: string | null = null;
            let isSalesNegative = false;
            if (yesterdaySales > 0) {
                const changePercent = ((todaySales - yesterdaySales) / yesterdaySales) * 100;
                salesChange = `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(1)}%`;
                isSalesNegative = changePercent < 0;
            } else if (todaySales > 0) {
                salesChange = '+100%';
            }

            // Calculate new orders change percentage
            let ordersChange: string | null = null;
            let isOrdersNegative = false;
            if (yesterdayNewOrders > 0) {
                const changePercent = ((todayNewOrders - yesterdayNewOrders) / yesterdayNewOrders) * 100;
                ordersChange = `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(1)}%`;
                isOrdersNegative = changePercent < 0;
            } else if (todayNewOrders > 0) {
                ordersChange = '+100%';
            }

            // --- Count Today's Cancelled Orders and store list ---
            const cancelledOrdersForTodayList = allOrders.filter(order =>
                order.status === 'cancelled' && moment(order.created_at).isSameOrAfter(today)
            );
            setCancelledOrdersList(cancelledOrdersForTodayList); // Store the full list
            const cancelledOrdersTodayCount = cancelledOrdersForTodayList.length;

            // --- 2. Fetch Inventory Data for Inventory Alerts and store list ---
            const inventoryItems = await getInventoryItems();
            const lowStockItems = inventoryItems.filter(item => item.quantity <= item.min_threshold);
            setLowStockItemsList(lowStockItems); // Store the full list
            const lowStockItemsCount = lowStockItems.length;

            // --- 3. Fetch Employee Data for Staff On Duty and store list ---
            const employees = await getEmployees();
            const staffOnDutyFiltered = employees.filter(employee =>
                employee.lastActivityAt && moment(employee.lastActivityAt).isAfter(twoHoursAgo)
            );
            setStaffOnDutyList(staffOnDutyFiltered); // Store the full list
            const staffOnDutyCount = staffOnDutyFiltered.length;
            const totalStaff = employees.length;

            // Compile all fetched and calculated stats with onPress handlers
            const newStats: Stat[] = [
                { label: "Today's Sales", value: `${todaySales.toFixed(2)} FCFA`, change: salesChange, isNegative: isSalesNegative },
                { label: "New Orders", value: String(todayNewOrders), change: ordersChange, isNegative: isOrdersNegative },
                {
                    label: "Cancelled Orders",
                    value: String(cancelledOrdersTodayCount),
                    change: null,
                    isNegative: cancelledOrdersTodayCount > 0,
                    onPress: () => {
                        setModalContentType('cancelledOrders');
                        setIsDetailModalVisible(true);
                    }
                },
                {
                    label: "Inventory Alerts",
                    value: String(lowStockItemsCount),
                    change: lowStockItemsCount > 0 ? 'Urgent!' : null,
                    isNegative: lowStockItemsCount > 0,
                    onPress: () => {
                        setModalContentType('inventoryAlerts');
                        setIsDetailModalVisible(true);
                    }
                },
                {
                    label: "Staff On Duty",
                    value: `${staffOnDutyCount}/${totalStaff}`,
                    change: null,
                    onPress: () => {
                        setModalContentType('staffOnDuty');
                        setIsDetailModalVisible(true);
                    }
                },
            ];
            setStats(newStats);

        } catch (err: any) {
            console.error("Failed to fetch quick stats:", err);
            setError("Failed to load dashboard data. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    // Effect to fetch data on component mount and set up periodic refresh
    useEffect(() => {
        fetchStats(); // Initial fetch
        const interval = setInterval(fetchStats, 5 * 60 * 1000); // Refresh stats every 5 minutes
        return () => clearInterval(interval); // Clear interval on unmount
    }, [fetchStats]);

    // Function to close the detail modal
    const closeDetailModal = useCallback(() => {
        setIsDetailModalVisible(false);
        setModalContentType(null);
    }, []);

    // Render logic for the modal content based on `modalContentType`
    const renderModalContent = useCallback(() => {
        switch (modalContentType) {
            case 'cancelledOrders':
                return (
                    <ScrollView contentContainerStyle={modalStyles.contentScroll}>
                        {cancelledOrdersList.length > 0 ? (
                            cancelledOrdersList.map((order) => (
                                <View key={order.id} style={modalStyles.itemRow}>
                                    <Text style={modalStyles.itemText}>Order #{order.id}:</Text>
                                    <Text style={modalStyles.itemText}>Customer: {order.customer_name || 'N/A'}</Text>
                                    <Text style={modalStyles.itemText}>Total: {Number(order.total_amount).toFixed(2)} FCFA</Text>
                                    <Text style={modalStyles.itemText}>Time: {moment(order.created_at).format('HH:mm')}</Text>
                                </View>
                            ))
                        ) : (
                            <Text style={modalStyles.emptyText}>No cancelled orders for today.</Text>
                        )}
                    </ScrollView>
                );
            case 'inventoryAlerts':
                return (
                    <ScrollView contentContainerStyle={modalStyles.contentScroll}>
                        {lowStockItemsList.length > 0 ? (
                            lowStockItemsList.map((item) => (
                                <View key={item.id} style={modalStyles.itemRow}>
                                    <Text style={modalStyles.itemText}>Item: {item.name}</Text>
                                    <Text style={modalStyles.itemText}>Current Stock: {item.quantity}</Text>
                                    <Text style={modalStyles.itemText}>Min Threshold: {item.min_threshold}</Text>
                                </View>
                            ))
                        ) : (
                            <Text style={modalStyles.emptyText}>No low stock items.</Text>
                        )}
                    </ScrollView>
                );
            case 'staffOnDuty':
                return (
                    <ScrollView contentContainerStyle={modalStyles.contentScroll}>
                        {staffOnDutyList.length > 0 ? (
                            staffOnDutyList.map((employee) => (
                                <View key={employee.employee_id} style={modalStyles.itemRow}>
                                    <Text style={modalStyles.itemText}>Name: {employee.employee_name}</Text>
                                    <Text style={modalStyles.itemText}>Role: {employee.employee_role}</Text>
                                    <Text style={modalStyles.itemText}>Last Activity: {employee.lastActivityAt ? moment(employee.lastActivityAt).format('HH:mm:ss') : 'N/A'}</Text>
                                </View>
                            ))
                        ) : (
                            <Text style={modalStyles.emptyText}>No staff currently detected on duty.</Text>
                        )}
                    </ScrollView>
                );
            default:
                return null;
        }
    }, [modalContentType, cancelledOrdersList, lowStockItemsList, staffOnDutyList]);


    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Loading dashboard stats...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <PaperButton mode="outlined" onPress={fetchStats} labelStyle={{ color: theme.colors.primary }}>
                    Retry
                </PaperButton>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {stats.map((stat, index) => {
                const StatCardContent = (
                    <View
                        style={[
                            styles.statCard,
                            // Apply right border to all but the last column in each row
                            index % 2 === 0 ? styles.statCardWithRightBorder : null,
                            // Apply bottom border to all but the last row (now adjusted for 5 items)
                            index < stats.length - (stats.length % 2 === 0 ? 2 : 1) ? styles.statCardWithBottomBorder : null,
                        ]}
                    >
                        <Text style={styles.statLabel}>{stat.label}</Text>
                        <Text style={styles.statValue}>{stat.value}</Text>
                        {stat.change && (
                            <Text style={[
                                styles.statChange,
                                stat.isNegative ? styles.negativeChange : styles.positiveChange
                            ]}>
                                {stat.change}
                            </Text>
                        )}
                    </View>
                );

                return stat.onPress ? (
                    <TouchableOpacity key={stat.label} onPress={stat.onPress} activeOpacity={0.7}>
                        {StatCardContent}
                    </TouchableOpacity>
                ) : (
                    // This View will now also have fixed dimensions
                    <View key={stat.label} style={styles.statCardNoClick}>
                        {StatCardContent}
                    </View>
                );
            })}

            {/* Detail Modal */}
            <Modal
                visible={isDetailModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={closeDetailModal}
            >
                <View style={modalStyles.centeredView}>
                    <View style={modalStyles.modalContainer}>
                        <View style={modalStyles.modalHeader}>
                            <Text style={modalStyles.modalTitle}>
                                {modalContentType === 'cancelledOrders' ? 'Cancelled Orders Today' :
                                 modalContentType === 'inventoryAlerts' ? 'Low Stock Items' :
                                 modalContentType === 'staffOnDuty' ? 'Staff On Duty' : 'Details'}
                            </Text>
                            {/* @ts-ignore: IconButton color prop might have type definition issues in some RN Paper versions */}
                            <IconButton
                                icon="close"
                                size={24}
                                onPress={closeDetailModal}
                                color={theme.colors.textSecondary}
                            />
                        </View>
                        {renderModalContent()}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: theme.colors.cardBackground,
        borderRadius: theme.borderRadius.md,
        ...theme.shadows.sm,
        borderWidth: 1,
        borderColor: theme.colors.border,
        overflow: 'hidden', // Ensures borderRadius clips content and internal borders
        justifyContent: 'center', // Center cards horizontally
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.xl,
        minHeight: 150,
        width: '100%', // Take full width when loading
    },
    loadingText: {
        marginTop: theme.spacing.sm,
        color: theme.colors.textSecondary,
        fontSize: theme.typography.fontSize.md,
    },
    errorContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.xl,
        minHeight: 150,
        width: '100%', // Take full width when error
    },
    errorText: {
        color: theme.colors.danger,
        textAlign: 'center',
        marginBottom: theme.spacing.md,
        fontSize: theme.typography.fontSize.md,
    },
    statCard: {
        width: CARD_DIMENSION, // Fixed width
        height: CARD_DIMENSION, // Fixed height
        padding: theme.spacing.xs,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statCardWithRightBorder: {
        borderRightWidth: 1,
        borderRightColor: theme.colors.borderLight,
    },
    statCardWithBottomBorder: {
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.borderLight,
    },
    statCardNoClick: { // Style for cards that are not clickable
        width: CARD_DIMENSION, // Fixed width
        height: CARD_DIMENSION, // Fixed height
        padding: theme.spacing.xs,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statLabel: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.xs,
        textAlign: 'center', // Centered for fixed width
    },
    statValue: {
        fontSize: theme.typography.fontSize.xl, // Changed to xl for prominence
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
        textAlign: 'center', // Centered for fixed width
    },
    statChange: {
        fontSize: theme.typography.fontSize.sm,
        fontWeight: theme.typography.fontWeight.semibold,
        textAlign: 'center',
    },
    positiveChange: {
        color: theme.colors.success,
    },
    negativeChange: {
        color: theme.colors.danger,
    },
});

const modalStyles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)', // Darker overlay
    },
    modalContainer: {
        width: '90%',
        maxHeight: '80%',
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        ...theme.shadows.lg,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: theme.spacing.sm,
        marginBottom: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.borderLight,
    },
    modalTitle: {
        fontSize: theme.typography.fontSize.lg,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.text,
    },
    contentScroll: {
        flexGrow: 1,
        paddingBottom: theme.spacing.sm,
    },
    itemRow: {
        paddingVertical: theme.spacing.xs,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.borderLight,
        marginBottom: theme.spacing.xs,
    },
    itemText: {
        fontSize: theme.typography.fontSize.md,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.xs,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: theme.spacing.md,
        color: theme.colors.textSecondary,
        fontSize: theme.typography.fontSize.md,
    },
});
