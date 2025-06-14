import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Button, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './styles';
import { OrderItem, FormValues } from '@/types/cashierTypes';

interface OrderSummaryProps {
  values: FormValues;
  orderItems: OrderItem[];
  onAddProduct: () => void;
  onRemoveProduct: (id: number) => void;
  onUpdateQuantity: (id: number, newQuantity: number) => void;
  onEditProduct: (item: OrderItem) => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  values,
  orderItems,
  onAddProduct,
  onRemoveProduct,
  onUpdateQuantity,
  onEditProduct,
}) => {
  const subtotal = orderItems.reduce((sum, item) => sum + item.total_price, 0);
  // const tax = subtotal * 0.1; // Example tax calculation
  // const total = subtotal + tax;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Order Summary</Text>
      {orderItems.length === 0 ? (
        <Text style={styles.emptyText}>No items added yet</Text>
      ) : (
        <>
          {orderItems.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.product} - {item.variant}</Text>
                <Text style={styles.itemPrice}>
                  {item.unit_price.toFixed(2)}FCFA × {item.quantity} = {item.total_price.toFixed(2)}FCFA
                </Text>
              </View>
              <View style={styles.itemActions}>
                <TouchableOpacity onPress={() => onEditProduct(item)}>
                  <Icon name="pencil" size={20} color="#555" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onRemoveProduct(item.id)}>
                  <Icon name="trash-can-outline" size={20} color="#ff4444" />
                </TouchableOpacity>
                <View style={styles.quantityControls}>
                  <TouchableOpacity 
                    onPress={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Icon name="minus-circle-outline" size={24} color={item.quantity <= 1 ? '#ccc' : '#555'} />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}>
                    <Icon name="plus-circle-outline" size={24} color="#555" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
          <Divider style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal:</Text>
            <Text style={styles.summaryValue}>{subtotal.toFixed(2)}FCFA</Text>
          </View>
          {/* <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax (10%):</Text>
            <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
          </View> */}
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, styles.totalLabel]}>Total:</Text>
            <Text style={[styles.summaryValue, styles.totalValue]}>{subtotal.toFixed(2)}FCFA</Text>
          </View>
        </>
      )}
      <Button 
        mode="outlined" 
        onPress={onAddProduct}
        style={styles.addButton}
      >
        Add Product
      </Button>
    </View>
  );
};

export default OrderSummary;