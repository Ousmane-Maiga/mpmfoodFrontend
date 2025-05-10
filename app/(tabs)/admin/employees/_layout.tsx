// app/(tabs)/admin/employees/_layout.tsx
import { Stack } from 'expo-router';

export default function EmployeesLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen 
        name="[employeeId]" 
        options={{
            presentation: 'modal',
            headerShown: true,
            title: 'Employee Details',
            contentStyle: {
              backgroundColor: 'white', // Match your app background
              flex: 1 // Force full screen
            }
          }}
      />
    </Stack>
  );
}


