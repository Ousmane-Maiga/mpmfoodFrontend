// // addOrdersModal.tsx
// import React, { useState, useEffect } from 'react'; // Import useEffect
// import { View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Text, Alert } from 'react-native';
// import { Button, SegmentedButtons, Divider, Modal, Portal } from 'react-native-paper';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { styles } from './styles';
// import {
//     AddOrderModalProps,
//     FormValues,
//     OrderItem,
//     Product,
//     OrderSource,
//     OrderType,
//     FormErrors // Import FormErrors
// } from '@/types/cashierTypes';
// import OrderSummary from './OrderSummary';
// import ProductSelectionModal from './ProductSelectionModal';

// const DELIVERY_PERSONS = ['Boura', 'Ahmed', 'Fatima']; // This should ideally come from an API for deliverers

// const AddOrderModal: React.FC<AddOrderModalProps> = ({
//     visible,
//     onClose,
//     onSubmit,
//     products,
//     defaultPreparedBy // Destructure new prop
// }) => {
//     const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
//     const [showProductModal, setShowProductModal] = useState(false);
//     const [editingItem, setEditingItem] = useState<OrderItem | null>(null);
//     const [showDelivererDropdown, setShowDelivererDropdown] = useState(false);
//     const [formValues, setFormValues] = useState<FormValues>({
//         orderType: 'delivery',
//         customerName: '', // FIX: Renamed from 'name'
//         customerPhone: '', // FIX: Renamed from 'phone'
//         orderSource: 'phone_call',
//         address: '',
//         deliverer: '',
//         notes: '',
//         discountAmount: 0,
//         paymentStatus: 'pending',
//         preparedBy: defaultPreparedBy || null, // Initialize with defaultPreparedBy
//     });

//     const [errors, setErrors] = useState<FormErrors>({});

//     // Effect to update preparedBy when defaultPreparedBy changes (e.g., employee logs in)
//     useEffect(() => {
//         setFormValues(prev => ({
//             ...prev,
//             preparedBy: defaultPreparedBy || null,
//         }));
//     }, [defaultPreparedBy]);


//     const validateForm = (): boolean => {
//         const newErrors: FormErrors = {};

//         if (!formValues.orderType) {
//             newErrors.orderType = 'Order type is required';
//         }

//         if (!formValues.customerName) { // FIX: Use customerName
//             newErrors.customerName = 'Customer name is required';
//         }

//         if (!formValues.customerPhone) { // FIX: Use customerPhone
//             newErrors.customerPhone = 'Phone number is required';
//         } else if (!/^[0-9]+$/.test(formValues.customerPhone)) { // FIX: Use customerPhone
//             newErrors.customerPhone = 'Must be only digits';
//         } else if (formValues.customerPhone.length < 8) { // FIX: Use customerPhone
//             newErrors.customerPhone = 'Must be at least 8 digits';
//         }

//         if (!formValues.orderSource) {
//             newErrors.orderSource = 'Order source is required';
//         }

//         if (formValues.orderType === 'delivery') {
//             if (!formValues.address) {
//                 newErrors.address = 'Address is required for delivery';
//             }
//             if (!formValues.deliverer) {
//                 newErrors.deliverer = 'Deliverer is required for delivery';
//             }
//         }

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };


//     const handleAddOrUpdateProduct = (productId: number, variantId: number, quantity: number) => {
//         const product = products.find(p => p.id === productId);
//         const variant = product?.variants.find(v => v.id === variantId);

//         if (!product || !variant) return;

//         const unitPrice = variant.price;
//         const totalPrice = unitPrice * quantity;

