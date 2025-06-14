// import { useState, useEffect } from 'react';
// import { useNavigation } from '@react-navigation/native';
// import { 
//   getEmployeeDetails, 
//   getEmployeeSchedule, 
//   updateEmployee,
//   deleteEmployee
// } from '../../services/api';
// import { Alert } from 'react-native';

// interface EmployeeDetails {
//   pin: number;
//   employee_id: string;
//   employee_name: string;
//   employee_role: string;
//   employee_email?: string;
//   employee_phone?: string;
// }

// interface ScheduleItem {
//   day_of_week: string;
//   start_time: string;
//   end_time: string;
// }

// export const useEmployeeData = (employeeId: string) => {
//   const navigation = useNavigation();
//   const [loading, setLoading] = useState(true);
//   const [updating, setUpdating] = useState(false);
//   const [employeeData, setEmployeeData] = useState<EmployeeDetails | null>(null);
//   const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
//   const [isEditing, setIsEditing] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchEmployeeData = async () => {
//       try {
//         setLoading(true);
//         setError(null);
        
//         if (!employeeId) {
//           setError('Employee ID is required');
//           return;
//         }

//         const [details, scheduleData] = await Promise.all([
//           getEmployeeDetails(employeeId),
//           getEmployeeSchedule(employeeId)
//         ]);
        
//         setEmployeeData(details);
//         setSchedule(scheduleData);
//       } catch (err) {
//         setError('Failed to load employee details');
//         console.error('Error fetching employee:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEmployeeData();
//   }, [employeeId]);

//   const handleEditSubmit = async (updatedData: Partial<EmployeeDetails>) => {
//     if (!employeeData) return;
    
//     try {
//       setUpdating(true);
//       const updatedEmployee = await updateEmployee(employeeId, updatedData);
      
//       setEmployeeData(prev => ({
//         ...prev!,
//         ...updatedEmployee
//       }));
      
//       setIsEditing(false);
//       Alert.alert('Success', 'Employee updated successfully');
//     } catch (err) {
//       setError('Failed to update employee');
//       console.error('Error updating employee:', err);
//       Alert.alert('Error', 'Failed to update employee');
//     } finally {
//       setUpdating(false);
//     }
//   };

//  const handleDeleteEmployee = async () => {
//   return new Promise<boolean>(async (resolve) => {
//     Alert.alert(
//       'Confirm Delete',
//       'Are you sure you want to delete this employee?',
//       [
//         { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
//         { 
//           text: 'Delete', 
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               await deleteEmployee(employeeId);
//               Alert.alert('Success', 'Employee deleted successfully');
//               resolve(true);
//             } catch (err: any) {
//               if (err.response?.status === 403) {
//                 Alert.alert('Error', 'Admin employees cannot be deleted');
//               } else {
//                 Alert.alert('Error', 'Failed to delete employee');
//               }
//               resolve(false);
//             }
//           }
//         }
//       ]
//     );
//   });
// };

//   return {
//     employeeId,
//     loading,
//     error,
//     employeeData,
//     schedule,
//     isEditing,
//     updating,
//     handleEditSubmit,
//     handleDeleteEmployee,
//     setIsEditing,
//     navigation
//   };
// };

// function onEmployeeDeleted() {
//     throw new Error('Function not implemented.');
// }




// hooks/employees/useEmployeeData.ts
import { useState, useEffect, useCallback } from 'react';
import * as api from '@/services/api'; // Assuming your api service is in src/services/api.ts
import { Alert } from 'react-native';

// Type for the Employee data that will be managed by this hook
interface EmployeeData {
    employee_id: string;
    employee_name: string;
    employee_role: string;
    pin?: string; // PIN is sensitive, only used in form, not fetched
    employee_email?: string;
    employee_phone?: string;
    is_active?: boolean;
}

// Type for schedule data as stored in the backend and used by the form
interface ScheduleItemBackend {
    schedule_id?: number; // Optional as it might not exist for new entries
    schedule_date: string; // YYYY-MM-DD
    is_day_off: boolean;
    start_time: string | null; // HH:MM
    end_time: string | null;   // HH:MM
}


export const useEmployeeData = (employeeId: string) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null);
    const [schedule, setSchedule] = useState<ScheduleItemBackend[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [updating, setUpdating] = useState(false);

    const fetchEmployeeDetails = useCallback(async () => {
        try {
            setLoading(true);
            const employee = await api.getEmployeeDetails(employeeId);
            setEmployeeData(employee);

            const fetchedSchedule = await api.getEmployeeSchedule(employeeId);
            setSchedule(fetchedSchedule); // This will update the schedule state

        } catch (err: any) {
            console.error("Error fetching employee data:", err);
            setError(err.message || "Failed to load employee data.");
        } finally {
            setLoading(false);
        }
    }, [employeeId]);

    useEffect(() => {
        if (employeeId) {
            fetchEmployeeDetails();
        }
    }, [employeeId, fetchEmployeeDetails]);

    const handleEditSubmit = async (updatedFields: any) => {
        setUpdating(true);
        setError(null);
        try {
            const { schedule: updatedSchedule, ...employeeFields } = updatedFields;

            // 1. Update basic employee details
            const updatedEmployee = await api.updateEmployee(employeeId, employeeFields);
            setEmployeeData(updatedEmployee);

            // 2. Update employee schedule
            await api.updateEmployeeSchedule(employeeId, updatedSchedule);
            setSchedule(updatedSchedule); // Update local state with new schedule

            setIsEditing(false); // Exit edit mode
            Alert.alert('Success', 'Employee updated successfully!');
        } catch (err: any) {
            console.error("Error updating employee:", err);
            setError(err.message || "Failed to update employee.");
            Alert.alert('Error', err.message || "Failed to update employee.");
        } finally {
            setUpdating(false);
        }
    };

    const handleDeleteEmployee = async () => {
        setUpdating(true);
        setError(null);
        try {
            await api.deleteEmployee(employeeId);
            Alert.alert('Success', 'Employee deleted successfully!');
            return true; // Indicate success for parent component to handle navigation
        } catch (err: any) {
            console.error("Error deleting employee:", err);
            setError(err.message || "Failed to delete employee.");
            Alert.alert('Error', err.message || "Failed to delete employee.");
            return false;
        } finally {
            setUpdating(false);
        }
    };

    return {
        loading,
        error,
        employeeData,
        schedule,
        isEditing,
        updating,
        handleEditSubmit,
        handleDeleteEmployee,
        setIsEditing,
        fetchEmployeeDetails // Expose fetch function for manual refresh if needed
    };
};
