// import React, { useState, useEffect } from 'react';
// import { View, StyleSheet } from 'react-native';
// import { Modal, Portal, Text, DataTable, Button, TextInput, useTheme } from 'react-native-paper';
// import { getSuppliers, createSupplier, updateSupplier } from '@/services/api';
// import { Supplier } from '../../../types/admin'

// type SuppliersModalProps = {
//   visible: boolean;
//   onClose: () => void;
// };

// export default function SuppliersModal({ visible, onClose }: SuppliersModalProps) {
//   const theme = useTheme();
//   const [suppliers, setSuppliers] = useState<Supplier[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     contact_person: '',
//     email: '',
//     phone: '',
//     address: ''
//   });

//   useEffect(() => {
//     if (visible) {
//       fetchSuppliers();
//     }
//   }, [visible]);

//   const fetchSuppliers = async () => {
//     try {
//       setLoading(true);
//       const data = await getSuppliers();
//       setSuppliers(data);
//     } catch (error) {
//       console.error('Failed to fetch suppliers:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (field: string, value: string) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleSubmit = async () => {
//     try {
//       setLoading(true);
//       if (editingSupplier) {
//         await updateSupplier(editingSupplier.id, formData);
//       } else {
//         await createSupplier(formData);
//       }
//       await fetchSuppliers();
//       resetForm();
//     } catch (error) {
//       console.error('Failed to save supplier:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       name: '',
//       contact_person: '',
//       email: '',
//       phone: '',
//       address: ''
//     });
//     setEditingSupplier(null);
//   };

//   const handleEdit = (supplier: Supplier) => {
//     setEditingSupplier(supplier);
//     setFormData({
//       name: supplier.name,
//       contact_person: supplier.contact_person || '',
//       email: supplier.email || '',
//       phone: supplier.phone || '',
//       address: supplier.address || ''
//     });
//   };

//   return (
//     <Portal>
//       <Modal 
//         visible={visible} 
//         onDismiss={onClose}
//         contentContainerStyle={styles.modalContainer}
//       >
//         <Text style={styles.modalTitle}>
//           {editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
//         </Text>

//         <TextInput
//           label="Supplier Name"
//           value={formData.name}
//           onChangeText={(text) => handleInputChange('name', text)}
//           style={styles.input}
//         />

//         <TextInput
//           label="Contact Person"
//           value={formData.contact_person}
//           onChangeText={(text) => handleInputChange('contact_person', text)}
//           style={styles.input}
//         />

//         <TextInput
//           label="Email"
//           value={formData.email}
//           onChangeText={(text) => handleInputChange('email', text)}
//           style={styles.input}
//           keyboardType="email-address"
//         />

//         <TextInput
//           label="Phone"
//           value={formData.phone}
//           onChangeText={(text) => handleInputChange('phone', text)}
//           style={styles.input}
//           keyboardType="phone-pad"
//         />

//         <TextInput
//           label="Address"
//           value={formData.address}
//           onChangeText={(text) => handleInputChange('address', text)}
//           style={styles.input}
//           multiline
//         />

//         <View style={styles.formButtons}>
//           <Button 
//             mode="outlined" 
//             onPress={resetForm}
//             style={styles.formButton}
//           >
//             Cancel
//           </Button>
//           <Button 
//             mode="contained" 
//             onPress={handleSubmit}
//             loading={loading}
//             disabled={!formData.name}
//             style={styles.formButton}
//           >
//             {editingSupplier ? 'Update' : 'Save'}
//           </Button>
//         </View>

//         <Text style={styles.sectionTitle}>Supplier List</Text>
//         <DataTable>
//           <DataTable.Header>
//             <DataTable.Title>Name</DataTable.Title>
//             <DataTable.Title>Contact</DataTable.Title>
//             <DataTable.Title numeric>Actions</DataTable.Title>
//           </DataTable.Header>

//           {suppliers.map((supplier) => (
//             <DataTable.Row key={supplier.id}>
//               <DataTable.Cell>{supplier.name}</DataTable.Cell>
//               <DataTable.Cell>{supplier.contact_person || '-'}</DataTable.Cell>
//               <DataTable.Cell numeric>
//                 <Button 
//                   compact 
//                   mode="outlined" 
//                   onPress={() => handleEdit(supplier)}
//                 >
//                   Edit
//                 </Button>
//               </DataTable.Cell>
//             </DataTable.Row>
//           ))}
//         </DataTable>

//         <View style={styles.buttonContainer}>
//           <Button mode="contained" onPress={onClose}>
//             Close
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
//     maxHeight: '80%',
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   input: {
//     marginBottom: 8,
//   },
//   formButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 16,
//   },
//   formButton: {
//     flex: 1,
//     marginHorizontal: 4,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginVertical: 8,
//   },
//   buttonContainer: {
//     marginTop: 16,
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
// });