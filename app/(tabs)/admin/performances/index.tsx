// app/(tabs)/admin/performances.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import { Text } from '@/components/ui/Text';
import { DataTable, Column } from '@/components/ui/DataTable';
import { theme } from '@/constants/theme';
import { getEmployeePerformanceAll, EmployeePerformanceMetrics } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

// Helper for date calculations
const getPeriodDates = (period: 'daily' | 'weekly' | 'monthly' | 'custom', customStart?: Date, customEnd?: Date) => {
    const today = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (period) {
        case 'daily':
            startDate = today;
            endDate = today;
            break;
        case 'weekly':
            startDate = new Date(today.setDate(today.getDate() - today.getDay())); // Start of week (Sunday)
            endDate = new Date(today.setDate(today.getDate() - today.getDay() + 6)); // End of week
            break;
        case 'monthly':
            startDate = new Date(today.getFullYear(), today.getMonth(), 1);
            endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of month
            break;
        case 'custom':
            startDate = customStart || today;
            endDate = customEnd || today;
            break;
    }
    // Ensure the date strings sent to backend are YYYY-MM-DD
    return {
        from: format(startDate, 'yyyy-MM-dd'),
        to: format(endDate, 'yyyy-MM-dd')
    };
};

// Component for displaying individual employee performance details (e.g., in a modal)
interface EmployeeDetailModalProps {
    visible: boolean;
    onClose: () => void;
    employee: EmployeePerformanceMetrics | null;
}

const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({ visible, onClose, employee }) => {
    if (!employee) return null;

    const lastActivityDate = employee.lastActivityAt
        ? new Date(employee.lastActivityAt)
        : null;

    const isValidLastActivityDate = lastActivityDate && !isNaN(lastActivityDate.getTime());

    return (
        <Modal
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={detailModalStyles.container}>
                <View style={detailModalStyles.header}>
                    <Text style={theme.text.heading2}>{employee.employeeName}'s Performance</Text>
                    <TouchableOpacity onPress={onClose} style={detailModalStyles.closeButton}>
                        <Ionicons name="close" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={detailModalStyles.contentContainer}>
                    <Text style={detailModalStyles.roleText}>Role: {employee.employeeRole}</Text>
                    <Text style={detailModalStyles.lastActivity}>Last Activity: {isValidLastActivityDate ? format(lastActivityDate, 'MMM dd,yyyy HH:mm') : 'N/A'}</Text>

                    <View style={detailModalStyles.metricSection}>
                        <Text style={detailModalStyles.metricTitle}>General Metrics</Text>
                        <Text>Login Duration: {employee.loginDurationMinutes || 0} minutes</Text>
                        <Text>Break Duration: {employee.breakDurationMinutes || 0} minutes</Text>
                        <Text>Days Off: {employee.daysOffCount || 0}</Text>
                    </View>

                    {employee.employeeRole === 'cashier' && (
                        <View style={detailModalStyles.metricSection}>
                            <Text style={detailModalStyles.metricTitle}>Cashier Metrics</Text>
                            <Text>Orders Handled: {employee.ordersHandled || 0}</Text>
                            <Text>Avg. Order Processing Time: {employee.averageOrderProcessingTimeSeconds || 0} seconds</Text>
                            {employee.customerInteractionScore !== undefined && (
                                <Text>Customer Interaction Score: {employee.customerInteractionScore}</Text>
                            )}
                        </View>
                    )}

                    {employee.employeeRole === 'kitchen' && (
                        <View style={detailModalStyles.metricSection}>
                            <Text style={detailModalStyles.metricTitle}>Kitchen Metrics</Text>
                            <Text>Items Prepared: {employee.itemsPrepared || 0}</Text>
                            <Text>Avg. Item Preparation Time: {employee.averageItemPreparationTimeSeconds || 0} seconds</Text>
                            {employee.inventoryRequestsHandled !== undefined && (
                                <Text>Inventory Requests Handled: {employee.inventoryRequestsHandled}</Text>
                            )}
                        </View>
                    )}

                    {employee.employeeRole === 'display' && (
                        <View style={detailModalStyles.metricSection}>
                            <Text style={detailModalStyles.metricTitle}>Display Metrics</Text>
                            <Text>Images Uploaded: {employee.imagesUploaded || 0}</Text>
                            <Text>Ads Managed: {employee.adsManaged || 0}</Text>
                            <Text>GIFs Uploaded: {employee.gifsUploaded || 0}</Text>
                            <Text>Custom Images Uploaded: {employee.customImagesUploaded || 0}</Text>
                        </View>
                    )}
                </ScrollView>
            </View>
        </Modal>
    );
};

const PerformancesScreen = () => {
    const [performanceData, setPerformanceData] = useState<EmployeePerformanceMetrics[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'custom'>('daily');
    const [customStartDate, setCustomStartDate] = useState<Date | undefined>(undefined);
    const [customEndDate, setCustomEndDate] = useState<Date | undefined>(undefined);
    const [selectedEmployeeForDetail, setSelectedEmployeeForDetail] = useState<EmployeePerformanceMetrics | null>(null);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

    const fetchPerformance = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { from, to } = getPeriodDates(selectedPeriod, customStartDate, customEndDate);
            const rawData = await getEmployeePerformanceAll(undefined, from, to); // Fetch raw daily aggregates

            let processedData: EmployeePerformanceMetrics[] = [];

            if (selectedPeriod === 'daily') {
                // For daily view, data is already per-day per-employee, so use directly
                processedData = rawData;
            } else {
                // For weekly/monthly, aggregate data per employee
                const aggregatedMap = new Map<string, EmployeePerformanceMetrics>();

                rawData.forEach(item => {
                    if (!aggregatedMap.has(item.employeeId)) {
                        // Initialize with current item's general employee info and default all metrics to 0
                        aggregatedMap.set(item.employeeId, {
                            employeeId: item.employeeId,
                            employeeName: item.employeeName,
                            employeeRole: item.employeeRole,
                            loginDurationMinutes: 0,
                            breakDurationMinutes: 0,
                            daysOffCount: 0,
                            ordersHandled: 0,
                            averageOrderProcessingTimeSeconds: 0,
                            itemsPrepared: 0,
                            averageItemPreparationTimeSeconds: 0,
                            imagesUploaded: 0,
                            adsManaged: 0,
                            gifsUploaded: 0,
                            customImagesUploaded: 0,
                            lastActivityAt: undefined, // Will be updated to the latest activity date
                            // Initialize other role-specific metrics as 0 if they exist on the interface
                            customerInteractionScore: undefined,
                            inventoryRequestsHandled: undefined,
                        });
                    }

                    const currentAggregate = aggregatedMap.get(item.employeeId)!;

                    // Sum up duration and count metrics
                    currentAggregate.loginDurationMinutes += item.loginDurationMinutes || 0;
                    currentAggregate.breakDurationMinutes += item.breakDurationMinutes || 0;
                    currentAggregate.daysOffCount += item.daysOffCount || 0;
                    currentAggregate.ordersHandled! += item.ordersHandled || 0; // Use ! and || 0
                    currentAggregate.itemsPrepared! += item.itemsPrepared || 0;
                    currentAggregate.imagesUploaded! += item.imagesUploaded || 0;
                    currentAggregate.adsManaged! += item.adsManaged || 0;
                    currentAggregate.gifsUploaded! += item.gifsUploaded || 0;
                    currentAggregate.customImagesUploaded! += item.customImagesUploaded || 0;

                    // For averages, we'll need to sum up total seconds and total counts
                    // Then calculate the average at the end
                    const totalOrderProcessingSecondsForEmployee = (currentAggregate.averageOrderProcessingTimeSeconds || 0) * (currentAggregate.ordersHandled || 0);
                    const newTotalOrderProcessingSeconds = totalOrderProcessingSecondsForEmployee + (item.averageOrderProcessingTimeSeconds || 0) * (item.ordersHandled || 0); // Avg * Count
                    if (currentAggregate.ordersHandled! > 0) {
                        currentAggregate.averageOrderProcessingTimeSeconds = Math.round(newTotalOrderProcessingSeconds / currentAggregate.ordersHandled!);
                    } else {
                        currentAggregate.averageOrderProcessingTimeSeconds = 0;
                    }
                    
                    const totalItemPreparationSecondsForEmployee = (currentAggregate.averageItemPreparationTimeSeconds || 0) * (currentAggregate.itemsPrepared || 0);
                    const newTotalItemPreparationSeconds = totalItemPreparationSecondsForEmployee + (item.averageItemPreparationTimeSeconds || 0) * (item.itemsPrepared || 0);
                    if (currentAggregate.itemsPrepared! > 0) {
                        currentAggregate.averageItemPreparationTimeSeconds = Math.round(newTotalItemPreparationSeconds / currentAggregate.itemsPrepared!);
                    } else {
                        currentAggregate.averageItemPreparationTimeSeconds = 0;
                    }

                    // Update lastActivityAt to the latest timestamp
                    if (item.lastActivityAt) {
                        const itemLastActivityDate = new Date(item.lastActivityAt);
                        if (!currentAggregate.lastActivityAt || itemLastActivityDate > currentAggregate.lastActivityAt) {
                            currentAggregate.lastActivityAt = itemLastActivityDate;
                        }
                    }

                    // For other optional metrics, take the latest or a combined value if applicable
                    if (item.customerInteractionScore !== undefined) {
                        currentAggregate.customerInteractionScore = item.customerInteractionScore; // Or average/latest as needed
                    }
                    if (item.inventoryRequestsHandled !== undefined) {
                        currentAggregate.inventoryRequestsHandled = item.inventoryRequestsHandled; // Or sum
                    }
                });
                processedData = Array.from(aggregatedMap.values());
            }
            setPerformanceData(processedData);

        } catch (err: any) {
            console.error("Error fetching performance data:", err);
            setError("Failed to fetch performance data. " + (err.message || 'Please try again.'));
        } finally {
            setLoading(false);
        }
    }, [selectedPeriod, customStartDate, customEndDate]);

    useEffect(() => {
        fetchPerformance();
    }, [fetchPerformance]);

    const openDetailModal = (employee: EmployeePerformanceMetrics) => {
        setSelectedEmployeeForDetail(employee);
        setIsDetailModalVisible(true);
    };

    const closeDetailModal = () => {
        setIsDetailModalVisible(false);
        setSelectedEmployeeForDetail(null);
    };

    const columns: Column<EmployeePerformanceMetrics>[] = [
        {
            key: "employeeName",
            title: "Name",
            sortable: true,
            width: '30%',
            render: (value: any, item: EmployeePerformanceMetrics) => (
                <TouchableOpacity onPress={() => openDetailModal(item)}>
                    <Text style={{ color: theme.colors.primary }}>{String(value || '')}</Text>
                </TouchableOpacity>
            )
        },
        {
            key: "employeeRole",
            title: "Role",
            sortable: true,
            width: '20%',
        },
        {
            key: "loginDurationMinutes",
            title: "Login (min)",
            sortable: true,
            width: '20%',
            render: (value: any) => <Text>{value || 0}</Text>
        },
        {
            key: "ordersHandled",
            title: "Orders",
            sortable: true,
            width: '15%',
            render: (value: any, item: EmployeePerformanceMetrics) => item.employeeRole === 'cashier' ? <Text>{value || 0}</Text> : <Text>-</Text>
        },
        {
            key: "itemsPrepared",
            title: "Items",
            sortable: true,
            width: '15%',
            render: (value: any, item: EmployeePerformanceMetrics) => item.employeeRole === 'kitchen' ? <Text>{value || 0}</Text> : <Text>-</Text>
        },
        {
            key: "imagesUploaded",
            title: "Images",
            sortable: true,
            width: '15%',
            render: (value: any, item: EmployeePerformanceMetrics) => item.employeeRole === 'display' ? <Text>{value || 0}</Text> : <Text>-</Text>
        },
    ];

    return (
        <View style={screenStyles.container}>
            <View style={screenStyles.headerContainer}>
                <Text style={theme.text.heading1}>Employee Performance</Text>
            </View>

            <View style={screenStyles.periodSelector}>
                {['daily', 'weekly', 'monthly'].map((period) => (
                    <TouchableOpacity
                        key={period}
                        style={[
                            screenStyles.periodButton,
                            selectedPeriod === period && screenStyles.periodButtonActive
                        ]}
                        onPress={() => setSelectedPeriod(period as any)}
                    >
                        <Text style={[
                            screenStyles.periodButtonText,
                            selectedPeriod === period && screenStyles.periodButtonTextActive
                        ]}>
                            {period.charAt(0).toUpperCase() + period.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {loading ? (
                <View style={screenStyles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text style={screenStyles.loadingText}>Loading performance data...</Text>
                </View>
            ) : error ? (
                <View style={screenStyles.errorContainer}>
                    <Text style={screenStyles.errorText}>{error}</Text>
                    <TouchableOpacity style={screenStyles.retryButton} onPress={fetchPerformance}>
                        <Text style={screenStyles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : performanceData.length === 0 ? (
                <View style={screenStyles.noDataContainer}>
                    <Text style={screenStyles.noDataText}>No performance data available for this period.</Text>
                </View>
            ) : (
                <DataTable<EmployeePerformanceMetrics>
                    data={performanceData}
                    columns={columns}
                    pageSize={10}
                    keyExtractor={(item: EmployeePerformanceMetrics) => item.employeeId}
                />
            )}

            <EmployeeDetailModal
                visible={isDetailModalVisible}
                onClose={closeDetailModal}
                employee={selectedEmployeeForDetail}
            />
        </View>
    );
};

const screenStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.md,
    },
    headerContainer: {
        marginBottom: theme.spacing.lg,
    },
    periodSelector: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: theme.spacing.md,
        backgroundColor: theme.colors.cardBackground,
        borderRadius: theme.roundness,
        padding: theme.spacing.xs,
        ...theme.shadows.sm,
    },
    periodButton: {
        flex: 1,
        paddingVertical: theme.spacing.sm,
        alignItems: 'center',
        borderRadius: theme.roundness,
    },
    periodButtonActive: {
        backgroundColor: theme.colors.primary,
    },
    periodButtonText: {
        color: theme.colors.textSecondary,
        fontWeight: theme.typography.fontWeight.semibold,
        fontSize: theme.typography.fontSize.sm,
    },
    periodButtonTextActive: {
        color: theme.colors.white,
    },
    customDateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginBottom: theme.spacing.md,
    },
    dateInput: {
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.roundness,
        padding: theme.spacing.sm,
        width: '40%',
        color: theme.colors.text,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: theme.spacing.md,
        fontSize: theme.typography.fontSize.md,
        color: theme.colors.text,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.lg,
        backgroundColor: theme.colors.dangerLight,
        borderRadius: theme.roundness,
        borderWidth: 1,
        borderColor: theme.colors.danger,
    },
    errorText: {
        color: theme.colors.danger,
        textAlign: 'center',
        fontSize: theme.typography.fontSize.md,
        fontWeight: theme.typography.fontWeight.bold,
    },
    retryButton: {
        marginTop: theme.spacing.md,
        backgroundColor: theme.colors.primary,
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.roundness,
    },
    retryButtonText: {
        color: theme.colors.white,
        fontSize: theme.typography.fontSize.md,
        fontWeight: theme.typography.fontWeight.semibold,
    },
    noDataContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.lg,
    },
    noDataText: {
        color: theme.colors.textSecondary,
        fontSize: theme.typography.fontSize.md,
        textAlign: 'center',
    },
});

const detailModalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.md,
        paddingTop: theme.spacing.xl,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    closeButton: {
        padding: theme.spacing.sm,
    },
    contentContainer: {
        paddingBottom: theme.spacing.lg,
    },
    roleText: {
        ...theme.text.body,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.sm,
    },
    lastActivity: {
        ...theme.text.caption,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.md,
    },
    metricSection: {
        backgroundColor: theme.colors.cardBackground,
        padding: theme.spacing.md,
        borderRadius: theme.roundness,
        marginBottom: theme.spacing.md,
        ...theme.shadows.sm,
    },
    metricTitle: {
        ...theme.text.heading3,
        color: theme.colors.primary,
        marginBottom: theme.spacing.sm,
    },
});

export default PerformancesScreen;
