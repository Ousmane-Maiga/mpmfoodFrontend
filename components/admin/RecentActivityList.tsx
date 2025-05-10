// components/admin/RecentActivityList.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../../constants/theme";

interface ActivityItem {
  id: number;
  action: string;
  time: string;
}

const RecentActivityList = () => {
  const activities: ActivityItem[] = [
    { id: 1, action: "New user registered", time: "2 minutes ago" },
    { id: 2, action: "System update completed", time: "1 hour ago" },
    { id: 3, action: "New content published", time: "3 hours ago" },
    { id: 4, action: "New order #1045 placed", time: "2 minutes ago" },
    { id: 5, action: "Inventory low on Chicken Sandwich", time: "1 hour ago" },
    { id: 6, action: "New employee registered", time: "3 hours ago" },
  ];

  return (
    <View style={styles.activityContainer}>
      <Text style={[theme.text.heading2, styles.sectionTitle]}>
        Recent Activity
      </Text>
      <View style={styles.card}>
        {activities.map((activity) => (
          <View key={activity.id} style={styles.activityItem}>
            <Text style={styles.activityAction}>{activity.action}</Text>
            <Text style={styles.activityTime}>{activity.time}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  activityContainer: {
    marginTop: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.md,
  },
  sectionTitle: {
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  activityItem: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  activityAction: {
    ...theme.text.body,
    color: theme.colors.text,
  },
  activityTime: {
    ...theme.text.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
});

export default RecentActivityList;