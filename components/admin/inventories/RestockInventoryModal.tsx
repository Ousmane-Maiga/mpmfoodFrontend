// components/admin/inventories/RestockInventoryModal.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert, Platform } from 'react-native';
import { Button, Card, Modal, Portal, TextInput, Text } from 'react-native-paper';
import { theme } from '@/constants/theme';
import { InventoryItem } from '@/types/admin';

interface RestockInventoryModalProps {
    visible: boolean;
    onClose: () => void;
    item: InventoryItem | null;
    onSubmit: (itemId: number, quantity: number, costPerUnit: number | null) => void;
}

/**
 * RestockInventoryModal allows administrators to add quantity to an existing inventory item
 * and optionally update its cost per unit.
 */
const RestockInventoryModal: React.FC<RestockInventoryModalProps> = ({ visible, onClose, item, onSubmit }) => {
    const [quantityToAdd, setQuantityToAdd] = useState('');
    const [newCostPerUnit, setNewCostPerUnit] = useState('');

    // Effect to reset input fields when the modal becomes visible or the item changes
    useEffect(() => {
        if (visible) {
            setQuantityToAdd('');
            // Pre-fill newCostPerUnit with current cost if available
            setNewCostPerUnit(item?.cost_per_unit !== null && item?.cost_per_unit !== undefined
                ? String(item.cost_per_unit)
                : ''
            );
        }
    }, [visible, item]);

    /**
     * Handles the submission of the restock form.
     * Validates input and calls the onSubmit prop with the restock data.
     */
    const handleSubmit = () => {
        if (!item) {
            Alert.alert('Error', 'No item selected for restock. Please select an item to restock.');
            return;
        }

        const parsedQuantity = parseFloat(quantityToAdd);
        const parsedCostPerUnit = newCostPerUnit ? parseFloat(newCostPerUnit) : null;

        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
            Alert.alert('Invalid Input', 'Please enter a valid positive number for "Quantity to Add".');
            return;
        }
        if (newCostPerUnit && (isNaN(parsedCostPerUnit!) || parsedCostPerUnit! < 0)) {
            Alert.alert('Invalid Input', 'Please enter a valid non-negative number for "New Cost Per Unit".');
            return;
        }

        onSubmit(item.id, parsedQuantity, parsedCostPerUnit);
        onClose(); // Close modal after submission
    };

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={onClose}
            >
                <Card style={styles.modalContainer}>
                    <Card.Title
                        title={`Restock ${item?.name || 'Item'}`}
                        titleStyle={styles.cardTitle}
                    />
                    <Card.Content>
                        <TextInput
                            label="Quantity to Add"
                            value={quantityToAdd}
                            onChangeText={setQuantityToAdd}
                            keyboardType="numeric"
                            mode="outlined"
                            style={styles.input}
                            theme={{ colors: { primary: theme.colors.primary, onSurfaceVariant: theme.colors.textSecondary } }}
                        />
                        <TextInput
                            label="New Cost Per Unit (Optional)"
                            value={newCostPerUnit}
                            onChangeText={setNewCostPerUnit}
                            keyboardType="numeric"
                            mode="outlined"
                            style={styles.input}
                            placeholder={item?.cost_per_unit ? `Current: ${item.cost_per_unit.toFixed(2)}` : 'Enter new cost'}
                            theme={{ colors: { primary: theme.colors.primary, onSurfaceVariant: theme.colors.textSecondary } }}
                        />
                         <Text style={styles.currentQuantityText}>
                            Current Quantity: {item?.quantity} {item?.unit}
                        </Text>
                    </Card.Content>
                    <Card.Actions style={styles.actions}>
                        <Button
                            onPress={onClose}
                            labelStyle={{ color: theme.colors.textSecondary }}
                            style={styles.button}
                        >
                            Cancel
                        </Button>
                        <Button
                            onPress={handleSubmit}
                            mode="contained"
                            labelStyle={{ color: theme.colors.white }}
                            style={styles.button}
                        >
                            Restock
                        </Button>
                    </Card.Actions>
                </Card>
            </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: theme.colors.cardBackground,
        padding: theme.spacing.md,
        margin: theme.spacing.md, // Add margin to center it and give space
        borderRadius: theme.borderRadius.lg,
        alignSelf: 'center', // Center modal horizontally
        maxHeight: '80%', // Prevent modal from taking full height on smaller screens
        width: Platform.OS === 'web' ? '40%' : '90%', // Responsive width for web/mobile
        ...theme.shadows.lg,
    },
    cardTitle: {
        color: theme.colors.primary,
        fontSize: theme.typography.fontSize.lg,
        fontWeight: theme.typography.fontWeight.bold,
    },
    input: {
        marginBottom: theme.spacing.md,
        backgroundColor: theme.colors.background, // Ensure input background is distinct
    },
    currentQuantityText: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.md,
        textAlign: 'center',
    },
    actions: {
        justifyContent: 'flex-end',
        marginTop: theme.spacing.md,
    },
    button: {
        marginLeft: theme.spacing.sm,
        paddingHorizontal: theme.spacing.sm,
    }
});

export default RestockInventoryModal;
