// // app/(tabs)/admin/sales/index.tsx

// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { View, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Modal, Dimensions } from 'react-native';
// import { Text } from '@/components/ui/Text';
// import { DataTable, Column } from '@/components/ui/DataTable';
// import { theme } from '@/constants/theme';
// import { getOrders } from '@/services/api';
// import { Order, OrderStatus } from '@/types/cashierTypes';
// import { Ionicons } from '@expo/vector-icons';
// import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
// import { Button as PaperButton } from 'react-native-paper';

// const { width } = Dimensions.get('window');

// // Helper for date calculations
// const getPeriodDates = (period: 'daily' | 'weekly' | 'monthly' | 'custom', customStart?: Date, customEnd?: Date) => {
//     const today = new Date();
//     let startDate: Date;
//     let endDate: Date;

//     switch (period) {
//         case 'daily':
//             startDate = startOfDay(today);
//             endDate = endOfDay(today);
//             break;
//         case 'weekly':
//             startDate = startOfWeek(today, { weekStartsOn: 0 }); // Sunday as start of week
//             endDate = endOfWeek(today, { weekStartsOn: 0 }); // Saturday as end of week
//             break;
//         case 'monthly':
//             startDate = startOfMonth(today);
//             endDate = endOfMonth(today);
//             break;
//         case 'custom':
//         default: // Default case for custom or fallback
//             startDate = customStart ? startOfDay(customStart) : startOfDay(today);
//             endDate = customEnd ? endOfDay(customEnd) : endOfDay(today);
//     }

//     // Return dates formatted as 'yyyy-MM-dd HH:mm:ss' for backend API
//     return {
//         from: format(startDate, 'yyyy-MM-dd HH:mm:ss'),
//         to: format(endDate, 'yyyy-MM-dd HH:mm:ss')
//     };
// };

// const SalesScreen = () => {
//     const [salesData, setSalesData] = useState<Order[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'custom'>('daily');
//     const [customStartDate, setCustomStartDate] = useState<Date | undefined>();
//     const [customEndDate, setCustomEndDate] = useState<Date | undefined>();
//     const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<Order | null>(null);
//     const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

//     // Aggregated state for sales metrics
//     const [totalSalesAmount, setTotalSalesAmount] = useState(0);
//     const [totalCogsAmount, setTotalCogsAmount] = useState(0);
//     const [totalGrossProfitAmount, setTotalGrossProfitAmount] = useState(0);

//     const fetchSales = useCallback(async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             const { from, to } = getPeriodDates(selectedPeriod, customStartDate, customEndDate);
//             const { orders } = await getOrders({ fromDate: from, toDate: to, sortBy: 'created_at', sortDirection: 'desc' });

//             // Filter out 'cancelled' orders before sorting and calculating metrics
//             const filteredOrders = orders.filter(order => order.status !== 'cancelled');

//             const sortedData = filteredOrders.sort((a, b) => {
//                 const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
//                 const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
//                 return dateB - dateA; // Newest first
//             });

//             setSalesData(sortedData);

//             // Calculate aggregated metrics from the filtered and sorted data
//             const salesSum = sortedData.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
//             const cogsSum = sortedData.reduce((sum, order) => sum + Number(order.total_cogs || 0), 0);
//             const grossProfitSum = salesSum - cogsSum;

//             setTotalSalesAmount(salesSum);
//             setTotalCogsAmount(cogsSum);
//             setTotalGrossProfitAmount(grossProfitSum);

//         } catch (err: any) {
//             console.error("Error fetching sales data:", err);
//             setError("Failed to fetch sales data. " + (err.message || 'Please try again.'));
//             setSalesData([]);
//             setTotalSalesAmount(0);
//             setTotalCogsAmount(0);
//             setTotalGrossProfitAmount(0);
//         } finally {
//             setLoading(false);
//         }
//     }, [selectedPeriod, customStartDate, customEndDate]);

//     useEffect(() => {
//         fetchSales();
//     }, [fetchSales]);

//     const openDetailModal = (order: Order) => {
//         setSelectedOrderForDetail(order);
//         setIsDetailModalVisible(true);
//     };

//     const closeDetailModal = () => {
//         setIsDetailModalVisible(false);
//         setSelectedOrderForDetail(null);
//     };

//     const getTotalSalesLabel = () => {
//         switch (selectedPeriod) {
//             case 'daily': return 'Total Sales for Today:';
//             case 'weekly': return 'Total Sales for this Week:';
//             case 'monthly': return 'Total Sales for this Month:';
//             case 'custom': return 'Total Sales for Selected Period:';
//             default: return 'Total Sales:';
//         }
//     };