//         if (editingItem) {
//             setOrderItems(orderItems.map(item =>
//                 item.id === editingItem.id
//                     ? {
//                         ...item,
//                         product_id: productId,
//                         product: product.name,
//                         variant_id: variantId,
//                         variant: variant.name,
//                         quantity,
//                         unit_price: unitPrice,
//                         total_price: totalPrice,
//                         // Removed 'price' and 'total'
//                     }
//                     : item
//             ));
//         } else {
//             const newItem: OrderItem = {
//                 id: Date.now(),
//                 order_id: 0, // Will be set when order is created
//                 product_id: productId,
//                 variant_id: variantId,
//                 product: product.name,
//                 variant: variant.name,
//                 quantity,
//                 unit_price: unitPrice,
//                 discount_amount: 0,
//                 total_price: totalPrice,
//                 created_at: new Date().toISOString(),
//                 // Removed 'price' and 'total'
//             };
//             setOrderItems([...orderItems, newItem]);
//         }
//         setEditingItem(null);
//     };

//     const handleRemoveProduct = (id: number) => {
//         setOrderItems(orderItems.filter(item => item.id !== id));
//     };

//     const handleUpdateQuantity = (id: number, newQuantity: number) => {
//         if (newQuantity < 1) return;
//         setOrderItems(orderItems.map(item => {
//             if (item.id === id) {
//                 const totalPrice = item.unit_price * newQuantity;
//                 return {
//                     ...item,
//                     quantity: newQuantity,
//                     total_price: totalPrice,
//                     // Removed 'total'
//                 };
//             }
//             return item;
//         }));
//     };

//     const handleEditProduct = (item: OrderItem) => {
//         setEditingItem(item);
//         setShowProductModal(true);
//     };

//     const resetForm = () => {
//         setOrderItems([]);
//         setEditingItem(null);
//         setFormValues({
//             orderType: 'delivery',
//             customerName: '', // FIX: Renamed
//             customerPhone: '', // FIX: Renamed
//             orderSource: 'phone_call',
//             address: '',
//             deliverer: '',
//             notes: '',
//             discountAmount: 0,
//             paymentStatus: 'pending',
//             preparedBy: defaultPreparedBy || null, // Reset with default
//         });
//         setErrors({});
//         onClose();
//     };

//     const handleSubmit = async () => {
//         if (orderItems.length === 0) {
//             Alert.alert('Error', 'Please add at least one item to the order');
//             return;
//         }

//         if (!validateForm()) {
//             return;
//         }

//         // Calculate totals (these are for display/local use, not passed to backend here)
//         const subtotal = orderItems.reduce((sum, item) => sum + item.total_price, 0);
//         // const tax = subtotal * 0.1; // Example tax calculation
//         // const total = subtotal + tax;

//         // Prepare order data for submission to the parent component (CashierScreen)
//         // The parent component will construct the CreateOrderRequest for the API
//         const orderData = {
//             values: formValues, // Pass the entire formValues object
//             items: orderItems, // Pass the orderItems as is
//         };

//         try {
//             await onSubmit(orderData.values, orderData.items);
//             resetForm();
//         } catch (error) {
//             Alert.alert('Error', 'Failed to submit order');
//         }
//     };

//     const handleInputChange = (field: keyof FormValues, value: string | OrderType | OrderSource | number | null) => {
//         setFormValues((prev: FormValues) => ({ // FIX: Explicitly type prev
//             ...prev,
//             [field]: value
//         }));

//         // Clear error for this field if it exists
//         if (errors[field as keyof FormErrors]) {
//             setErrors(prev => {
//                 const newErrors = { ...prev };
//                 delete newErrors[field as keyof FormErrors];
//                 return newErrors;
//             });
//         }

//         // Special case: when order type changes to pickup, clear delivery-specific fields
//         if (field === 'orderType' && value === 'pickup') {
//             setFormValues((prev: FormValues) => ({ // FIX: Explicitly type prev
//                 ...prev,
//                 address: null, // Set to null
//                 deliverer: null // Set to null
//             }));

//             setErrors(prev => {
//                 const newErrors = { ...prev };
//                 delete newErrors.address;
//                 delete newErrors.deliverer;
//                 return newErrors;
//             });
//         }
//     };

