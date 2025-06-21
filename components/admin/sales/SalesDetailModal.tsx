// // components/admin/sales/SalesDetailModal.tsx
// import React from 'react';
// import { Modal, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
// import { Text } from '@/components/ui/Text';
// import { theme } from '@/constants/theme';
// import { Ionicons } from '@expo/vector-icons';
// import { Order, OrderItem } from '@/types/cashierTypes'; // Import Order and OrderItem types
// import { format } from 'date-fns';

// interface SalesDetailModalProps {
//     visible: boolean;
//     onClose: () => void;
//     order: Order | null;
// }

// const SalesDetailModal: React.FC<SalesDetailModalProps> = ({ visible, onClose, order }) => {
//     if (!order) return null;

//     const formatPrice = (price: number): string => {
//         // Ensure the price is a number before calling toFixed
//         return `${Number(price || 0).toFixed(2)}FCFA`;
//     };

//     return (
//         <Modal
//             visible={visible}
//             animationType="slide"
//             onRequestClose={onClose}
//         >
//             <View style={styles.container}>
//                 <View style={styles.header}>
//                     <Text style={theme.text.heading2}>Order #{order.id}</Text> {/* Use order.id */}
//                     <TouchableOpacity onPress={onClose} style={styles.closeButton}>
//                         <Ionicons name="close" size={24} color={theme.colors.text} />
//                     </TouchableOpacity>
//                 </View>

//                 <ScrollView contentContainerStyle={styles.contentContainer}>
//                     <View style={styles.detailSection}>
//                         <Text style={styles.detailTitle}>Order Information</Text>
//                         <Text style={styles.detailText}>Date: {order.created_at ? format(new Date(order.created_at), 'MMM dd,yyyy HH:mm') : 'N/A'}</Text> {/* Use order.created_at */}
//                         <Text style={styles.detailText}>Status: {order.status}</Text>
//                         <Text style={styles.detailText}>Type: {order.order_type}</Text> {/* Use order.order_type */}
//                         <Text style={styles.detailText}>Source: {order.order_source}</Text> {/* Use order.order_source */}
//                         {/* FIX: Convert order.total_amount to Number before passing to formatPrice */}
//                         <Text style={styles.detailText}>Total: {formatPrice(Number(order.total_amount || 0))}</Text> 
//                         <Text style={styles.detailText}>Cashier: {order.created_by_name || 'N/A'}</Text> {/* Use order.created_by_name */}
//                         {order.customer_name && <Text style={styles.detailText}>Customer: {order.customer_name}</Text>} {/* Use order.customer_name */}
//                         {order.notes && <Text style={styles.detailText}>Notes: {order.notes}</Text>}
//                     </View>

//                     {order.order_items && order.order_items.length > 0 && ( /* Use order.order_items */
//                         <View style={styles.detailSection}>
//                             <Text style={styles.detailTitle}>Items</Text>
//                             {order.order_items.map((item: OrderItem, index: number) => (
//                                 <View key={item.id || index} style={styles.itemRow}> {/* Use item.id if available, else index */}
//                                     <Text style={styles.itemText}>{item.product} {item.variant ? `(${item.variant})` : ''} ({item.quantity})</Text> {/* Use item.product and item.variant */}
//                                     {/* FIX: Convert item.total_price to Number before passing to formatPrice */}
//                                     <Text style={styles.itemText}>{formatPrice(Number(item.total_price || 0))}</Text> 
//                                 </View>
//                             ))}
//                         </View>
//                     )}

//                     {/* Removed paymentDetails section as it's not part of the Order type based on provided models.
//                         If you need this, extend your Order type and backend response. */}
//                     {/* {order.paymentDetails && (
//                         <View style={styles.detailSection}>
//                             <Text style={styles.detailTitle}>Payment Details</Text>
//                             <Text style={styles.detailText}>Method: {order.paymentDetails.method}</Text>
//                             <Text style={styles.detailText}>Amount Paid: {formatPrice(order.paymentDetails.amountPaid)}</Text>
//                             {order.paymentDetails.changeGiven !== undefined && (
//                                 <Text style={styles.detailText}>Change Given: {formatPrice(order.paymentDetails.changeGiven)}</Text>
//                             )}
//                             {order.paymentDetails.transactionId && (
//                                 <Text style={styles.detailText}>Transaction ID: {order.paymentDetails.transactionId}</Text>
//                             )}
//                         </View>
//                     )} */}
//                 </ScrollView>
//             </View>
//         </Modal>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: theme.colors.background,
//         padding: theme.spacing.md,
//         paddingTop: theme.spacing.xl, // Adjust for safe area
//     },
//     header: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: theme.spacing.lg,
//     },
//     closeButton: {
//         padding: theme.spacing.sm,
//     },
//     contentContainer: {
//         paddingBottom: theme.spacing.lg,
//     },
//     detailSection: {
//         backgroundColor: theme.colors.cardBackground,
//         padding: theme.spacing.md,
//         borderRadius: theme.roundness,
//         marginBottom: theme.spacing.md,
//         ...theme.shadows.sm,
//     },
//     detailTitle: {
//         ...theme.text.heading3,
//         color: theme.colors.primary,
//         marginBottom: theme.spacing.sm,
//     },
//     detailText: {
//         ...theme.text.body,
//         color: theme.colors.text,
//         marginBottom: theme.spacing.xs,
//     },
//     itemRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         paddingVertical: theme.spacing.xs,
//         borderBottomWidth: StyleSheet.hairlineWidth,
//         borderBottomColor: theme.colors.borderLight,
//         marginBottom: theme.spacing.xs,
//     },
//     itemText: {
//         ...theme.text.body,
//         color: theme.colors.textSecondary,
//     },
// });

// export default SalesDetailModal;