//     // Columns for the DataTable, now including COGS and Gross Profit
//     const columns: Column<Order>[] = useMemo(() => [
//         {
//             key: "id",
//             title: "Order ID",
//             sortable: true,
//             width: width * 0.25,
//             render: (value, item) => {
//                 let textColor;
//                 switch (item.status) {
//                     case 'pending':
//                         textColor = '#FFA500';
//                         break;
//                     case 'in_progress':
//                         textColor = theme.colors.primary;
//                         break;
//                     case 'completed':
//                     case 'ready':
//                         textColor = theme.colors.success;
//                         break;
//                     case 'cancelled': // Ensure cancelled orders are still colored if shown (though filtered out of data)
//                         textColor = theme.colors.danger;
//                         break;
//                     default:
//                         textColor = theme.colors.text;
//                 }
//                 return (
//                     <TouchableOpacity onPress={() => openDetailModal(item)} style={styles.columnTouchable}>
//                         <Text style={[styles.columnText, { color: textColor }]}>{String(value).substring(0, 8)}...</Text>
//                     </TouchableOpacity>
//                 );
//             }
//         },
//         {
//             key: "total_amount",
//             title: "Sales",
//             sortable: true,
//             numeric: true,
//             width: width * 0.25,
//             render: (value) => (
//                 <View style={styles.columnView}>
//                     <Text style={styles.columnText}>{Number(value || 0).toFixed(2)}</Text>
//                 </View>
//             )
//         },
//         {
//             key: "total_cogs",
//             title: "COGS",
//             sortable: true,
//             numeric: true,
//             width: width * 0.25,
//             render: (value) => (
//                 <View style={styles.columnView}>
//                     <Text style={styles.columnText}>{Number(value || 0).toFixed(2)}</Text>
//                 </View>
//             )
//         },
//         {
//             key: "gross_profit",
//             title: "Gross Profit",
//             sortable: false,
//             numeric: true,
//             width: width * 0.25,
//             render: (value, item) => {
//                 const grossProfit = (Number(item.total_amount || 0) - Number(item.total_cogs || 0));
//                 return (
//                     <View style={styles.columnView}>
//                         <Text style={[styles.columnText, grossProfit >= 0 ? styles.positiveText : styles.negativeText]}>
//                             {grossProfit.toFixed(2)}
//                         </Text>
//                     </View>
//                 );
//             }
//         },
//     ], [width]);

//     const formatPrice = (price: number): string => {
//         return `${Number(price || 0).toFixed(2)} FCFA`;
//     };

//     return (
//         <View style={styles.container}>
//             <ScrollView contentContainerStyle={styles.scrollViewContent}>
//                 <View style={styles.headerContainer}>
//                     <Text style={theme.text.heading1}>Sales Overview</Text>
//                 </View>

//                 <View style={styles.periodSelector}>
//                     {['daily', 'weekly', 'monthly'].map((period) => (
//                         <TouchableOpacity
//                             key={period}
//                             style={[
//                                 styles.periodButton,
//                                 selectedPeriod === period && styles.periodButtonActive
//                             ]}
//                             onPress={() => setSelectedPeriod(period as any)}
//                         >
//                             <Text style={[
//                                 styles.periodButtonText,
//                                 selectedPeriod === period && styles.periodButtonTextActive
//                             ]}>
//                                 {period.charAt(0).toUpperCase() + period.slice(1)}
//                             </Text>
//                         </TouchableOpacity>
//                     ))}
//                 </View>

//                 {loading ? (
//                     <View style={styles.loadingContainer}>
//                         <ActivityIndicator size="large" color={theme.colors.primary} />
//                         <Text style={styles.loadingText}>Loading sales data...</Text>
//                     </View>
//                 ) : error ? (
//                     <View style={styles.errorContainer}>
//                         <Text style={styles.errorText}>{error}</Text>
//                         <PaperButton mode="outlined" onPress={fetchSales} labelStyle={{ color: theme.colors.primary }}>
//                             Retry
//                         </PaperButton>
//                     </View>
//                 ) : salesData.length === 0 ? (
//                     <View style={styles.noDataContainer}>
//                         <Text style={styles.noDataText}>No sales data available for this period.</Text>
//                     </View>
//                 ) : (
//                     <DataTable<Order>
//                         data={salesData}
//                         columns={columns}
//                         pageSize={10}
//                         keyExtractor={(item) => String(item.id)}
//                         onRowPress={openDetailModal}
//                         loading={loading}
//                     />
//                 )}

