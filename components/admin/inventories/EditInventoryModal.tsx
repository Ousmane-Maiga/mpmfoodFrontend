// // components/admin/inventory/EditInventoryModal

// import React, { useState, useEffect } from 'react';
// import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
// import {
//   Modal,
//   Portal,
//   Text,
//   Button,
//   TextInput,
//   Menu,
//   Divider,
//   RadioButton,
// } from 'react-native-paper';
// import { InventoryItem, Supplier } from '@/types/admin';
// import { getSuppliers } from '@/services/api';
// import { theme } from '@/constants/theme'

// interface EditInventoryModalProps {
//   visible: boolean;
//   onClose: () => void;
//   onSubmit: (item: InventoryItem) => void;
//   item: InventoryItem | null;
// }

// export default function EditInventoryModal({ visible, onClose, onSubmit, item }: EditInventoryModalProps) {
//   const [name, setName] = useState('');
//   const [type, setType] = useState<'ingredient' | 'container' | 'packaging'>('ingredient');
//   const [quantity, setQuantity] = useState('0');
//   const [unit, setUnit] = useState('');
//   const [minThreshold, setMinThreshold] = useState('0');
//   const [supplierId, setSupplierId] = useState<number | null>(null);
//   const [costPerUnit, setCostPerUnit] = useState('');
//   const [suppliers, setSuppliers] = useState<Supplier[]>([]);
//   const [showSupplierMenu, setShowSupplierMenu] = useState(false);

//   const paperInputTheme = {
//     colors: {
//       primary: theme.colors.primary,
//       outline: theme.colors.primary,
//       text: theme.colors.text,
//       placeholder: theme.colors.placeholder,
//     },
//   };

//   useEffect(() => {
//     const fetchSuppliers = async () => {
//       try {
//         const data = await getSuppliers();
//         setSuppliers(data);
//       } catch (error) {
//         console.error('Failed to fetch suppliers:', error);
//       }
//     };
//     fetchSuppliers();
//   }, []);

//   useEffect(() => {
//     if (item) {
//       setName(item.name);
//       setType(item.type);
//       setQuantity(item.quantity.toString());
//       setUnit(item.unit);
//       setMinThreshold(item.min_threshold.toString());
//       setSupplierId(item.supplier_id || null);
//       setCostPerUnit(item.cost_per_unit?.toString() || '');
//     }
//   }, [item]);

//   const handleSubmit = () => {
//     if (!item) return;

//     const updatedItem: InventoryItem = {
//       ...item,
//       name,
//       type,
//       quantity: parseFloat(quantity),
//       unit,
//       min_threshold: parseFloat(minThreshold),
//       supplier_id: supplierId !== null ? supplierId : undefined,
//       cost_per_unit: costPerUnit ? parseFloat(costPerUnit) : undefined
//     };

//     onSubmit(updatedItem);
//   };

//   return (
//     <Portal>
//       <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.modal}>
//         <KeyboardAvoidingView
//           behavior={Platform.OS === "ios" ? "padding" : "height"}
//           style={styles.keyboardAvoidingView}
//         >
//           <ScrollView contentContainerStyle={styles.scrollViewContent}>
//             <View style={styles.container}>
//               <Text style={styles.title}>Edit Inventory Item</Text>

//               <TextInput
//                 label="Item Name*"
//                 value={name}
//                 onChangeText={setName}
//                 style={styles.input}
//                 mode="outlined"
//                 theme={paperInputTheme}
//               />

//               <View style={styles.typeContainer}>
//                 <Text style={styles.typeLabel}>Type*</Text>
//                 <RadioButton.Group onValueChange={value => setType(value as any)} value={type}>
//                   <View style={styles.radioRow}>
//                     <View style={styles.radioOption}>
//                       <RadioButton value="ingredient" color={theme.colors.primary} />
//                       <Text style={{ color: theme.colors.text }}>Ingredient</Text>
//                     </View>
//                     <View style={styles.radioOption}>
//                       <RadioButton value="container" color={theme.colors.primary} />
//                       <Text style={{ color: theme.colors.text }}>Container</Text>
//                     </View>
//                     <View style={styles.radioOption}>
//                       <RadioButton value="packaging" color={theme.colors.primary} />
//                       <Text style={{ color: theme.colors.text }}>Packaging</Text>
//                     </View>
//                   </View>
//                 </RadioButton.Group>
//               </View>

//               <TextInput
//                 label="Quantity*"
//                 value={quantity}
//                 onChangeText={setQuantity}
//                 keyboardType="numeric"
//                 style={styles.input}
//                 mode="outlined"
//                 theme={paperInputTheme}
//               />

//               <TextInput
//                 label="Unit* (e.g., kg, g, liters, units)"
//                 value={unit}
//                 onChangeText={setUnit}
//                 style={styles.input}
//                 mode="outlined"
//                 theme={paperInputTheme}
//               />

