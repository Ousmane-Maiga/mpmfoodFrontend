import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { OrderStatusFilter } from '@/types/cashierTypes';
import { styles } from './styles';

const statusColors = {
  all: '#6200ee',
  pending: '#FFA500',
  in_progress: '#1E90FF',
  ready: '#32CD32',
  completed: '#808080',
  cancelled: '#FF0000'
} as const;

interface OrderStatusTabsProps {
  activeTab: OrderStatusFilter;
  onTabChange: (tab: OrderStatusFilter) => void;
}

const OrderStatusTabs: React.FC<OrderStatusTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs: OrderStatusFilter[] = ['all', 'pending', 'in_progress', 'ready'];

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
              color: statusColors[tab]
            }
          ]}>
            {getTabLabel(tab)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default OrderStatusTabs;