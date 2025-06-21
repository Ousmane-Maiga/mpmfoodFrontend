// app/(tabs)/admin/reports/index.tsx (Conceptual: AdminDashboard)
import React from 'react';
import { ScrollView, StyleSheet, View, SafeAreaView } from 'react-native';
import { Text } from '../../../components/ui/Text'; // Your custom Text component
import QuickStats from '../../../components/admin/QuickStats';
import RecentActivityList from '../../../components/admin/RecentActivityList';
import { theme } from '../../../constants/theme'; // Your theme

/**
 * AdminDashboard component serves as the main administrative overview panel.
 * It displays key performance indicators (KPIs) through the QuickStats component
 * and recent operational events via the RecentActivityList component,
 * providing administrators with a quick snapshot of the business.
 */
export default function AdminDashboard() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Dashboard Header */}
        <Text style={[theme.text.heading1, styles.header]}>Admin Dashboard</Text>

        {/* Quick Stats Section: Displays high-level aggregated metrics */}
        <View style={styles.section}>
          <Text style={[theme.text.heading2, styles.sectionTitle]}>Overview</Text>
          <QuickStats />
        </View>

        {/* Recent Activity Section: Shows a chronological list of recent events */}
        <View style={styles.section}>
          <Text style={[theme.text.heading2, styles.sectionTitle]}>Recent Activity</Text>
          <RecentActivityList />
        </View>

        {/* Add more sections here as needed, e.g., charts, quick actions */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background, // Background from theme
  },
  container: {
    flexGrow: 1, // Allows content to be scrollable
    padding: theme.spacing.md, // Padding around the content
    paddingBottom: theme.spacing.xxl, // Extra padding at the bottom for scroll comfort
  },
  header: {
    marginBottom: theme.spacing.lg,
    color: theme.colors.text, // Text color from theme
    textAlign: 'center', // Center align the dashboard title
  },
  section: {
    marginBottom: theme.spacing.xl, // Space between dashboard sections
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
    color: theme.colors.text, // Text color from theme
  },
});
