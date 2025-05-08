
import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme } from 'react-native-paper';
import NormalDisplayScreen from './normalDisplay';
import PersonalisedDisplayScreen from './personalisedDisplay';

const Tab = createMaterialTopTabNavigator();

export default function DisplayScreen() {
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
        name="NormalDisplay" 
        component={NormalDisplayScreen}
        options={{
          title: 'Normal Display',
        }}
      />
      <Tab.Screen 
        name="PersonalisedDisplay" 
        component={PersonalisedDisplayScreen}
        options={{
          title: 'Personalised Display',
        }}
      />
    </Tab.Navigator>
  );
}