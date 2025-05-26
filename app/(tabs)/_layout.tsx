import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import HomeScreen from './index';
import AdminScreen from './admin/index';
import CashierScreen from './cashier/index';
import KitchenScreen from './kitchen/index';
import DisplayScreen from './display/index';
import { ActivityIndicator, View } from 'react-native';

const Tab = createBottomTabNavigator();
const router = useRouter();

const TABS = [
  { name: 'home', component: HomeScreen, icon: 'home', roles: ['admin', 'cashier', 'kitchen', 'display'] },
  { name: 'admin', 
    component: AdminScreen, 
    icon: 'settings', 
    roles: ['admin'] },
  { 
    name: 'cashier', 
    component: CashierScreen, 
    icon: 'cash', 
    roles: ['admin', 'cashier'],
    initialParams: { user: null } // Will be filled dynamically
  },
  { 
    name: 'kitchen', 
    component: KitchenScreen, 
    icon: 'restaurant', 
    roles: ['admin', 'kitchen'],
    initialParams: { user: null } // Will be filled dynamically
  },
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
    router.replace('/login'); // Update this path to your actual login route
  return null;
  }

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
      {TABS
        .filter(tab => tab.roles.includes(user.role))
        .map(tab => (
          <Tab.Screen 
            key={tab.name} 
            name={tab.name} 
            component={tab.component}
            initialParams={{ user }} // Pass the user object here
          />
        ))
      }
    </Tab.Navigator>
  );
}