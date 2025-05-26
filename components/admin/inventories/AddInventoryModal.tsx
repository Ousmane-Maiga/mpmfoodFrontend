// import React, { useState, useEffect } from 'react';
// import { View, StyleSheet } from 'react-native';
// import { Modal, Portal, Text, Button, TextInput, useTheme, Menu, Divider } from 'react-native-paper';
// import { getSuppliers } from '@/services/api';

// interface AddInventoryModalProps {
//   visible: boolean;
//   onClose: () => void;
//   onSubmit: (item: any) => void;
// }

// export default function AddInventoryModal({ visible, onClose, onSubmit }: AddInventoryModalProps) {
//   const [name, setName] = useState('');
//   const [type, setType] = useState<'ingredient' | 'container' | 'packaging'>('ingredient');
//   const [quantity, setQuantity] = useState('');
//   const [unit, setUnit] = useState('');
//   const [minThreshold, setMinThreshold] = useState('');
//   const [supplierId, setSupplierId] = useState<number | null>(null);
//   const [costPerUnit, setCostPerUnit] = useState('');
//   const [suppliers, setSuppliers] = useState<any[]>([]);
//   const [showSupplierMenu, setShowSupplierMenu] = useState(false);
//   const theme = useTheme();

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

//   const handleSubmit = () => {
//     const newItem = {
//       name,
//       type,
//       quantity: parseFloat(quantity),
//       unit,
//       min_threshold: parseFloat(minThreshold),
//       supplier_id: supplierId || null,
//       cost_per_unit: costPerUnit ? parseFloat(costPerUnit) : null
//     };
//     onSubmit(newItem);
//     resetForm();
//   };

//   const resetForm = () => {
//     setName('');
//     setType('ingredient');
//     setQuantity('');
//     setUnit('');
//     setMinThreshold('');
//     setSupplierId(null);
//     setCostPerUnit('');
//   };

//   return (
//     <Portal>
//       <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.modal}>
//         <View style={styles.container}>
//           <Text style={styles.title}>Add New Inventory Item</Text>
          
//           <TextInput
//             label="Item Name"
//             value={name}
//             onChangeText={setName}
//             style={styles.input}
//             mode="outlined"
//           />
          
//           <Menu
//             visible={showSupplierMenu}
//             onDismiss={() => setShowSupplierMenu(false)}
//             anchor={
//               <Button 
//                 onPress={() => setShowSupplierMenu(true)}
//                 style={styles.input}
//                 mode="outlined"
//               >
//                 {supplierId ? suppliers.find(s => s.id === supplierId)?.name : 'Select Supplier'}
//               </Button>
//             }
//           >
//             {suppliers.map(supplier => (
//               <Menu.Item
//                 key={supplier.id}
//                 onPress={() => {
//                   setSupplierId(supplier.id);
//                   setShowSupplierMenu(false);
//                 }}
//                 title={supplier.name}
//               />
//             ))}
//             <Divider />
//             <Menu.Item
//               onPress={() => {
//                 setSupplierId(null);
//                 setShowSupplierMenu(false);
//               }}
//               title="None"
//             />
//           </Menu>

//           <TextInput
//             label="Quantity"
//             value={quantity}
//             onChangeText={setQuantity}
//             keyboardType="numeric"
//             style={styles.input}
//             mode="outlined"
//           />
          
//           <TextInput
//             label="Low Stock Threshold"
//             value={minThreshold}
//             onChangeText={setMinThreshold}
//             keyboardType="numeric"
//             style={styles.input}
//             mode="outlined"
//           />
          
//           <TextInput
//             label="Unit (e.g., kg, g, liters, units)"
//             value={unit}
//             onChangeText={setUnit}
//             style={styles.input}
//             mode="outlined"
//           />
          
//           <View style={styles.buttonContainer}>
//             <Button mode="outlined" onPress={onClose} style={styles.button}>
//               Cancel
//             </Button>
//             <Button 
//               mode="contained" 
//               onPress={handleSubmit}
//               style={[styles.button, { backgroundColor: theme.colors.primary }]}
//               disabled={!name || !quantity || !unit || !minThreshold}
//             >
//               Add Item
//             </Button>
//           </View>
//         </View>
//       </Modal>
//     </Portal>
//   );
// }

