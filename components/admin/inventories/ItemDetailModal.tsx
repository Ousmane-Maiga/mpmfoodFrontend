// import React from 'react';
// import { View, StyleSheet } from 'react-native';
// import { Modal, Portal, Text, Button } from 'react-native-paper';
// import { InventoryItem } from '@/types/admin';

// type ItemDetailModalProps = {
//   visible: boolean;
//   onClose: () => void;
//   item: InventoryItem | null;
// };

// export default function ItemDetailModal({ visible, onClose, item }: ItemDetailModalProps) {
//   if (!item) return null;

//   return (
//     <Portal>
//       <Modal 
//         visible={visible} 
//         onDismiss={onClose}
//         contentContainerStyle={styles.modalContainer}
//       >
//         <Text style={styles.modalTitle}>{item.name}</Text>
        
//         <View style={styles.detailRow}>
//           <Text style={styles.detailLabel}>Type:</Text>
//           <Text style={styles.detailValue}>
//             {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
//           </Text>
//         </View>
        
//         <View style={styles.detailRow}>
//           <Text style={styles.detailLabel}>Current Quantity:</Text>
//           <Text style={styles.detailValue}>
//             {item.quantity} {item.unit}
//           </Text>
//         </View>
        
//         <View style={styles.detailRow}>
//           <Text style={styles.detailLabel}>Minimum Threshold:</Text>
//           <Text style={styles.detailValue}>
//             {item.min_threshold} {item.unit}
//           </Text>
//         </View>
        
//         <View style={styles.detailRow}>
//           <Text style={styles.detailLabel}>Last Restocked:</Text>
//           <Text style={styles.detailValue}>
//             {new Date(item.last_restocked).toLocaleDateString()}
//           </Text>
//         </View>
        
//         {item.supplier && (
//           <View style={styles.detailRow}>
//             <Text style={styles.detailLabel}>Supplier:</Text>
//             <Text style={styles.detailValue}>{item.supplier.name}</Text>
//           </View>
//         )}
        
//         {item.cost_per_unit && (
//           <View style={styles.detailRow}>
//             <Text style={styles.detailLabel}>Cost per Unit:</Text>
//             <Text style={styles.detailValue}>
//               ${item.cost_per_unit.toFixed(2)}
//             </Text>
//           </View>
//         )}

//         <Button 
//           mode="contained" 
//           onPress={onClose}
//           style={styles.closeButton}
//         >
//           Close
//         </Button>
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
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   detailRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 8,
//   },
//   detailLabel: {
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   detailValue: {
//     color: '#666',
//   },
//   closeButton: {
//     marginTop: 16,
//   },
// });