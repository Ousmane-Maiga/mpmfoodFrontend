// OrderStatusTabs.tsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'; // Import StyleSheet
import { OrderStatusFilter } from '@/types/cashierTypes';
// import { styles } from './styles'; // If styles are in a separate file, make sure to import correctly

const statusColors = {
  all: '#000000',      // Black for 'All Orders'
  pending: '#FFA500',  // Orange
  in_progress: '#1E90FF', // Dodger Blue
  ready: '#32CD32',    // Lime Green
  completed: '#808080', // Grey
  cancelled: '#FF0000' // Red
} as const;

interface OrderStatusTabsProps {
  activeTab: OrderStatusFilter;
  onTabChange: (tab: OrderStatusFilter) => void;
}

const OrderStatusTabs: React.FC<OrderStatusTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs: OrderStatusFilter[] = ['all', 'pending', 'in_progress', 'ready', 'completed'];

  const getTabLabel = (tab: OrderStatusFilter) => {
    switch (tab) {
      case 'all': return 'All Orders';
      case 'in_progress': return 'In Progress';
      default: return tab.charAt(0).toUpperCase() + tab.slice(1).replace('_', ' ');
    }
  };

  return (
    <View style={styles.statusTabs}>
      {tabs.map((tab) => (
        <TouchableOpacity 
          key={tab}
          style={[
            styles.tab, 
            activeTab === tab && {
              ...styles.activeTab,
              borderBottomColor: statusColors[tab]
            }
          ]}
          onPress={() => onTabChange(tab)}
        >
          <Text style={[
            styles.tabText,
            activeTab === tab && {
              ...styles.activeTabText,
              color: statusColors[tab] // Apply specific color for active tab
            }
          ]}>
            {getTabLabel(tab)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  statusTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    fontWeight: 'bold',
  },
});

export default OrderStatusTabs;