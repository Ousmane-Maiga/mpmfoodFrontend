// // app/(tabs)/admin/index

// import React from 'react';
// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// import { theme } from '@/constants/theme'
// import { SafeAreaView, StyleSheet } from 'react-native'; // Import SafeAreaView and StyleSheet

// import InventoriesScreen from './inventories';
// import SalesScreen from './sales';
// import AdminDashboard from './dashboard';
// import EmployeesScreen from './employees';

// const Tab = createMaterialTopTabNavigator();

// interface AdminScreenProps {
//   // Add any props your component receives here
//   // For example, if it receives a user prop:
//   // user?: UserType;
// }

// const AdminScreen: React.FC<AdminScreenProps> = () => {
 
  
//   return (
//     // Wrap the Tab.Navigator with SafeAreaView
//     <SafeAreaView style={styles.safeArea}>
//       <Tab.Navigator
//         screenOptions={{
//           tabBarActiveTintColor: theme.colors.primary,
//           tabBarInactiveTintColor: '#666',
//           tabBarIndicatorStyle: {
//             backgroundColor: theme.colors.primary,
//           },
//           tabBarLabelStyle: styles.tabLabel,
//           tabBarStyle: {
//             backgroundColor: theme.colors.background,
//           },
//         }}
//       >
//         <Tab.Screen
//           name="dashboard"
//           component={AdminDashboard}
//           options={{ title: 'Dashboard' }}
//         />
//         <Tab.Screen
//           name="employees"
//           component={EmployeesScreen}
//           options={{ title: 'Employees' }}
//         />
//         <Tab.Screen
//           name="inventories"
//           component={InventoriesScreen}
//           options={{ title: 'Inventories' }}
//         />
//         <Tab.Screen
//           name="sales"
//           component={SalesScreen}
//           options={{ title: 'Sales' }}
//         />
//       </Tab.Navigator>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1, // Ensures SafeAreaView takes up the full available space
//     // You might want to add a background color here that matches your app's overall background
//     // For example: backgroundColor: 'white', or theme.colors.background
//   },
//   tabLabel: { // <-- New style for tab labels
//     fontWeight: 'bold',
//     textTransform: 'none',
//     fontSize: 11, // You can adjust the font size here if needed
//   },
// });

// export default AdminScreen;


// app/(tabs)/admin/index.tsx

import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { theme } from '@/constants/theme';
import { SafeAreaView, StyleSheet } from 'react-native';
import InventoriesScreen from './inventories';
import SalesScreen from './sales';
import AdminDashboard from './dashboard';
import EmployeesScreen from './employees';
import ReportsScreen from './reports';
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
          drawerInactiveTintColor: '#666',
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
        <Drawer.Screen
          name="reports"
          component={ReportsScreen}
          options={{ title: 'Reports' }}
        />
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
    fontSize: 14,
  },
});

export default AdminScreen;