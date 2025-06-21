// components/admin/RecentActivityList.tsx
import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Text } from "../ui/Text";
import { theme } from "../../constants/theme";
import { getOrders } from "../../services/api"; // To fetch recent orders
import { Order } from '@/types/cashierTypes'; // Import Order type
import moment from "moment"; // For time formatting
import { Button as PaperButton } from 'react-native-paper'; // For retry button

interface ActivityItem {
  id: string; // Changed to string as order IDs are usually strings
  action: string;
  time: string; // Formatted time string, e.g., "5 minutes ago"
}

/**
 * RecentActivityList component displays a chronological list of recent operational activities.
 * It fetches the most recent orders to populate the list, providing a quick overview
 * of recent events in the system.
 */
  function RecentActivityList() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches recent activities, primarily recent orders, from the API.
   */
  const fetchRecentActivities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch recent orders, limiting to 10 and sorting by creation time descending.
      const { orders } = await getOrders({ limit: 10, sortBy: 'created_at', sortDirection: 'desc' });

      // Map fetched orders to the ActivityItem format.
      const fetchedActivities: ActivityItem[] = orders.map(order => ({
        id: String(order.id), // Ensure ID is string for key
        action: `New order #${String(order.id).substring(0, 8)} placed by ${order.created_by_name || 'N/A'} for ${Number(order.total_amount || 0).toFixed(2)} FCFA`,
        time: moment(order.created_at).fromNow(), // e.g., "5 minutes ago"
      }));

      // You can extend this to include other types of activities if you have
      // corresponding backend APIs (e.g., inventory changes, user logins, etc.).
      // For example:
      // const inventoryChanges = await getRecentInventoryChanges();
      // const mappedInventoryChanges = inventoryChanges.map(change => ({
      //   id: String(change.id),
      //   action: `Inventory update: ${change.item_name} ${change.change_type}`,
      //   time: moment(change.timestamp).fromNow(),
      // }));
      // setActivities([...fetchedActivities, ...mappedInventoryChanges].sort((a, b) => /* sort by time */));

      setActivities(fetchedActivities);
    } catch (err: any) {
      console.error("Failed to fetch recent activities:", err);
      setError("Failed to load recent activity data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []); // No external dependencies, so useCallback just memoizes the function

  // Effect to fetch data on component mount and set up periodic refresh
  useEffect(() => {
    fetchRecentActivities(); // Initial fetch
    // Refresh activities every 1 minute (adjust interval as needed)
    const interval = setInterval(fetchRecentActivities, 60 * 1000); // 1 minute * 1000 ms
    return () => clearInterval(interval); // Clear interval on component unmount
  }, [fetchRecentActivities]); // Re-run effect if fetchRecentActivities changes (which it won't due to useCallback)


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading recent activity...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <PaperButton mode="outlined" onPress={fetchRecentActivities} labelStyle={{ color: theme.colors.primary }}>
          Retry
        </PaperButton>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      {activities.length > 0 ? (
        activities.map((activity, index) => (
          <View key={activity.id} style={[
            styles.activityItem,
            index === activities.length - 1 && styles.lastActivityItem // No bottom border for the last item
          ]}>
            <Text style={styles.activityAction}>{activity.action}</Text>
            <Text style={styles.activityTime}>{activity.time}</Text>
          </View>
        ))
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No recent activities to display.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.cardBackground, // Using cardBackground from theme
    borderRadius: theme.borderRadius.lg, // Using borderRadius from theme
    padding: theme.spacing.lg,
    ...theme.shadows.md,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
    minHeight: 100, // Give some minimum height for loading state
  },
  loadingText: {
    marginTop: theme.spacing.sm,
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.md,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
    minHeight: 100, // Give some minimum height for error state
  },
  errorText: {
    color: theme.colors.danger,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl,
  },
  noDataText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSize.md,
  },
  activityItem: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xs, // Slightly less horizontal padding than card overall
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight, // Lighter border for separation
  },
  lastActivityItem: {
    borderBottomWidth: 0, // No border for the last item
  },
  activityAction: {
    fontSize: theme.typography.fontSize.md, // Using theme typography
    color: theme.colors.text,
  },
  activityTime: {
    fontSize: theme.typography.fontSize.sm, // Using theme typography
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
});

export default RecentActivityList;