//     return (
//         <Portal>
//             <Modal
//                 visible={visible}
//                 onDismiss={resetForm}
//                 contentContainerStyle={styles.modalContainer}
//             >
//                 <KeyboardAvoidingView
//                     behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//                     style={styles.container}
//                 >
//                     <View style={styles.header}>
//                         <Button icon="close" onPress={resetForm} children={undefined} />
//                         <Text style={styles.title}>
//                             {editingItem ? 'Edit Order Item' : 'New Order'}
//                         </Text>
//                         <View style={{ width: 60 }} />
//                     </View>

//                     <ScrollView style={styles.content}>
//                         <OrderSummary
//                             values={formValues}
//                             orderItems={orderItems}
//                             onAddProduct={() => {
//                                 setEditingItem(null);
//                                 setShowProductModal(true);
//                             }}
//                             onRemoveProduct={handleRemoveProduct}
//                             onUpdateQuantity={handleUpdateQuantity}
//                             onEditProduct={handleEditProduct}
//                         />

//                         {/* Order Type Selection */}
//                         <View style={styles.section}>
//                             <Text style={styles.sectionTitle}>Order Type</Text>
//                             <SegmentedButtons
//                                 value={formValues.orderType}
//                                 onValueChange={(value) => handleInputChange('orderType', value)}
//                                 buttons={[
//                                     { value: 'delivery', label: 'Delivery' },
//                                     { value: 'pickup', label: 'Pick up' },
//                                 ]}
//                                 style={styles.segmentedButtons}
//                             />
//                             {errors.orderType && <Text style={styles.errorText}>{errors.orderType}</Text>}
//                         </View>

//                         {/* Customer Information */}
//                         <View style={styles.section}>
//                             <Text style={styles.sectionTitle}>Customer Information</Text>

//                             <TextInput
//                                 style={styles.input}
//                                 placeholder="Customer Name"
//                                 value={formValues.customerName} // FIX: Use customerName
//                                 onChangeText={(text) => handleInputChange('customerName', text)} // FIX: Use customerName
//                             />
//                             {errors.customerName && <Text style={styles.errorText}>{errors.customerName}</Text>}

//                             <TextInput
//                                 style={styles.input}
//                                 placeholder="Phone"
//                                 value={formValues.customerPhone} // FIX: Use customerPhone
//                                 onChangeText={(text) => handleInputChange('customerPhone', text)} // FIX: Use customerPhone
//                                 keyboardType="phone-pad"
//                             />
//                             {errors.customerPhone && <Text style={styles.errorText}>{errors.customerPhone}</Text>}

//                             <View style={styles.dropdownContainer}>
//                                 <Text style={styles.dropdownLabel}>Order Source</Text>
//                                 <View style={styles.segmentedButtons}>
//                                     <SegmentedButtons
//                                         value={formValues.orderSource}
//                                         onValueChange={(value) => handleInputChange('orderSource', value)}
//                                         buttons={[
//                                             { value: 'phone_call', label: 'Phone call' },
//                                             { value: 'in_person', label: 'In_person' },
//                                             { value: 'whatsapp', label: 'WhatsApp' },
//                                             { value: 'tiktok', label: 'Tiktok' },
//                                             { value: 'snapchat', label: 'SnapChat' },

//                                         ]}
//                                     />
//                                 </View>
//                                 {errors.orderSource && <Text style={styles.errorText}>{errors.orderSource}</Text>}
//                             </View>
//                         </View>

//                         {/* Delivery Information (Conditional) */}
//                         {formValues.orderType === 'delivery' && (
//                             <View style={styles.section}>
//                                 <Text style={styles.sectionTitle}>Delivery Information</Text>

//                                 <TextInput
//                                     style={styles.input}
//                                     placeholder="Address"
//                                     value={formValues.address || ''} // FIX: Handle null by providing empty string
//                                     onChangeText={(text) => handleInputChange('address', text)}
//                                     multiline
//                                     numberOfLines={3}
//                                 />
//                                 {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}

//                                 <View style={styles.dropdownContainer}>
//                                     <Text style={styles.dropdownLabel}>Deliverer</Text>
//                                     <TouchableOpacity
//                                         style={styles.dropdown}
//                                         onPress={() => setShowDelivererDropdown(true)}
//                                     >
//                                         <Text>{formValues.deliverer || 'Select deliverer'}</Text>
//                                         <Icon name="chevron-down" size={20} />
//                                     </TouchableOpacity>
//                                     {errors.deliverer && <Text style={styles.errorText}>{errors.deliverer}</Text>}
//                                 </View>

