// components/admin/employees/EmployeeActions

import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { styles } from '../../../constants/employeesStyles';

interface Props {
  onEdit: () => void;
  onDelete: () => void;
  updating: boolean;
}

const EmployeeActions = ({ onEdit, onDelete, updating }: Props) => {
  return (
    <View style={styles.buttonGroup}>
      <TouchableOpacity 
        style={[styles.button, styles.editButton]}
        onPress={onEdit}
        disabled={updating}
      >
        <Text style={styles.buttonText}>Edit Employee</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.button, styles.deleteButton]}
        onPress={onDelete}
        disabled={updating}
      >
        <Text style={styles.buttonText}>Delete Employee</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EmployeeActions;