//                 {!loading && !error && salesData.length > 0 && (
//                     <View style={styles.totalSalesContainer}>
//                         <Text style={styles.totalSalesLabel}>{getTotalSalesLabel()}</Text>
//                         <Text style={styles.totalSalesValue}>Sales: {totalSalesAmount.toFixed(2)} FCFA</Text>
//                         <Text style={styles.totalSalesValue}>COGS: {totalCogsAmount.toFixed(2)} FCFA</Text>
//                         <Text style={[
//                             styles.totalSalesValue,
//                             totalGrossProfitAmount >= 0 ? styles.positiveText : styles.negativeText
//                         ]}>
//                             Gross Profit: {totalGrossProfitAmount.toFixed(2)} FCFA
//                         </Text>
//                     </View>
//                 )}
//             </ScrollView>

//             <Modal
//                 visible={isDetailModalVisible}
//                 animationType="slide"
//                 onRequestClose={closeDetailModal}
//                 transparent={true}
//             >
//                 {selectedOrderForDetail && (
//                     <View style={modalStyles.centeredView}>
//                         <View style={modalStyles.container}>
//                             <View style={modalStyles.header}>
//                                 <Text style={theme.text.heading2}>Order #{String(selectedOrderForDetail.id).substring(0, 8)}</Text>
//                                 <TouchableOpacity onPress={closeDetailModal} style={modalStyles.closeButton}>
//                                     <Ionicons name="close" size={24} color={theme.colors.text} />
//                                 </TouchableOpacity>
//                             </View>

//                             <ScrollView contentContainerStyle={modalStyles.contentContainer}>
//                                 <View style={modalStyles.detailSection}>
//                                     <Text style={modalStyles.detailTitle}>Order Information</Text>
//                                     <Text style={modalStyles.detailText}>
//                                         Date: {selectedOrderForDetail.created_at ?
//                                             format(new Date(selectedOrderForDetail.created_at), 'MMM dd,yyyy HH:mm') : 'N/A'}
//                                     </Text>
//                                     <Text style={modalStyles.detailText}>Status: {selectedOrderForDetail.status}</Text>
//                                     <Text style={modalStyles.detailText}>Type: {selectedOrderForDetail.order_type}</Text>
//                                     <Text style={modalStyles.detailText}>Source: {selectedOrderForDetail.order_source}</Text>
//                                     <Text style={modalStyles.detailText}>
//                                         Total Sales: {formatPrice(Number(selectedOrderForDetail.total_amount || 0))}
//                                     </Text>
//                                     <Text style={modalStyles.detailText}>
//                                         COGS: {formatPrice(Number(selectedOrderForDetail.total_cogs || 0))}
//                                     </Text>
//                                     <Text style={[
//                                         modalStyles.detailText,
//                                         (Number(selectedOrderForDetail.total_amount || 0) - Number(selectedOrderForDetail.total_cogs || 0)) >= 0 ? styles.positiveText : styles.negativeText
//                                     ]}>
//                                         Gross Profit: {formatPrice(Number(selectedOrderForDetail.total_amount || 0) - Number(selectedOrderForDetail.total_cogs || 0))}
//                                     </Text>
//                                     <Text style={modalStyles.detailText}>
//                                         Cashier: {selectedOrderForDetail.created_by_name || 'N/A'}
//                                     </Text>
//                                     {selectedOrderForDetail.customer_name && (
//                                         <Text style={modalStyles.detailText}>
//                                             Customer: {selectedOrderForDetail.customer_name}
//                                         </Text>
//                                     )}
//                                     {selectedOrderForDetail.notes && (
//                                         <Text style={modalStyles.detailText}>Notes: {selectedOrderForDetail.notes}</Text>
//                                     )}
//                                 </View>

