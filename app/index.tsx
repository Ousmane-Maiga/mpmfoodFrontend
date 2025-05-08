// import { Redirect } from 'expo-router';
// import { useAuth } from '../components/AuthProvider';

// export default function Index() {
//   const { isAuthenticated } = useAuth();
  
//   if (isAuthenticated) {
//     return <Redirect href="/(tabs)/home" />;
//   } else {
//     return <Redirect href="/(auth)/login" />;
//   }
// }



import React from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../contexts/AuthContext'; // Updated import
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // If not logged in, redirect to login screen
  // If logged in, redirect to appropriate screen based on role
  return user ? (
    <Redirect href="/(tabs)" />
  ) : (
    <Redirect href="/(auth)/login" />
  );
}