//               <TextInput
//                 label="Minimum Threshold*"
//                 value={minThreshold}
//                 onChangeText={setMinThreshold}
//                 keyboardType="numeric"
//                 style={styles.input}
//                 mode="outlined"
//                 theme={paperInputTheme}
//               />

//               <TextInput
//                 label="Cost Per Unit"
//                 value={costPerUnit}
//                 onChangeText={setCostPerUnit}
//                 keyboardType="numeric"
//                 style={styles.input}
//                 mode="outlined"
//                 left={<TextInput.Affix text="$" />}
//                 theme={paperInputTheme}
//               />

//               <Menu
//                 visible={showSupplierMenu}
//                 onDismiss={() => setShowSupplierMenu(false)}
//                 anchor={
//                   <Button
//                     onPress={() => setShowSupplierMenu(true)}
//                     style={styles.input}
//                     labelStyle={{ color: theme.colors.primary }}
//                     mode="outlined"
//                   >
//                     {supplierId ? suppliers.find(s => s.id === supplierId)?.name : 'Select Supplier'}
//                   </Button>
//                 }
//               >
//                 {suppliers.map(supplier => (
//                   <Menu.Item
//                     key={supplier.id}
//                     onPress={() => {
//                       setSupplierId(supplier.id);
//                       setShowSupplierMenu(false);
//                     }}
//                     title={supplier.name}
//                   />
//                 ))}
//                 <Divider />
//                 <Menu.Item
//                   onPress={() => {
//                     setSupplierId(null);
//                     setShowSupplierMenu(false);
//                   }}
//                   title="None"
//                 />
//               </Menu>

//               <View style={styles.buttonContainer}>
//                 <Button
//                   mode="outlined"
//                   onPress={onClose}
//                   style={styles.button}
//                   labelStyle={{ color: theme.colors.primary }}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   mode="contained"
//                   onPress={handleSubmit}
//                   style={[styles.button, { backgroundColor: theme.colors.primary }]}
//                   labelStyle={{ color: '#fff' }}
//                   disabled={!name || !quantity || !unit || !minThreshold || !type}
//                 >
//                   Save Changes
//                 </Button>
//               </View>
//             </View>
//           </ScrollView>
//         </KeyboardAvoidingView>
//       </Modal>
//     </Portal>
//   );
// }


// const styles = StyleSheet.create({
//   modal: {
//     padding: 0,
//     justifyContent: 'center', // Center the modal vertically
//   },
//   keyboardAvoidingView: {
//     justifyContent: 'center', // Center content vertically within the keyboard avoiding view
//   },
//   scrollViewContent: {
//     flexGrow: 1, // Allow content to grow
//     justifyContent: 'center', // Center content if it doesn't fill the screen
//   },
//   container: {
//     backgroundColor: 'white',
//     padding: 20,
//     borderRadius: 8,
//     marginHorizontal: 20, // Add horizontal margin to keep it centered
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//     color: '#000'
//   },
//   input: {
//     marginBottom: 15,
//     backgroundColor: '#fff',
//   },
//   typeContainer: {
//     marginBottom: 15,
//   },
//   typeLabel: {
//     marginBottom: 8,
//     fontSize: 12,
//     color: '#000', 
//   },
//   radioRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     // Removed backgroundColor: '#666' here
//   },
//   radioOption: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 10,
//   },
//   button: {
//     flex: 1,
//     marginHorizontal: 5,
//   },
// });



import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import {
  Modal,
  Portal,
  Text,
  Button,
  TextInput,
  Menu,
  Divider,
  RadioButton,
} from 'react-native-paper';
import { InventoryItem, Supplier } from '@/types/admin';
import { getSuppliers } from '@/services/api';
import { theme } from '@/constants/theme'

interface EditInventoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (item: InventoryItem) => void;
  item: InventoryItem | null;
}

