// import { NavigatorScreenParams } from '@react-navigation/native';


// type RootStackParamList = {
//     '/(auth)/login': string;
//     '/(tabs)/home': { employee_role?: string };
//     '/(tabs)/admin': { employee_role?: string };
//     '/(tabs)/cashier': { employee_role?: string };
//     '/(tabs)/display': { employee_role?: string };
//     '/(tabs)/kitchen': { employee_role?: string };
//   };

//   export type AdminStackParamList = {
//     'admin/dashboard': undefined;
//     'admin/employees': undefined;
//     'admin/employees/[employeeId]': { 
//         employeeId: string;
//         name?: string;
//     };
//     'admin/inventories': undefined;
//     'admin/inventories/[itemId]': { id: string; name?: string };
//     'admin/sales': undefined;
//     'admin/sales/[orderId]': { id: string; orderId?: string };
//   };
  
//   declare global {
//     namespace ReactNavigation {
//       interface RootParamList extends AdminStackParamList {}
//     }
//   }


import { NavigatorScreenParams } from '@react-navigation/native';

// 1. Define your auth routes
type AuthStackParamList = {
  '(auth)/login': undefined;
};

type User = {
  name: string;
  role: string;
};

// 2. Define your admin stack routes
type AdminStackParamList = {
  '(tabs)/admin/dashboard': undefined;
  '(tabs)/admin/employees': undefined;
  '(tabs)/admin/inventories': undefined;
  '(tabs)/admin/sales': undefined;
  '(tabs)/admin/inventories/[itemId]': {
    id: string;
    name?: string;
  };
  '(tabs)/admin/sales/[orderId]': {
    id: string;
    orderId?: string;
  };
};

// 3. Define your tab routes
type TabParamList = {
  home: { user: User };
  admin: NavigatorScreenParams<AdminStackParamList>;
  cashier: { user: User };
  display: { user: User };
  kitchen: { user: User };
};

// 4. Define your root stack
type RootStackParamList = {
  '(auth)': NavigatorScreenParams<AuthStackParamList>;
  '(tabs)': NavigatorScreenParams<TabParamList>;
};

// 5. Global type declarations
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList, AdminStackParamList {}
  }
}

// Export types for use in components
export type {
  AuthStackParamList,
  AdminStackParamList,
  TabParamList,
  RootStackParamList
};