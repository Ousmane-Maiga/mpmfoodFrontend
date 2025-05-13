import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert 
} from 'react-native';
import { theme } from '../../../../constants/theme';
import EmployeeForm from '../../../../components/admin/employeeForm';
import { 
  getEmployeeDetails, 
  getEmployeeSchedule, 
  updateEmployee,
  deleteEmployee
} from '../../../../services/api';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

interface EmployeeDetailScreenProps {
  route: {
    params: {
      employeeId: string;
    };
  };
  navigation: any; // Or use proper navigation type from @react-navigation/native
}

type EmployeeDetails = {
  employee_id: string;
  employee_name: string;
  employee_role: string;
  employee_email?: string;
  employee_phone?: string;
};

type ScheduleItem = {
  day_of_week: string;
  start_time: string;
  end_time: string;
};

const EmployeeDetailScreen: React.FC<EmployeeDetailScreenProps> = ({ route }) => {
  const { employeeId } = route.params;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [employeeData, setEmployeeData] = useState<EmployeeDetails | null>(null);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch employee data and schedule
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [details, scheduleData] = await Promise.all([
          getEmployeeDetails(employeeId),
          getEmployeeSchedule(employeeId)
        ]);
        
        setEmployeeData(details);
        setSchedule(scheduleData);
      } catch (err) {
        setError('Failed to load employee details');
        console.error('Error fetching employee:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [employeeId]);

  const handleEditSubmit = async (updatedData: Partial<EmployeeDetails>) => {
    if (!employeeData) return;
    
    try {
      setUpdating(true);
      const updatedEmployee = await updateEmployee(employeeId, updatedData);
      
      setEmployeeData(prev => ({
        ...prev!,
        ...updatedEmployee
      }));
      
      setIsEditing(false);
      Alert.alert('Success', 'Employee updated successfully');
    } catch (err) {
      setError('Failed to update employee');
      console.error('Error updating employee:', err);
      Alert.alert('Error', 'Failed to update employee');
    } finally {
      setUpdating(false);
    }
  };

 const handleDeleteEmployee = async () => {
  Alert.alert(
    'Confirm Delete',
    'Are you sure you want to delete this employee?',
    [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteEmployee(employeeId);
            navigation.goBack();
            Alert.alert('Success', 'Employee deleted successfully');
          } catch (err: any) {
            if (err.response?.status === 403) {
              Alert.alert('Error', 'Admin employees cannot be deleted');
            } else {
              setError('Failed to delete employee');
              Alert.alert('Error', 'Failed to delete employee');
            }
          }
        }
      }
    ]
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
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
    );
  }

  if (!employeeData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Employee not found</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
      </TouchableOpacity>

      {isEditing ? (
        <EmployeeForm 
          initialData={{
            employee_name: employeeData.employee_name,
            employee_role: employeeData.employee_role,
            employee_email: employeeData.employee_email || '',
            employee_phone: employeeData.employee_phone || ''
          }}
          onSubmit={handleEditSubmit}
          onCancel={() => setIsEditing(false)}
          loading={updating}
        />
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.name}>{employeeData.employee_name}</Text>
            <Text style={styles.role}>{employeeData.employee_role}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <DetailRow label="Email" value={employeeData.employee_email} />
            <DetailRow label="Phone" value={employeeData.employee_phone} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Work Schedule</Text>
            {schedule.length > 0 ? (
              schedule.map((shift, index) => (
                <DetailRow 
                  key={`${shift.day_of_week}-${index}`} 
                  label={shift.day_of_week} 
                  value={`${shift.start_time} - ${shift.end_time}`} 
                />
              ))
            ) : (
              <Text style={styles.noScheduleText}>No schedule assigned</Text>
            )}
          </View>

          <View style={styles.buttonGroup}>
            <TouchableOpacity 
              style={[styles.button, styles.editButton]}
              onPress={() => setIsEditing(true)}
              disabled={updating}
            >
              <Text style={styles.buttonText}>Edit Employee</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.deleteButton]}
              onPress={handleDeleteEmployee}
              disabled={updating}
            >
              <Text style={styles.buttonText}>Delete Employee</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
};

