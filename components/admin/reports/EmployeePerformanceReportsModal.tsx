// components/admin/reports/EmployeePerformanceReportsModal.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform // Used for Picker styling based on OS
} from 'react-native';
import { Modal, Portal, Card, ActivityIndicator, Button as PaperButton } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-native-modern-datepicker';
import moment from 'moment';
import { getEmployeePerformanceAll } from '../../../services/api';
import { EmployeePerformanceMetrics } from '@/types/EmployeeTypes';
import { DataTable, Column } from '../../ui/DataTable'; // Ensure correct path for DataTable
import { Text } from '../../ui/Text'; // Ensure correct path for Text
import { theme } from '../../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface EmployeePerformanceReportsModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

/**
 * EmployeePerformanceReportsModal component displays performance data for all employees,
 * allowing filtering by role and date range.
 * Fetches data using the getEmployeePerformanceAll API and displays it in a DataTable.
 */
const EmployeePerformanceReportsModal: React.FC<EmployeePerformanceReportsModalProps> = ({ isVisible, onClose }) => {
  const today = moment().format('YYYY-MM-DD');
  const [fromDate, setFromDate] = useState<string>(moment().subtract(30, 'days').format('YYYY-MM-DD'));
  const [toDate, setToDate] = useState<string>(today);
  const [selectedRole, setSelectedRole] = useState<string>(''); // For filtering by employee role
  const [performanceData, setPerformanceData] = useState<EmployeePerformanceMetrics[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState<'from' | 'to' | null>(null);
  const [selectedEmployeeForDetail, setSelectedEmployeeForDetail] = useState<EmployeePerformanceMetrics | null>(null);

  /**
   * Fetches employee performance data based on filters.
   */
  const fetchPerformanceData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // getEmployeePerformanceAll already performs aggregation if needed by the backend.
      // We are simply passing the date range and role filter.
      const fetchedPerformance = await getEmployeePerformanceAll(
        selectedRole || undefined, // Pass undefined if no role is selected
        fromDate,
        toDate
      );
      setPerformanceData(fetchedPerformance);
    } catch (err: any) {
      console.error('Failed to fetch employee performance data:', err);
      setError(err.message || 'Failed to fetch employee performance data.');
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate, selectedRole]);

  // Fetch data when modal becomes visible or filters change
  useEffect(() => {
    if (isVisible) {
      fetchPerformanceData();
    }
  }, [isVisible, fetchPerformanceData]);

  const openDetailModal = (employee: EmployeePerformanceMetrics) => {
    setSelectedEmployeeForDetail(employee);
  };

  const closeDetailModal = () => {
    setSelectedEmployeeForDetail(null);
  };

  // Define columns for the DataTable
  const columns: Column<EmployeePerformanceMetrics>[]  = [
    {
      key: 'employeeName',
      title: 'Employee',
      sortable: true,
      width: width * 0.25,
      render: (value: string, item: EmployeePerformanceMetrics) => (
        <TouchableOpacity onPress={() => openDetailModal(item)} style={styles.columnTouchable}>
          <Text style={[styles.tableCellTextBold, { color: theme.colors.primary }]}>{value}</Text>
        </TouchableOpacity>
      ),
    },
    {
      key: 'employeeRole',
      title: 'Role',
      sortable: true,
      width: width * 0.20,
      render: (value: string) => <Text style={styles.tableCellText}>{value}</Text>,
    },
    {
      // FIX: Changed 'ordersProcessed' to 'ordersHandled' to match EmployeePerformanceMetrics type
      key: 'ordersHandled',
      title: 'Orders',
      numeric: true,
      sortable: true,
      width: width * 0.15,
      render: (value: number) => <Text style={styles.tableCellText}>{value || 0}</Text>,
    },
    {
      key: 'totalSales',
      title: 'Sales',
      numeric: true,
      sortable: true,
      width: width * 0.20,
      render: (value: number) => <Text style={styles.tableCellText}>${(value || 0).toFixed(2)}</Text>,
    },
    {
      key: 'averageOrderProcessingTimeSeconds',
      title: 'Avg Proc Time (s)',
      numeric: true,
      sortable: true,
      width: width * 0.20,
      render: (value: number | undefined) => (
        <Text style={styles.tableCellText}>{value !== undefined ? value.toFixed(0) : 'N/A'}</Text>
      ),
    },
  ];

  return (
    <Portal>
      <Modal
        visible={isVisible}
        onDismiss={onClose}
        contentContainerStyle={styles.centeredView}
      >
        <View style={styles.modalView}>
          <ScrollView style={{ width: '100%' }} contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }}>
            <Text style={styles.modalTitle}>Employee Performance Reports</Text>

            {/* Role Selection */}
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Filter by Role:</Text>
              <Picker
                selectedValue={selectedRole}
                // FIX: Explicitly type itemValue as string to resolve implicit any error
                onValueChange={(itemValue: string) => setSelectedRole(itemValue)}
                style={styles.picker}
                mode="dropdown" // Android specific, makes it a dropdown
                itemStyle={Platform.OS === 'ios' ? styles.pickerItem : undefined} // iOS specific styling for Picker.Item
              >
                <Picker.Item label="All Roles" value="" />
                <Picker.Item label="Cashier" value="cashier" />
                <Picker.Item label="Kitchen" value="kitchen" />
                <Picker.Item label="Admin" value="admin" />
                <Picker.Item label="Display" value="display" />
                {/* Add other roles as necessary */}
              </Picker>
            </View>

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

            <View style={styles.dataTableWrapper}>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={theme.colors.primary} />
                  <Text style={styles.loadingText}>Loading performance data...</Text>
                </View>
              ) : error ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                  <PaperButton mode="outlined" onPress={fetchPerformanceData} labelStyle={{ color: theme.colors.primary }}>
                    Retry
                  </PaperButton>
                </View>
              ) : performanceData.length === 0 ? (
                <View style={styles.noDataContainer}>
                  <Text style={styles.noDataText}>No performance data found for the selected criteria.</Text>
                </View>
              ) : (
                <DataTable<EmployeePerformanceMetrics>
                  data={performanceData}
                  columns={columns}
                  keyExtractor={(item) => item.employeeId}
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

      {/* Employee Performance Detail Modal */}
      <Portal>
        <Modal
          visible={!!selectedEmployeeForDetail}
          onDismiss={closeDetailModal}
          contentContainerStyle={detailModalStyles.container}
        >
          {selectedEmployeeForDetail && (
            <Card style={detailModalStyles.card}>
              <Card.Title
                title={`${selectedEmployeeForDetail.employeeName}'s Performance`}
                titleStyle={detailModalStyles.cardTitle}
                right={(props) => (
                  <TouchableOpacity onPress={closeDetailModal} style={detailModalStyles.closeIconButton}>
                    <Ionicons name="close" size={theme.typography.fontSize.xl} color={theme.colors.text} />
                  </TouchableOpacity>
                )}
              />
              <Card.Content>
                <ScrollView contentContainerStyle={detailModalStyles.scrollContent}>
                  <Text style={detailModalStyles.detailText}>Role: {selectedEmployeeForDetail.employeeRole}</Text>
                  <Text style={detailModalStyles.detailText}>
                    Last Activity:{' '}
                    {selectedEmployeeForDetail.lastActivityAt
                      ? moment(selectedEmployeeForDetail.lastActivityAt).format('MMM DD,YYYY HH:mm')
                      : 'N/A'}
                  </Text>

                  <View style={detailModalStyles.metricSection}>
                    <Text style={detailModalStyles.metricTitle}>General Metrics</Text>
                    <View style={detailModalStyles.metricRow}>
                      <Text style={detailModalStyles.metricLabel}>Login Duration:</Text>
                      <Text style={detailModalStyles.metricValue}>
                        {(selectedEmployeeForDetail.loginDurationMinutes || 0).toFixed(0)} minutes
                      </Text>
                    </View>
                    <View style={detailModalStyles.metricRow}>
                      <Text style={detailModalStyles.metricLabel}>Break Duration:</Text>
                      <Text style={detailModalStyles.metricValue}>
                        {(selectedEmployeeForDetail.breakDurationMinutes || 0).toFixed(0)} minutes
                      </Text>
                    </View>
                    <View style={detailModalStyles.metricRow}>
                      <Text style={detailModalStyles.metricLabel}>Days Off:</Text>
                      <Text style={detailModalStyles.metricValue}>
                        {(selectedEmployeeForDetail.daysOffCount || 0)}
                      </Text>
                    </View>
                  </View>

                  {selectedEmployeeForDetail.employeeRole === 'cashier' && (
                    <View style={detailModalStyles.metricSection}>
                      <Text style={detailModalStyles.metricTitle}>Cashier Metrics</Text>
                      <View style={detailModalStyles.metricRow}>
                        <Text style={detailModalStyles.metricLabel}>Orders Handled:</Text>
                        <Text style={detailModalStyles.metricValue}>
                          {(selectedEmployeeForDetail.ordersHandled || 0)}
                        </Text>
                      </View>
                      <View style={detailModalStyles.metricRow}>
                        <Text style={detailModalStyles.metricLabel}>Avg. Order Proc. Time:</Text>
                        <Text style={detailModalStyles.metricValue}>
                          {(selectedEmployeeForDetail.averageOrderProcessingTimeSeconds || 0).toFixed(0)} seconds
                        </Text>
                      </View>
                      {selectedEmployeeForDetail.customerInteractionScore !== undefined && (
                        <View style={detailModalStyles.metricRow}>
                          <Text style={detailModalStyles.metricLabel}>Customer Score:</Text>
                          <Text style={detailModalStyles.metricValue}>
                            {selectedEmployeeForDetail.customerInteractionScore}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}

                  {selectedEmployeeForDetail.employeeRole === 'kitchen' && (
                    <View style={detailModalStyles.metricSection}>
                      <Text style={detailModalStyles.metricTitle}>Kitchen Metrics</Text>
                      <View style={detailModalStyles.metricRow}>
                        <Text style={detailModalStyles.metricLabel}>Items Prepared:</Text>
                        <Text style={detailModalStyles.metricValue}>
                          {(selectedEmployeeForDetail.itemsPrepared || 0)}
                        </Text>
                      </View>
                      <View style={detailModalStyles.metricRow}>
                        <Text style={detailModalStyles.metricLabel}>Avg. Item Prep. Time:</Text>
                        <Text style={detailModalStyles.metricValue}>
                          {(selectedEmployeeForDetail.averageItemPreparationTimeSeconds || 0).toFixed(0)} seconds
                        </Text>
                      </View>
                      {selectedEmployeeForDetail.inventoryRequestsHandled !== undefined && (
                        <View style={detailModalStyles.metricRow}>
                          <Text style={detailModalStyles.metricLabel}>Inv. Requests Handled:</Text>
                          <Text style={detailModalStyles.metricValue}>
                            {selectedEmployeeForDetail.inventoryRequestsHandled}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}

                  {selectedEmployeeForDetail.employeeRole === 'display' && (
                    <View style={detailModalStyles.metricSection}>
                      <Text style={detailModalStyles.metricTitle}>Display Metrics</Text>
                      <View style={detailModalStyles.metricRow}>
                        <Text style={detailModalStyles.metricLabel}>Images Uploaded:</Text>
                        <Text style={detailModalStyles.metricValue}>
                          {(selectedEmployeeForDetail.imagesUploaded || 0)}
                        </Text>
                      </View>
                      <View style={detailModalStyles.metricRow}>
                        <Text style={detailModalStyles.metricLabel}>Ads Managed:</Text>
                        <Text style={detailModalStyles.metricValue}>
                          {(selectedEmployeeForDetail.adsManaged || 0)}
                        </Text>
                      </View>
                      <View style={detailModalStyles.metricRow}>
                        <Text style={detailModalStyles.metricLabel}>GIFs Uploaded:</Text>
                        <Text style={detailModalStyles.metricValue}>
                          {(selectedEmployeeForDetail.gifsUploaded || 0)}
                        </Text>
                      </View>
                      <View style={detailModalStyles.metricRow}>
                        <Text style={detailModalStyles.metricLabel}>Custom Images Uploaded:</Text>
                        <Text style={detailModalStyles.metricValue}>
                          {(selectedEmployeeForDetail.customImagesUploaded || 0)}
                        </Text>
                      </View>
                    </View>
                  )}
                </ScrollView>
              </Card.Content>
              <Card.Actions style={detailModalStyles.cardActions}>
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
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    width: '100%',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  pickerLabel: {
    fontSize: theme.typography.fontSize.md,
    marginRight: theme.spacing.sm,
    color: theme.colors.text,
    paddingLeft: theme.spacing.sm,
  },
  picker: {
    flex: 1,
    height: 40,
    color: theme.colors.text,
  },
  pickerItem: { // iOS specific styling for Picker.Item
    fontSize: theme.typography.fontSize.md,
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
    borderColor: theme.colors.border,
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
  tableCellTextBold: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
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
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});

const detailModalStyles = StyleSheet.create({
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
    paddingRight: theme.spacing.xl,
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
  metricSection: {
    marginBottom: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  metricTitle: {
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
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    flexShrink: 1,
    marginRight: theme.spacing.sm,
  },
  metricValue: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    flexShrink: 1,
    textAlign: 'right',
  },
  cardActions: {
    justifyContent: 'flex-end',
    padding: theme.spacing.md,
  },
});

export default EmployeePerformanceReportsModal;