//                                 {selectedOrderForDetail.order_items && selectedOrderForDetail.order_items.length > 0 && (
//                                     <View style={modalStyles.detailSection}>
//                                         <Text style={modalStyles.detailTitle}>Items</Text>
//                                         {selectedOrderForDetail.order_items.map((item, index) => (
//                                             <View key={item.id || index} style={modalStyles.itemRow}>
//                                                 <Text style={modalStyles.itemText}>
//                                                     {item.product} {item.variant ? `(${item.variant})` : ''} ({item.quantity})
//                                                 </Text>
//                                                 <Text style={modalStyles.itemText}>
//                                                     {formatPrice(Number(item.total_price || 0))}
//                                                 </Text>
//                                             </View>
//                                         ))}
//                                     </View>
//                                 )}
//                             </ScrollView>
//                         </View>
//                     </View>
//                 )}
//             </Modal>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: theme.colors.background,
//         paddingHorizontal: theme.spacing.md,
//     },
//     scrollViewContent: {
//         paddingVertical: theme.spacing.lg,
//     },
//     headerContainer: {
//         marginBottom: theme.spacing.lg,
//         alignItems: 'center',
//     },
//     periodSelector: {
//         flexDirection: 'row',
//         justifyContent: 'space-around',
//         marginBottom: theme.spacing.lg,
//         backgroundColor: theme.colors.cardBackground,
//         borderRadius: theme.borderRadius.md,
//         padding: theme.spacing.xs,
//         ...theme.shadows.sm,
//     },
//     periodButton: {
//         flex: 1,
//         paddingVertical: theme.spacing.sm,
//         borderRadius: theme.borderRadius.sm,
//         alignItems: 'center',
//     },
//     periodButtonActive: {
//         backgroundColor: theme.colors.primary,
//     },
//     periodButtonText: {
//         color: theme.colors.textSecondary,
//         fontWeight: theme.typography.fontWeight.semibold,
//         fontSize: theme.typography.fontSize.md,
//     },
//     periodButtonTextActive: {
//         color: theme.colors.white,
//     },
//     loadingContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         paddingVertical: theme.spacing.xl,
//         minHeight: 200,
//     },
//     loadingText: {
//         marginTop: theme.spacing.sm,
//         color: theme.colors.textSecondary,
//         fontSize: theme.typography.fontSize.md,
//     },
//     errorContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         paddingVertical: theme.spacing.xl,
//         minHeight: 200,
//     },
//     errorText: {
//         color: theme.colors.danger,
//         textAlign: 'center',
//         marginBottom: theme.spacing.md,
//         fontSize: theme.typography.fontSize.md,
//     },
//     retryButton: {
//         backgroundColor: theme.colors.primary,
//         paddingVertical: theme.spacing.sm,
//         paddingHorizontal: theme.spacing.md,
//         borderRadius: theme.borderRadius.md,
//     },
//     retryButtonText: {
//         color: theme.colors.white,
//         fontSize: theme.typography.fontSize.md,
//         fontWeight: theme.typography.fontWeight.semibold,
//     },
//     noDataContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         paddingVertical: theme.spacing.xl,
//         minHeight: 200,
//     },
//     noDataText: {
//         textAlign: 'center',
//         color: theme.colors.textSecondary,
//         fontSize: theme.typography.fontSize.md,
//     },
//     columnTouchable: {
//         paddingVertical: theme.spacing.xs,
//         alignItems: 'center',
//     },
//     columnView: {
//         alignItems: 'center',
//     },
//     columnText: {
//         fontSize: theme.typography.fontSize.xs,
//         fontWeight: theme.typography.fontWeight.bold,
//         color: theme.colors.text,
//         textAlign: 'center',
//     },
//     totalSalesContainer: {
//         marginTop: theme.spacing.md,
//         padding: theme.spacing.md,
//         backgroundColor: theme.colors.cardBackground,
//         borderRadius: theme.borderRadius.md,
//         ...theme.shadows.md,
//         alignItems: 'center',
//     },
//     totalSalesLabel: {
//         fontSize: theme.typography.fontSize.lg,
//         fontWeight: theme.typography.fontWeight.bold,
//         color: theme.colors.text,
//         marginBottom: theme.spacing.sm,
//     },
//     totalSalesValue: {
//         fontSize: theme.typography.fontSize.xl,
//         fontWeight: theme.typography.fontWeight.bold,
//         color: theme.colors.primary,
//         marginBottom: theme.spacing.xs,
//     },
//     positiveText: {
//         color: theme.colors.success,
//         fontWeight: theme.typography.fontWeight.bold,
//     },
//     negativeText: {
//         color: theme.colors.danger,
//         fontWeight: theme.typography.fontWeight.bold,
//     },
//     warning: {
//         color:'#FFD700'
//     },
//     info: {
//         color:'#00BFFF'
//     },
// });

