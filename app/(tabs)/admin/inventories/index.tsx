
// app/(tabs)/admin/inventory/index.tsx
import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Text } from "../../../../components/ui/Text";
import { DataTable } from "../../../../components/ui/DataTable";
import { sampleProducts } from "../../../../constants/sampleData";
import { theme } from "../../../../constants/theme";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  threshold: number;
  status?: string; // Add this if you want to use status
  supplier?: {
    name: string;
    contact: string;
  };
};

export default function InventoryScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={[theme.text.heading1, styles.header]}>Inventory</Text>
      
      <DataTable<Product>
        data={sampleProducts}
        columns={[
          { 
            key: "name", 
            title: "Product",
            width: '30%'
          },
          { 
            key: "category", 
            title: "Category",
            width: '20%'
          },
          { 
            key: "price", 
            title: "Price", 
            numeric: true,
            width: '20%',
            render: (value) => `$${value.toFixed(2)}`
          },
          { 
            key: "stock", 
            title: "Stock", 
            numeric: true,
            width: '15%',
            render: (value, item) => (
              <Text style={value < item.threshold ? styles.lowStock : undefined}>
                {value}
              </Text>
            )
          },
          { 
            key: "status", 
            title: "Status",
            width: '15%',
            render: (_, item) => (
              <Text style={item.stock < item.threshold ? styles.lowStockText : styles.inStockText}>
                {item.stock < item.threshold ? 'Low' : 'OK'}
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
  lowStock: {
    color: theme.colors.danger,
  },
  lowStockText: {
    color: theme.colors.danger,
    fontWeight: '600',
  },
  inStockText: {
    color: theme.colors.success,
    fontWeight: '600',
  },
});