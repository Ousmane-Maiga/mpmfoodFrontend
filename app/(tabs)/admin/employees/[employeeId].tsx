import React from 'react';
import { ScrollView, View, ActivityIndicator, Text, TouchableOpacity, Modal } from 'react-native';
import { useEmployeeData } from '../../../../hooks/employees/useEmployeeData';
import EmployeeDetailHeader from '../../../../components/admin/employees/EmployeeDetailHeader';
import EmployeeContactInfo from '../../../../components/admin/employees/EmployeeContactInfo';
import EmployeeSchedule from '../../../../components/admin/employees/EmployeeSchedule';
import EmployeeActions from '../../../../components/admin/employees/EmployeeActions';
import { styles } from '../../../../constants/employeesStyles';
import EmployeeForm from '../../../../components/admin/employees/employeeForm';
import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface EmployeeDetailModalProps {
  employeeId: string;
  visible: boolean;
  onClose: () => void;
  onEmployeeUpdated?: (updatedData: any) => void;
}

const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({ 
  employeeId, 
  visible,
  onClose,
  onEmployeeUpdated 
}) => {
  const {
    loading,
    error,
    employeeData,
    schedule,
    isEditing,
    updating,
    handleEditSubmit,
    handleDeleteEmployee,
    setIsEditing
  } = useEmployeeData(employeeId);

  const handleSubmit = async (updatedData: any) => {
    await handleEditSubmit(updatedData);
    onEmployeeUpdated?.(updatedData);
  };

  const handleDelete = async () => {
    await handleDeleteEmployee();
    onClose();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (error || !employeeData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error || 'Employee not found'}</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
        {/* Floating Close Button */}
        <TouchableOpacity 
          onPress={onClose}
          style={styles.floatingCloseButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
          <Text>Go Back</Text>
        </TouchableOpacity>

        {isEditing ? (
          <EmployeeForm 
            initialData={{
              employee_name: employeeData.employee_name,
              employee_role: employeeData.employee_role,
               pin: '****',
              employee_email: employeeData.employee_email || '',
              employee_phone: employeeData.employee_phone || ''
            }}
            onSubmit={handleSubmit}
            onCancel={() => setIsEditing(false)}
            loading={updating}
            submitButtonText="Save Changes"
          />
        ) : (
          <>
            <EmployeeDetailHeader 
              name={employeeData.employee_name} 
              role={employeeData.employee_role} 
            />
            <EmployeeContactInfo 
              email={employeeData.employee_email}
              phone={employeeData.employee_phone}
            />
            <EmployeeSchedule schedule={schedule} />
            <EmployeeActions 
              onEdit={() => setIsEditing(true)}
              onDelete={handleDelete}
              updating={updating}
            />
          </>
        )}
      </ScrollView>
    </Modal>
  );
};

export default EmployeeDetailModal;