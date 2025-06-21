// components/admin/inventory/AddInventoryModal

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
  RadioButton
} from 'react-native-paper';
import { getSuppliers } from '@/services/api';
import { InventoryItem, Supplier } from '@/types/admin';
import { theme } from '@/constants/theme'
import { ThemeContext } from '@react-navigation/core';

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
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.container}>
              <Text style={styles.title}>Add New Inventory Item</Text>
              
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
                    textColor={theme.colors.primary}
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
                    titleStyle={{ color:  theme.colors.primary }}
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
                  Add Item
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