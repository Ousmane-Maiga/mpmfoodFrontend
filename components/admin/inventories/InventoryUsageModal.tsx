// components/admin/InventoryUsageModal.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal, Portal, Text, Button, DataTable } from 'react-native-paper';
import { InventoryItem, InventoryUsage } from '@/types/admin';

interface InventoryUsageModalProps {
  visible: boolean;
  onClose: () => void;
  item: InventoryItem | null;
  usageData: InventoryUsage[];
}

export default function InventoryUsageModal({ visible, onClose, item, usageData }: InventoryUsageModalProps) {
  return (
    <Portal>
      <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.modal}>
        <View style={styles.container}>
          <Text style={styles.title}>Usage History: {item?.name}</Text>
          
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Date</DataTable.Title>
              <DataTable.Title numeric>Quantity Used</DataTable.Title>
              <DataTable.Title>Order ID</DataTable.Title>
            </DataTable.Header>

            {usageData.map((usage, index) => (
              <DataTable.Row key={index}>
                <DataTable.Cell>
                  {new Date(usage.date).toLocaleDateString()}
                </DataTable.Cell>
                <DataTable.Cell numeric>{usage.quantity_used} {item?.unit}</DataTable.Cell>
                <DataTable.Cell>#{usage.order_id}</DataTable.Cell>
              </DataTable.Row>
            ))}

            {usageData.length === 0 && (
            <DataTable.Row>
                <DataTable.Cell>
                <Text style={styles.noData}>No usage history found</Text>
                </DataTable.Cell>
                <DataTable.Cell>
                <Text style={styles.noData} children={undefined}></Text>
                </DataTable.Cell>
                <DataTable.Cell>
                <Text style={styles.noData} children={undefined}></Text>
                </DataTable.Cell>
            </DataTable.Row>
            )}
          </DataTable>

          <Button 
            mode="contained" 
            onPress={onClose}
            style={styles.closeButton}
          >
            Close
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    padding: 20,
  },
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  noData: {
    textAlign: 'center',
    paddingVertical: 20,
    width: '100%', 
  },
  closeButton: {
    marginTop: 20,
  },
});