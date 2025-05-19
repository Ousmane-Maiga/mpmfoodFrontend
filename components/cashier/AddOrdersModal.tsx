import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Text, Alert } from 'react-native';
import { Button, SegmentedButtons, Divider, Modal, Portal } from 'react-native-paper';
import { Formik } from 'formik';
import * as yup from 'yup';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { OrderItem, FormValues, Product } from '../../types/cashierTypes';
import ProductSelectionModal from './ProductSelectionModal';
import OrderSummary from './OrderSummary';
import { createOrder } from '@/services/api';

const DELIVERY_PERSONS = ['Boura', 'Ahmed', 'Fatima'];

const ORDER_SOURCES = [
  { value: 'phone', label: 'Phone' },
  { value: 'in_person', label: 'In Person' },
  { value: 'online', label: 'Online' },
  { value: 'third_party', label: 'Third Party' }
];

const orderSchema = yup.object().shape({
  orderType: yup.string().required('Order type is required'),
  name: yup.string().required('Customer name is required'),
  phone: yup.string()
    .required('Phone number is required')
    .matches(/^[0-9]+$/, 'Must be only digits')
    .min(8, 'Must be at least 8 digits'),
 orderSource: yup.string()
    .required('Order source is required')
    .oneOf(ORDER_SOURCES.map(src => src.value)),
  address: yup.string().when('orderType', {
    is: 'delivery',
    then: (schema) => schema.required('Address is required for delivery'),
  }),
  deliverer: yup.string().when('orderType', {
    is: 'delivery',
    then: (schema) => schema.required('Deliverer is required for delivery'),
  }),
});

