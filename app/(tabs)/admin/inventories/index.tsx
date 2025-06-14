import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, Alert, ScrollView, SafeAreaView, RefreshControl } from 'react-native';
import { Button, Text, Avatar, DataTable, ActivityIndicator, FAB, Card, Modal, Portal } from 'react-native-paper';
import { useAuth } from '@/contexts/AuthContext';
import { theme } from '@/constants/theme'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'; 
import { TabParamList, RouteProp } from '@/app/types'; 
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AddInventoryModal from '@/components/admin/inventories/AddInventoryModal';
import EditInventoryModal from '@/components/admin/inventories/EditInventoryModal';
import { getInventoryItems, createInventoryItem, updateInventoryItem, getInventoryUsage, setupInventoryUpdates } from '@/services/api';
import { InventoryItem, InventoryItemUpdate, InventoryUsage, CreateInventoryItemPayload } from '@/types/admin';

type InventoryScreenRouteProp = RouteProp<TabParamList, 'admin'>;

const InventoryStats = ({ items }: { items: InventoryItem[] }) => {
  
  const stats = useMemo(() => {
    const totalItems = items.length;
    const lowStockItems = items.filter(item => item.quantity <= item.min_threshold).length;
    const totalValue = items.reduce((sum, item) => {
      return sum + (item.cost_per_unit ? item.cost_per_unit * item.quantity : 0);
    }, 0);
    const recentlyRestocked = items.filter(item => {
      const lastRestocked = new Date(item.last_restocked);
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return lastRestocked > oneWeekAgo;
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

      {/* <View style={styles.statItem}>
        <View style={styles.statValueContainer}>
          <Icon name="currency-francs" size={24} color={theme.colors.primary} />
          <Text style={styles.statValue}>{stats.totalValue.toFixed(2)}FCFA</Text>
        </View>
        <Text style={styles.statLabel}>Total Value</Text>
      </View> */}

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

export default function InventoryScreen() {
  const route = useRoute<InventoryScreenRouteProp>();
  const { user: authUser } = useAuth();
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchInventory();
  }, []);

  const handleItemPress = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  const handleAddItem = async (item: Omit<InventoryItem, 'id' | 'updated_at' | 'last_restocked' | 'supplier'>) => {
  try {
    setLoading(true);
    const newItem = await createInventoryItem(item); // pass only allowed fields
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
            <Card.Title title="Item Details" />
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
                <Text style={styles.detailLabelText}>{new Date(selectedItem.last_restocked).toLocaleDateString()}</Text>
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
            <Card.Actions>
              <Button 
              onPress={() => setShowDetailModal(false)}
              style={styles.button}
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
        {/* Add Inventory Stats Component */}
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
                <DataTable.Title style={styles.centerText}>
                  <Text style={styles.datatableText} >Item Name</Text>
                  </DataTable.Title>
                <DataTable.Title numeric style={styles.centerText}>
                  <Text style={styles.datatableText}>Quantity</Text>
                  </DataTable.Title>
                <DataTable.Title style={styles.centerText}>
                  <Text style={styles.datatableText}>Last Restocked</Text>
                  </DataTable.Title>
                <DataTable.Title style={styles.centerText}>
                  <Text style={styles.datatableText}>Actions</Text>
                  </DataTable.Title>
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
                    <Text style={[{
                      color: item.quantity <= item.min_threshold
                        ? theme.colors.danger
                        : '#666'
                    }]}>
                      {item.quantity} {item.unit}
                    </Text>
                  </DataTable.Cell>
                  <DataTable.Cell style={[styles.centerText, {color: '#666'}]}>
                   <Text 
                   style={{color: '#666'}} > 
                   {new Date(item.last_restocked).toLocaleDateString()}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.centerText}>
                    <Button
                      compact
                      mode="outlined"
                      style={styles.button}
                      labelStyle={{ color: theme.colors.primary }}
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
    padding: 8,
  },
  scrollContainer: {
    flex: 1,
    width: '100%',
  },
  datatableText: {
    color: '#000'
  },
  loader: {
    marginVertical: 20,
  },
  centerText: {
    padding: 0,
    justifyContent: 'center',
   
  },
  clickableText: {
    color: theme.colors.primary,
    textDecorationLine: 'none',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  detailCard: {
    backgroundColor: theme.colors.primaryLight,
    color: theme.colors.text
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
    
  },
  detailLabel: {
    fontWeight: 'bold',
    marginRight: 8,
    color: '#000'
  },
  detailLabelText: {
    color: theme.colors.text
  },
  supplierInfo: {
    backgroundColor: 'white',
    padding: 10,
    marginTop: 8,
    borderRadius: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', 
    marginVertical: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
    justifyContent: 'center', 
    flexShrink: 1,
  },
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 4,
    textAlign: 'center',
    color: '#000',
  },
  statLabel: {
    fontSize: 12,
    color: '#000',
    marginTop: 4,
    textAlign: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});