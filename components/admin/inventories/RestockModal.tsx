// import React, { useEffect, useState } from 'react';
// import { View, StyleSheet } from 'react-native';
// import { Modal, Portal, Text, Button, TextInput, useTheme } from 'react-native-paper';
// import { restockInventoryItem, getSuppliers } from '@/services/api';
// import { Supplier, InventoryItem } from '@/types/admin';

// type RestockModalProps = {
//   visible: boolean;
//   onClose: () => void;
//   item: InventoryItem | null;
//   onRestockSuccess: () => void;
// };

// export default function RestockModal({ visible, onClose, item, onRestockSuccess }: RestockModalProps) {
//   const theme = useTheme();
//   const [quantity, setQuantity] = useState('');
//   const [costPerUnit, setCostPerUnit] = useState('');
//   const [invoiceNumber, setInvoiceNumber] = useState('');
//   const [suppliers, setSuppliers] = useState<Supplier[]>([]);
//   const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (visible && item) {
//       fetchSuppliers();
//       setCostPerUnit(item.cost_per_unit?.toString() || '');
//       setSelectedSupplier(item.supplier_id || null);
//     }
//   }, [visible, item]);

//   const fetchSuppliers = async () => {
//     try {
//       const data = await getSuppliers();
//       setSuppliers(data);
//     } catch (error) {
//       console.error('Failed to fetch suppliers:', error);
//     }
//   };

//   const handleRestock = async () => {
//     if (!item || !quantity) return;

//     try {
//       setLoading(true);
//       await restockInventoryItem({
//         inventory_item_id: item.id,
//         quantity_added: parseFloat(quantity),
//         cost_per_unit: costPerUnit ? parseFloat(costPerUnit) : undefined,
//         supplier_id: selectedSupplier || undefined,
//         invoice_number: invoiceNumber || undefined
//       });
//       onRestockSuccess();
//       onClose();
//       resetForm();
//     } catch (error) {
//       console.error('Failed to restock item:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setQuantity('');
//     setCostPerUnit('');
//     setInvoiceNumber('');
//     setSelectedSupplier(null);
//   };

//   return (
//     <Portal>
//       <Modal 
//         visible={visible} 
//         onDismiss={onClose}
//         contentContainerStyle={styles.modalContainer}
//       >
//         <Text style={styles.modalTitle}>
//           Restock {item?.name}
//         </Text>

//         <TextInput
//           label="Quantity to Add"
//           value={quantity}
//           onChangeText={setQuantity}
//           keyboardType="numeric"
//           style={styles.input}
//         />

//         <TextInput
//           label="Cost Per Unit"
//           value={costPerUnit}
//           onChangeText={setCostPerUnit}
//           keyboardType="numeric"
//           style={styles.input}
//         />

//         <TextInput
//           label="Invoice Number (Optional)"
//           value={invoiceNumber}
//           onChangeText={setInvoiceNumber}
//           style={styles.input}
//         />

//         <View style={styles.supplierContainer}>
//           <Text style={styles.label}>Supplier:</Text>
//           <View style={styles.supplierButtons}>
//             {suppliers.map(supplier => (
//               <Button
//                 key={supplier.id}
//                 mode={selectedSupplier === supplier.id ? "contained" : "outlined"}
//                 onPress={() => setSelectedSupplier(supplier.id)}
//                 style={styles.supplierButton}
//               >
//                 {supplier.name}
//               </Button>
//             ))}
//           </View>
//         </View>

//         <View style={styles.buttonContainer}>
//           <Button 
//             mode="outlined" 
//             onPress={() => {
//               onClose();
//               resetForm();
//             }}
//             style={styles.button}
//           >
//             Cancel
//           </Button>
//           <Button 
//             mode="contained" 
//             onPress={handleRestock}
//             loading={loading}
//             disabled={!quantity}
//             style={styles.button}
//           >
//             Confirm Restock
//           </Button>
//         </View>
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
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   input: {
//     marginBottom: 8,
//   },
//   supplierContainer: {
//     marginBottom: 16,
//   },
//   label: {
//     marginBottom: 8,
//     fontWeight: 'bold',
//   },
//   supplierButtons: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//   },
//   supplierButton: {
//     margin: 4,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 16,
//   },
//   button: {
//     flex: 1,
//     marginHorizontal: 4,
//   },
// });