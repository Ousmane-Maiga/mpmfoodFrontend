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
import { InventoryItem, Supplier } from '@/types/admin';
import { getSuppliers } from '@/services/api';

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
        <View style={styles.container}>
          <Text style={styles.title}>Edit Inventory Item</Text>
          
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
              Save Changes
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