//                                 <Portal>
//                                     <Modal
//                                         visible={showDelivererDropdown}
//                                         onDismiss={() => setShowDelivererDropdown(false)}
//                                         contentContainerStyle={styles.dropdownModal}
//                                     >
//                                         <ScrollView>
//                                             {DELIVERY_PERSONS.map((person) => (
//                                                 <TouchableOpacity
//                                                     key={person}
//                                                     style={styles.dropdownItem}
//                                                     onPress={() => {
//                                                         handleInputChange('deliverer', person);
//                                                         setShowDelivererDropdown(false);
//                                                     }}
//                                                 >
//                                                     <Text>{person}</Text>
//                                                 </TouchableOpacity>
//                                             ))}
//                                         </ScrollView>
//                                     </Modal>
//                                 </Portal>
//                             </View>
//                         )}
//                     </ScrollView>

//                     <View style={styles.footer}>
//                         <Button
//                             mode="contained"
//                             onPress={handleSubmit}
//                             disabled={orderItems.length === 0}
//                             style={styles.submitButton}
//                             labelStyle={styles.submitButtonLabel}
//                         >
//                             Complete Order
//                         </Button>
//                     </View>
//                 </KeyboardAvoidingView>

//                 <ProductSelectionModal
//                     visible={showProductModal}
//                     products={products}
//                     selectedProductId={editingItem?.product_id || null}
//                     selectedVariantId={editingItem?.variant_id || null}
//                     initialQuantity={editingItem?.quantity || 1}
//                     editingItemId={editingItem?.id || null}
//                     onClose={() => {
//                         setEditingItem(null);
//                         setShowProductModal(false);
//                     }}
//                     onSelectProduct={handleAddOrUpdateProduct}
//                 />
//             </Modal>
//         </Portal>
//     );
// };

// export default AddOrderModal;



import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Text, Alert } from 'react-native';
import { Button, SegmentedButtons, Divider, Modal, Portal } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './styles'; // Assuming 'styles' is defined in './styles.ts'
import {
    AddOrderModalProps,
    FormValues,
    OrderItem,
    Product,
    OrderSource,
    OrderType,
    FormErrors
} from '@/types/cashierTypes'; // Adjust path as necessary
import OrderSummary from './OrderSummary';
import ProductSelectionModal from './ProductSelectionModal';

const DELIVERY_PERSONS = ['Boura', 'Ahmed', 'Fatima']; // This should ideally come from an API for deliverers

