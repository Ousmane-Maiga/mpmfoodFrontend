import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from '../../../components/ui/Text';
import QuickStats from '../../../components/admin/QuickStats';
import RecentActivityList from '../../../components/admin/RecentActivityList';
import { theme } from '../../../constants/theme';

export default function AdminDashboard() {
  return (
    <ScrollView style={styles.container}>
      <Text style={[theme.text.heading1, styles.header]}>Admin Dashboard</Text>
      
      {/* Quick Stats Section */}
      <View style={styles.section}>
        <Text style={[theme.text.heading2, styles.sectionTitle]}>Overview</Text>
        <QuickStats />
      </View>

      {/* Recent Activity Section */}
      <View style={styles.section}>
        <Text style={[theme.text.heading2, styles.sectionTitle]}>Recent Activity</Text>
        <RecentActivityList />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  header: {
    marginBottom: theme.spacing.lg,
    color: theme.colors.text,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
    color: theme.colors.text,
  },
});