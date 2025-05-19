import React from 'react';
import { ScrollView, View, ActivityIndicator, Modal, TouchableOpacity } from 'react-native';
import { useEmployeeData } from '../../../hooks/employees/useEmployeeData';
import EmployeeDetailHeader from './EmployeeDetailHeader';
import EmployeeContactInfo from './EmployeeContactInfo';
import EmployeeSchedule from './EmployeeSchedule';
import EmployeeActions from './EmployeeActions';
import EmployeeForm from './employeeForm';
import { theme } from '@/constants/theme';
import { styles } from '@/constants/employeesStyles';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';

interface UpdateEmployeeModalProps {
  employeeId: string;
  visible: boolean;
  onClose: () => void;
  onEmployeeUpdated?: (updatedData: any) => void;
  onEmployeeDeleted?: () => void;
}

const UpdateEmployeeModal: React.FC<UpdateEmployeeModalProps> = ({ 
  employeeId, 
  visible,
  onClose,
  onEmployeeUpdated,
  onEmployeeDeleted
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
  try {
    const success = await handleDeleteEmployee();
    if (success) {
      onEmployeeDeleted?.();
      onClose();
    }
  } catch (error) {
    console.error('Delete failed:', error);
  }
};

  if (loading) {
    return (
      <Modal visible={visible} transparent>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </Modal>
    );
  }

  if (error || !employeeData) {
    return (
      <Modal visible={visible} transparent>
        <View style={styles.container}>
          <Text style={styles.errorText}>{error || 'Employee not found'}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
        {/* Header with close button */}
        <View style={styles.modalHeader}>
        <Text style={theme.text.heading2}>
          {isEditing ? 'Edit Employee' : 'Employee Details'}
        </Text>
        <TouchableOpacity 
          onPress={onClose} // This properly triggers the onClose callback
          style={styles.closeButton}
        >
          <Ionicons name="close" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

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


export default UpdateEmployeeModal;




// // components/admin/employees/UpdateEmployee.tsx
// import React from 'react';
// import { View, Modal, TouchableOpacity } from 'react-native';
// import { Text } from '@/components/ui/Text';
// import { theme } from '@/constants/theme';
// import { styles } from '@/constants/employeesStyles';
// import { Ionicons } from '@expo/vector-icons';

// interface UpdateEmployeeModalProps {
//   employeeId: string;
//   visible: boolean;
//   onClose: () => void;
//   onEmployeeUpdated?: (updatedData: any) => void;
//   onEmployeeDeleted?: () => void;
// }

// const UpdateEmployeeModal: React.FC<UpdateEmployeeModalProps> = ({
//   employeeId,
//   visible,
//   onClose,
//   onEmployeeUpdated,
//   onEmployeeDeleted
// }) => {
//   return (
//     <Modal
//       visible={visible}
//       animationType="slide"
//       onRequestClose={onClose}
//     >
//       <View style={styles.container}>
//         <View style={styles.modalHeader}>
//           <Text style={theme.text.heading2}>Employee Details</Text>
//           <TouchableOpacity onPress={onClose} style={styles.closeButton}>
//             <Ionicons name="close" size={24} color={theme.colors.text} />
//           </TouchableOpacity>
//         </View>
//         <Text>Employee ID: {employeeId}</Text>
//         {/* Removed other components */}
//       </View>
//     </Modal>
//   );
// };

// export default UpdateEmployeeModal;