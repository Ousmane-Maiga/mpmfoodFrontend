import { View, Text } from 'react-native';
import { Link } from 'expo-router';
export default function HomeScreen() {

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home Screen 1</Text>
      <Link href='/(tabs)/admin/employees/1'>Admin</Link>
    </View>
  );
}