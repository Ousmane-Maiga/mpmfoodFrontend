import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { 
  getEmployeeDetails, 
  getEmployeeSchedule, 
  updateEmployee,
  deleteEmployee
} from '../../services/api';
import { Alert } from 'react-native';

interface EmployeeDetails {
  pin: number;
  employee_id: string;
  employee_name: string;
  employee_role: string;
  employee_email?: string;
  employee_phone?: string;
}

interface ScheduleItem {
  day_of_week: string;
  start_time: string;
  end_time: string;
}

export const useEmployeeData = (employeeId: string) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [employeeData, setEmployeeData] = useState<EmployeeDetails | null>(null);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!employeeId) {
          setError('Employee ID is required');
          return;
        }

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
  return new Promise<boolean>(async (resolve) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this employee?',
      [
        { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteEmployee(employeeId);
              Alert.alert('Success', 'Employee deleted successfully');
              resolve(true);
            } catch (err: any) {
              if (err.response?.status === 403) {
                Alert.alert('Error', 'Admin employees cannot be deleted');
              } else {
                Alert.alert('Error', 'Failed to delete employee');
              }
              resolve(false);
            }
          }
        }
      ]
    );
  });
};

  return {
    employeeId,
    loading,
    error,
    employeeData,
    schedule,
    isEditing,
    updating,
    handleEditSubmit,
    handleDeleteEmployee,
    setIsEditing,
    navigation
  };
};

function onEmployeeDeleted() {
    throw new Error('Function not implemented.');
}