// const styles = StyleSheet.create({
//   modal: {
//     padding: 20,
//   },
//   container: {
//     backgroundColor: 'white',
//     padding: 20,
//     borderRadius: 8,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   input: {
//     marginBottom: 15,
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
import { View, StyleSheet } from 'react-native';
import { 
  Modal, 
  Portal, 
  Text, 
  Button, 
  TextInput, 
  useTheme, 
  Menu, 
  Divider,
  RadioButton
} from 'react-native-paper';
import { getSuppliers } from '@/services/api';
import { InventoryItem, Supplier } from '@/types/admin';

interface AddInventoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (item: Omit<InventoryItem, 'id' | 'created_at' | 'updated_at' | 'last_restocked'>) => void;
}

export default function AddInventoryModal({ visible, onClose, onSubmit }: AddInventoryModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'ingredient' | 'container' | 'packaging'>('ingredient');
  const [quantity, setQuantity] = useState('0');
  const [unit, setUnit] = useState('');
  const [minThreshold, setMinThreshold] = useState('0');
  const [supplierId, setSupplierId] = useState<number | null>(null);
  const [costPerUnit, setCostPerUnit] = useState('');
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [showSupplierMenu, setShowSupplierMenu] = useState(false);
  const theme = useTheme();

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

 const handleSubmit = () => {
  const newItem = {
    name,
    type,
    quantity: parseFloat(quantity),
    unit,
    min_threshold: parseFloat(minThreshold),
    ...(supplierId ? { supplier_id: supplierId } : { supplier_id: null }),
    ...(costPerUnit ? { cost_per_unit: parseFloat(costPerUnit) } : { cost_per_unit: null })
  };
  
  onSubmit(newItem);
  resetForm();
};
  const resetForm = () => {
    setName('');
    setType('ingredient');
    setQuantity('0');
    setUnit('');
    setMinThreshold('0');
    setSupplierId(null);
    setCostPerUnit('');
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.modal}>
        <View style={styles.container}>
          <Text style={styles.title}>Add New Inventory Item</Text>
          
          <TextInput
            label="Item Name*"
            value={name}
            onChangeText={setName}
            style={styles.input}
            mode="outlined"
          />
          
          <View style={styles.typeContainer}>
            <Text style={styles.typeLabel}>Type*</Text>
            <RadioButton.Group onValueChange={value => setType(value as any)} value={type}>
              <View style={styles.radioRow}>
                <View style={styles.radioOption}>
                  <RadioButton value="ingredient" />
                  <Text>Ingredient</Text>
                </View>
                <View style={styles.radioOption}>
                  <RadioButton value="container" />
                  <Text>Container</Text>
                </View>
                <View style={styles.radioOption}>
                  <RadioButton value="packaging" />
                  <Text>Packaging</Text>
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
          />
          
          <TextInput
            label="Unit* (e.g., kg, g, liters, units)"
            value={unit}
            onChangeText={setUnit}
            style={styles.input}
            mode="outlined"
          />
          
          <TextInput
            label="Minimum Threshold*"
            value={minThreshold}
            onChangeText={setMinThreshold}
            keyboardType="numeric"
            style={styles.input}
            mode="outlined"
          />
          
          <TextInput
            label="Cost Per Unit"
            value={costPerUnit}
            onChangeText={setCostPerUnit}
            keyboardType="numeric"
            style={styles.input}
            mode="outlined"
            left={<TextInput.Affix text="$" />}
          />

          <Menu
            visible={showSupplierMenu}
            onDismiss={() => setShowSupplierMenu(false)}
            anchor={
              <Button 
                onPress={() => setShowSupplierMenu(true)}
                style={styles.input}
                mode="outlined"
              >
                {supplierId ? suppliers.find(s => s.id === supplierId)?.name : 'Select Supplier'}
              </Button>
            }
          >
            {suppliers.map(supplier => (
              <Menu.Item
                key={supplier.id}
                onPress={() => {
                  setSupplierId(supplier.id);
                  setShowSupplierMenu(false);
                }}
                title={supplier.name}
              />
            ))}
            <Divider />
            <Menu.Item
              onPress={() => {
                setSupplierId(null);
                setShowSupplierMenu(false);
              }}
              title="None"
            />
          </Menu>

          <View style={styles.buttonContainer}>
            <Button mode="outlined" onPress={onClose} style={styles.button}>
              Cancel
            </Button>
            <Button 
              mode="contained" 
              onPress={handleSubmit}
              style={[styles.button, { backgroundColor: theme.colors.primary }]}
              disabled={!name || !quantity || !unit || !minThreshold || !type}
            >
              Add Item
            </Button>
          </View>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    padding: 20,
  },
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
  },
  typeContainer: {
    marginBottom: 15,
  },
  typeLabel: {
    marginBottom: 8,
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.54)',
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