export default function EditInventoryModal({ visible, onClose, onSubmit, item }: EditInventoryModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'ingredient' | 'container' | 'packaging'>('ingredient');
  const [quantity, setQuantity] = useState('0');
  const [unit, setUnit] = useState('');
  const [minThreshold, setMinThreshold] = useState('0');
  const [supplierId, setSupplierId] = useState<number | null>(null);
  const [costPerUnit, setCostPerUnit] = useState('');
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [showSupplierMenu, setShowSupplierMenu] = useState(false);

  const paperInputTheme = {
    colors: {
      primary: theme.colors.primary, // For active state
      text: '#000000', // Black text color
      placeholder: '#666666', // Gray placeholder
      onSurface: '#666666', // For iOS labels
      outline: '#666666', // Gray border
      background: '#FFFFFF', // White background
      surface: '#FFFFFF', // White surface
    },
  };

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await getSuppliers();
        setSuppliers(data);
      } catch (error) {
        console.error('Failed to fetch suppliers:', error);
      }
    };
    fetchSuppliers();
  }, []);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setType(item.type);
      setQuantity(item.quantity.toString());
      setUnit(item.unit);
      setMinThreshold(item.min_threshold.toString());
      setSupplierId(item.supplier_id || null);
      setCostPerUnit(item.cost_per_unit?.toString() || '');
    }
  }, [item]);

  const handleSubmit = () => {
    if (!item) return;

    const updatedItem: InventoryItem = {
      ...item,
      name,
      type,
      quantity: parseFloat(quantity),
      unit,
      min_threshold: parseFloat(minThreshold),
      supplier_id: supplierId !== null ? supplierId : undefined,
      cost_per_unit: costPerUnit ? parseFloat(costPerUnit) : undefined
    };

    onSubmit(updatedItem);
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.modal}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.container}>
              <Text style={styles.title}>Edit Inventory Item</Text>

              <TextInput
                label="Item Name*"
                value={name}
                onChangeText={setName}
                style={styles.input}
                mode="outlined"
                theme={paperInputTheme}
                textColor="#000000"
                outlineColor="#666666"
                activeOutlineColor={theme.colors.primary}
              />

              <View style={styles.typeContainer}>
                <Text style={styles.typeLabel}>Type*</Text>
                <RadioButton.Group onValueChange={value => setType(value as any)} value={type}>
                  <View style={styles.radioRow}>
                    <View style={styles.radioOption}>
                      <RadioButton value="ingredient" color={theme.colors.primary} />
                      <Text style={{ color: '#000000' }}>Ingredient</Text>
                    </View>
                    <View style={styles.radioOption}>
                      <RadioButton value="container" color={theme.colors.primary} />
                      <Text style={{ color: '#000000' }}>Container</Text>
                    </View>
                    <View style={styles.radioOption}>
                      <RadioButton value="packaging" color={theme.colors.primary} />
                      <Text style={{ color: '#000000' }}>Packaging</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>

              <TextInput
                label="Quantity*"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                style={styles.input}
                mode="outlined"
                theme={paperInputTheme}
                textColor="#000000"
                outlineColor="#666666"
                activeOutlineColor={theme.colors.primary}
              />

              <TextInput
                label="Unit* (e.g., kg, g, liters, units)"
                value={unit}
                onChangeText={setUnit}
                style={styles.input}
                mode="outlined"
                theme={paperInputTheme}
                textColor="#000000"
                outlineColor="#666666"
                activeOutlineColor={theme.colors.primary}
              />

              <TextInput
                label="Minimum Threshold*"
                value={minThreshold}
                onChangeText={setMinThreshold}
                keyboardType="numeric"
                style={styles.input}
                mode="outlined"
                theme={paperInputTheme}
                textColor="#000000"
                outlineColor="#666666"
                activeOutlineColor={theme.colors.primary}
              />

              <TextInput
                label="Cost Per Unit"
                value={costPerUnit}
                onChangeText={setCostPerUnit}
                keyboardType="numeric"
                style={styles.input}
                mode="outlined"
                left={<TextInput.Affix text="" />}
                theme={paperInputTheme}
                textColor="#000000"
                outlineColor="#666666"
                activeOutlineColor={theme.colors.primary}
              />

              <Menu
                visible={showSupplierMenu}
                onDismiss={() => setShowSupplierMenu(false)}
                anchor={
                  <Button
                    onPress={() => setShowSupplierMenu(true)}
                    style={[styles.input, { backgroundColor: theme.colors.primary }]}
                    labelStyle={{ color: '#fff' }}
                    mode="contained"
                  >
                    {supplierId ? suppliers.find(s => s.id === supplierId)?.name : 'Select Supplier'}
                  </Button>
                }
                contentStyle={{ backgroundColor: theme.colors.primaryLight }}
              >
                {suppliers.map(supplier => (
                  <Menu.Item
                    key={supplier.id}
                    onPress={() => {
                      setSupplierId(supplier.id);
                      setShowSupplierMenu(false);
                    }}
                    title={supplier.name}
                    titleStyle={{ color: theme.colors.primary }}
                  />
                ))}
                <Divider />
                <Menu.Item
                  onPress={() => {
                    setSupplierId(null);
                    setShowSupplierMenu(false);
                  }}
                  title="None"
                  titleStyle={{ color: theme.colors.primary }}
                />
              </Menu>

              <View style={styles.buttonContainer}>
                <Button
                  mode="outlined"
                  onPress={onClose}
                  style={[styles.button, { borderColor: theme.colors.primary }]}
                  labelStyle={{ color: theme.colors.primary }}
                  textColor={theme.colors.primary}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  style={[styles.button, { backgroundColor: theme.colors.primary }]}
                  labelStyle={{ color: '#FFFFFF' }}
                  textColor="#FFFFFF"
                  disabled={!name || !quantity || !unit || !minThreshold || !type}
                >
                  Save Changes
                </Button>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    padding: 0,
    justifyContent: 'center',
  },
  keyboardAvoidingView: {
    justifyContent: 'center',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    marginHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#000000',
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
  },
  typeContainer: {
    marginBottom: 15,
  },
  typeLabel: {
    marginBottom: 8,
    fontSize: 12,
    color: '#666666',
  },
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});