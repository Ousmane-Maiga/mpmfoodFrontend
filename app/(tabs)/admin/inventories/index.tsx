import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView, SafeAreaView, RefreshControl } from 'react-native';
import { Button, Text, Avatar, useTheme, DataTable, ActivityIndicator, FAB, Card, Modal, Portal } from 'react-native-paper';
import { useAuth } from '@/contexts/AuthContext';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'; 
import { TabParamList, RouteProp } from '@/app/types'; 
import AddInventoryModal from '@/components/admin/inventories/AddInventoryModal';
import EditInventoryModal from '@/components/admin/inventories/EditInventoryModal';
import { getInventoryItems, createInventoryItem, updateInventoryItem, getInventoryUsage, setupInventoryUpdates } from '@/services/api';
import { InventoryItem, InventoryItemUpdate, InventoryUsage } from '@/types/admin';

type InventoryScreenRouteProp = RouteProp<TabParamList, 'admin'>;

export default function InventoryScreen() {
  const route = useRoute<InventoryScreenRouteProp>();
  const { user: authUser } = useAuth();
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const theme = useTheme();
  const [showSupplierInfo, setShowSupplierInfo] = useState(false);
  const { loading: authLoading, logout } = useAuth();
   const [refreshing, setRefreshing] = useState(false);

  const name = authUser?.name || 'Admin';
  const role = authUser?.role || 'Administrator';

  // State for usage data (was missing)
  const [usageData, setUsageData] = useState<InventoryUsage[]>([]);

  // Fetch inventory items
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

  // Fetch on focus and initial load
  useFocusEffect(
    React.useCallback(() => {
      fetchInventory();
    }, [])
  );

   // Set up WebSocket for real-time updates
  useEffect(() => {
    const cleanup = setupInventoryUpdates((updatedItems: any[]) => {
      setInventoryItems(prevItems => 
        prevItems.map(item => {
          const updatedItem = updatedItems.find(u => u.id === item.id);
          return updatedItem || item;
        })
      );
    });

    return cleanup;
  }, []);

  // Manual refresh
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchInventory();
  }, []);

  const handleItemPress = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  // Handle adding new inventory item
  const handleAddItem = async (item: Omit<InventoryItem, 'id' | 'created_at' | 'updated_at' | 'last_restocked'>) => {
    try {
      setLoading(true);
      const newItem = await createInventoryItem({
        ...item,
        created_at: new Date().toISOString(), // Provide actual dates
        updated_at: new Date().toISOString(), // Provide actual dates
        last_restocked: new Date().toISOString() // Provide actual dates
      });
      setInventoryItems(prev => [...prev, newItem]);
      setShowAddModal(false);
      Alert.alert('Success', 'Inventory item added successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to add inventory item');
      console.error('Failed to add item:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle updating inventory item
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

      const result = await updateInventoryItem({
        ...payload,
        id: updatedItem.id
      });

      setInventoryItems(prev =>
        prev.map(item => (item.id === updatedItem.id ? result : item))
      );
      setShowEditModal(false);
      Alert.alert('Success', 'Inventory item updated successfully');
    } catch (error) {
      console.error('Update failed:', error);
      Alert.alert('Error', 'Failed to update inventory item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle viewing usage history
  const handleViewUsage = async (item: InventoryItem) => {
    try {
      setLoading(true);
      setSelectedItem(item);
      
      const usage = await getInventoryUsage(item.id); // Pass item.id
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
            <Card.Title title="Item Details" />
            <Card.Content>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Name:</Text>
                <Text>{selectedItem.name}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Type:</Text>
                <Text>{selectedItem.type}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Quantity:</Text>
                <Text style={{
                  color: selectedItem.quantity <= selectedItem.min_threshold
                    ? theme.colors.error
                    : 'inherit'
                }}>
                  {selectedItem.quantity} {selectedItem.unit}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Min Threshold:</Text>
                <Text>{selectedItem.min_threshold}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Cost:</Text>
                <Text>
                  {selectedItem.cost_per_unit && typeof selectedItem.cost_per_unit === 'number'
                    ? `$${selectedItem.cost_per_unit.toFixed(2)}`
                    : 'Not specified'}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Last Restocked:</Text>
                <Text>{new Date(selectedItem.last_restocked).toLocaleDateString()}</Text>
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
                  <Text><Text style={styles.detailLabel}>Email:</Text> {selectedItem.supplier.email || 'N/A'}</Text>
                  <Text><Text style={styles.detailLabel}>Phone:</Text> {selectedItem.supplier.phone || 'N/A'}</Text>
                  <Text><Text style={styles.detailLabel}>Address:</Text> {selectedItem.supplier.address || 'N/A'}</Text>
                </View>
              )}
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => setShowDetailModal(false)}>Close</Button>
            </Card.Actions>
          </Card>
        )}
      </Modal>
    </Portal>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
    <View style={styles.container}>
      {/* User Status Bar */}
      <View style={styles.userContainer}>
        <View style={styles.userInfo}>
          <Avatar.Text size={40} label={name.split(' ').map(n => n[0]).join('')} />
          <View style={styles.userText}>
            <Text style={styles.userName}>{name}</Text>
            <Text style={styles.userRole}>{role}</Text>
          </View>
        </View>
        {/* Logout button and other actions can go here if needed */}
        {/* Example:
        <Button mode="outlined" onPress={logout}>Logout</Button>
        */}
      </View>

      <Button
        mode="contained"
        onPress={() => setShowAddModal(true)}
        labelStyle={{ color: 'white' }}
        style={{ marginBottom: 16 }} // Added some margin for spacing
      >
        Add Item
      </Button>

      {/* Inventory Table */}
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
              <DataTable.Title style={styles.centerText}>Item Name</DataTable.Title>
              <DataTable.Title numeric style={styles.centerText}>Quantity</DataTable.Title>
              <DataTable.Title style={styles.centerText}>Last Restocked</DataTable.Title>
              <DataTable.Title style={styles.centerText}>Actions</DataTable.Title>
            </DataTable.Header>

            {inventoryItems.map(item => (
              <DataTable.Row key={item.id}>
                <DataTable.Cell style={styles.centerText}>
                  <Text
                    style={styles.clickableText}
                    onPress={() => handleItemPress(item)}
                  >
                    {item.name}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell numeric style={styles.centerText}>
                  <Text style={{
                    color: item.quantity <= item.min_threshold
                      ? theme.colors.error
                      : 'inherit'
                  }}>
                    {item.quantity} {item.unit}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell style={styles.centerText}>
                  {new Date(item.last_restocked).toLocaleDateString()}
                </DataTable.Cell>
                <DataTable.Cell style={styles.centerText}>
                  <Button
                    compact
                    mode="outlined"
                    onPress={() => {
                      setSelectedItem(item);
                      setShowEditModal(true);
                    }}
                  >
                    Edit
                  </Button>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        )}
      </ScrollView>

      {/* Keep your existing Add and Edit modals */}
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
  },
  container: {
    flex: 1,
    padding: 16,
  },
  userContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userText: {
    marginLeft: 10,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  userRole: {
    fontSize: 14,
    color: '#666',
  },
  scrollContainer: {
    flex: 1,
  },
  loader: {
    marginVertical: 20,
  },
  centerText: {
    justifyContent: 'center',
  },
  clickableText: {
    color: '#0000EE',
    textDecorationLine: 'underline',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
  modalContainer: {
    backgroundColor: 'white', // Added background color for modal
    padding: 20,
    margin: 20, // Added margin to center the modal
    borderRadius: 8,
  },
  detailCard: {
    // No specific styles needed here, modalContainer handles sizing
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  detailLabel: {
    fontWeight: 'bold',
    marginRight: 8,
  },
  supplierInfo: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginTop: 8,
    borderRadius: 6
  },
  refreshControl: {
    backgroundColor: 'transparent',
  },
});
