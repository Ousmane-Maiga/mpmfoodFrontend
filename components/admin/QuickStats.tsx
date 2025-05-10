// components/admin/QuickStats.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "../ui/Text";
import { theme } from "../../constants/theme";

const stats = [
  { label: "Today's Sales", value: "$2,450", change: "+12%" },
  { label: "New Orders", value: "24", change: "+5%" },
  { label: "Inventory Alerts", value: "3", change: "-2" },
  { label: "Staff On Duty", value: "8/12", change: null },
];

export default function QuickStats() {
  return (
    <View style={styles.container}>
      {stats.map((stat, index) => (
        <View key={index} style={styles.statCard}>
          <Text style={styles.statLabel}>{stat.label}</Text>
          <Text style={styles.statValue}>{stat.value}</Text>
          {stat.change && (
            <Text style={[
              styles.statChange,
              stat.change.startsWith('+') ? styles.positiveChange : styles.negativeChange
            ]}>
              {stat.change}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statCard: {
    width: '50%',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: theme.colors.border,
  },
  statLabel: {
    ...theme.text.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  statValue: {
    ...theme.text.heading2,
    fontSize: 20,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  statChange: {
    ...theme.text.caption,
    fontWeight: '500',
  },
  positiveChange: {
    color: theme.colors.success,
  },
  negativeChange: {
    color: theme.colors.danger,
  },
});