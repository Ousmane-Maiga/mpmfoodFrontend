import { NavigatorScreenParams } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';

// 1. Define your auth routes
type AuthStackParamList = {
  '(auth)/login': undefined;
};

type User = {
  name: string;
  role: string;
  id: string; // Added ID for consistency
};

// 2. Define your admin stack routes
// type AdminStackParamList = {
//   '(tabs)/admin/dashboard': { user: User };
//   '(tabs)/admin/employees': { user: User };
//   '(tabs)/admin/inventories': { user: User };
//   '(tabs)/admin/sales': { user: User };
//   '(tabs)/admin/report': { user: User };
// };

// 3. Define your tab routes
type TabParamList = {
  home: { user: User };
  admin: { user: User }; // Changed from NavigatorScreenParams to direct params
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
    interface RootParamList extends RootStackParamList {}
  }
}

// Export types for use in components
export type {
  AuthStackParamList,
  // AdminStackParamList,
  TabParamList,
  RootStackParamList,
  User,
  RouteProp  // Add RouteProp to exports
};