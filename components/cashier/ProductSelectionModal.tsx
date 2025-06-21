import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Button, Modal, Portal } from 'react-native-paper'; // Import Portal
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './styles'; // Assuming 'styles' is defined in './styles.ts'
import { Product, ProductVariant } from '@/types/cashierTypes'; // Adjust path as necessary

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
    const [showProductDropdown, setShowProductDropdown] = useState(false);
    const [showVariantDropdown, setShowVariantDropdown] = useState(false);

    useEffect(() => {
        // Reset state when modal becomes visible or editing item changes
        if (visible) {
            setQuantity(initialQuantity);
            setCurrentSelectedProductId(selectedProductId);
            setCurrentSelectedVariantId(selectedVariantId);
            if (!selectedProductId && products.length > 0) {
                // If no product is selected initially, select the first one
                setCurrentSelectedProductId(products[0].id);
                setCurrentSelectedVariantId(products[0].variants?.[0]?.id ?? null);
            }
        }
    }, [visible, initialQuantity, selectedProductId, selectedVariantId, products]);

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
        <Portal>
            <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.productModal}>
                <View style={styles.productModalContent}>
                    <View style={styles.productModalHeader}>
                        <Text style={styles.productModalTitle}>Select Product</Text>
                        <Button icon="close" onPress={onClose} children={undefined} />
                    </View>

                    {/* Product Selection Dropdown */}
                    <View style={styles.dropdownContainer}>
                        <Text style={styles.dropdownLabel}>Product</Text>
                        <TouchableOpacity
                            style={styles.dropdown}
                            onPress={() => setShowProductDropdown(true)}
                        >
                            <Text>{selectedProduct?.name || 'Select a product'}</Text>
                            <Icon name="chevron-down" size={20} />
                        </TouchableOpacity>
                        <Portal>
                            <Modal
                                visible={showProductDropdown}
                                onDismiss={() => setShowProductDropdown(false)}
                                contentContainerStyle={styles.dropdownModal}
                            >
                                <ScrollView>
                                    {products.map((product) => (
                                        <TouchableOpacity
                                            key={product.id}
                                            style={styles.dropdownItem}
                                            onPress={() => {
                                                setCurrentSelectedProductId(product.id);
                                                setCurrentSelectedVariantId(product.variants?.[0]?.id ?? null);
                                                setShowProductDropdown(false);
                                            }}
                                        >
                                            <Text>{product.name}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </Modal>
                        </Portal>
                    </View>

                    {/* Variant Selection Dropdown (Conditional) */}
                    {selectedProduct && variants.length > 0 && (
                        <View style={styles.dropdownContainer}>
                            <Text style={styles.dropdownLabel}>Variant</Text>
                            <TouchableOpacity
                                style={styles.dropdown}
                                onPress={() => setShowVariantDropdown(true)}
                                disabled={!selectedProduct}
                            >
                                <Text>
                                    {variants.find(v => v.id === currentSelectedVariantId)?.name || 'Select a variant'}
                                </Text>
                                <Icon name="chevron-down" size={20} />
                            </TouchableOpacity>
                            <Portal>
                                <Modal
                                    visible={showVariantDropdown}
                                    onDismiss={() => setShowVariantDropdown(false)}
                                    contentContainerStyle={styles.dropdownModal}
                                >
                                    <ScrollView>
                                        {variants.map((variant) => (
                                            <TouchableOpacity
                                                key={variant.id}
                                                style={styles.dropdownItem}
                                                onPress={() => {
                                                    setCurrentSelectedVariantId(variant.id);
                                                    setShowVariantDropdown(false);
                                                }}
                                            >
                                                <Text>{variant.name} ({variant.price.toFixed(2)} FCFA)</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </Modal>
                            </Portal>
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
        </Portal>
    );
};



export default ProductSelectionModal;