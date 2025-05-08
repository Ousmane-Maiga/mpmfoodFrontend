import React from 'react';
import { createBottomTabNavigator, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';

// Import all screen components
import HomeScreen from './index';
import AdminScreen from './admin/index';
import CashierScreen from './cashier/index';
import KitchenScreen from './kitchen/index';
import DisplayScreen from './display/index';

type TabParamList = {
    Home: undefined;
    Admin: undefined;
    Cashier: undefined;
    Kitchen: undefined;
    Display: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

type RouteParams = {
    employee_role?: string;
};

type TabBarIconProps = {
    color: string;
    size: number;
};

const getTabBarIcon = (routeName: keyof TabParamList) => {
    return ({ color, size }: TabBarIconProps) => {
        let iconName: keyof typeof Ionicons.glyphMap = 'home';

        switch (routeName) {
            case 'Home':
                iconName = 'home';
                break;
            case 'Admin':
                iconName = 'settings';
                break;
            case 'Cashier':
                iconName = 'cash';
                break;
            case 'Kitchen':
                iconName = 'restaurant';
                break;
            case 'Display':
                iconName = 'tv';
                break;
        }

        return <Ionicons name={iconName} size={size} color={color} />;
    };
};

export default function AppLayout() {
    const { employee_role } = useLocalSearchParams<RouteParams>();

    if (!employee_role) {
        return null;
    }

    return (
        <Tab.Navigator
            screenOptions={({ route }: BottomTabScreenProps<TabParamList>) => ({ // Added the type here
                tabBarIcon: getTabBarIcon(route.name),
                headerShown: false,
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />

            {employee_role === 'admin' && (
                <Tab.Screen name="Admin" component={AdminScreen} />
            )}

            {(employee_role === 'admin' || employee_role === 'cashier') && (
                <Tab.Screen name="Cashier" component={CashierScreen} />
            )}

            {(employee_role === 'admin' || employee_role === 'kitchen') && (
                <Tab.Screen name="Kitchen" component={KitchenScreen} />
            )}

            {(employee_role === 'admin' || employee_role === 'display') && (
                <Tab.Screen name="Display" component={DisplayScreen} />
            )}
        </Tab.Navigator>
    );
}

