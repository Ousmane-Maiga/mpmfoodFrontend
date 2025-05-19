import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { OrderItem } from '../../types/cashierTypes';

interface OrderItemProps {
  item: OrderItem;
  onRemove: () => void;
  onUpdateQuantity: (quantity: number) => void;
  onEdit?: (item: OrderItem) => void;
}

const OrderItemComponent: React.FC<OrderItemProps> = ({ 
  item, 
  onRemove, 
  onUpdateQuantity,
  onEdit 
}) => {
  if (!item.product || !item.variant) {
    console.error('Missing product or variant data:', item);
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <TouchableOpacity 
          onPress={() => onEdit?.(item)}
          style={styles.productInfo}
        >
          <Text style={styles.productName} numberOfLines={1}>
            {item.product} - {item.variant}
          </Text>
          <Icon name="pencil" size={18} color="#6200ee" />
        </TouchableOpacity>
        
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>{item.price} XOF</Text>
          <Text style={styles.quantityText}>× {item.quantity}</Text>
          <Text style={styles.totalText}>= {item.total} XOF</Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <View style={styles.quantityControls}>
          <TouchableOpacity 
            onPress={() => onUpdateQuantity(Math.max(1, item.quantity - 1))}
            style={styles.quantityButton}
          >
            <Icon name="minus-circle" size={28} color="#6200ee" />
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{item.quantity}</Text>
          
          <TouchableOpacity 
            onPress={() => onUpdateQuantity(item.quantity + 1)}
            style={styles.quantityButton}
          >
            <Icon name="plus-circle" size={28} color="#6200ee" />
          </TouchableOpacity>
        </View>

        <View style={styles.actionButtons}>
          <Button 
            mode="outlined"
            onPress={() => onEdit?.(item)}
            style={styles.editButton}
            labelStyle={styles.buttonLabel}
            icon="pencil"
          >
            Edit
          </Button>
          <Button 
            mode="outlined"
            onPress={onRemove}
            style={styles.deleteButton}
            labelStyle={[styles.buttonLabel, { color: '#d32f2f' }]}
            icon="delete"
            textColor="#d32f2f"
          >
            Remove
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    elevation: 2,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
    flexShrink: 1,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  quantityText: {
    fontSize: 14,
    marginHorizontal: 8,
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    padding: 4,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  editButton: {
    marginRight: 8,
  },
  deleteButton: {
    borderColor: '#d32f2f',
  },
  buttonLabel: {
    fontSize: 14,
  },
});

export default OrderItemComponent;