// // Extend the theme colors if not already defined in your constants/theme.ts
// // This is crucial for styling in the component where `theme.colors.warning` or `theme.colors.info` might be used.
// // Best practice is to define these directly in your `theme.ts`
// if (!theme.colors.warning) {
//     // @ts-ignore
//     theme.colors.warning = styles.warning.color;
// }
// if (!theme.colors.info) {
//     // @ts-ignore
//     theme.colors.info = styles.info.color;
// }

// const modalStyles = StyleSheet.create({
//     centeredView: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'rgba(0,0,0,0.6)',
//     },
//     container: {
//         width: '90%',
//         maxHeight: '80%',
//         backgroundColor: theme.colors.background,
//         borderRadius: theme.borderRadius.xl,
//         padding: theme.spacing.lg,
//         ...theme.shadows.lg,
//     },
//     header: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: theme.spacing.md,
//         paddingBottom: theme.spacing.sm,
//         borderBottomWidth: 1,
//         borderBottomColor: theme.colors.border,
//     },
//     closeButton: {
//         padding: theme.spacing.xs,
//     },
//     contentContainer: {
//         flexGrow: 1,
//         paddingBottom: theme.spacing.md,
//     },
//     detailSection: {
//         marginBottom: theme.spacing.lg,
//         paddingVertical: theme.spacing.md,
//         borderBottomWidth: 1,
//         borderBottomColor: theme.colors.borderLight,
//     },
//     detailTitle: {
//         fontSize: theme.typography.fontSize.lg,
//         fontWeight: theme.typography.fontWeight.bold,
//         color: theme.colors.text,
//         marginBottom: theme.spacing.sm,
//     },
//     detailText: {
//         fontSize: theme.typography.fontSize.md,
//         color: theme.colors.textSecondary,
//         marginBottom: theme.spacing.xs,
//     },
//     itemRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         paddingVertical: theme.spacing.xs,
//         borderBottomWidth: 1,
//         borderBottomColor: theme.colors.border,
//     },
//     itemText: {
//         fontSize: theme.typography.fontSize.md,
//         color: theme.colors.textSecondary,
//     },
// });

// export default SalesScreen;





// app/(tabs)/admin/sales/index.tsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { Text } from '@/components/ui/Text';
import { DataTable, Column } from '@/components/ui/DataTable';
import { theme } from '@/constants/theme';
import { getOrders } from '@/services/api';
import { Order, OrderStatus } from '@/types/cashierTypes';
import { Ionicons } from '@expo/vector-icons';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { Button as PaperButton } from 'react-native-paper';

const { width } = Dimensions.get('window');

// Helper for date calculations
const getPeriodDates = (period: 'daily' | 'weekly' | 'monthly' | 'custom', customStart?: Date, customEnd?: Date) => {
    const today = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (period) {
        case 'daily':
            startDate = startOfDay(today);
            endDate = endOfDay(today);
            break;
        case 'weekly':
            startDate = startOfWeek(today, { weekStartsOn: 0 }); // Sunday as start of week
            endDate = endOfWeek(today, { weekStartsOn: 0 }); // Saturday as end of week
            break;
        case 'monthly':
            startDate = startOfMonth(today);
            endDate = endOfMonth(today);
            break;
        case 'custom':
        default: // Default case for custom or fallback
            startDate = customStart ? startOfDay(customStart) : startOfDay(today);
            endDate = customEnd ? endOfDay(customEnd) : endOfDay(today);
    }

    // Return dates formatted as 'yyyy-MM-dd HH:mm:ss' for backend API
    return {
        from: format(startDate, 'yyyy-MM-dd HH:mm:ss'),
        to: format(endDate, 'yyyy-MM-dd HH:mm:ss')
    };
};

