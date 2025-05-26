// import React, { useState } from 'react';
// import { View, StyleSheet, ActivityIndicator } from 'react-native';
// import { Modal, Portal, Text, DataTable, SegmentedButtons, useTheme, Button } from 'react-native-paper';
// import SuppliersModal from './SupplierModal';
// import RestockModal from './RestockModal';
// import { InventoryItem, InventoryUsage } from '@/types/admin';

// type InventoryModalProps = {
//   visible: boolean;
//   onClose: () => void;
//   items: InventoryItem[] | null; // Changed to accept null
//   usage: InventoryUsage[] | null; // Changed to accept null
//   timeRange: 'daily' | 'weekly' | 'monthly';
//   onTimeRangeChange: (range: 'daily' | 'weekly' | 'monthly') => void;
//   loading?: boolean;
// };

// export default function InventoryModal({
//   visible,
//   onClose,
//   items = [], // Default empty array
//   usage = [], // Default empty array
//   timeRange,
//   onTimeRangeChange,
//   loading = false
// }: InventoryModalProps) {
//   const theme = useTheme();
//   const [showSuppliers, setShowSuppliers] = useState(false);
//   const [showRestock, setShowRestock] = useState(false);
//   const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

//   const handleRestock = (item: InventoryItem) => {
//     setSelectedItem(item);
//     setShowRestock(true);
//   };

//   return (
//     <Portal>
//       <Modal 
//         visible={visible} 
//         onDismiss={onClose}
//         contentContainerStyle={styles.modalContainer}
//       >
//         <Text style={styles.modalTitle}>Inventory Management</Text>
        
//         <View style={styles.actionButtons}>
//           <Button 
//             mode="outlined" 
//             onPress={() => setShowSuppliers(true)}
//             style={styles.actionButton}
//           >
//             Manage Suppliers
//           </Button>
//         </View>

//         <SegmentedButtons
//           value={timeRange}
//           onValueChange={(value) => onTimeRangeChange(value as 'daily' | 'weekly' | 'monthly')}
//           buttons={[
//             { value: 'daily', label: 'Daily' },
//             { value: 'weekly', label: 'Weekly' },
//             { value: 'monthly', label: 'Monthly' },
//           ]}
//           style={styles.segmentButtons}
//         />

//         {loading ? (
//           <ActivityIndicator animating={true} style={styles.loader} />
//         ) : (
//           <>
//             <View style={styles.section}>
//               <Text style={styles.sectionTitle}>Current Inventory Levels</Text>
//               <DataTable>
//                 <DataTable.Header>
//                   <DataTable.Title>Item</DataTable.Title>
//                   <DataTable.Title numeric>Quantity</DataTable.Title>
//                   <DataTable.Title numeric>Threshold</DataTable.Title>
//                   <DataTable.Title numeric>Supplier</DataTable.Title>
//                   <DataTable.Title numeric>Actions</DataTable.Title>
//                 </DataTable.Header>

//                 {items?.map((item) => (
//                   <DataTable.Row key={item.id}>
//                     <DataTable.Cell>{item.name}</DataTable.Cell>
//                     <DataTable.Cell numeric>
//                       <Text style={{
//                         color: item.quantity <= item.min_threshold ? theme.colors.error : theme.colors.primary
//                       }}>
//                         {item.quantity} {item.unit}
//                       </Text>
//                     </DataTable.Cell>
//                     <DataTable.Cell numeric>{item.min_threshold} {item.unit}</DataTable.Cell>
//                     <DataTable.Cell numeric>{item.supplier?.name || '-'}</DataTable.Cell>
//                     <DataTable.Cell numeric>
//                       <Button 
//                         compact 
//                         mode="contained" 
//                         onPress={() => handleRestock(item)}
//                         disabled={loading}
//                       >
//                         Restock
//                       </Button>
//                     </DataTable.Cell>
//                   </DataTable.Row>
//                 ))}
//               </DataTable>
//               {items?.length === 0 && (
//                 <Text style={styles.emptyText}>No inventory items found</Text>
//               )}
//             </View>

//             <View style={styles.section}>
//               <Text style={styles.sectionTitle}>{timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} Usage</Text>
//               <DataTable>
//                 <DataTable.Header>
//                   <DataTable.Title>Item</DataTable.Title>
//                   <DataTable.Title numeric>Quantity Used</DataTable.Title>
//                   <DataTable.Title numeric>Cost</DataTable.Title>
//                   <DataTable.Title numeric>Supplier</DataTable.Title>
//                 </DataTable.Header>

//                 {usage?.map((usageItem) => (
//                   <DataTable.Row key={usageItem.id}>
//                     <DataTable.Cell>{usageItem.name}</DataTable.Cell>
//                     <DataTable.Cell numeric>{usageItem.quantity_used} {usageItem.unit}</DataTable.Cell>
//                     <DataTable.Cell numeric>${(usageItem.quantity_used * (usageItem.cost_per_unit || 0)).toFixed(2)}</DataTable.Cell>
//                     <DataTable.Cell numeric>{usageItem.supplier?.name || '-'}</DataTable.Cell>
//                   </DataTable.Row>
//                 ))}
//               </DataTable>
//               {usage?.length === 0 && (
//                 <Text style={styles.emptyText}>No usage data available</Text>
//               )}
//             </View>
//           </>
//         )}

//         <View style={styles.buttonContainer}>
//           <Button mode="contained" onPress={onClose} disabled={loading}>
//             Close
//           </Button>
//         </View>

//         <SuppliersModal
//           visible={showSuppliers}
//           onClose={() => setShowSuppliers(false)}
//         />

//         <RestockModal
//           visible={showRestock}
//           onClose={() => setShowRestock(false)}
//           item={selectedItem}
//           onRestockSuccess={() => {
//             onTimeRangeChange(timeRange);
//           }}
//         />
//       </Modal>
//     </Portal>
//   );
// }

// const styles = StyleSheet.create({
//   modalContainer: {
//     backgroundColor: 'white',
//     padding: 20,
//     margin: 20,
//     borderRadius: 8,
//     maxHeight: '80%',
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   segmentButtons: {
//     marginBottom: 16,
//   },
//   section: {
//     marginBottom: 20,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
//   buttonContainer: {
//     marginTop: 16,
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   actionButtons: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     marginBottom: 16,
//   },
//   actionButton: {
//     marginLeft: 8,
//   },
//   loader: {
//     marginVertical: 20,
//   },
//   emptyText: {
//     textAlign: 'center',
//     marginVertical: 16,
//     color: '#666',
//   }
// });