import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { testApiConnection } from '@/services/api';

const ConnectionStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      const status = await testApiConnection();
      setIsConnected(status);
    };

    checkConnection();
    
    // Optional: Check periodically (every 30 seconds)
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isConnected === null) {
    return null; // Still loading
  }

  return (
    <View style={[
      styles.container,
      isConnected ? styles.connected : styles.disconnected
    ]}>
      <Text style={styles.text}>
        {isConnected ? 'Connected to server' : 'Server connection failed'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    alignItems: 'center',
  },
  connected: {
    backgroundColor: '#4CAF50',
  },
  disconnected: {
    backgroundColor: '#F44336',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ConnectionStatus;