const SalesScreen = () => {
    const [salesData, setSalesData] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'custom'>('daily');
    const [customStartDate, setCustomStartDate] = useState<Date | undefined>();
    const [customEndDate, setCustomEndDate] = useState<Date | undefined>();
    const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<Order | null>(null);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

    // Aggregated state for sales metrics
    const [totalSalesAmount, setTotalSalesAmount] = useState(0);
    const [totalCogsAmount, setTotalCogsAmount] = useState(0);
    const [totalGrossProfitAmount, setTotalGrossProfitAmount] = useState(0);

    const fetchSales = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { from, to } = getPeriodDates(selectedPeriod, customStartDate, customEndDate);
            const { orders } = await getOrders({ fromDate: from, toDate: to, sortBy: 'created_at', sortDirection: 'desc' });

            // Filter out 'cancelled' orders before sorting and calculating metrics
            const filteredOrders = orders.filter(order => order.status !== 'cancelled');

            const sortedData = filteredOrders.sort((a, b) => {
                const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
                const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
                return dateB - dateA; // Newest first
            });

            setSalesData(sortedData);

            // Calculate aggregated metrics from the filtered and sorted data
            const salesSum = sortedData.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
            const cogsSum = sortedData.reduce((sum, order) => sum + Number(order.total_cogs || 0), 0);
            const grossProfitSum = salesSum - cogsSum;

            setTotalSalesAmount(salesSum);
            setTotalCogsAmount(cogsSum);
            setTotalGrossProfitAmount(grossProfitSum);

        } catch (err: any) {
            console.error("Error fetching sales data:", err);
            setError("Failed to fetch sales data. " + (err.message || 'Please try again.'));
            setSalesData([]);
            setTotalSalesAmount(0);
            setTotalCogsAmount(0);
            setTotalGrossProfitAmount(0);
        } finally {
            setLoading(false);
        }
    }, [selectedPeriod, customStartDate, customEndDate]);

    useEffect(() => {
        fetchSales();
    }, [fetchSales]);

    const openDetailModal = (order: Order) => {
        setSelectedOrderForDetail(order);
        setIsDetailModalVisible(true);
    };

    const closeDetailModal = () => {
        setIsDetailModalVisible(false);
        setSelectedOrderForDetail(null);
    };

    const getTotalSalesLabel = () => {
        switch (selectedPeriod) {
            case 'daily': return 'Total Sales for Today:';
            case 'weekly': return 'Total Sales for this Week:';
            case 'monthly': return 'Total Sales for this Month:';
            case 'custom': return 'Total Sales for Selected Period:';
            default: return 'Total Sales:';
        }
    };

    // Helper to get status color based on OrderStatus
    const getStatusColor = useCallback((status: OrderStatus) => {
        switch (status) {
            case 'pending': return '#FFA500'; // Orange
            case 'in_progress': return theme.colors.primary; // Blue from theme
            case 'ready':
            case 'completed': return theme.colors.success; // Green from theme
            case 'cancelled': return theme.colors.danger; // Red from theme
            default: return theme.colors.text; // Default text color
        }
    }, []);

    // Columns for the DataTable: Order ID (colored), Sales, COGS, and Gross Profit
    const columns: Column<Order>[] = useMemo(() => [
        {
            key: "id",
            title: "Order ID",
            sortable: true,
            width: width * 0.25, // Adjusted width
            render: (value, item) => (
                <TouchableOpacity onPress={() => openDetailModal(item)} style={styles.columnTouchable}>
                    {/* Color based on status */}
                    <Text style={[styles.columnText, { color: getStatusColor(item.status) }]}>{String(value).substring(0, 8)}...</Text>
                </TouchableOpacity>
            )
        },
        {
            key: "total_amount",
            title: "Sales",
            sortable: true,
            numeric: true,
            width: width * 0.25,
            render: (value) => (
                <View style={styles.columnView}>
                    <Text style={styles.columnText}>{Number(value || 0).toFixed(2)}</Text>
                </View>
            )
        },
        {
            key: "total_cogs",
            title: "COGS",
            sortable: true,
            numeric: true,
            width: width * 0.25,
            render: (value) => (
                <View style={styles.columnView}>
                    <Text style={styles.columnText}>{Number(value || 0).toFixed(2)}</Text>
                </View>
            )
        },
        {
            key: "gross_profit", // This column is derived client-side
            title: "Profit",
            sortable: false,
            numeric: true,
            width: width * 0.25,
            render: (value, item) => {
                const grossProfit = (Number(item.total_amount || 0) - Number(item.total_cogs || 0));
                return (
                    <View style={styles.columnView}>
                        <Text style={[styles.columnText, grossProfit >= 0 ? styles.positiveText : styles.negativeText]}>
                            {grossProfit.toFixed(2)}
                        </Text>
                    </View>
                );
            }
        },
    ], [width, getStatusColor]); // Depend on getStatusColor

    const formatPrice = (price: number): string => {
        return `${Number(price || 0).toFixed(2)} FCFA`;
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.headerContainer}>
                    <Text style={theme.text.heading1}>Sales Overview</Text>
                </View>

                <View style={styles.periodSelector}>
                    {['daily', 'weekly', 'monthly'].map((period) => (
                        <TouchableOpacity
                            key={period}
                            style={[
                                styles.periodButton,
                                selectedPeriod === period && styles.periodButtonActive
                            ]}
                            onPress={() => setSelectedPeriod(period as any)}
                        >
                            <Text style={[
                                styles.periodButtonText,
                                selectedPeriod === period && styles.periodButtonTextActive
                            ]}>
                                {period.charAt(0).toUpperCase() + period.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                        <Text style={styles.loadingText}>Loading sales data...</Text>
                    </View>
                ) : error ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                        <PaperButton mode="outlined" onPress={fetchSales} labelStyle={{ color: theme.colors.primary }}>
                            Retry
                        </PaperButton>
                    </View>
                ) : salesData.length === 0 ? (
                    <View style={styles.noDataContainer}>
                        <Text style={styles.noDataText}>No sales data available for this period.</Text>
                    </View>
                ) : (
                    <DataTable<Order>
                        data={salesData}
                        columns={columns}
                        pageSize={10}
                        keyExtractor={(item) => String(item.id)}
                        onRowPress={openDetailModal}
                        loading={loading}
                    />
                )}

                {!loading && !error && salesData.length > 0 && (
                    <View style={styles.totalSalesContainer}>
                        <Text style={styles.totalSalesLabel}>{getTotalSalesLabel()}</Text>
                        <Text style={styles.totalSalesValue}>Sales: {totalSalesAmount.toFixed(2)} FCFA</Text>
                        <Text style={styles.totalSalesValue}>COGS: {totalCogsAmount.toFixed(2)} FCFA</Text>
                        <Text style={[
                            styles.totalSalesValue,
                            totalGrossProfitAmount >= 0 ? styles.positiveText : styles.negativeText
                        ]}>
                            Gross Profit: {totalGrossProfitAmount.toFixed(2)} FCFA
                        </Text>
                    </View>
                )}
            </ScrollView>

            <Modal
                visible={isDetailModalVisible}
                animationType="slide"
                onRequestClose={closeDetailModal}
                transparent={true}
            >
                {selectedOrderForDetail && (
                    <View style={modalStyles.centeredView}>
                        <View style={modalStyles.container}>
                            <View style={modalStyles.header}>
                                <Text style={theme.text.heading2}>Order #{String(selectedOrderForDetail.id).substring(0, 8)}</Text>
                                <TouchableOpacity onPress={closeDetailModal} style={modalStyles.closeButton}>
                                    <Ionicons name="close" size={24} color={theme.colors.text} />
                                </TouchableOpacity>
                            </View>

                            <ScrollView contentContainerStyle={modalStyles.contentContainer}>
                                <View style={modalStyles.detailSection}>
                                    <Text style={modalStyles.detailTitle}>Order Information</Text>
                                    <Text style={modalStyles.detailText}>
                                        Date: {selectedOrderForDetail.created_at ?
                                            format(new Date(selectedOrderForDetail.created_at), 'MMM dd,yyyy HH:mm') : 'N/A'}
                                    </Text>
                                    <Text style={modalStyles.detailText}>Status: {selectedOrderForDetail.status}</Text>
                                    <Text style={modalStyles.detailText}>Type: {selectedOrderForDetail.order_type}</Text>
                                    <Text style={modalStyles.detailText}>Source: {selectedOrderForDetail.order_source}</Text>
                                    <Text style={modalStyles.detailText}>
                                        Total Sales: {formatPrice(Number(selectedOrderForDetail.total_amount || 0))}
                                    </Text>
                                    <Text style={modalStyles.detailText}>
                                        COGS: {formatPrice(Number(selectedOrderForDetail.total_cogs || 0))}
                                    </Text>
                                    <Text style={[
                                        modalStyles.detailText,
                                        (Number(selectedOrderForDetail.total_amount || 0) - Number(selectedOrderForDetail.total_cogs || 0)) >= 0 ? styles.positiveText : styles.negativeText
                                    ]}>
                                        Gross Profit: {formatPrice(Number(selectedOrderForDetail.total_amount || 0) - Number(selectedOrderForDetail.total_cogs || 0))}
                                    </Text>
                                    <Text style={modalStyles.detailText}>
                                        Cashier: {selectedOrderForDetail.created_by_name || 'N/A'}
                                    </Text>
                                    {selectedOrderForDetail.customer_name && (
                                        <Text style={modalStyles.detailText}>
                                            Customer: {selectedOrderForDetail.customer_name}
                                        </Text>
                                    )}
                                    {selectedOrderForDetail.notes && (
                                        <Text style={modalStyles.detailText}>Notes: {selectedOrderForDetail.notes}</Text>
                                    )}
                                </View>

                                {selectedOrderForDetail.order_items && selectedOrderForDetail.order_items.length > 0 && (
                                    <View style={modalStyles.detailSection}>
                                        <Text style={modalStyles.detailTitle}>Items</Text>
                                        {selectedOrderForDetail.order_items.map((item, index) => (
                                            <View key={item.id || index} style={modalStyles.itemRow}>
                                                <Text style={modalStyles.itemText}>
                                                    {item.product} {item.variant ? `(${item.variant})` : ''} ({item.quantity})
                                                </Text>
                                                <Text style={modalStyles.itemText}>
                                                    {formatPrice(Number(item.total_price || 0))}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </ScrollView>
                        </View>
                    </View>
                )}
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingHorizontal: theme.spacing.md,
    },
    scrollViewContent: {
        paddingVertical: theme.spacing.lg,
    },
    headerContainer: {
        marginBottom: theme.spacing.lg,
        alignItems: 'center',
    },
    periodSelector: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: theme.spacing.lg,
        backgroundColor: theme.colors.cardBackground,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.xs,
        ...theme.shadows.sm,
    },
    periodButton: {
        flex: 1,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.sm,
        alignItems: 'center',
    },
    periodButtonActive: {
        backgroundColor: theme.colors.primary,
    },
    periodButtonText: {
        color: theme.colors.textSecondary,
        fontWeight: theme.typography.fontWeight.semibold,
        fontSize: theme.typography.fontSize.md,
    },
    periodButtonTextActive: {
        color: theme.colors.white,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: theme.spacing.xl,
        minHeight: 200,
    },
    loadingText: {
        marginTop: theme.spacing.sm,
        color: theme.colors.textSecondary,
        fontSize: theme.typography.fontSize.md,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: theme.spacing.xl,
        minHeight: 200,
    },
    errorText: {
        color: theme.colors.danger,
        textAlign: 'center',
        marginBottom: theme.spacing.md,
        fontSize: theme.typography.fontSize.md,
    },
    retryButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
    },
    retryButtonText: {
        color: theme.colors.white,
        fontSize: theme.typography.fontSize.md,
        fontWeight: theme.typography.fontWeight.semibold,
    },
    noDataContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: theme.spacing.xl,
        minHeight: 200,
    },
    noDataText: {
        textAlign: 'center',
        color: theme.colors.textSecondary,
        fontSize: theme.typography.fontSize.md,
    },
    columnTouchable: {
        paddingVertical: theme.spacing.xs,
        alignItems: 'center',
    },
    columnView: {
        alignItems: 'center',
    },
    columnText: {
        fontSize: theme.typography.fontSize.xs,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.text,
        textAlign: 'center',
    },
    totalSalesContainer: {
        marginTop: theme.spacing.md,
        padding: theme.spacing.md,
        backgroundColor: theme.colors.cardBackground,
        borderRadius: theme.borderRadius.md,
        ...theme.shadows.md,
        alignItems: 'center',
    },
    totalSalesLabel: {
        fontSize: theme.typography.fontSize.md,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
    },
    totalSalesValue: {
        fontSize: theme.typography.fontSize.md,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.primary,
        marginBottom: theme.spacing.xs,
    },
    positiveText: {
        color: theme.colors.success,
        fontWeight: theme.typography.fontWeight.bold,
    },
    negativeText: {
        color: theme.colors.danger,
        fontWeight: theme.typography.fontWeight.bold,
    },
    warning: {
        color:'#FFD700'
    },
    info: {
        color:'#00BFFF'
    },
});

// Extend the theme colors if not already defined in your constants/theme.ts
if (!theme.colors.warning) {
    // @ts-ignore
    theme.colors.warning = styles.warning.color;
}
if (!theme.colors.info) {
    // @ts-ignore
    theme.colors.info = styles.info.color;
}

const modalStyles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    container: {
        width: '90%',
        maxHeight: '80%',
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.lg,
        ...theme.shadows.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
        paddingBottom: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    closeButton: {
        padding: theme.spacing.xs,
    },
    contentContainer: {
        flexGrow: 1,
        paddingBottom: theme.spacing.md,
    },
    detailSection: {
        marginBottom: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.borderLight,
    },
    detailTitle: {
        fontSize: theme.typography.fontSize.lg,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
    },
    detailText: {
        fontSize: theme.typography.fontSize.md,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.xs,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: theme.spacing.xs,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    itemText: {
        fontSize: theme.typography.fontSize.md,
        color: theme.colors.textSecondary,
    },
});

export default SalesScreen;
