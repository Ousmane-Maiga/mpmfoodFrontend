// admin/employees/index

import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Modal, TouchableOpacity, ActivityIndicator, View } from "react-native";
import { Text } from "../../../../components/ui/Text";
import { DataTable, Column } from '@/components/ui/DataTable';
import { theme } from "../../../../constants/theme";
import { getEmployees, createEmployee } from "../../../../services/api";
import UpdateEmployeeModal from "@/components/admin/employees/UpdateEmployee";
import AddEmployeeModal from "../../../../components/admin/employees/addEmployee";
import { FloatingAction } from "react-native-floating-action";
import { Ionicons } from '@expo/vector-icons';

type Employee = {
  employee_id: string;
  employee_name: string;
  employee_role: string;
  employee_email?: string;
  employee_phone?: string;
};

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
        setEmployees(data);
      } catch (err) {
        setError('Failed to load employees');
        console.error(err);
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

 const closeModal = React.useCallback(() => {
  setIsModalVisible(false);
  // Add timeout to ensure modal is fully unmounted before clearing selection
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.headerContainer}>
          <Text style={[theme.text.heading1, styles.header]}>Employees</Text>
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
                    {value}
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
                  {value}
                </Text>
              )
            },
            {
              key: "employee_phone",
              title: "Phone",
              sortable: true,
              width: '30%',
              render: (value: string) => (
                <Text style={{ color: theme.colors.text }}>
                  {value || '-'}
                </Text>
              )
            },
          ]}
          pageSize={10}
          keyExtractor={(item: Employee) => item.employee_id}
        />
      </ScrollView>

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
  key={selectedEmployee?.employee_id || 'modal'} // Force re-render
/>

      <AddEmployeeModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onEmployeeAdded={handleAddEmployee}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  header: {
    color: theme.colors.text,
  },
  addButton: {
    padding: theme.spacing.sm,
  },
  errorText: {
    color: theme.colors.danger,
    textAlign: 'center',
    marginTop: 20
  }
});