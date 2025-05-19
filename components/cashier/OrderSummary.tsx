import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button, Divider } from 'react-native-paper';
import OrderItemComponent from './OrderItem';
import { FormValues, OrderItem } from '../../types/cashierTypes';

interface OrderSummaryProps {
  values: FormValues;
  orderItems: OrderItem[];
  onAddProduct: () => void;
  onRemoveProduct: (id: number) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onEditProduct: (item: OrderItem) => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  values,
  orderItems,
  onAddProduct,
  onRemoveProduct,
  onUpdateQuantity,
  onEditProduct
}) => {
  const totalAmount = orderItems.reduce((sum, item) => sum + item.total, 0);

  return (
    <View style={styles.container}>
      {/* Customer Info Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer Information</Text>
        {values.name && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name:</Text>
            <Text style={styles.infoValue}>{values.name}</Text>
          </View>
        )}
        {values.phone && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoValue}>{values.phone}</Text>
          </View>
        )}
        {values.orderSource && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Source:</Text>
            <Text style={styles.infoValue}>
              {values.orderSource === 'phone' ? 'Phone call' :
               values.orderSource === 'in_person' ? 'In-person' :
               values.orderSource === 'online' ? 'Online' : 'Third-party app'}
            </Text>
          </View>
        )}
        {values.orderType === 'delivery' && values.address && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address:</Text>
            <Text style={styles.infoValue}>{values.address}</Text>
          </View>
        )}
      </View>

      {/* Order Items */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          <Button 
            mode="outlined" 
            onPress={onAddProduct}
            icon="plus"
            style={styles.addButton}
            labelStyle={styles.addButtonLabel}
          >
            Add Item
          </Button>
        </View>

        {orderItems.length === 0 ? (
          <Text style={styles.emptyText}>No items added yet</Text>
        ) : (
          <ScrollView style={styles.itemsContainer}>
            {orderItems.map(item => (
              <OrderItemComponent
                key={item.id}
                item={item}
                onRemove={() => onRemoveProduct(item.id)}
                onUpdateQuantity={(newQty) => onUpdateQuantity(item.id, newQty)}
                onEdit={() => onEditProduct(item)}
              />
            ))}
          </ScrollView>
        )}
      </View>

      {/* Order Total */}
      <View style={styles.totalContainer}>
        <Divider style={styles.divider} />
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>{totalAmount} XOF</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 16,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontWeight: 'bold',
    width: 80,
  },
  infoValue: {
    flex: 1,
  },
  addButton: {
    borderRadius: 4,
  },
  addButtonLabel: {
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginVertical: 16,
  },
  itemsContainer: {
    maxHeight: 300,
  },
  totalContainer: {
    marginTop: 16,
  },
  divider: {
    marginBottom: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrderSummary;