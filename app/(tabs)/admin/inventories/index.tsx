// inventories/index.tsx

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, StyleSheet, Alert, ScrollView, SafeAreaView, RefreshControl, Platform } from 'react-native';
import { Button, Text, ActivityIndicator, FAB, Card, Modal, Portal, TextInput, DataTable } from 'react-native-paper';
import { useAuth } from '@/contexts/AuthContext';
import { theme } from '@/constants/theme'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { TabParamList, RouteProp } from '@/app/types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AddInventoryModal from '@/components/admin/inventories/AddInventoryModal';
import EditInventoryModal from '@/components/admin/inventories/EditInventoryModal';
import { getInventoryItems, createInventoryItem, updateInventoryItem, getInventoryUsage, setupWebSocketUpdates, getInventoryItemById, restockInventoryItem } from '@/services/api';
import { InventoryItem, InventoryUsage } from '@/types/admin';
import { InventoryItemUpdate } from '@/types/inventoryTypes';

type InventoryScreenRouteProp = RouteProp<TabParamList, 'admin'>;

const InventoryStats = ({ items }: { items: InventoryItem[] }) => {
    const stats = useMemo(() => {
        const totalItems = items.length;
        const lowStockItems = items.filter(item => item.quantity <= item.min_threshold).length;
        const totalValue = items.reduce((sum, item) => {
            return sum + (typeof item.cost_per_unit === 'number' ? item.cost_per_unit * item.quantity : 0);
        }, 0);
        const recentlyRestocked = items.filter(item => {
            const lastRestockedDate = item.last_restocked ? new Date(item.last_restocked) : null;
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            return lastRestockedDate && lastRestockedDate.getTime() > oneWeekAgo.getTime();
        }).length;

        return { totalItems, lowStockItems, totalValue, recentlyRestocked };
    }, [items]);

    return (
        <View style={styles.statsContainer}>
            <View style={styles.statItem}>
                <View style={styles.statValueContainer}>
                    <Icon name="package" size={24} color={theme.colors.primary} />
                    <Text style={styles.statValue}>{stats.totalItems}</Text>
                </View>
                <Text style={styles.statLabel}>Total Items</Text>
            </View>

            <View style={styles.statItem}>
                <View style={styles.statValueContainer}>
                    <Icon name="alert" size={24} color={stats.lowStockItems > 0 ? theme.colors.danger : theme.colors.primary} />
                    <Text style={[styles.statValue, stats.lowStockItems > 0 && { color: theme.colors.danger }]}>
                        {stats.lowStockItems}
                    </Text>
                </View>
                <Text style={styles.statLabel}>Low Stock</Text>
            </View>

            <View style={styles.statItem}>
                <View style={styles.statValueContainer}>
                    <Icon name="truck-delivery" size={24} color={theme.colors.primary} />
                    <Text style={styles.statValue}>{stats.recentlyRestocked}</Text>
                </View>
                <Text style={styles.statLabel}>Recent Restocks</Text>
            </View>
        </View>
    );
};

// New component for Restock Modal (Kept inline as per your provided code, but ideally should be in its own file)
interface RestockInventoryModalProps {
    visible: boolean;
    onClose: () => void;
    item: InventoryItem | null;
    onSubmit: (itemId: number, quantity: number, costPerUnit: number | null) => void;
}

