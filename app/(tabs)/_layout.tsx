// import React from 'react';
// import { createBottomTabNavigator, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
// import { Ionicons } from '@expo/vector-icons';
// import { useLocalSearchParams } from 'expo-router';

// // Import all screen components
// import HomeScreen from './index';
// import AdminScreen from './admin/index';
// import CashierScreen from './cashier/index';
// import KitchenScreen from './kitchen/index';
// import DisplayScreen from './display/index';

// type TabParamList = {
//     Home: undefined;
//     Admin: undefined;
//     Cashier: undefined;
//     Kitchen: undefined;
//     Display: undefined;
// };

// const Tab = createBottomTabNavigator<TabParamList>();

// type RouteParams = {
//     employee_role?: string;
// };

// type TabBarIconProps = {
//     color: string;
//     size: number;
// };

// const getTabBarIcon = (routeName: keyof TabParamList) => {
//     return ({ color, size }: TabBarIconProps) => {
//         let iconName: keyof typeof Ionicons.glyphMap = 'home';

//         switch (routeName) {
//             case 'Home':
//                 iconName = 'home';
//                 break;
//             case 'Admin':
//                 iconName = 'settings';
//                 break;
//             case 'Cashier':
//                 iconName = 'cash';
//                 break;
//             case 'Kitchen':
//                 iconName = 'restaurant';
//                 break;
//             case 'Display':
//                 iconName = 'tv';
//                 break;
//         }

//         return <Ionicons name={iconName} size={size} color={color} />;
//     };
// };

// export default function AppLayout() {
//     const { employee_role } = useLocalSearchParams<RouteParams>();

//     if (!employee_role) {
//         return null;
//     }

//     return (
//         <Tab.Navigator
//             screenOptions={({ route }: BottomTabScreenProps<TabParamList>) => ({ // Added the type here
//                 tabBarIcon: getTabBarIcon(route.name),
//                 headerShown: false,
//             })}
//         >
//             <Tab.Screen name="Home" component={HomeScreen} />

//             {employee_role === 'admin' && (
//                 <Tab.Screen name="Admin" component={AdminScreen} />
//             )}

//             {(employee_role === 'admin' || employee_role === 'cashier') && (
//                 <Tab.Screen name="Cashier" component={CashierScreen} />
//             )}

//             {(employee_role === 'admin' || employee_role === 'kitchen') && (
//                 <Tab.Screen name="Kitchen" component={KitchenScreen} />
//             )}

//             {(employee_role === 'admin' || employee_role === 'display') && (
//                 <Tab.Screen name="Display" component={DisplayScreen} />
//             )}
//         </Tab.Navigator>
//     );
// }





// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { Ionicons } from '@expo/vector-icons';
// import { useLocalSearchParams } from 'expo-router';

// // Screens (Expo Router file-based paths)
// import HomeScreen from './index';
// import AdminScreen from './admin/index';
// import CashierScreen from './cashier/index';
// import KitchenScreen from './kitchen/index';
// import DisplayScreen from './display/index';
// import { useAuth } from '@/contexts/AuthContext';

// // Types
// type TabParamList = {
//   home: undefined;
//   admin: undefined;
//   cashier: undefined;
//   kitchen: undefined;
//   display: undefined;
// };

// type TabBarIconProps = {
//   color: string;
//   size: number;
// };

// // Tab Icons Config (Cleaner approach)
// const TAB_ICONS: Record<keyof TabParamList, keyof typeof Ionicons.glyphMap> = {
//   home: 'home',
//   admin: 'settings',
//   cashier: 'cash',
//   kitchen: 'restaurant',
//   display: 'tv',
// };

// const Tab = createBottomTabNavigator<TabParamList>();

// export default function AppLayout() {
//   // Expo Router: Get URL params
//   // const { employee_role } = useLocalSearchParams<{ employee_role?: string }>();

//   const { user } = useAuth(); // ✅ Always rely on Auth Context
//   const employee_role = user?.role;

//   if (!employee_role) {
//     return null; // Or a loading/fallback component
//   }

//   // React Navigation: Tab config
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ color, size }: TabBarIconProps) => (
//           <Ionicons 
//             name={TAB_ICONS[route.name]} 
//             size={size} 
//             color={color} 
//           />
//         ),
//         headerShown: false,
//       })}
//     >
//       {/* Always visible */}
//       <Tab.Screen name="home" component={HomeScreen} />

//       {/* Conditionally visible tabs */}
//       {employee_role === 'admin' && (
//         <Tab.Screen name="admin" component={AdminScreen} />
//       )}

//       {(employee_role === 'admin' || employee_role === 'cashier') && (
//         <Tab.Screen name="cashier" component={CashierScreen} />
//       )}

//       {(employee_role === 'admin' || employee_role === 'kitchen') && (
//         <Tab.Screen name="kitchen" component={KitchenScreen} />
//       )}

//       {(employee_role === 'admin' || employee_role === 'display') && (
//         <Tab.Screen name="display" component={DisplayScreen} />
//       )}
//     </Tab.Navigator>
//   );
// }





import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import HomeScreen from './index';
import AdminScreen from './admin/index';
import CashierScreen from './cashier/index';
import KitchenScreen from './kitchen/index';
import DisplayScreen from './display/index';
import { ActivityIndicator, View } from 'react-native';

const Tab = createBottomTabNavigator();

const TABS = [
  { name: 'home', component: HomeScreen, icon: 'home', roles: ['admin', 'cashier', 'kitchen', 'display'] },
  { name: 'admin', component: AdminScreen, icon: 'settings', roles: ['admin'] },
  { name: 'cashier', component: CashierScreen, icon: 'cash', roles: ['admin', 'cashier'] },
  { name: 'kitchen', component: KitchenScreen, icon: 'restaurant', roles: ['admin', 'kitchen'] },
  { name: 'display', component: DisplayScreen, icon: 'tv', roles: ['admin', 'display'] },
];

export default function AppLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user?.role) {
    return null; // Or handle redirection to login screen here if needed
  }

  const employee_role = user.role;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const tab = TABS.find(t => t.name === route.name);
          return <Ionicons name={tab?.icon as keyof typeof Ionicons.glyphMap} size={size} color={color} />;
        },
        headerShown: false,
      })}
    >
      {TABS.filter(tab => tab.roles.includes(employee_role)).map(tab => (
        <Tab.Screen key={tab.name} name={tab.name} component={tab.component} />
      ))}
    </Tab.Navigator>
  );
}
