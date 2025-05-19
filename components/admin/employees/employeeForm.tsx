// components/admin/employees/employeeForm.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

interface EmployeeFormProps {
  initialData: {
    employee_name: string;
    employee_role: string;
    pin: string; // Changed from number to string
    employee_email: string;
    employee_phone: string;
  };
  onSubmit: (data: any) => Promise<void> | void;
  onCancel: () => void;
  loading: boolean;
  submitButtonText?: string;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading,
  submitButtonText = "Save Changes",
}) => {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Validate required fields before submitting
    if (!formData.employee_name.trim() || !formData.employee_role.trim() || !formData.pin.trim()) {
      alert('Name, role and PIN are required');
      return;
    }
    onSubmit(formData);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name*</Text>
      <TextInput
        style={styles.input}
        value={formData.employee_name}
        onChangeText={(text) => handleChange('employee_name', text)}
        placeholder="Employee Name"
      />

      <Text style={styles.label}>Role*</Text>
      <TextInput
        style={styles.input}
        value={formData.employee_role}
        onChangeText={(text) => handleChange('employee_role', text)}
        placeholder="Employee Role"
      />

      <Text style={styles.label}>PIN*</Text>
      <TextInput
        style={styles.input}
        value={formData.pin}
        onChangeText={(text) => handleChange('pin', text)}
        placeholder="4-digit PIN"
        keyboardType="number-pad"
        maxLength={4}
        secureTextEntry={true}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={formData.employee_email}
        onChangeText={(text) => handleChange('employee_email', text)}
        placeholder="Employee Email"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Phone</Text>
      <TextInput
        style={styles.input}
        value={formData.employee_phone}
        onChangeText={(text) => handleChange('employee_phone', text)}
        placeholder="Employee Phone"
        keyboardType="phone-pad"
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.submitButton]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{submitButtonText}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ... keep the existing styles ...

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
  },
  label: {
    fontSize: 16,
    marginBottom: theme.spacing.sm,
    color: theme.colors.text,
  },
  input: {
    height: 40,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
  },
  button: {
    padding: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: theme.spacing.sm,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
  },
  cancelButton: {
    backgroundColor: theme.colors.secondary,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default EmployeeForm;