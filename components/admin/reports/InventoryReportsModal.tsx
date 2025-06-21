// components/admin/reports/InventoryReportsModal.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert // Still using Alert for supplier info pop-up as per previous pattern
} from 'react-native';
import { Modal, Portal, Card, ActivityIndicator, Button as PaperButton } from 'react-native-paper'; // Import Paper components
import { getInventoryItems, getInventoryItemById } from '../../../services/api'; // Adjust path as necessary
import { InventoryItem } from '@/types/admin'; // Assuming InventoryItem type is defined here
import { DataTable, Column } from '../../ui/DataTable'; // Import YOUR custom DataTable
import { Text } from '../../ui/Text'; // Import your custom Text component
import { theme } from '../../../constants/theme'; // Import your theme
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // For icons in stats
import { Ionicons } from '@expo/vector-icons'; // For close icon in detail modal

interface InventoryReportsModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

/**
 * InventoryStats component from your inventories/index.tsx
 * Displays aggregated inventory statistics.
 */
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
    <View style={statsStyles.statsContainer}>
      <View style={statsStyles.statItem}>
        <View style={statsStyles.statValueContainer}>
          <Icon name="package" size={theme.typography.fontSize.lg} color={theme.colors.primary} />
          <Text style={statsStyles.statValue}>{stats.totalItems}</Text>
        </View>
        <Text style={statsStyles.statLabel}>Total Items</Text>
      </View>

      <View style={statsStyles.statItem}>
        <View style={statsStyles.statValueContainer}>
          <Icon name="alert" size={theme.typography.fontSize.lg} color={stats.lowStockItems > 0 ? theme.colors.danger : theme.colors.primary} />
          <Text style={[statsStyles.statValue, stats.lowStockItems > 0 && { color: theme.colors.danger }]}>
            {stats.lowStockItems}
          </Text>
        </View>
        <Text style={statsStyles.statLabel}>Low Stock</Text>
      </View>

      <View style={statsStyles.statItem}>
        <View style={statsStyles.statValueContainer}>
          <Icon name="truck-delivery" size={theme.typography.fontSize.lg} color={theme.colors.primary} />
          <Text style={statsStyles.statValue}>{stats.recentlyRestocked}</Text>
        </View>
        <Text style={statsStyles.statLabel}>Recent Restocks</Text>
      </View>
    </View>
  );
};

const statsStyles = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.cardBackground,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.sm,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  statValue: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginLeft: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});


/**
 * InventoryReportsModal component displays current inventory levels and highlights low stock items.
 * Fetches inventory data using the getInventoryItems API and displays it in a DataTable.
 */