const AddOrderModal: React.FC<AddOrderModalProps> = ({
    visible,
    onClose,
    onSubmit,
    products,
    defaultPreparedBy
}) => {
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [showProductModal, setShowProductModal] = useState(false);
    const [editingItem, setEditingItem] = useState<OrderItem | null>(null);
    const [showDelivererDropdown, setShowDelivererDropdown] = useState(false);
    const [formValues, setFormValues] = useState<FormValues>({
        orderType: 'delivery',
        customerName: '',
        customerPhone: '',
        orderSource: 'phone_call',
        address: '',
        deliverer: '',
        notes: 'regular', // Set initial value for notes
        discountAmount: 0,
        paymentStatus: 'pending',
        preparedBy: defaultPreparedBy || null,
    });

    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        setFormValues(prev => ({
            ...prev,
            preparedBy: defaultPreparedBy || null,
        }));
    }, [defaultPreparedBy]);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formValues.orderType) {
            newErrors.orderType = 'Order type is required';
        }

        if (!formValues.customerName) {
            newErrors.customerName = 'Customer name is required';
        }

        if (!formValues.customerPhone) {
            newErrors.customerPhone = 'Phone number is required';
        } else if (!/^[0-9]+$/.test(formValues.customerPhone)) {
            newErrors.customerPhone = 'Must be only digits';
        } else if (formValues.customerPhone.length < 8) {
            newErrors.customerPhone = 'Must be at least 8 digits';
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
                    }
                    : item
            ));
        } else {
            const newItem: OrderItem = {
                id: Date.now(),
                order_id: 0,
                product_id: productId,
                variant_id: variantId,
                product: product.name,
                variant: variant.name,
                quantity,
                unit_price: unitPrice,
                discount_amount: 0,
                total_price: totalPrice,
                created_at: new Date().toISOString(),
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
            customerName: '',
            customerPhone: '',
            orderSource: 'phone_call',
            address: '',
            deliverer: '',
            notes: 'regular', // Reset notes to 'regular'
            discountAmount: 0,
            paymentStatus: 'pending',
            preparedBy: defaultPreparedBy || null,
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

        const orderData = {
            values: formValues,
            items: orderItems,
        };

        try {
            await onSubmit(orderData.values, orderData.items);
            resetForm();
        } catch (error) {
            Alert.alert('Error', 'Failed to submit order');
        }
    };

    const handleInputChange = (field: keyof FormValues, value: string | OrderType | OrderSource | number | null) => {
        setFormValues((prev: FormValues) => ({
            ...prev,
            [field]: value
        }));

        if (errors[field as keyof FormErrors]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field as keyof FormErrors];
                return newErrors;
            });
        }

        if (field === 'orderType' && value === 'pickup') {
            setFormValues((prev: FormValues) => ({
                ...prev,
                address: null,
                deliverer: null
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
        <Portal>
            <Modal
                visible={visible}
                onDismiss={resetForm}
                contentContainerStyle={styles.modalContainer}
            >
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
                                placeholder="Customer Name"
                                value={formValues.customerName}
                                onChangeText={(text) => handleInputChange('customerName', text)}
                            />
                            {errors.customerName && <Text style={styles.errorText}>{errors.customerName}</Text>}

                            <TextInput
                                style={styles.input}
                                placeholder="Phone"
                                value={formValues.customerPhone}
                                onChangeText={(text) => handleInputChange('customerPhone', text)}
                                keyboardType="phone-pad"
                            />
                            {errors.customerPhone && <Text style={styles.errorText}>{errors.customerPhone}</Text>}

                            <View style={styles.dropdownContainer}>
                                <Text style={styles.dropdownLabel}>Order Source</Text>
                                <View style={styles.segmentedButtons}>
                                    <SegmentedButtons
                                        value={formValues.orderSource}
                                        onValueChange={(value) => handleInputChange('orderSource', value)}
                                        buttons={[
                                            { value: 'phone_call', label: 'Phone call' },
                                            { value: 'in_person', label: 'In_person' },
                                            { value: 'whatsapp', label: 'WhatsApp' },
                                            { value: 'tiktok', label: 'Tiktok' },
                                            { value: 'snapchat', label: 'SnapChat' },
                                        ]}
                                        style={styles.segmentedButtons}
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
                                    value={formValues.address || ''}
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

                        {/* Notes Text Field */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Notes</Text>
                            <TextInput
                                style={styles.notesInput} // Apply a new style for notes
                                placeholder="Add notes here..."
                                value={formValues.notes || ''}
                                onChangeText={(text) => handleInputChange('notes', text)}
                                multiline
                                numberOfLines={4}
                            />
                        </View>

                    </ScrollView>

                    <Button
                        mode="contained"
                        onPress={handleSubmit}
                        style={styles.submitButton}
                        labelStyle={styles.submitButtonLabel}
                    >
                        Place Order
                    </Button>

                </KeyboardAvoidingView>
            </Modal>

            <ProductSelectionModal
                visible={showProductModal}
                products={products}
                selectedProductId={editingItem?.product_id || null}
                selectedVariantId={editingItem?.variant_id || null}
                initialQuantity={editingItem?.quantity || 1}
                editingItemId={editingItem?.id || null}
                onClose={() => setShowProductModal(false)}
                onSelectProduct={handleAddOrUpdateProduct}
            />
        </Portal>
    );
};

export default AddOrderModal;