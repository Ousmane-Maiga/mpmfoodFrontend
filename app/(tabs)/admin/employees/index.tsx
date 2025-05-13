import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Modal, TouchableOpacity, ActivityIndicator, View } from "react-native";
import { Text } from "../../../../components/ui/Text";
import { DataTable } from "../../../../components/ui/DataTable";
import { theme } from "../../../../constants/theme";
import { getEmployees } from "../../../../services/api";
import EmployeeDetailScreen from './[employeeId]';

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

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedEmployee(null);
  };

  const handleUpdateEmployee = (updatedEmployee: Employee) => {
    setEmployees(prev => 
      prev.map(emp => 
        emp.employee_id === updatedEmployee.employee_id ? updatedEmployee : emp
      )
    );
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
    <ScrollView style={styles.container}>
      <Text style={[theme.text.heading1, styles.header]}>Employees</Text>

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
            title: "Position",
            sortable: true,
            width: '30%'
          },
          {
            key: "employee_email",
            title: "Email",
            width: '30%'
          }
        ]}
        pageSize={10}
        keyExtractor={(item: Employee) => item.employee_id}
      />

      
      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <EmployeeDetailScreen 
          route={{
            params: {
              employeeId: selectedEmployee?.employee_id || ''
            }
          }}
          navigation={navigator}
        />
      </Modal>
    </ScrollView>
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
  header: {
    marginBottom: theme.spacing.lg,
    color: theme.colors.text,
  },
  errorText: {
    color: theme.colors.danger,
    textAlign: 'center',
    marginTop: 20
  }
});





// import React, { useState, useEffect } from "react";
// import { ScrollView, StyleSheet, Modal, TouchableOpacity } from "react-native";
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Text } from "../../../../components/ui/Text";
// import { DataTable } from "../../../../components/ui/DataTable";
// import { sampleEmployees } from "../../../../constants/sampleData";
// import { theme } from "../../../../constants/theme";
// import EmployeeDetailScreen from './[employeeId]';

// type Employee = {
//   id: string;
//   name: string;
//   role: string;
//   email?: string;
//   phone?: string;
//   schedule?: Array<{ day: string; shift: string }>;
// };

// const STORAGE_KEY = 'employee_data';

// export default function EmployeesScreen() {
//   const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [employees, setEmployees] = useState<Employee[]>([]);

//   // Load employees from storage on initial render
//   useEffect(() => {
//     const loadEmployees = async () => {
//       try {
//         const savedEmployees = await AsyncStorage.getItem(STORAGE_KEY);
//         if (savedEmployees) {
//           setEmployees(JSON.parse(savedEmployees));
//         } else {
//           // Initialize with sample data if no saved data exists
//           setEmployees(sampleEmployees);
//           await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sampleEmployees));
//         }
//       } catch (error) {
//         console.error('Failed to load employees', error);
//         setEmployees(sampleEmployees);
//       }
//     };

//     loadEmployees();
//   }, []);

//   const openModal = (employee: Employee) => {
//     setSelectedEmployee(employee);
//     setIsModalVisible(true);
//   };

//   const closeModal = () => {
//     setIsModalVisible(false);
//     setSelectedEmployee(null);
//   };

//   const handleUpdateEmployee = async (updatedData: Employee) => {
//     try {
//       const updatedEmployees = employees.map(emp => 
//         emp.id === updatedData.id ? updatedData : emp
//       );
//       setEmployees(updatedEmployees);
//       await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEmployees));
//       setSelectedEmployee(updatedData);
//     } catch (error) {
//       console.error('Failed to save employee data', error);
//     }
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={[theme.text.heading1, styles.header]}>Employees</Text>

//       <DataTable<Employee>
//         data={employees}
//         columns={[
//           {
//             key: "name",
//             title: "Name",
//             sortable: true,
//             width: '40%',
//             render: (value: string, item: Employee) => (
//               <TouchableOpacity onPress={() => openModal(item)}>
//                 <Text style={{ color: theme.colors.primary }}>
//                   {value}
//                 </Text>
//               </TouchableOpacity>
//             )
//           },
//           {
//             key: "role",
//             title: "Position",
//             sortable: true,
//             width: '30%'
//           },
//           {
//             key: "email",
//             title: "Email",
//             width: '30%'
//           }
//         ]}
//         pageSize={10}
//         keyExtractor={(item: Employee) => item.id}
//       />

//       <Modal
//         visible={isModalVisible}
//         animationType="slide"
//         onRequestClose={closeModal}
//       >
//         <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
//           {selectedEmployee && (
//             <EmployeeDetailScreen 
//               employeeId={selectedEmployee.id} 
//               onEdit={handleUpdateEmployee}
//             />
//           )}
//           <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
//             <Text style={{color: 'white'}}>Close</Text>
//           </TouchableOpacity>
//         </ScrollView>
//       </Modal>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: theme.colors.background,
//     padding: theme.spacing.md,
//   },
//   header: {
//     marginBottom: theme.spacing.lg,
//     color: theme.colors.text,
//   },
//   closeButton: {
//     padding: 10,
//     backgroundColor: theme.colors.primary,
//     alignSelf: 'center',
//     marginTop: 20,
//     marginBottom: 20,
//     borderRadius: 5
//   }
// });