// AllOrdersModal.tsx
import React, { useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native'; // Import ScrollView
import { Text, Button, Modal, Portal, IconButton } from 'react-native-paper';
import { Order, OrderStatus, OrderStatusFilter } from '../../types/cashierTypes';
import { theme } from '@/constants/theme';
import RNPrint from 'react-native-print';

export interface AllOrdersModalProps {
    visible: boolean;
    onClose: () => void;
    orders: Order[];
    totalOrders: number;
    onPrint: (orderId: string) => void;
}

const statusColors = {
    all: theme.colors.primary, // Using theme primary for 'all' filter
    pending: '#FFA500',
    in_progress: '#1E90FF',
    ready: '#32CD32',
    completed: '#808080',
    cancelled: '#FF0000'
} as const;

const statusFilters: { value: OrderStatusFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'ready', label: 'Ready' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
];

const AllOrdersModal: React.FC<AllOrdersModalProps> = ({
    visible,
    onClose,
    orders = [],
    totalOrders,
    onPrint
}) => {
    const [filter, setFilter] = useState<OrderStatusFilter>('all');

    const filteredOrders = filter === 'all'
        ? orders
        : orders.filter(order => order.status === filter);

    const getStatusLabel = (status: OrderStatus) => {
        switch (status) {
            case 'pending': return 'Pending';
            case 'in_progress': return 'In Progress';
            case 'ready': return 'Ready';
            case 'completed': return 'Completed';
            case 'cancelled': return 'Cancelled';
            default: return status;
        }
    };

    const getStatusColor = (status: OrderStatusFilter | OrderStatus) => {
        return statusColors[status] || '#000'; // Fallback for safety
    };

    const renderOrderItem = ({ item }: { item: Order }) => (
        <View style={[styles.orderCard, { borderLeftColor: getStatusColor(item.status) }]}>
            <View style={styles.cardHeader}>
                <View style={styles.orderInfo}>
                    <Text style={styles.orderId}>Order #{item.id}</Text>
                    <Text style={styles.orderTime}>
                        {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
                    <View style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: getStatusColor(item.status)
                    }} />
                    <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                        {getStatusLabel(item.status)}
                    </Text>
                </View>
            </View>

            <View style={styles.orderDetails}>
                <Text style={styles.orderType}>Type: {item.order_type || 'N/A'}</Text>
                {/* <Text style={styles.orderSource}>Source: {item.order_source || 'N/A'}</Text> */}
                {item.customer_name && <Text style={styles.customerInfo}>Customer: {item.customer_name}</Text>}
                {/* {item.customer_phone && <Text style={styles.customerInfo}>Phone: {item.customer_phone}</Text>} */}
                {/* {item.created_by_name && <Text style={styles.employeeInfo}>Created By: {item.created_by_name}</Text>} */}
                {/* {item.prepared_by_name && <Text style={styles.employeeInfo}>Prepared By: {item.prepared_by_name}</Text>} */}
                {/* {item.store_name && <Text style={styles.storeInfo}>Store: {item.store_name}</Text>} */}
                {/* {item.store_location && <Text style={styles.storeInfo}>Location: {item.store_location}</Text>} */}
            </View>

            <View style={styles.itemsContainer}>
                {item.order_items?.slice(0, 3).map((orderItem, index) => (
                    <View key={`${item.id}-${orderItem.id}-${index}`} style={styles.itemRow}>
                        <Text style={styles.itemQuantity}>{orderItem.quantity}x</Text>
                        <Text style={styles.itemName} numberOfLines={1}>
                            {orderItem.product}
                            {orderItem.variant ? ` (${orderItem.variant})` : ''}
                        </Text>
                        <Text style={styles.itemPrice}>
                            {(orderItem.unit_price * orderItem.quantity).toFixed(2)}FCFA
                        </Text>
                    </View>
                ))}
                {item.order_items && item.order_items.length > 3 && (
                    <Text style={{ color: '#666', marginTop: 4 }}>
                        +{item.order_items.length - 3} more items
                    </Text>
                )}
            </View>

            <View style={styles.orderTotal}>
                <Text style={styles.totalText}>Total: {Number(item.total_amount).toFixed(2)}FCFA</Text>
            </View>

            {item.status === 'completed' && (
                <Button
                    mode="contained"
                    onPress={() => onPrint(item.id.toString())}
                    style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                    labelStyle={styles.actionButtonText}
                >
                    Print Receipt
                </Button>
            )}
        </View>
    );

    // const handlePrintOrder = async (orderId: string) => {
        
    //    const order = orders.find(o => o.id.toString() === orderId);
    
    //     if (!order) {
    //         Alert.alert('Error', 'Order not found');
    //         return;
    //     }
    
    //     try {
    //         await RNPrint.print({
    //             html: `
    //                 <html>
    //                     <head>
    //                         <style>
    //                             body { font-family: sans-serif; }
    //                             .header { text-align: center; margin-bottom: 20px; }
    //                             .section { margin-bottom: 15px; }
    //                             .section-title { font-weight: bold; border-bottom: 1px solid #000; margin-bottom: 5px; }
    //                             .item-row { display: flex; justify-content: space-between; }
    //                             .total { font-weight: bold; margin-top: 10px; }
    //                         </style>
    //                     </head>
    //                     <body>
    //                         <div class="header">
    //                             <h2>${order.store_name || 'Store'}</h2>
    //                             <p>${order.store_location || ''}</p>
    //                             <p>Tel: ${order.store_phone || ''}</p>
    //                         </div>
                            
    //                         <div class="section">
    //                             <div class="section-title">ORDER #${order.id}</div>
    //                             <p>Date: ${new Date(order.created_at).toLocaleString()}</p>
    //                             <p>Type: ${order.order_type} | Status: ${getStatusLabel(order.status)}</p>
    //                         </div>
                            
    //                         <div class="section">
    //                             <div class="section-title">CUSTOMER</div>
    //                             <p>${order.customer_name || 'Walk-in Customer'}</p>
    //                             <p>${order.customer_phone || ''}</p>
    //                             ${order.order_type === 'delivery' ? `<p>${order.address || ''}</p>` : ''}
    //                         </div>
                            
    //                         <div class="section">
    //                             <div class="section-title">ITEMS</div>
    //                             ${order.order_items?.map(item => `
    //                                 <div class="item-row">
    //                                     <span>${item.quantity}x ${item.product}${item.variant ? ` (${item.variant})` : ''}</span>
    //                                     <span>${(item.unit_price * item.quantity).toFixed(2)}FCFA</span>
    //                                 </div>
    //                             `).join('')}
    //                         </div>
                            
    //                         <div class="section">
    //                             <div class="section-title">TOTALS</div>
    //                             <div class="item-row">
    //                                 <span>Subtotal:</span>
    //                                 <span>${Number(order.subtotal).toFixed(2)}FCFA</span>
    //                             </div>
    //                             <div class="item-row">
    //                                 <span>Discount:</span>
    //                                 <span>${Number(order.discount_amount || 0).toFixed(2)}FCFA</span>
    //                             </div>
    //                             <div class="item-row total">
    //                                 <span>Total:</span>
    //                                 <span>${Number(order.total_amount).toFixed(2)}FCFA</span>
    //                             </div>
    //                             <p>Payment: ${order.payment_status}</p>
    //                         </div>
                            
    //                         ${order.order_type === 'delivery' ? `
    //                         <div class="section">
    //                             <div class="section-title">DELIVERY</div>
    //                             <p>Deliverer: ${order.deliverer || 'N/A'}</p>
    //                         </div>
    //                         ` : ''}
                            
    //                         ${order.notes ? `
    //                         <div class="section">
    //                             <div class="section-title">NOTES</div>
    //                             <p>${order.notes}</p>
    //                         </div>
    //                         ` : ''}
                            
    //                         <div class="section">
    //                             <p>Prepared by: ${order.prepared_by_name || 'N/A'}</p>
    //                             <p>Thank you for your business!</p>
    //                         </div>
    //                     </body>
    //                 </html>
    //             `
    //         });
    //     } catch (error) {
    //         console.error('Failed to print:', error);
    //         Alert.alert('Error', 'Failed to print receipt');
    //     }
    // };

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={onClose}
                contentContainerStyle={styles.modal}
            >
                <View style={styles.header}>
                    <Text variant="titleMedium" style={styles.headerText}>
                        All Orders ({totalOrders})
                    </Text>
                    <IconButton icon="close" onPress={onClose} />
                </View>

                {/* Wrap status filters in a horizontal ScrollView */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabContainer}>
                    {statusFilters.map(({ value, label }) => (
                        <TouchableOpacity
                            key={value}
                            style={[
                                styles.tabButton,
                                filter === value && {
                                    ...styles.activeTabButton,
                                    borderBottomColor: getStatusColor(value)
                                }
                            ]}
                            onPress={() => setFilter(value)}
                        >
                            <Text style={[
                                styles.tabButtonText,
                                filter === value && {
                                    ...styles.activeTabButtonText,
                                    color: getStatusColor(value)
                                }
                            ]}>
                                {label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <FlatList
                    data={filteredOrders}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.scrollContainer}
                    renderItem={renderOrderItem}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateText}>No orders found for this filter.</Text>
                        </View>
                    }
                />
            </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    modal: {
        backgroundColor: 'white',
        margin: 0,
        borderRadius: 0,
        paddingTop: 2,
        padding: 16,
        maxHeight: '100%',
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    tabContainer: {
        flexDirection: 'row', // Keep flexDirection as row for horizontal scrolling
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.backdrop,
        paddingBottom: 5, // Add some padding to prevent bottom border from cutting off
    },
    tabButton: {
        height: 50,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 5,
        borderBottomColor: 'transparent',
        marginHorizontal: 5, // Add horizontal margin between buttons
    },
    activeTabButton: {
        // borderBottomColor will be set dynamically
    },
    tabButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: theme.colors.placeholder,
    },
    activeTabButtonText: {
        fontWeight: 'bold',
        // color will be set dynamically
    },
    scrollContainer: {
        paddingBottom: 20,
    },
    orderCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: 8,
        borderLeftWidth: 5,
        marginBottom: 15,
        padding: 15,
        ...theme.shadows.sm,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    orderInfo: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    orderId: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginRight: 10,
    },
    orderTime: {
        fontSize: 12,
        color: theme.colors.placeholder,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 15,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 5,
    },
    orderDetails: {
        marginBottom: 10,
    },
    orderType: {
        fontSize: 14,
        color: theme.colors.text,
        marginBottom: 2,
    },
    orderSource: {
        fontSize: 14,
        color: theme.colors.text,
        marginBottom: 2,
    },
    customerInfo: {
        fontSize: 13,
        color: theme.colors.placeholder,
        marginBottom: 2,
    },
    employeeInfo: {
        fontSize: 13,
        color: theme.colors.placeholder,
        marginBottom: 2,
    },
    storeInfo: {
        fontSize: 13,
        color: theme.colors.placeholder,
        marginBottom: 2,
    },
    itemsContainer: {
        borderTopWidth: 1,
        borderTopColor: theme.colors.backdrop,
        paddingTop: 10,
        marginBottom: 10,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    itemQuantity: {
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginRight: 10,
    },
    itemName: {
        flex: 1,
        fontSize: 14,
        color: theme.colors.text,
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginLeft: 10,
    },
    orderTotal: {
        alignItems: 'flex-end',
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: theme.colors.backdrop,
        paddingTop: 10,
    },
    totalText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    actionButton: {
        marginTop: 15,
        borderRadius: 8,
    },
    actionButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    emptyStateText: {
        fontSize: 16,
        color: theme.colors.placeholder,
    },
});

export default AllOrdersModal;