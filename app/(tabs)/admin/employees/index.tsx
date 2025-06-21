// app/(tabs)/admin/employees/index.tsx

import React, { useState, useEffect, useCallback } from "react";
import { ScrollView, StyleSheet, Modal, TouchableOpacity, View, Text, ActivityIndicator } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { DataTable, Column } from '@/components/ui/DataTable';
import { theme } from "../../../../constants/theme";
import { getEmployees, createEmployee } from "../../../../services/api";
import UpdateEmployeeModal from "@/components/admin/employees/UpdateEmployee";
import AddEmployeeModal from "../../../../components/admin/employees/addEmployee";
import { Ionicons } from '@expo/vector-icons';
import { Employee } from '@/types/EmployeeTypes';

// --- INLINED COMPONENT: DetailRow ---
interface DetailRowProps {
  label: string;
  value?: string;
}

const DetailRow = ({ label, value }: DetailRowProps) => {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}:</Text>
      <Text style={styles.detailValue}>{value || 'Not provided'}</Text>
    </View>
  );
};
// --- END INLINED COMPONENT: DetailRow ---

// --- INLINED COMPONENT: EmployeeContactInfo ---
interface EmployeeContactInfoProps {
  email?: string;
  phone?: string;
}

const EmployeeContactInfo = ({ email, phone }: EmployeeContactInfoProps) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Contact Information</Text>
      <DetailRow label="Email" value={email} />
      <DetailRow label="Phone" value={phone} />
    </View>
  );
};
// --- END INLINED COMPONENT: EmployeeContactInfo ---

// --- INLINED COMPONENT: EmployeeDetailHeader ---
interface EmployeeDetailHeaderProps {
  name: string;
  role: string;
}

const EmployeeDetailHeader = ({ name, role }: EmployeeDetailHeaderProps) => {
  return (
    <View style={styles.header}> {/* This refers to the header style for layout of name/role */}
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.role}>{role}</Text>
    </View>
  );
};
// --- END INLINED COMPONENT: EmployeeDetailHeader ---


export default function EmployeesScreen() {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const data = await getEmployees();

        if (Array.isArray(data)) {
            setEmployees(data);
        } else {
            console.error("getEmployees did not return an array as expected:", data);
            setError('Received invalid data format for employees');
            setEmployees([]);
        }
      } catch (err) {
        setError('Failed to load employees');
        console.error(err);
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const openModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsModalVisible(true);
  };

  const closeModal = useCallback(() => {
    setIsModalVisible(false);
    setTimeout(() => setSelectedEmployee(null), 100);
  }, []);

  const handleUpdateEmployee = (updatedEmployee: Employee) => {
    setEmployees(prev =>
      prev.map(emp =>
        emp.employee_id === updatedEmployee.employee_id ? updatedEmployee : emp
      )
    );
    closeModal();
  };

  const handleAddEmployee = (newEmployee: Employee) => {
    setEmployees(prev => [...prev, newEmployee]);
    setIsAddModalVisible(false);
  };

  const handleDeleteEmployee = (deletedEmployeeId: string) => {
    setEmployees(prev => prev.filter(emp => emp.employee_id !== deletedEmployeeId));
    closeModal();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  // Defensively get heading1 style
  const heading1Style = theme.text && theme.text.heading1 ? theme.text.heading1 : {};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.pageHeader}>
          <Text style={[heading1Style, styles.headerText]}>Employees</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setIsAddModalVisible(true)}
          >
            <Ionicons name="add" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        <DataTable<Employee>
          data={employees}
          columns={[
            {
              key: "employee_name",
              title: "Name",
              sortable: true,
              width: '40%',
              render: (value: string, item: Employee) => (
                <TouchableOpacity onPress={() => openModal(item)}>
                  <Text style={{ color: theme.colors.primary }}>
                    {typeof value === 'string' ? value : ''} {/* Robust check */}
                  </Text>
                </TouchableOpacity>
              )
            },
            {
              key: "employee_role",
              title: "Role",
              sortable: true,
              width: '30%',
              render: (value: string) => (
                <Text style={{ color: theme.colors.text }}>
                  {typeof value === 'string' ? value : ''} {/* Robust check */}
                </Text>
              )
            },
            {
              key: "employee_phone",
              title: "Phone",
              sortable: true,
              width: '30%',
              render: (value: string | null) => (
                <Text style={{ color: theme.colors.text }}>
                  {typeof value === 'string' ? value : '-'} {/* Robust check */}
                </Text>
              )
            },
          ]}
          pageSize={10}
          keyExtractor={(item: Employee) => item.employee_id}
        />
      </ScrollView>

      {/* UpdateEmployeeModal and AddEmployeeModal remain separate as they are complex */}
      <UpdateEmployeeModal
        employeeId={selectedEmployee?.employee_id || ''}
        visible={isModalVisible}
        onClose={closeModal}
        onEmployeeUpdated={handleUpdateEmployee}
        onEmployeeDeleted={() => {
          if (selectedEmployee) {
            handleDeleteEmployee(selectedEmployee.employee_id);
          }
        }}
        key={selectedEmployee?.employee_id || 'modal'}
      />

      <AddEmployeeModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onEmployeeAdded={handleAddEmployee}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  contentContainer: {
    padding: theme.spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  pageHeader: { // This is the container style for the main "Employees" title and add button
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  header: { // This is for EmployeeDetailHeader, styling the container of name and role
    marginBottom: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  addButton: {
    padding: theme.spacing.sm,
  },
  headerText: { // This applies to the Text component for the main "Employees" title
    color: theme.colors.text,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  role: {
    fontSize: 16,
    color: theme.colors.textSecondary,
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
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.primary,
  },
  detailLabel: {
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  detailValue: {
    color: theme.colors.text,
    flexShrink: 1,
    textAlign: 'right',
    marginLeft: theme.spacing.sm,
  },
  noScheduleText: {
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    marginTop: theme.spacing.sm,
  },
  buttonGroup: {
    marginTop: theme.spacing.md,
  },
  button: {
    padding: theme.spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  editButton: {
    backgroundColor: theme.colors.primary,
  },
  deleteButton: {
    backgroundColor: theme.colors.danger,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorText: {
    color: theme.colors.danger,
    textAlign: 'center',
    marginTop: 20
  },
  backButtonText: {
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
    fontSize: 16,
  },
  headerCloseButton: {
    marginRight: 15,
    padding: 5,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.secondary,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
  },
  floatingCloseButton: {
    position: 'absolute',
    top: 10,
    right: 15,
    zIndex: 10,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 20,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border
  },
  errorContainer: {
    backgroundColor: theme.colors.dangerLight,
    padding: theme.spacing.sm,
    borderRadius: theme.roundness, // Use theme.roundness here
    marginBottom: theme.spacing.md
  },
  contentScrollView: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
});
