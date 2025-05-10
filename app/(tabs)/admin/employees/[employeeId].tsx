import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, usePathname, useSegments } from 'expo-router';
import { sampleEmployees } from '../../../../constants/sampleData';
import { theme } from '../../../../constants/theme';

export default function EmployeeDetailScreen() {
  // Get the entire path segments
  const segments = useSegments();
  const params = useLocalSearchParams();
  
  console.log('All segments:', segments);
  console.log('All params:', params);

  // Alternative extraction method
  const { employeeId } = useLocalSearchParams();
  console.log('Employee ID:', employeeId);

  // Fallback to path parsing if needed
  const pathname = usePathname();
  const extractedId = pathname.split('/').pop();
  console.log('Extracted ID:', extractedId);

  // Use whichever method gives you the ID
  const effectiveId = employeeId || extractedId;
  const employee = sampleEmployees.find(e => e.id === effectiveId);
  if (!employee) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Employee not found {employee}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{employee.name}</Text>
        <Text style={styles.role}>{employee.role}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <DetailRow label="Email" value={employee.email} />
        <DetailRow label="Phone" value={employee.phone} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Work Schedule</Text>
        {employee.schedule?.map((shift, index) => (
          <DetailRow 
            key={`${shift.day}-${index}`} 
            label={shift.day} 
            value={shift.shift} 
          />
        ))}
      </View>
    </ScrollView>
  );
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}:</Text>
      <Text style={styles.detailValue}>{value || 'N/A'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  header: {
    marginBottom: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  role: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
  },
  detailLabel: {
    color: theme.colors.textSecondary,
  },
  detailValue: {
    color: theme.colors.text,
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: 16,
  },
});


