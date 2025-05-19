import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Modal, Button, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Product } from '../../types/cashierTypes';

interface ProductSelectionModalProps {
  visible: boolean;
  products: Product[];
  selectedProductId?: number | null;
  selectedVariantId?: number | null;
  initialQuantity?: number;
  editingItemId?: number | null;
  onClose: () => void;
  onSelectProduct: (productId: number, variantId: number, quantity: number, editingItemId?: number | null) => void;
}

const ProductSelectionModal: React.FC<ProductSelectionModalProps> = ({
  visible,
  products,
  selectedProductId = null,
  selectedVariantId = null,
  initialQuantity = 1,
  editingItemId = null,
  onClose,
  onSelectProduct
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(
    selectedProductId ? products.find(p => p.id === selectedProductId) || null : null
  );
  const [selectedVariantIdState, setSelectedVariantId] = useState<number | null>(selectedVariantId || null);
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleConfirm = () => {
    if (selectedProduct && selectedVariantIdState) {
      onSelectProduct(selectedProduct.id, selectedVariantIdState, quantity, editingItemId);
      resetSelection();
      onClose();
    }
  };

  const resetSelection = () => {
    setSelectedProduct(null);
    setSelectedVariantId(null);
    setQuantity(1);
  };

  return (
    <Modal 
      visible={visible} 
      onDismiss={onClose}
      contentContainerStyle={styles.modalContainer}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Button 
            icon={selectedProduct ? "arrow-left" : "close"} 
            onPress={selectedProduct ? resetSelection : onClose}
            children={undefined}
          />
          <Text style={styles.title}>
            {selectedProduct ? `Select ${selectedProduct.name} Variant` : 'Select Product'}
          </Text>
          <View style={{ width: 48 }} />
        </View>

        <Divider style={styles.divider} />

        {!selectedProduct ? (
          <ScrollView contentContainerStyle={styles.productsContainer}>
            {products.map(product => (
              <TouchableOpacity
                key={product.id}
                style={styles.productItem}
                onPress={() => setSelectedProduct(product)}
              >
                <Text style={styles.productName}>{product.name}</Text>
                <Icon name="chevron-right" size={24} color="#6200ee" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <>
            <ScrollView contentContainerStyle={styles.variantsContainer}>
              {selectedProduct.variants.map(variant => (
                <TouchableOpacity
                  key={variant.id}
                  style={[
                    styles.variantItem,
                    selectedVariantIdState === variant.id && styles.selectedVariant
                  ]}
                  onPress={() => setSelectedVariantId(variant.id)}
                >
                  <Text style={styles.variantText}>{variant.name} - {variant.price} XOF</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.quantityContainer}>
              <Text style={styles.quantityLabel}>Quantity:</Text>
              <View style={styles.quantityControls}>
                <TouchableOpacity 
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                  style={styles.quantityButton}
                >
                  <Icon name="minus-circle" size={32} color="#6200ee" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity 
                  onPress={() => setQuantity(quantity + 1)}
                  style={styles.quantityButton}
                >
                  <Icon name="plus-circle" size={32} color="#6200ee" />
                </TouchableOpacity>
              </View>
            </View>

            {selectedVariantIdState && (
              <Button 
                mode="contained" 
                onPress={handleConfirm}
                style={styles.confirmButton}
                disabled={!selectedVariantIdState}
              >
                <Text>{selectedProductId ? 'Update Item' : 'Add to Order'}</Text>
              </Button>
            )}
          </>
        )}
      </View>
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
    height: '80%',
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
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  divider: {
    marginVertical: 8,
  },
  productsContainer: {
    paddingBottom: 16,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  productName: {
    fontSize: 16,
  },
  variantsContainer: {
    paddingBottom: 16,
  },
  variantItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedVariant: {
    backgroundColor: '#f0f0f0',
  },
  variantText: {
    fontSize: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    padding: 8,
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 16,
    minWidth: 24,
    textAlign: 'center',
  },
  confirmButton: {
    borderRadius: 8,
    paddingVertical: 8,
    marginTop: 8,
  },
});

export default ProductSelectionModal;