interface AddOrderModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (order: any) => void;
  products: Product[];
}

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

 const handleAddOrUpdateProduct = (productId: number, variantId: number, quantity: number) => {
  const product = products.find(p => p.id === productId);
  const variant = product?.variants.find(v => v.id === variantId);
  
  if (!product || !variant) return;

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
            price: variant.price,
            total: variant.price * quantity,
            created_at: item.created_at // Preserve existing created_at
          }
        : item
    ));
  } else {
    const newItem: OrderItem = {
      id: Date.now(),
      product_id: productId,
      product: product.name,
      variant_id: variantId,
      variant: variant.name,
      quantity,
      price: variant.price,
      total: variant.price * quantity,
      order_id: 0,
      created_at: new Date() // Add current date as default
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
        return { ...item, quantity: newQuantity, total: item.price * newQuantity };
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
    onClose();
  };


const handleSubmit = async (values: FormValues) => {
  try {
    const orderData = {
      employee_id: '4d40e877-3752-4cde-b304-c2d3e23e4337',
      store_id: 1,
      orderData: {
        customer_id: null,
        order_type: values.orderType,
        order_source: values.orderSource,
        subtotal: orderItems.reduce((sum, item) => sum + item.total, 0),
        total_amount: orderItems.reduce((sum, item) => sum + item.total, 0),
        address: values.orderType === 'delivery' ? values.address : undefined, // Changed null to undefined
        deliverer: values.orderType === 'delivery' ? values.deliverer : undefined, // Changed null to undefined
        notes: '',
        status: 'pending' as const // Explicitly type as 'pending'
      },
      items: orderItems.map(item => ({
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.total
      }))
    };

    await createOrder(orderData);
    onSubmit(orderData);
    resetForm();
  } catch (error) {
    console.error('Failed to create order:', error);
    Alert.alert('Error', 'Failed to create order');
  }
};

   const setProductModalVisible = setShowProductModal;

  return (
    <Modal visible={visible} onDismiss={resetForm} contentContainerStyle={styles.modalContainer}>
      <Formik
        initialValues={{
          orderType: 'delivery' as 'delivery' | 'pickup',
          name: '',
          phone: '',
          orderSource: '' as 'phone' | 'in_person' | 'online' | 'third_party',
          address: '',
          deliverer: '',
        }}
        validationSchema={orderSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
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
                values={values}
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
                  value={values.orderType}
                  onValueChange={(value) => setFieldValue('orderType', value)}
                  buttons={[
                    { value: 'delivery', label: 'Delivery' },
                    { value: 'pickup', label: 'Pick up' },
                  ]}
                  style={styles.segmentedButtons}
                />
              </View>

              {/* Customer Information */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Customer Information</Text>
                
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  value={values.name}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                />
                {touched.name && errors.name && (
                  <Text style={styles.errorText}>{errors.name}</Text>
                )}

                <TextInput
                  style={styles.input}
                  placeholder="Phone"
                  value={values.phone}
                  onChangeText={handleChange('phone')}
                  onBlur={handleBlur('phone')}
                  keyboardType="phone-pad"
                />
                {touched.phone && errors.phone && (
                  <Text style={styles.errorText}>{errors.phone}</Text>
                )}

                <View style={styles.dropdownContainer}>
                  <Text style={styles.dropdownLabel}>Order Source</Text>
                  <View style={styles.segmentedButtons}>
                    <SegmentedButtons
                      value={values.orderSource}
                      onValueChange={(value) => setFieldValue('orderSource', value)}
                      buttons={[
                        { value: 'phone', label: 'Phone' },
                        { value: 'in_person', label: 'In Person' },
                        { value: 'online', label: 'Online' },
                        { value: 'third_party', label: '3rd Party' },
                      ]}
                    />
                  </View>
                  {touched.orderSource && errors.orderSource && (
                    <Text style={styles.errorText}>{errors.orderSource}</Text>
                  )}
                </View>
              </View>

              {/* Delivery Information (Conditional) */}
              {values.orderType === 'delivery' && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Delivery Information</Text>
                  
                  <TextInput
                    style={styles.input}
                    placeholder="Address"
                    value={values.address}
                    onChangeText={handleChange('address')}
                    onBlur={handleBlur('address')}
                    multiline
                    numberOfLines={3}
                  />
                  {touched.address && errors.address && (
                    <Text style={styles.errorText}>{errors.address}</Text>
                  )}

                  <View style={styles.dropdownContainer}>
                    <Text style={styles.dropdownLabel}>Deliverer</Text>
                    <TouchableOpacity
                      style={styles.dropdown}
                      onPress={() => setShowDelivererDropdown(true)}
                    >
                      <Text>{values.deliverer || 'Select deliverer'}</Text>
                      <Icon name="chevron-down" size={20} />
                    </TouchableOpacity>
                    {touched.deliverer && errors.deliverer && (
                      <Text style={styles.errorText}>{errors.deliverer}</Text>
                    )}
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
                              setFieldValue('deliverer', person);
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
                onPress={() => handleSubmit()}
                disabled={orderItems.length === 0}
                style={styles.submitButton}
                labelStyle={styles.submitButtonLabel}
              >
                Complete Order
              </Button>
            </View>
          </KeyboardAvoidingView>
        )}
      </Formik>

      <ProductSelectionModal
        visible={showProductModal}
        products={products}
        selectedProductId={editingItem?.product_id || null}
        selectedVariantId={editingItem?.variant_id || null}
        initialQuantity={editingItem?.quantity || 1}
        editingItemId={editingItem?.id || null} // pass the item id for edit mode
        onClose={() => {
            setEditingItem(null);
            setProductModalVisible(false);
        }}
        onSelectProduct={(productId: number, variantId: number, quantity: number) => {
            const product = products.find(p => p.id === productId);
            const variant = product?.variants.find(v => v.id === variantId);
            
    if (product && variant) {
      if (editingItem) {
        // Update existing item
        setOrderItems(orderItems.map(item => 
          item.id === editingItem.id 
            ? { 
                ...item, 
                product_id: productId,
                product: product.name,
                variant_id: variantId,
                variant: variant.name,
                quantity,
                price: variant.price,
                total: variant.price * quantity
              }
            : item
        ));
      } else {
        // Add new item
        const newItem: OrderItem = {
          id: Date.now(),
          product_id: productId,
          product: product.name,
          variant_id: variantId,
          variant: variant.name,
          quantity,
          price: variant.price,
          total: variant.price * quantity,
          order_id: 0
        };
        setOrderItems([...orderItems, newItem]);
      }
    }
    setEditingItem(null);
    setShowProductModal(false);
  }}
/>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    margin: 0,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: 'white',
    height: '90%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  content: {
    flex: 1,
    marginBottom: 16,
  },
  footer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    marginBottom: 8,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 12,
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  dropdownLabel: {
    fontSize: 14,
    marginBottom: 8,
    color: '#666',
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
  },
  dropdownModal: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 8,
    maxHeight: 300,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  submitButton: {
    borderRadius: 8,
    paddingVertical: 8,
  },
  submitButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddOrderModal;