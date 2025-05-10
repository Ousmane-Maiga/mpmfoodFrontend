// app/(tabs)/admin/sales/index.tsx
import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Text } from "../../../../components/ui/Text";
import { DataTable } from "../../../../components/ui/DataTable";
import { recentOrders } from "../../../../constants/sampleData";
import { theme } from "../../../../constants/theme";

export default function SalesScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={[theme.text.heading1, styles.header]}>Sales</Text>
      
      <DataTable
        data={recentOrders}
        columns={[
          { 
            key: "id", 
            title: "Order ID",
            width: '20%'
          },
          { 
            key: "customer", 
            title: "Customer",
            width: '25%'
          },
          { 
            key: "date", 
            title: "Date",
            width: '20%',
            render: (value) => new Date(value).toLocaleDateString()
          },
          { 
            key: "total", 
            title: "Amount", 
            numeric: true,
            width: '15%',
            render: (value) => `$${value.toFixed(2)}`
          },
          { 
            key: "status", 
            title: "Status",
            width: '20%',
            render: (value) => (
              <Text style={[
                styles.statusText,
                value === 'Completed' && styles.completedStatus,
                value === 'Pending' && styles.pendingStatus,
                value === 'Cancelled' && styles.cancelledStatus,
              ]}>
                {value}
              </Text>
            )
          }
        ]}
        pageSize={10}
        keyExtractor={(item) => item.id}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  header: {
    marginBottom: theme.spacing.lg,
    color: theme.colors.text,
  },
  statusText: {
    fontWeight: '500',
    textAlign: 'center',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  completedStatus: {
    backgroundColor: '#ecfdf5',
    color: '#10b981',
  },
  pendingStatus: {
    backgroundColor: '#fffbeb',
    color: '#f59e0b',
  },
  cancelledStatus: {
    backgroundColor: '#fef2f2',
    color: '#ef4444',
  },
});