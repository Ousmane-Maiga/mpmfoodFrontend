// app/(tabs)/admin/index.tsx

import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { theme } from '@/constants/theme';
import { SafeAreaView, StyleSheet } from 'react-native';
import InventoriesScreen from './inventories';
import SalesScreen from './sales';
import AdminDashboard from './dashboard';
import EmployeesScreen from './employees';
// import ReportsScreen from './reports';
import PerformancesScreen from './performances';
import ParametersScreen from './parameters';
import AboutScreen from './about';

const Drawer = createDrawerNavigator();

interface AdminScreenProps {
  // Add any props your component receives here
}

const AdminScreen: React.FC<AdminScreenProps> = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Drawer.Navigator
        initialRouteName="dashboard"
        screenOptions={{
          drawerActiveTintColor: theme.colors.primary,
          drawerInactiveTintColor: '#000',
          drawerLabelStyle: styles.drawerLabel,
          drawerStyle: {
            backgroundColor: theme.colors.background,
            width: 240,
          },
          headerStyle: {
            backgroundColor: theme.colors.background,
            
          },
          headerTintColor: theme.colors.text,
        }}
      >
        <Drawer.Screen
          name="dashboard"
          component={AdminDashboard}
          options={{ title: 'Dashboard' }}
        />
        <Drawer.Screen
          name="employees"
          component={EmployeesScreen}
          options={{ title: 'Employees' }}
        />
        <Drawer.Screen
          name="inventories"
          component={InventoriesScreen}
          options={{ title: 'Inventories' }}
        />
        <Drawer.Screen
          name="sales"
          component={SalesScreen}
          options={{ title: 'Sales' }}
        />
        {/* <Drawer.Screen
          name="reports"
          component={ReportsScreen}
          options={{ title: 'Reports' }}
        /> */}
        <Drawer.Screen
          name="performances"
          component={PerformancesScreen}
          options={{ title: 'Performances' }}
        />
        <Drawer.Screen
          name="parameters"
          component={ParametersScreen}
          options={{ title: 'Parameters' }}
        />
        <Drawer.Screen
          name="about"
          component={AboutScreen}
          options={{ title: 'About' }}
        />
      </Drawer.Navigator>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  drawerLabel: {
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default AdminScreen;