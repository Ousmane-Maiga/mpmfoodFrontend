import { Stack } from 'expo-router';
import { theme } from '../../../constants/theme';

// Define the parameter types for each screen
type EmployeeDetailParams = {
  id: string;
  name?: string;
};

type InventoryItemParams = {
  id: string;
  name?: string;
};

type SalesOrderParams = {
  id: string;
  orderId?: string;
};

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
        headerBackTitleStyle: {
          fontSize: 14,
        },
      }}
    >
      {/* Dashboard - Main Admin Screen */}
      <Stack.Screen
        name="dashboard"
        options={{
          title: 'Admin Dashboard',
          headerShown: true,
        }}
      />

      {/* Employees Management */}
      <Stack.Screen
        name="employees"
        options={{
          title: 'Employee Management',
          headerBackTitle: 'Dashboard',
        }}
      />

      {/* Employee Details */}
      {/* <Stack.Screen 
        name="employees/[employeeId]" 
        options={({ route }) => ({
            title: (route.params as EmployeeDetailParams)?.name || 'Employess Details',
            headerBackTitle: 'Employee',     
        })}
      /> */}

      {/* Inventory Management */}
      <Stack.Screen
        name="inventories"
        options={{
          title: 'Inventory Management',
          headerBackTitle: 'Dashboard',
        }}
      />

      {/* Inventory Item Details */}
      {/* <Stack.Screen
        name="inventories/[itemId]"
        options={({ route }) => ({
          title: (route.params as InventoryItemParams)?.name || 'Product Details',
          headerBackTitle: 'Inventory',
        })}
      /> */}

      {/* Sales Reports */}
      <Stack.Screen
        name="sales"
        options={{
          title: 'Sales Reports',
          headerBackTitle: 'Dashboard',
        }}
      />

      {/* Order Details */}
      {/* <Stack.Screen
        name="sales/[orderId]"
        options={({ route }) => {
          const params = route.params as SalesOrderParams;
          return {
            title: params?.orderId ? `Order #${params.orderId}` : 'Order Details',
            headerBackTitle: 'Sales',
          };
        }}
      /> */}

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