const DetailRow = ({ label, value }: { label: string; value?: string }) => {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}:</Text>
      <Text style={styles.detailValue}>{value || 'Not provided'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
    alignSelf: 'flex-start',
    marginBottom: theme.spacing.md,
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
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default EmployeeDetailScreen;




// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
// import { sampleEmployees } from '../../../../constants/sampleData';
// import { theme } from '../../../../constants/theme';
// import EmployeeForm from '../../../../components/admin/employeeForm';

// interface EmployeeDetailScreenProps {
//   employeeId: string;
//   onEdit?: (updatedData: any) => void;
// }

// const EmployeeDetailScreen: React.FC<EmployeeDetailScreenProps> = ({ employeeId, onEdit }) => {
//   const [loading, setLoading] = useState(true);
//   const [employeeData, setEmployeeData] = useState<any>(null);
//   const [isEditing, setIsEditing] = useState(false);

//   useEffect(() => {
//     if (employeeId) {
//       const employee = sampleEmployees.find((e) => e.id === employeeId);
//       setEmployeeData(employee);
//       setLoading(false);
//     }
//   }, [employeeId]);

//   const handleEditSubmit = (updatedData: any) => {
//     if (onEdit) {
//       onEdit(updatedData);
//     }
//     setEmployeeData(updatedData);
//     setIsEditing(false);
//   };

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <Text>Loading employee details...</Text>
//       </View>
//     );
//   }

//   if (!employeeData) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.errorText}>Employee not found: {employeeId}</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView style={styles.container}>
//       {isEditing ? (
//         <EmployeeForm 
//           initialData={employeeData}
//           onSubmit={handleEditSubmit}
//           onCancel={() => setIsEditing(false)}
//         />
//       ) : (
//         <>
//           <View style={styles.header}>
//             <Text style={styles.name}>{employeeData.name}</Text>
//             <Text style={styles.role}>{employeeData.role}</Text>
//           </View>

//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Contact Information</Text>
//             <DetailRow label="Email" value={employeeData.email} />
//             <DetailRow label="Phone" value={employeeData.phone} />
//           </View>

//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Work Schedule</Text>
//             {employeeData.schedule?.map((shift: { day: string; shift: string }, index: number) => (
//               <DetailRow key={`${shift.day}-${index}`} label={shift.day} value={shift.shift} />
//             ))}
//           </View>

//           <TouchableOpacity 
//             style={styles.editButton}
//             onPress={() => setIsEditing(true)}
//           >
//             <Text style={styles.editButtonText}>Edit Employee</Text>
//           </TouchableOpacity>
//         </>
//       )}
//     </ScrollView>
//   );
// };

// function DetailRow({ label, value }: { label: string; value?: string }) {
//   return (
//     <View style={styles.detailRow}>
//       <Text style={styles.detailLabel}>{label}:</Text>
//       <Text style={styles.detailValue}>{value || 'N/A'}</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: theme.spacing.md,
//     backgroundColor: theme.colors.background,
//   },
//   header: {
//     marginBottom: theme.spacing.lg,
//     paddingBottom: theme.spacing.md,
//     borderBottomWidth: 1,
//     borderBottomColor: theme.colors.border,
//   },
//   name: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: theme.colors.text,
//   },
//   role: {
//     fontSize: 16,
//     color: theme.colors.textSecondary,
//     marginTop: theme.spacing.xs,
//   },
//   section: {
//     marginBottom: theme.spacing.lg,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: theme.colors.text,
//     marginBottom: theme.spacing.sm,
//   },
//   detailRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: theme.spacing.sm,
//   },
//   detailLabel: {
//     color: theme.colors.textSecondary,
//   },
//   detailValue: {
//     color: theme.colors.text,
//   },
//   errorText: {
//     color: theme.colors.danger,
//     fontSize: 16,
//   },
//   editButton: {
//     backgroundColor: theme.colors.primary,
//     padding: theme.spacing.md,
//     borderRadius: 4,
//     alignItems: 'center',
//     marginTop: theme.spacing.md,
//   },
//   editButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
// });

// export default EmployeeDetailScreen;