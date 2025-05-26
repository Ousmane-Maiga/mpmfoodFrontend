import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Text, Alert } from 'react-native';
import { Button, SegmentedButtons, Divider, Modal, Portal } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './styles';
import { 
  AddOrderModalProps, 
  FormValues, 
  OrderItem, 
  Product, 
  OrderSource, 
  OrderType,
  FormErrors
} from '@/types/cashierTypes';
import OrderSummary from './OrderSummary';
import ProductSelectionModal from './ProductSelectionModal';

const DELIVERY_PERSONS = ['Boura', 'Ahmed', 'Fatima'];

const AddOrderModal: React.FC<AddOrderModalProps> = ({ 
  visible, 
  onClose, 
  onSubmit,
  products 
}) => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingItem, setEditingItem] = useState<OrderItem | null>(null);
  const [showDelivererDropdown, setShowDelivererDropdown] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>({
    orderType: 'delivery',
    name: '',
    phone: '',
    orderSource: 'phone',
    address: '',
    deliverer: '',
  });
 

const [errors, setErrors] = useState<FormErrors>({});

// Update the validateForm function
const validateForm = (): boolean => {
  const newErrors: FormErrors = {};
  
  if (!formValues.orderType) {
    newErrors.orderType = 'Order type is required';
  }
  
  if (!formValues.name) {
    newErrors.name = 'Customer name is required';
  }
  
  if (!formValues.phone) {
    newErrors.phone = 'Phone number is required';
  } else if (!/^[0-9]+$/.test(formValues.phone)) {
    newErrors.phone = 'Must be only digits';
  } else if (formValues.phone.length < 8) {
    newErrors.phone = 'Must be at least 8 digits';
  }
  
  if (!formValues.orderSource) {
    newErrors.orderSource = 'Order source is required';
  }
  
  if (formValues.orderType === 'delivery') {
    if (!formValues.address) {
      newErrors.address = 'Address is required for delivery';
    }
    if (!formValues.deliverer) {
      newErrors.deliverer = 'Deliverer is required for delivery';
    }
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  

  const handleAddOrUpdateProduct = (productId: number, variantId: number, quantity: number) => {
    const product = products.find(p => p.id === productId);
    const variant = product?.variants.find(v => v.id === variantId);
    
    if (!product || !variant) return;

    const unitPrice = variant.price;
    const totalPrice = unitPrice * quantity;

    if (editingItem) {
      setOrderItems(orderItems.map(item => 
        item.id === editingItem.id 
          ? { 
              ...item, 
              product_id: productId,
              product: product.name,
              variant_id: variantId,
              variant: variant.name,
              quantity,
              unit_price: unitPrice,
              total_price: totalPrice,
              price: unitPrice, // Keeping for backward compatibility
              total: totalPrice // Keeping for backward compatibility
            }
          : item
      ));
    } else {
      const newItem: OrderItem = {
        id: Date.now(),
        order_id: 0, // Will be set when order is created
        product_id: productId,
        variant_id: variantId,
        product: product.name,
        variant: variant.name,
        quantity,
        unit_price: unitPrice,
        discount_amount: 0,
        total_price: totalPrice,
        created_at: new Date().toISOString(),
        price: unitPrice, // Keeping for backward compatibility
        total: totalPrice // Keeping for backward compatibility
      };
      setOrderItems([...orderItems, newItem]);
    }
    setEditingItem(null);
  };

  const handleRemoveProduct = (id: number) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
  };

  const handleUpdateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setOrderItems(orderItems.map(item => {
      if (item.id === id) {
        const totalPrice = item.unit_price * newQuantity;
        return { 
          ...item, 
          quantity: newQuantity, 
          total_price: totalPrice,
          total: totalPrice // Keeping for backward compatibility
        };
      }
      return item;
    }));
  };

  const handleEditProduct = (item: OrderItem) => {
    setEditingItem(item);
    setShowProductModal(true);
  };

  const resetForm = () => {
    setOrderItems([]);
    setEditingItem(null);
    setFormValues({
      orderType: 'delivery',
      name: '',
      phone: '',
      orderSource: 'phone',
      address: '',
      deliverer: '',
    });
    setErrors({});
    onClose();
  };

  const handleSubmit = async () => {
    if (orderItems.length === 0) {
      Alert.alert('Error', 'Please add at least one item to the order');
      return;
    }

    if (!validateForm()) {
      return;
    }

    // Calculate totals
    const subtotal = orderItems.reduce((sum, item) => sum + item.total_price, 0);
    const tax = subtotal * 0.1; // Example tax calculation
    const total = subtotal + tax;

    // Prepare order data
    const orderData = {
      values: formValues,
      items: orderItems.map(item => ({
        ...item,
        total_price: item.unit_price * item.quantity
      })),
      subtotal,
      tax,
      total
    };

    try {
      await onSubmit(orderData.values, orderData.items);
      resetForm();
    } catch (error) {
      Alert.alert('Error', 'Failed to submit order');
    }
  };

  const handleInputChange = (field: keyof FormValues, value: string | OrderType | OrderSource) => {
  setFormValues(prev => ({
    ...prev,
    [field]: value
  }));

  // Clear error for this field if it exists
  if (errors[field as keyof FormErrors]) {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field as keyof FormErrors];
      return newErrors;
    });
  }

  // Special case: when order type changes to pickup, clear delivery-specific fields
  if (field === 'orderType' && value === 'pickup') {
    setFormValues(prev => ({
      ...prev,
      address: '',
      deliverer: ''
    }));
    
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.address;
      delete newErrors.deliverer;
      return newErrors;
    });
  }
};

  return (
    <Modal visible={visible} onDismiss={resetForm} contentContainerStyle={styles.modalContainer}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          <Button icon="close" onPress={resetForm} children={undefined} />
          <Text style={styles.title}>
            {editingItem ? 'Edit Order Item' : 'New Order'}
          </Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView style={styles.content}>
          <OrderSummary 
            values={formValues}
            orderItems={orderItems}
            onAddProduct={() => {
              setEditingItem(null);
              setShowProductModal(true);
            }}
            onRemoveProduct={handleRemoveProduct}
            onUpdateQuantity={handleUpdateQuantity}
            onEditProduct={handleEditProduct}
          />

          {/* Order Type Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Type</Text>
            <SegmentedButtons
              value={formValues.orderType}
              onValueChange={(value) => handleInputChange('orderType', value)}
              buttons={[
                { value: 'delivery', label: 'Delivery' },
                { value: 'pickup', label: 'Pick up' },
              ]}
              style={styles.segmentedButtons}
            />
            {errors.orderType && <Text style={styles.errorText}>{errors.orderType}</Text>}
          </View>

          {/* Customer Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customer Information</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={formValues.name}
              onChangeText={(text) => handleInputChange('name', text)}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Phone"
              value={formValues.phone}
              onChangeText={(text) => handleInputChange('phone', text)}
              keyboardType="phone-pad"
            />
            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownLabel}>Order Source</Text>
              <View style={styles.segmentedButtons}>
                <SegmentedButtons
                  value={formValues.orderSource}
                  onValueChange={(value) => handleInputChange('orderSource', value)}
                  buttons={[
                    { value: 'phone', label: 'Phone' },
                    { value: 'in_person', label: 'In Person' },
                    { value: 'online', label: 'Online' },
                    { value: 'third_party', label: '3rd Party' },
                  ]}
                />
              </View>
              {errors.orderSource && <Text style={styles.errorText}>{errors.orderSource}</Text>}
            </View>
          </View>

          {/* Delivery Information (Conditional) */}
          {formValues.orderType === 'delivery' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Delivery Information</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Address"
                value={formValues.address}
                onChangeText={(text) => handleInputChange('address', text)}
                multiline
                numberOfLines={3}
              />
              {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}

              <View style={styles.dropdownContainer}>
                <Text style={styles.dropdownLabel}>Deliverer</Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setShowDelivererDropdown(true)}
                >
                  <Text>{formValues.deliverer || 'Select deliverer'}</Text>
                  <Icon name="chevron-down" size={20} />
                </TouchableOpacity>
                {errors.deliverer && <Text style={styles.errorText}>{errors.deliverer}</Text>}
              </View>

              <Portal>
                <Modal 
                  visible={showDelivererDropdown} 
                  onDismiss={() => setShowDelivererDropdown(false)}
                  contentContainerStyle={styles.dropdownModal}
                >
                  <ScrollView>
                    {DELIVERY_PERSONS.map((person) => (
                      <TouchableOpacity
                        key={person}
                        style={styles.dropdownItem}
                        onPress={() => {
                          handleInputChange('deliverer', person);
                          setShowDelivererDropdown(false);
                        }}
                      >
                        <Text>{person}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </Modal>
              </Portal>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <Button 
            mode="contained" 
            onPress={handleSubmit}
            disabled={orderItems.length === 0}
            style={styles.submitButton}
            labelStyle={styles.submitButtonLabel}
          >
            Complete Order
          </Button>
        </View>
      </KeyboardAvoidingView>

      <ProductSelectionModal
        visible={showProductModal}
        products={products}
        selectedProductId={editingItem?.product_id || null}
        selectedVariantId={editingItem?.variant_id || null}
        initialQuantity={editingItem?.quantity || 1}
        editingItemId={editingItem?.id || null}
        onClose={() => {
          setEditingItem(null);
          setShowProductModal(false);
        }}
        onSelectProduct={handleAddOrUpdateProduct}
      />
    </Modal>
  );
};

export default AddOrderModal;