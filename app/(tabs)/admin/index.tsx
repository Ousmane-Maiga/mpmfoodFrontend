// import React from 'react';
// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// import { useTheme } from 'react-native-paper';
// import InventoriesScreen from './inventories';
// import SalesScreen from './sales';
// import AdminDashboard from './dashboard';
// import EmployeesScreen from './employees';

// const Tab = createMaterialTopTabNavigator();

// export default function AdminScreen() {
//   const theme = useTheme();
//   return (
//     <Tab.Navigator
//       screenOptions={{
//         tabBarActiveTintColor: '#f7c40d',
//         tabBarInactiveTintColor: 'gray',
//         tabBarIndicatorStyle: {
//           backgroundColor: '#f7c40d',
//         },
//         tabBarLabelStyle: {
//           fontWeight: 'bold',
//           textTransform: 'none',
//         },
//         tabBarStyle: {
//           backgroundColor: theme.colors.background,
//         },
//       }}
//     >
//       <Tab.Screen
//         name="dashboard"
//         component={AdminDashboard}
//         options={{ title: 'Dashboard' }}
//       />
//       <Tab.Screen
//         name="employees"
//         component={EmployeesScreen}
//         options={{ title: 'Employees' }}
//       />
//       <Tab.Screen
//         name="inventories"
//         component={InventoriesScreen}
//         options={{ title: 'Inventories' }}
//       />
//       <Tab.Screen
//         name="sales"
//         component={SalesScreen}
//         options={{ title: 'Sales' }}
//       />
//     </Tab.Navigator>
//   );
// }



import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme } from 'react-native-paper';
import InventoriesScreen from './inventories';
import SalesScreen from './sales';
import AdminDashboard from './dashboard';
import EmployeesScreen from './employees';

const Tab = createMaterialTopTabNavigator();

interface AdminScreenProps {
  // Add any props your component receives here
  // For example, if it receives a user prop:
  // user?: UserType;
}

const AdminScreen: React.FC<AdminScreenProps> = () => {
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
        name="dashboard"
        component={AdminDashboard}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen
        name="employees"
        component={EmployeesScreen}
        options={{ title: 'Employees' }}
      />
      <Tab.Screen
        name="inventories"
        component={InventoriesScreen}
        options={{ title: 'Inventories' }}
      />
      <Tab.Screen
        name="sales"
        component={SalesScreen}
        options={{ title: 'Sales' }}
      />
    </Tab.Navigator>
  );
};

export default AdminScreen;