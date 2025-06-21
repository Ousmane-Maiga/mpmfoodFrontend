// components/admin/reports/SalesReportsModal.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions
} from 'react-native';
import { Modal, Portal, Card, ActivityIndicator, Button as PaperButton } from 'react-native-paper'; // Import Paper components
import DatePicker from 'react-native-modern-datepicker'
import moment from 'moment';
import { getOrders } from '../../../services/api'; // Adjust path as necessary
import { Order, OrderItem } from '@/types/cashierTypes'; // Assuming Order and OrderItem types are defined here
import { DataTable, Column } from '../../ui/DataTable'; // Import YOUR custom DataTable
import { Text } from '../../ui/Text'; // Import your custom Text component
import { theme } from '../../../constants/theme'; // Import your theme
import { Ionicons } from '@expo/vector-icons'; // For close icon in modal
import { format } from 'date-fns'; // For consistent date formatting in detail modal

interface SalesReportsModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

/**
 * SalesReportsModal component displays sales data, allowing filtering by date range.
 * Fetches order data using the getOrders API and displays it in a DataTable.
 */
const SalesReportsModal: React.FC<SalesReportsModalProps> = ({ isVisible, onClose }) => {
  const today = moment().format('YYYY-MM-DD');
  const [fromDate, setFromDate] = useState<string>(moment().subtract(7, 'days').format('YYYY-MM-DD'));
  const [toDate, setToDate] = useState<string>(today);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState<'from' | 'to' | null>(null);
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<Order | null>(null);

  /**
   * Fetches sales data based on the selected date range.
   */
  const fetchSalesData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { orders: fetchedOrders } = await getOrders({
        fromDate: fromDate,
        toDate: toDate,
      });

      // Sort by created_at descending by default, matching SalesScreen
      const sortedData = fetchedOrders.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      });

      setOrders(sortedData);
    } catch (err: any) {
      console.error('Failed to fetch sales data:', err);
      setError(err.message || 'Failed to fetch sales data.');
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate]);

  // Fetch data when modal becomes visible or dates change
  useEffect(() => {
    if (isVisible) {
      fetchSalesData();
    }
  }, [isVisible, fetchSalesData]);

  // Calculate aggregated sales metrics
  const totalSales = orders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
  const totalOrdersCount = orders.length;
  const averageOrderValue = totalOrdersCount > 0 ? totalSales / totalOrdersCount : 0;

  const openDetailModal = (order: Order) => {
    setSelectedOrderForDetail(order);
  };

  const closeDetailModal = () => {
    setSelectedOrderForDetail(null);
  };

  // Define columns for the DataTable
  const columns: Column<Order>[] = useMemo(() => [
    {
      key: 'id',
      title: 'Order ID',
      width: width * 0.25, // Adjusted width for better fit
      render: (value: any, item: Order) => ( // value could be number or string here
        <TouchableOpacity onPress={() => openDetailModal(item)} style={styles.columnTouchable}>
          {/* FIX: Ensure 'id' is a string before calling substring */}
          <Text style={[styles.tableCellText, { color: theme.colors.primary }]}>{String(item.id).substring(0, 8)}...</Text>
        </TouchableOpacity>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      width: width * 0.20,
      sortable: true,
      render: (value: Order['status']) => <Text style={styles.tableCellText}>{value}</Text>,
    },
    {
      key: 'total_amount',
      title: 'Total',
      numeric: true,
      sortable: true,
      width: width * 0.20,
      render: (value: number) => <Text style={styles.tableCellText}>${value.toFixed(2)}</Text>,
    },
    {
      key: 'created_at',
      title: 'Date',
      sortable: true,
      width: width * 0.35,
      render: (value: string) => <Text style={styles.tableCellText}>{moment(value).format('YYYY-MM-DD HH:mm')}</Text>,
    },
    // Add created_by_name if needed and available in the Order type
    // {
    //   key: 'created_by_name',
    //   title: 'Cashier',
    //   width: width * 0.2,
    //   sortable: true,
    //   render: (value: string) => <Text style={styles.tableCellText}>{value || 'N/A'}</Text>,
    // },
  ], []);

  const formatPrice = (price: number): string => {
    return `${Number(price || 0).toFixed(2)}FCFA`;
  };

  return (
    <Portal>
      <Modal
        visible={isVisible}
        onDismiss={onClose}
        contentContainerStyle={styles.centeredView} // Use for outer modal container
      >
        <View style={styles.modalView}>
          <ScrollView style={{ width: '100%' }} contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }}>
            <Text style={styles.modalTitle}>Sales Reports</Text>

            {/* Date Range Selection */}
            <View style={styles.datePickerContainer}>
              <TouchableOpacity style={styles.dateInput} onPress={() => setIsDatePickerVisible('from')}>
                <Text style={styles.dateInputText}>From: {fromDate}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dateInput} onPress={() => setIsDatePickerVisible('to')}>
                <Text style={styles.dateInputText}>To: {toDate}</Text>
              </TouchableOpacity>
            </View>

            {isDatePickerVisible && (
              <DatePicker
                options={{
                  backgroundColor: '#090C08',
                  textHeaderColor: '#FFA25B',
                  textDefaultColor: '#F6E7E1',
                  selectedTextColor: '#fff',
                  mainColor: '#F4722B',
                  textSecondaryColor: '#D6C7A1',
                  borderColor: 'rgba(122, 146, 165, 0.1)',
                }}
                mode="calendar"
                minimumDate="2020-01-01" // Adjust as needed
                maximumDate={today}
                selected={isDatePickerVisible === 'from' ? fromDate : toDate}
                onSelectedChange={date => {
                  if (isDatePickerVisible === 'from') {
                    setFromDate(date);
                  } else {
                    setToDate(date);
                  }
                  setIsDatePickerVisible(null); // Close date picker after selection
                }}
              />
            )}

            {/* Aggregated Metrics Display */}
            <View style={styles.metricsContainer}>
              <Text style={styles.metricText}>Total Sales: ${totalSales.toFixed(2)}</Text>
              <Text style={styles.metricText}>Total Orders: {totalOrdersCount}</Text>
              <Text style={styles.metricText}>Average Order Value: ${averageOrderValue.toFixed(2)}</Text>
            </View>

            {/* DataTable for Orders */}
            <View style={styles.dataTableWrapper}>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={theme.colors.primary} />
                  <Text style={styles.loadingText}>Loading sales data...</Text>
                </View>
              ) : error ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                  <PaperButton mode="outlined" onPress={fetchSalesData} labelStyle={{ color: theme.colors.primary }}>
                    Retry
                  </PaperButton>
                </View>
              ) : orders.length === 0 ? (
                <View style={styles.noDataContainer}>
                  <Text style={styles.noDataText}>No orders found for the selected date range.</Text>
                </View>
              ) : (
                <DataTable<Order>
                  data={orders}
                  columns={columns}
                  keyExtractor={(item) => String(item.id)} 
                  pageSize={10} // Adjust page size as needed
                  loading={loading} // Pass loading state to DataTable
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

      {/* Sales Detail Modal */}
      <Portal>
        <Modal
          visible={!!selectedOrderForDetail}
          onDismiss={closeDetailModal}
          contentContainerStyle={modalDetailStyles.container}
        >
          {selectedOrderForDetail && (
            <Card style={modalDetailStyles.card}>
              <Card.Title
                // FIX: Ensure 'id' is a string before calling substring
                title={`Order #${String(selectedOrderForDetail.id).substring(0, 8)}`}
                titleStyle={modalDetailStyles.cardTitle}
                right={(props) => (
                  <TouchableOpacity onPress={closeDetailModal} style={modalDetailStyles.closeIconButton}>
                    <Ionicons name="close" size={theme.typography.fontSize.xl} color={theme.colors.text} />
                  </TouchableOpacity>
                )}
              />
              <Card.Content>
                <ScrollView contentContainerStyle={modalDetailStyles.scrollContent}>
                  <View style={modalDetailStyles.detailSection}>
                    <Text style={modalDetailStyles.detailTitle}>Order Information</Text>
                    <Text style={modalDetailStyles.detailText}>
                      Date:{' '}
                      {selectedOrderForDetail.created_at
                        ? format(new Date(selectedOrderForDetail.created_at), 'MMM dd,yyyy HH:mm')
                        : 'N/A'}
                    </Text>
                    <Text style={modalDetailStyles.detailText}>Status: {selectedOrderForDetail.status}</Text>
                    <Text style={modalDetailStyles.detailText}>Type: {selectedOrderForDetail.order_type}</Text>
                    <Text style={modalDetailStyles.detailText}>Source: {selectedOrderForDetail.order_source}</Text>
                    <Text style={modalDetailStyles.detailText}>
                      Total: {formatPrice(Number(selectedOrderForDetail.total_amount || 0))}
                    </Text>
                    <Text style={modalDetailStyles.detailText}>
                      Cashier: {selectedOrderForDetail.created_by_name || 'N/A'}
                    </Text>
                    {selectedOrderForDetail.customer_name && (
                      <Text style={modalDetailStyles.detailText}>
                        Customer: {selectedOrderForDetail.customer_name}
                      </Text>
                    )}
                    {selectedOrderForDetail.notes && (
                      <Text style={modalDetailStyles.detailText}>Notes: {selectedOrderForDetail.notes}</Text>
                    )}
                  </View>

                  {selectedOrderForDetail.order_items && selectedOrderForDetail.order_items.length > 0 && (
                    <View style={modalDetailStyles.detailSection}>
                      <Text style={modalDetailStyles.detailTitle}>Items</Text>
                      {selectedOrderForDetail.order_items.map((item, index) => (
                        <View key={item.id || index} style={modalDetailStyles.itemRow}>
                          <Text style={modalDetailStyles.itemText}>
                            {item.product} {item.variant ? `(${item.variant})` : ''} ({item.quantity})
                          </Text>
                          <Text style={modalDetailStyles.itemText}>
                            {formatPrice(Number(item.total_price || 0))}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
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
    backgroundColor: 'rgba(0,0,0,0.5)', // Dim background
  },
  modalView: {
    backgroundColor: theme.colors.background, // Use theme background
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    alignItems: 'center',
    shadowColor: theme.colors.text, // Use theme color for shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '95%', // Adjusted width to give more space for DataTable
    maxHeight: '95%', // Limit height and enable scrolling
  },
  modalTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.lg,
    color: theme.colors.text,
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: theme.spacing.md,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: theme.colors.border, // Use theme border color
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    flex: 1,
    marginHorizontal: theme.spacing.xs,
    alignItems: 'center',
  },
  dateInputText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  metricsContainer: {
    width: '100%',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.cardBackground, // A slightly different background for metrics
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    alignItems: 'flex-start',
    ...theme.shadows.sm,
  },
  metricText: {
    fontSize: theme.typography.fontSize.md,
    marginBottom: theme.spacing.xs,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  dataTableWrapper: {
    width: '100%',
    flex: 1, // Allow DataTable to take available height
    marginBottom: theme.spacing.md,
  },
  columnTouchable: {
    paddingVertical: theme.spacing.xs, // Give some padding for better touch
  },
  tableCellText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center', // Center text in cells
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
    color: theme.colors.error, // Use theme error color
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
    color: theme.colors.white, // White text for buttons
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
  detailSection: {
    marginBottom: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  detailTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  detailText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  itemText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
  },
  cardActions: {
    justifyContent: 'flex-end',
    padding: theme.spacing.md,
  },
});

export default SalesReportsModal;
