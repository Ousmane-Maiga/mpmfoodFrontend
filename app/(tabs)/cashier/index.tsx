import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme } from 'react-native-paper';
import AllOrdersScreen from './all-orders';
import AddOrdersScreen from './add-orders';

const Tab = createMaterialTopTabNavigator();

export default function CashierScreen() {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#f7c40d',
        tabBarInactiveTintColor: 'gray',
        tabBarIndicatorStyle: {
          backgroundColor: '#f7c40d',
        },
        tabBarLabelStyle: {
          fontWeight: 'bold',
          textTransform: 'none',
        },
        tabBarStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Tab.Screen 
        name="AddOrder" 
        component={AddOrdersScreen}
        options={{
          title: 'Add Order',
        }}
      />
      <Tab.Screen 
        name="AllOrders" 
        component={AllOrdersScreen}
        options={{
          title: 'All Orders',
        }}
      />
    </Tab.Navigator>
  );
}