const RestockInventoryModal: React.FC<RestockInventoryModalProps> = ({ visible, onClose, item, onSubmit }) => {
    const [quantityToAdd, setQuantityToAdd] = useState('');
    const [newCostPerUnit, setNewCostPerUnit] = useState('');

    useEffect(() => {
        if (visible) {
            setQuantityToAdd('');
            setNewCostPerUnit(item?.cost_per_unit !== null && item?.cost_per_unit !== undefined
                ? String(item.cost_per_unit)
                : ''
            );
        }
    }, [visible, item]);

    const handleSubmit = () => {
        if (!item) {
            Alert.alert('Error', 'No item selected for restock.');
            return;
        }
        const parsedQuantity = parseFloat(quantityToAdd);
        const parsedCostPerUnit = newCostPerUnit ? parseFloat(newCostPerUnit) : null;

        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
            Alert.alert('Invalid Input', 'Please enter a valid quantity to add (a positive number).');
            return;
        }
        if (newCostPerUnit && (isNaN(parsedCostPerUnit!) || parsedCostPerUnit! < 0)) {
            Alert.alert('Invalid Input', 'Please enter a valid cost per unit (a non-negative number).');
            return;
        }

        onSubmit(item.id, parsedQuantity, parsedCostPerUnit);
        onClose();
    };

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={onClose}
                contentContainerStyle={restockModalStyles.modalContainer}
            >
                <Card style={restockModalStyles.card}>
                    <Card.Title 
                        title={`Restock ${item?.name || 'Item'}`} 
                        titleStyle={{ color: theme.colors.text }} // Add this line
                    />
                   <Card.Content>
                        <TextInput
                            label="Quantity to Add"
                            value={quantityToAdd}
                            onChangeText={setQuantityToAdd}
                            keyboardType="numeric"
                            mode="outlined"
                            style={[restockModalStyles.input, { color: '#000000' }]}
                            theme={{ 
                                colors: {
                                    primary: '#000000', // Black for active state
                                    text: '#000000', // Pure black for text
                                    placeholder: theme.colors.textSecondary,
                                    onSurfaceVariant: theme.colors.textSecondary,
                                    onSurface: '#000000', // Important for iOS
                                } 
                            }}
                            underlineColor="transparent"
                            activeUnderlineColor="#000000"
                        />
                        <TextInput
                            label="New Cost Per Unit (Optional)"
                            value={newCostPerUnit}
                            onChangeText={setNewCostPerUnit}
                            keyboardType="numeric"
                            mode="outlined"
                            style={[restockModalStyles.input, { color: '#000000' }]}
                            placeholder={item?.cost_per_unit ? `Current: ${item.cost_per_unit.toFixed(2)}` : 'Enter cost'}
                            theme={{ 
                                colors: {
                                    primary: '#000000', // Black for active state
                                    text: '#000000', // Pure black for text
                                    placeholder: theme.colors.textSecondary,
                                    onSurfaceVariant: theme.colors.textSecondary,
                                    onSurface: '#000000', // Important for iOS
                                } 
                            }}
                            underlineColor="transparent"
                            activeUnderlineColor="#000000"
                        />
                    </Card.Content>
                    <Card.Actions style={restockModalStyles.actions}>
                        <Button 
                        onPress={onClose} 
                        labelStyle={{ color: theme.colors.primary }}>
                            Cancel
                            </Button>
                        <Button 
                        onPress={handleSubmit} 
                        mode="contained" 
                        style={[styles.button, { backgroundColor: theme.colors.primary, marginRight: theme.spacing.sm }]}
                                labelStyle={{ color: theme.colors.white }}>
                            Restock
                        </Button>
                    </Card.Actions>
                </Card>
            </Modal>
        </Portal>
    );
};