const InventoryReportsModal: React.FC<InventoryReportsModalProps> = ({ isVisible, onClose }) => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<InventoryItem | null>(null);

  /**
   * Fetches inventory data.
   */
  const fetchInventoryData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedItems = await getInventoryItems();
      setInventoryItems(fetchedItems);
    } catch (err: any) {
      console.error('Failed to fetch inventory data:', err);
      setError(err.message || 'Failed to fetch inventory data.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data when modal becomes visible
  useEffect(() => {
    if (isVisible) {
      fetchInventoryData();
    }
  }, [isVisible, fetchInventoryData]);

  const openDetailModal = async (item: InventoryItem) => {
    try {
      // Fetch detailed item to ensure supplier info is available
      const detailedItem = await getInventoryItemById(item.id);
      setSelectedItemForDetail(detailedItem);
    } catch (error) {
      console.error('Failed to load item details for modal:', error);
      // Optionally show an error message within the modal or using a global toast
      setError('Failed to load item details.'); // Set error for the main modal content
    }
  };

  const closeDetailModal = () => {
    setSelectedItemForDetail(null);
  };

  // Define columns for the DataTable
  const columns: Column<InventoryItem>[] = useMemo(() => [
    {
      key: 'name',
      title: 'Item Name',
      sortable: true,
      width: width * 0.3,
      render: (value: string, item: InventoryItem) => (
        <TouchableOpacity onPress={() => openDetailModal(item)} style={styles.columnTouchable}>
          <Text style={[styles.tableCellText, item.quantity <= item.min_threshold && styles.lowStockText, { color: theme.colors.primary }]}>
            {value}
          </Text>
        </TouchableOpacity>
      ),
    },
    {
      key: 'quantity',
      title: 'Qty',
      numeric: true,
      sortable: true,
      width: width * 0.2,
      render: (value: number, item: InventoryItem) => (
        <Text style={[styles.tableCellText, item.quantity <= item.min_threshold && styles.lowStockText]}>
          {value} {item.unit}
        </Text>
      ),
    },
    {
      key: 'min_threshold',
      title: 'Min',
      numeric: true,
      sortable: true,
      width: width * 0.15,
      render: (value: number) => <Text style={styles.tableCellText}>{value}</Text>,
    },
    {
      key: 'supplier',
      title: 'Supplier',
      sortable: true,
      width: width * 0.35,
      render: (value: InventoryItem['supplier']) => (
        <Text style={styles.tableCellText}>{(value && value.name) || 'N/A'}</Text>
      ),
    },
  ], []);

  return (
    <Portal>
      <Modal
        visible={isVisible}
        onDismiss={onClose}
        contentContainerStyle={styles.centeredView}
      >
        <View style={styles.modalView}>
          <ScrollView style={{ width: '100%' }} contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }}>
            <Text style={styles.modalTitle}>Inventory Reports</Text>

            {/* Inventory Stats Component */}
            <InventoryStats items={inventoryItems} />

            <Text style={styles.sectionHeader}>Current Stock Levels</Text>
            <View style={styles.dataTableWrapper}>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={theme.colors.primary} />
                  <Text style={styles.loadingText}>Loading inventory data...</Text>
                </View>
              ) : error ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                  <PaperButton mode="outlined" onPress={fetchInventoryData} labelStyle={{ color: theme.colors.primary }}>
                    Retry
                  </PaperButton>
                </View>
              ) : inventoryItems.length === 0 ? (
                <View style={styles.noDataContainer}>
                  <Text style={styles.noDataText}>No inventory items found.</Text>
                </View>
              ) : (
                <DataTable<InventoryItem>
                  data={inventoryItems}
                  columns={columns}
                  keyExtractor={(item) => item.id.toString()}
                  pageSize={10} // Adjust page size as needed
                  loading={loading}
                  onRowPress={openDetailModal}
                />
              )}
            </View>
          </ScrollView>

          {/* Close Button */}
          <PaperButton
            mode="contained"
            onPress={onClose}
            style={styles.closeButton}
            labelStyle={styles.buttonText}
          >
            Close
          </PaperButton>
        </View>
      </Modal>

      {/* Inventory Item Detail Modal */}
      <Portal>
        <Modal
          visible={!!selectedItemForDetail}
          onDismiss={closeDetailModal}
          contentContainerStyle={modalDetailStyles.container}
        >
          {selectedItemForDetail && (
            <Card style={modalDetailStyles.card}>
              <Card.Title
                title="Item Details"
                titleStyle={modalDetailStyles.cardTitle}
                right={(props) => (
                  <TouchableOpacity onPress={closeDetailModal} style={modalDetailStyles.closeIconButton}>
                    <Ionicons name="close" size={theme.typography.fontSize.xl} color={theme.colors.text} />
                  </TouchableOpacity>
                )}
              />
              <Card.Content>
                <ScrollView contentContainerStyle={modalDetailStyles.scrollContent}>
                  <View style={modalDetailStyles.detailRow}>
                    <Text style={modalDetailStyles.detailLabel}>Name:</Text>
                    <Text style={modalDetailStyles.detailLabelText}>{selectedItemForDetail.name}</Text>
                  </View>
                  <View style={modalDetailStyles.detailRow}>
                    <Text style={modalDetailStyles.detailLabel}>Type:</Text>
                    <Text style={modalDetailStyles.detailLabelText}>{selectedItemForDetail.type}</Text>
                  </View>
                  <View style={modalDetailStyles.detailRow}>
                    <Text style={modalDetailStyles.detailLabel}>Quantity:</Text>
                    <Text style={[
                      modalDetailStyles.detailLabelText,
                      selectedItemForDetail.quantity <= selectedItemForDetail.min_threshold && { color: theme.colors.danger }
                    ]}>
                      {selectedItemForDetail.quantity} {selectedItemForDetail.unit}
                    </Text>
                  </View>
                  <View style={modalDetailStyles.detailRow}>
                    <Text style={modalDetailStyles.detailLabel}>Min Threshold:</Text>
                    <Text style={modalDetailStyles.detailLabelText}>{selectedItemForDetail.min_threshold}</Text>
                  </View>
                  <View style={modalDetailStyles.detailRow}>
                    <Text style={modalDetailStyles.detailLabel}>Cost:</Text>
                    <Text style={modalDetailStyles.detailLabelText}>
                      {selectedItemForDetail.cost_per_unit && typeof selectedItemForDetail.cost_per_unit === 'number'
                        ? `${selectedItemForDetail.cost_per_unit.toFixed(2)}FCFA`
                        : 'Not specified'}
                    </Text>
                  </View>
                  <View style={modalDetailStyles.detailRow}>
                    <Text style={modalDetailStyles.detailLabel}>Last Restocked:</Text>
                    <Text style={modalDetailStyles.detailLabelText}>
                      {selectedItemForDetail.last_restocked
                        ? new Date(selectedItemForDetail.last_restocked).toLocaleDateString()
                        : 'N/A'}
                    </Text>
                  </View>
                  <View style={modalDetailStyles.detailRow}>
                    <Text style={modalDetailStyles.detailLabel}>Supplier:</Text>
                    <TouchableOpacity onPress={() => Alert.alert(
                        'Supplier Info',
                        `Name: ${selectedItemForDetail.supplier?.name || 'N/A'}\n` +
                        `Email: ${selectedItemForDetail.supplier?.email || 'N/A'}\n` +
                        `Phone: ${selectedItemForDetail.supplier?.phone || 'N/A'}\n` +
                        `Address: ${selectedItemForDetail.supplier?.address || 'N/A'}`
                      )} // Simple alert for supplier details for now
                    >
                      <Text
                        style={{ color: theme.colors.primary, textDecorationLine: 'underline' }}
                      >
                        {selectedItemForDetail.supplier?.name || 'None'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </Card.Content>
              <Card.Actions style={modalDetailStyles.cardActions}>
                <PaperButton onPress={closeDetailModal} mode="outlined" labelStyle={{ color: theme.colors.primary }}>
                  Close
                </PaperButton>
              </Card.Actions>
            </Card>
          )}
        </Modal>
      </Portal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    alignItems: 'center',
    shadowColor: theme.colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '95%',
    maxHeight: '95%',
  },
  modalTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.lg,
    color: theme.colors.text,
  },
  sectionHeader: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
    color: theme.colors.text,
    width: '100%',
    textAlign: 'left',
  },
  dataTableWrapper: {
    width: '100%',
    flex: 1,
    marginBottom: theme.spacing.md,
  },
  columnTouchable: {
    paddingVertical: theme.spacing.xs,
  },
  tableCellText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  lowStockText: {
    color: theme.colors.danger,
    fontWeight: theme.typography.fontWeight.bold,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  loadingText: {
    marginTop: theme.spacing.sm,
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  errorText: {
    color: theme.colors.error,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  noDataText: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.md,
  },
  closeButton: {
    marginTop: theme.spacing.md,
    width: '50%',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.md,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});

const modalDetailStyles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    margin: theme.spacing.md,
    maxHeight: '90%',
    width: '90%',
    alignSelf: 'center',
    ...theme.shadows.md,
  },
  card: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.lg,
  },
  cardTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    paddingRight: theme.spacing.xl, // Make space for close button
  },
  closeIconButton: {
    position: 'absolute',
    right: theme.spacing.sm,
    top: theme.spacing.sm,
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.border,
  },
  scrollContent: {
    paddingBottom: theme.spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
  },
  detailLabelText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    flexShrink: 1, // Allow text to wrap
    textAlign: 'right', // Align value to right
  },
  cardActions: {
    justifyContent: 'flex-end',
    padding: theme.spacing.md,
  },
});

export default InventoryReportsModal;
