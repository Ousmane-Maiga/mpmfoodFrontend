import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Button, Modal } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './styles';
import { Product, ProductVariant } from '@/types/cashierTypes';

interface ProductSelectionModalProps {
  visible: boolean;
  products: Product[];
  selectedProductId: number | null;
  selectedVariantId: number | null;
  initialQuantity: number;
  editingItemId: number | null;
  onClose: () => void;
  onSelectProduct: (productId: number, variantId: number, quantity: number) => void;
}

const ProductSelectionModal: React.FC<ProductSelectionModalProps> = ({
  visible,
  products,
  selectedProductId,
  selectedVariantId,
  initialQuantity,
  editingItemId,
  onClose,
  onSelectProduct,
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [currentSelectedProductId, setCurrentSelectedProductId] = useState<number | null>(selectedProductId);
  const [currentSelectedVariantId, setCurrentSelectedVariantId] = useState<number | null>(selectedVariantId);

  const selectedProduct = products.find(p => p.id === currentSelectedProductId);
  const variants = selectedProduct?.variants || [];

  const handleIncrement = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (currentSelectedProductId && currentSelectedVariantId) {
      onSelectProduct(currentSelectedProductId, currentSelectedVariantId, quantity);
      onClose();
    }
  };

  return (
    <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.productModal}>
      <View style={styles.productModalContent}>
        <View style={styles.productModalHeader}>
          <Text style={styles.productModalTitle}>Select Product</Text>
          <Button icon="close" onPress={onClose} children={undefined} />
        </View>

        <ScrollView style={styles.productList}>
          {products.map(product => {
            // Safely get first variant price and count
            const firstVariantPrice = product.variants?.[0]?.price ?? 0;
            const variantCount = product.variants?.length ?? 0;
            
            return (
              <TouchableOpacity
                key={product.id}
                style={[
                  styles.productItem,
                  currentSelectedProductId === product.id && styles.selectedProductItem
                ]}
                onPress={() => {
                  setCurrentSelectedProductId(product.id);
                  // Safely set first variant ID or null
                  setCurrentSelectedVariantId(product.variants?.[0]?.id ?? null);
                }}
              >
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productPrice}>
                  ${firstVariantPrice.toFixed(2)} - {variantCount} variants
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {selectedProduct && variants.length > 0 && (
          <View style={styles.variantSection}>
            <Text style={styles.sectionTitle}>Select Variant</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {variants.map(variant => (
                <TouchableOpacity
                  key={variant.id}
                  style={[
                    styles.variantItem,
                    currentSelectedVariantId === variant.id && styles.selectedVariantItem
                  ]}
                  onPress={() => setCurrentSelectedVariantId(variant.id)}
                >
                  <Text style={styles.variantName}>{variant.name}</Text>
                  <Text style={styles.variantPrice}>${variant.price.toFixed(2)}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.quantitySection}>
          <Text style={styles.sectionTitle}>Quantity</Text>
          <View style={styles.quantityControls}>
            <TouchableOpacity 
              onPress={handleDecrement}
              disabled={quantity <= 1}
              style={[styles.quantityButton, quantity <= 1 && styles.disabledButton]}
            >
              <Icon name="minus" size={24} color={quantity <= 1 ? '#ccc' : '#333'} />
            </TouchableOpacity>
            <Text style={styles.quantityDisplay}>{quantity}</Text>
            <TouchableOpacity onPress={handleIncrement} style={styles.quantityButton}>
              <Icon name="plus" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        <Button 
          mode="contained" 
          onPress={handleSubmit}
          disabled={!currentSelectedProductId || !currentSelectedVariantId}
          style={styles.addToOrderButton}
        >
          {editingItemId ? 'Update Item' : 'Add to Order'}
        </Button>
      </View>
    </Modal>
  );
};

export default ProductSelectionModal;