export default function InventoryScreen() {
    const route = useRoute<InventoryScreenRouteProp>();
    const { user: authUser } = useAuth();
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showRestockModal, setShowRestockModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const [showSupplierInfo, setShowSupplierInfo] = useState(false);
    const { loading: authLoading, logout } = useAuth();
    const [refreshing, setRefreshing] = useState(false);
    const [usageData, setUsageData] = useState<InventoryUsage[]>([]);

    const name = authUser?.name || 'Admin';
    const role = authUser?.role || 'Administrator';

    const fetchInventory = async () => {
        try {
            setLoading(true);
            const items = await getInventoryItems();
            setInventoryItems(items);
        } catch (error) {
            Alert.alert('Error', 'Failed to load inventory items');
            console.error('Failed to load inventory:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchInventory();
        }, [])
    );

    useEffect(() => {
        if (!authUser?.id) {
            console.warn('Cannot set up WebSocket: No authenticated user ID.');
            return;
        }

        const cleanupWs = setupWebSocketUpdates(authUser.id, {
            onInventoryUpdate: (updatedItems: InventoryItem[]) => {
                console.log('Received WebSocket inventory update. Refetching...');
                fetchInventory();
            },
        });

        return () => {
            cleanupWs();
        };
    }, [authUser?.id, fetchInventory]);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchInventory();
    }, [fetchInventory]);

    const handleItemPress = async (item: InventoryItem) => {
        try {
            const detailedItem = await getInventoryItemById(item.id);
            setSelectedItem(detailedItem);
            setShowDetailModal(true);
        } catch (error) {
            Alert.alert('Error', 'Failed to load item details.');
            console.error('Failed to load item details:', error);
        }
    };

    const handleAddItem = async (item: Omit<InventoryItem, 'id' | 'updated_at' | 'last_restocked' | 'supplier'>) => {
        try {
            setLoading(true);
            await createInventoryItem(item);
            setShowAddModal(false);
            Alert.alert('Success', 'Inventory item added successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to add inventory item');
            console.error('Failed to add item:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateItem = async (updatedItem: InventoryItem) => {
        try {
            setLoading(true);
            const payload: InventoryItemUpdate = {
                name: updatedItem.name,
                type: updatedItem.type,
                quantity: Number(updatedItem.quantity),
                unit: updatedItem.unit,
                min_threshold: Number(updatedItem.min_threshold),
                supplier_id: updatedItem.supplier_id === null ? undefined : updatedItem.supplier_id,
                cost_per_unit: updatedItem.cost_per_unit === null ? undefined : updatedItem.cost_per_unit
            };
            await updateInventoryItem({
                ...payload,
                id: updatedItem.id
            });
            setShowEditModal(false);
            Alert.alert('Success', 'Inventory item updated successfully');
        } catch (error) {
            console.error('Update failed:', error);
            Alert.alert('Error', 'Failed to update inventory item. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleRestockItem = async (itemId: number, quantityAdded: number, costPerUnit: number | null) => {
        try {
            setLoading(true);
            await restockInventoryItem(itemId, quantityAdded, costPerUnit);
            setShowRestockModal(false);
            Alert.alert('Success', 'Inventory item restocked successfully');
            fetchInventory(); // Re-fetch to update quantity and last_restocked
        } catch (error) {
            Alert.alert('Error', 'Failed to restock inventory item.');
            console.error('Failed to restock item:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewUsage = async (item: InventoryItem) => {
        try {
            setLoading(true);
            setSelectedItem(item);
            const usage = await getInventoryUsage(item.id);
            setUsageData(usage);
            console.log('Usage Data:', usage);
            Alert.alert('Usage History', 'Usage data loaded to console for now.');
        } catch (error) {
            Alert.alert('Error', 'Failed to load usage history');
            console.error('Failed to load usage:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderDetailModal = () => (
        <Portal>
            <Modal
                visible={showDetailModal}
                onDismiss={() => setShowDetailModal(false)}
                contentContainerStyle={styles.modalContainer}
            >
                {selectedItem && (
                    <Card style={styles.detailCard}>
                        <Card.Title 
                        title="Item Details" 
                        titleStyle={{ color: theme.colors.text }}
                        />
                        <Card.Content>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Name:</Text>
                                <Text style={styles.detailLabelText}>{selectedItem.name}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Type:</Text>
                                <Text style={styles.detailLabelText}>{selectedItem.type}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Quantity:</Text>
                                <Text style={{
                                    color: selectedItem.quantity <= selectedItem.min_threshold
                                        ? theme.colors.danger
                                        : '#666'
                                }}>
                                    {selectedItem.quantity} {selectedItem.unit}
                                </Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Min Threshold:</Text>
                                <Text style={styles.detailLabelText}>{selectedItem.min_threshold}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Cost:</Text>
                                <Text style={styles.detailLabelText}>
                                    {selectedItem.cost_per_unit && typeof selectedItem.cost_per_unit === 'number'
                                        ? `${selectedItem.cost_per_unit.toFixed(2)}FCFA`
                                        : 'Not specified'}
                                </Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Last Restocked:</Text>
                                <Text style={styles.detailLabelText}>
                                    {selectedItem.last_restocked
                                        ? new Date(selectedItem.last_restocked).toLocaleDateString()
                                        : 'N/A'}
                                </Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Supplier:</Text>
                                <Text
                                    style={{ color: theme.colors.primary, textDecorationLine: 'underline' }}
                                    onPress={() => setShowSupplierInfo(prev => !prev)}
                                >
                                    {selectedItem.supplier?.name || 'None'}
                                </Text>
                            </View>

                            {showSupplierInfo && selectedItem.supplier && (
                                <View style={styles.supplierInfo}>
                                    <Text><Text style={styles.detailLabel}>Email:  </Text>
                                        <Text style={styles.detailLabelText} >{selectedItem.supplier.email || 'N/A'}</Text>
                                    </Text>
                                    <Text><Text style={styles.detailLabel}>Phone:  </Text>
                                        <Text style={styles.detailLabelText} >{selectedItem.supplier.phone || 'N/A'}</Text>
                                    </Text>
                                    <Text><Text style={styles.detailLabel}>Address:  </Text>
                                        <Text style={styles.detailLabelText} >{selectedItem.supplier.address || 'N/A'}</Text>
                                    </Text>
                                </View>
                            )}
                        </Card.Content>
                        <Card.Actions style={styles.modalActions}>
                            {/* Edit Button in Details Modal */}
                            <Button
                                mode="contained"
                                onPress={() => {
                                    setShowDetailModal(false); // Close detail modal
                                    setShowEditModal(true); // Open edit modal
                                    // selectedItem is already set by handleItemPress
                                }}
                                style={[styles.button, { backgroundColor: theme.colors.primary, marginRight: theme.spacing.sm }]}
                                labelStyle={{ color: theme.colors.white }}
                            >
                                Edit
                            </Button>
                            {/* Restock Button in Details Modal */}
                            <Button
                                mode="contained"
                                onPress={() => {
                                    setShowDetailModal(false); // Close detail modal
                                    setShowRestockModal(true); // Open restock modal
                                    // selectedItem is already set by handleItemPress
                                }}
                                style={[styles.button, { backgroundColor: theme.colors.tertiary, marginRight: theme.spacing.sm }]}
                                labelStyle={{ color: theme.colors.white }}
                            >
                                Restock
                            </Button>
                            <Button
                                onPress={() => setShowDetailModal(false)}
                                style={[styles.button, { backgroundColor: '#fff' }]}
                                labelStyle={{ color: theme.colors.primary }}
                            >
                                Close
                            </Button>
                        </Card.Actions>
                    </Card>
                )}
            </Modal>
        </Portal>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <InventoryStats items={inventoryItems} />

                <ScrollView
                    style={styles.scrollContainer}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                >
                    {loading ? (
                        <ActivityIndicator animating={true} style={styles.loader} />
                    ) : (
                        <DataTable>
                            <DataTable.Header>
                                <DataTable.Title style={styles.datatableHeaderCell}>
                                    <Text style={styles.datatableText} >Item Name</Text>
                                </DataTable.Title>
                                <DataTable.Title numeric style={styles.datatableHeaderCell}>
                                    <Text style={styles.datatableText}>Quantity</Text>
                                </DataTable.Title>
                                <DataTable.Title style={styles.datatableHeaderCell}>
                                    <Text style={styles.datatableText}>Last Restocked</Text> {/* Changed title back */}
                                </DataTable.Title>
                            </DataTable.Header>

                            {inventoryItems.map(item => (
                                <DataTable.Row key={item.id}>
                                    <DataTable.Cell style={styles.datatableCell}>
                                        <Text
                                            style={styles.clickableText}
                                            onPress={() => handleItemPress(item)}
                                        >
                                            {item.name}
                                        </Text>
                                    </DataTable.Cell>
                                    <DataTable.Cell numeric style={styles.datatableCell}>
                                        <Text style={[{
                                            color: item.quantity <= item.min_threshold
                                                ? theme.colors.danger
                                                : '#666'
                                        }]}>
                                            {item.quantity} {item.unit}
                                        </Text>
                                    </DataTable.Cell>
                                    {/* Display Last Restocked date only in this cell */}
                                    <DataTable.Cell style={styles.datatableCell}> {/* Reverted to standard cell style */}
                                        <Text style={{ color: '#666' }}>
                                            {item.last_restocked
                                                ? new Date(item.last_restocked).toLocaleDateString()
                                                : 'N/A'}
                                        </Text>
                                    </DataTable.Cell>
                                </DataTable.Row>
                            ))}
                        </DataTable>
                    )}
                </ScrollView>

                <AddInventoryModal
                    visible={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    onSubmit={handleAddItem}
                />

                <EditInventoryModal
                    visible={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    item={selectedItem}
                    onSubmit={handleUpdateItem}
                />

                <RestockInventoryModal
                    visible={showRestockModal}
                    onClose={() => setShowRestockModal(false)}
                    item={selectedItem}
                    onSubmit={handleRestockItem}
                />

                <FAB
                    icon="plus"
                    style={styles.fab}
                    onPress={() => setShowAddModal(true)}
                />
                {renderDetailModal()}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    container: {
        flex: 1,
        padding: theme.spacing.sm,
    },
    scrollContainer: {
        flex: 1,
        width: '100%',
        marginTop: theme.spacing.md,
    },
    datatableText: {
        color: theme.colors.text,
        fontWeight: theme.typography.fontWeight.semibold,
        fontSize: theme.typography.fontSize.sm,
    },
    loader: {
        marginVertical: theme.spacing.xl,
    },
    datatableHeaderCell: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingHorizontal: theme.spacing.xs,
    },
    datatableCell: {
        justifyContent: 'flex-start', // Default text alignment for data cells
        alignItems: 'center',
        paddingHorizontal: theme.spacing.xs,
    },
    // Removed actionCell, as buttons are no longer in table cells
    clickableText: {
        color: theme.colors.primary,
        textDecorationLine: 'underline',
        fontWeight: theme.typography.fontWeight.semibold,
    },
    fab: {
        position: 'absolute',
        margin: theme.spacing.md,
        right: 0,
        bottom: 0,
        backgroundColor: theme.colors.primary,
    },
    modalContainer: {
        backgroundColor: theme.colors.background,
        // padding: theme.spacing.md,
        // margin: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
        alignSelf: 'center',
        maxHeight: '100%',
        width: Platform.OS === 'web' ? '50%' : '90%',
        ...theme.shadows.lg,
    },
    detailCard: {
        backgroundColor: theme.colors.cardBackground,
        // borderRadius: theme.borderRadius.md,
        // elevation: 0,
        width: '100%',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: theme.spacing.xxs,
        paddingVertical: theme.spacing.xxs,
        borderBottomWidth: 0.5,
        borderBottomColor: theme.colors.borderLight,
    },
    detailLabel: {
        fontWeight: theme.typography.fontWeight.bold,
        marginRight: theme.spacing.xs,
        color: theme.colors.textSecondary,
        flex: 1,
    },
    detailLabelText: {
        color: theme.colors.text,
        flex: 2,
        textAlign: 'right',
    },
    supplierInfo: {
        backgroundColor: theme.colors.background,
        padding: theme.spacing.sm,
        marginTop: theme.spacing.sm,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: theme.spacing.md,
        padding: theme.spacing.md,
        backgroundColor: theme.colors.cardBackground,
        borderRadius: theme.borderRadius.md,
        ...theme.shadows.sm,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    statItem: {
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 1,
        paddingHorizontal: theme.spacing.xs,
    },
    statValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statValue: {
        fontSize: theme.typography.fontSize.lg,
        fontWeight: theme.typography.fontWeight.bold,
        marginLeft: theme.spacing.xxs,
        textAlign: 'center',
        color: theme.colors.text,
    },
    statLabel: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.xxs,
        textAlign: 'center',
    },
    // Removed actionButton, restockButton as they are no longer in table cells
    button: {
        marginTop: theme.spacing.sm,
    },
    modalActions: {
        justifyContent: 'flex-end',
        marginTop: theme.spacing.md,
    }
});

const restockModalStyles = StyleSheet.create({
    modalContainer: {
        backgroundColor: theme.colors.background,
        // padding: theme.spacing.md,
        // margin: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
        alignSelf: 'center',
        maxHeight: '100%',
        width: Platform.OS === 'web' ? '40%' : '90%',
        ...theme.shadows.lg,
    },
    card: {
        backgroundColor: theme.colors.cardBackground,
        borderRadius: theme.borderRadius.md,
        elevation: 0,
    },
    input: {
        marginBottom: theme.spacing.md,
        backgroundColor: theme.colors.background,
    },
    actions: {
        justifyContent: 'flex-end',
        marginTop: theme.spacing.md,
    },
});
