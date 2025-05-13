// import React, { useState } from 'react';
// import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
// import { Text } from '../../components/ui/Text';
// import { theme } from '../../constants/theme';

// interface EmployeeFormProps {
//   initialData: any;
//   onSubmit: (data: any) => void;
//   onCancel: () => void;
// }

// const EmployeeForm: React.FC<EmployeeFormProps> = ({ initialData, onSubmit, onCancel }) => {
//   const [formData, setFormData] = useState(initialData);

//   const handleChange = (field: string, value: string) => {
//     setFormData({
//       ...formData,
//       [field]: value
//     });
//   };

//   const handleSubmit = () => {
//     onSubmit(formData);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.sectionTitle}>Edit Employee</Text>

//       <View style={styles.formGroup}>
//         <Text style={styles.label}>Name</Text>
//         <TextInput
//           style={styles.input}
//           value={formData.name}
//           onChangeText={(text) => handleChange('name', text)}
//         />
//       </View>

//       <View style={styles.formGroup}>
//         <Text style={styles.label}>Position</Text>
//         <TextInput
//           style={styles.input}
//           value={formData.role}
//           onChangeText={(text) => handleChange('role', text)}
//         />
//       </View>

//       <View style={styles.formGroup}>
//         <Text style={styles.label}>Email</Text>
//         <TextInput
//           style={styles.input}
//           value={formData.email}
//           onChangeText={(text) => handleChange('email', text)}
//           keyboardType="email-address"
//         />
//       </View>

//       <View style={styles.formGroup}>
//         <Text style={styles.label}>Phone</Text>
//         <TextInput
//           style={styles.input}
//           value={formData.phone}
//           onChangeText={(text) => handleChange('phone', text)}
//           keyboardType="phone-pad"
//         />
//       </View>

//       <View style={styles.buttonContainer}>
//         <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
//           <Text style={styles.buttonText}>Cancel</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
//           <Text style={styles.buttonText}>Save Changes</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: theme.spacing.md,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: theme.spacing.md,
//     color: theme.colors.text,
//   },
//   formGroup: {
//     marginBottom: theme.spacing.md,
//   },
//   label: {
//     marginBottom: theme.spacing.xs,
//     color: theme.colors.textSecondary,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: theme.colors.border,
//     borderRadius: 4,
//     padding: theme.spacing.sm,
//     color: theme.colors.text,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: theme.spacing.md,
//   },
//   button: {
//     padding: theme.spacing.sm,
//     borderRadius: 4,
//     alignItems: 'center',
//     flex: 1,
//     marginHorizontal: theme.spacing.xs,
//   },
//   submitButton: {
//     backgroundColor: theme.colors.primary,
//   },
//   cancelButton: {
//     backgroundColor: theme.colors.secondary,
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
// });

// export default EmployeeForm;



import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '../../components/ui/Text';
import { theme } from '../../constants/theme';

interface EmployeeFormProps {
  initialData: {
    employee_name: string;
    employee_role: string;
    employee_email?: string;
    employee_phone?: string;
  };
  onSubmit: (data: any) => void;
  onCancel: () => void;
  loading?: boolean; // Add this line
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ initialData, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSubmit = () => {
    onSubmit({
      employee_name: formData.employee_name,
      employee_role: formData.employee_role,
      employee_email: formData.employee_email,
      employee_phone: formData.employee_phone
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Edit Employee</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={formData.employee_name}
          onChangeText={(text) => handleChange('employee_name', text)}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Position</Text>
        <TextInput
          style={styles.input}
          value={formData.employee_role}
          onChangeText={(text) => handleChange('employee_role', text)}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={formData.employee_email || ''}
          onChangeText={(text) => handleChange('employee_email', text)}
          keyboardType="email-address"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          value={formData.employee_phone || ''}
          onChangeText={(text) => handleChange('employee_phone', text)}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: theme.spacing.md,
    color: theme.colors.text,
  },
  formGroup: {
    marginBottom: theme.spacing.md,
  },
  label: {
    marginBottom: theme.spacing.xs,
    color: theme.colors.textSecondary,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 4,
    padding: theme.spacing.sm,
    color: theme.colors.text,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
  },
  button: {
    padding: theme.spacing.sm,
    borderRadius: 4,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
  },
  cancelButton: {
    backgroundColor: theme.colors.secondary,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default EmployeeForm;