import { Stack } from 'expo-router';
import { theme } from '../../../constants/theme';

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.card,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
      }}
    >
      {/* Dashboard - Main Admin Screen */}
      <Stack.Screen
        name="index"
        options={{
          title: 'Admin Dashboard',
        }}
      />

      {/* Employees Management */}
      <Stack.Screen
        name="employees/index"
        options={{
          title: 'Employee Management',
        }}
      />

      {/* Employee Details */}
      <Stack.Screen
        name="employees/[employeeId]"
        options={{
          title: 'Employee Details',
        }}
      />

      {/* Dashboard - Main Admin Screen */}
      <Stack.Screen
        name="dashboard"
        options={{
          title: 'Admin Dashboard',
          headerShown: true,
        }}
      />

      {/* Inventory Management */}
      <Stack.Screen
        name="inventories"
        options={{
          title: 'Inventory Management',
          headerBackTitle: 'Dashboard',
        }}
      />

      {/* Inventory Item Details */}<Stack.Screen
        name="[itemId]"
        options={{
          title:  'Product Details',
          headerBackTitle: 'Inventory',
        }}
      />
      

      {/* Sales Reports */}
      <Stack.Screen
        name="sales"
        options={{
          title: 'Sales Reports',
          headerBackTitle: 'Dashboard',
        }}
      />

      {/* Order Details */}
      <Stack.Screen
        name="[orderId]"
        options={{
            title: 'Order Details',
            headerBackTitle: 'Sales',
        }}
      />

      {/* Reports Screen (Example) */}
      <Stack.Screen
        name="reports"
        options={{
          title: 'Analytics Reports',
          headerBackTitle: 'Dashboard',
        }}
      />
    </Stack>
  );
}