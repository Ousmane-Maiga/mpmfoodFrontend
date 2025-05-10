import { NavigatorScreenParams } from '@react-navigation/native';


type RootStackParamList = {
    '/(auth)/login': string;
    '/(tabs)/home': { employee_role?: string };
    '/(tabs)/admin': { employee_role?: string };
    '/(tabs)/cashier': { employee_role?: string };
    '/(tabs)/display': { employee_role?: string };
    '/(tabs)/kitchen': { employee_role?: string };
  };

  export type AdminStackParamList = {
    'admin/dashboard': undefined;
    'admin/employees': undefined;
    'admin/employees': undefined;
    'admin/employees/[employeeId]': { 
        employeeId: string;
        // name?: string;
    };
    'admin/inventories': undefined;
    'admin/inventories/[itemId]': { id: string; name?: string };
    'admin/sales': undefined;
    'admin/sales/[orderId]': { id: string; orderId?: string };
  };
  
  declare global {
    namespace ReactNavigation {
      interface RootParamList extends AdminStackParamList {}
    }
  }