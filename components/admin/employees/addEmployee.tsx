// components/admin/employees/addEmployee.tsx
import React, { useState } from 'react';
import { Modal, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/Text';
import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '@/constants/employeesStyles';
import EmployeeForm from './employeeForm';
import { createEmployee } from '@/services/api';

interface AddEmployeeModalProps {
  visible: boolean;
  onClose: () => void;
  onEmployeeAdded: (newEmployee: any) => void;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ 
  visible, 
  onClose,
  onEmployeeAdded 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (employeeData: any) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Ensure PIN is included and is a string
      const dataToSend = {
        ...employeeData,
        pin: employeeData.pin.toString() // Ensure PIN is string
      };
      
      const newEmployee = await createEmployee(dataToSend);
      onEmployeeAdded(newEmployee);
      onClose();
    } catch (err: any) {
      console.error('Error creating employee:', err);
      setError(err.message || 'Failed to create employee. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer}
        bounces={false}
      >
        {/* Header with close button */}
        <View style={styles.modalHeader}>
          <Text style={theme.text.heading2}>Add New Employee</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        {/* Error message */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Employee form */}
        <EmployeeForm
          initialData={{
            employee_name: '',
            employee_role: '',
            pin: '',
            employee_email: '',
            employee_phone: ''
          }}
          onSubmit={handleSubmit}
          onCancel={onClose}
          loading={isSubmitting}
          submitButtonText="Add Employee"
        />
      </ScrollView>
    </Modal>
  );
};

export default AddEmployeeModal;